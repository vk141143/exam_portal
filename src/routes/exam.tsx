import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MeetingProvider, useMeeting } from "@videosdk.live/react-sdk";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, Wifi, Maximize2, AlertTriangle, Flag, SkipForward, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { getVideoSDKToken } from "@/lib/videosdk";

export const Route = createFileRoute("/exam")({
  head: () => ({ meta: [{ title: "Exam in progress — Proctor" }] }),
  component: ExamBootstrap,
});

type Question = { id: string; question_text: string; options: string[]; marks: number };
type Status = "notVisited" | "answered" | "skipped" | "review";
const MAX_WARNINGS = 2;

// ── Bootstrap: fetch shared room_id from exam, get token, mount provider ────
function ExamBootstrap() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const candidate = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("candidate") ?? "{}"); }
    catch { return {}; }
  }, []);

  useEffect(() => {
    if (!candidate.examId) { setError("No exam session found. Please log in again."); return; }

    supabase.from("exams").select("room_id").eq("id", candidate.examId).single()
      .then(async ({ data: examData }) => {
        const rid = examData?.room_id ?? null;

        // Register candidate session for admin live-monitoring
        await supabase.from("exam_sessions").upsert({
          candidate_id: candidate.id,
          candidate_name: candidate.name,
          exam_id: candidate.examId,
          exam_name: candidate.examName,
          room_id: rid,
          question_index: 0,
          total_questions: 0,
          warnings: 0,
          status: "live",
          started_at: new Date().toISOString(),
        }, { onConflict: "candidate_id" });

        if (rid) {
          // Only fetch token if there's a room to join
          const tok = await getVideoSDKToken();
          setToken(tok);
          setRoomId(rid);
        } else {
          // No room assigned — run exam without VideoSDK
          setRoomId("__none__");
        }
      })
      .catch(() => setError("Failed to start exam. Please refresh."));
  }, [candidate.examId]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <p className="text-destructive text-sm text-center">{error}</p>
    </div>
  );

  if (!roomId) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground text-sm">Starting exam…</p>
    </div>
  );

  // No VideoSDK room — run exam without live proctoring stream
  if (roomId === "__none__") return <ExamUI leave={() => {}} />;

  return (
    <MeetingProvider
      config={{
        meetingId: roomId,
        micEnabled: true,
        webcamEnabled: true,
        name: candidate.name ?? "Candidate",
        debugMode: false,
      }}
      token={token!}
      joinWithoutUserInteraction
    >
      <ExamUIWithMeeting />
    </MeetingProvider>
  );
}

function ExamUIWithMeeting() {
  const { leave } = useMeeting();
  return <ExamUI leave={leave} />;
}

// ── Main exam UI ─────────────────────────────────────────────────────────────
function ExamUI({ leave }: { leave: () => void }) {
  const navigate = useNavigate();

  const candidate = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("candidate") ?? "{}"); }
    catch { return {}; }
  }, []);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQ, setLoadingQ] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flags, setFlags] = useState<Record<number, Status>>({});
  const [remaining, setRemaining] = useState((candidate.duration ?? 60) * 60);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const animFrameRef = useRef<number>(0);
  const [audioBars, setAudioBars] = useState<number[]>(Array(28).fill(10));
  const [micBlocked, setMicBlocked] = useState(false);
  const [camBlocked, setCamBlocked] = useState(false);

  // ── Load questions ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!candidate.examId) { setLoadingQ(false); return; }
    supabase.from("questions").select("id, question_text, options, marks")
      .eq("exam_id", candidate.examId)
      .then(({ data }) => {
        if (data?.length) {
          setQuestions(data.map((q) => ({
            ...q,
            options: Array.isArray(q.options) ? q.options : Object.values(q.options ?? {}),
          })));
          if (candidate.id) {
            supabase.from("exam_sessions")
              .update({ total_questions: data.length })
              .eq("candidate_id", candidate.id);
          }
        }
        setLoadingQ(false);
      });
  }, [candidate.examId]);

  // ── Sync progress to exam_sessions ─────────────────────────────────────
  useEffect(() => {
    if (!candidate.id) return;
    supabase.from("exam_sessions")
      .update({ question_index: current, warnings })
      .eq("candidate_id", candidate.id);
  }, [current, warnings]);

  // ── Timer ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Camera + mic (local preview + audio analyser) ───────────────────────
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCamBlocked(!stream.getVideoTracks()[0]?.enabled);
        setMicBlocked(!stream.getAudioTracks()[0]?.enabled);

        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteFrequencyData(data);
          setAudioBars(Array.from({ length: 28 }, (_, i) =>
            Math.max(6, (data[Math.floor((i / 28) * data.length)] / 255) * 100)
          ));
          animFrameRef.current = requestAnimationFrame(tick);
        };
        tick();
      })
      .catch(() => { setCamBlocked(true); setMicBlocked(true); toast.error("Camera/mic access lost."); });

    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (terminated = false) => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    const score = questions.reduce((acc, q, i) =>
      acc + (answers[i] !== undefined ? (q.marks ?? 1) : 0), 0);

    if (candidate.id && candidate.examId) {
      await Promise.all([
        supabase.from("results").insert({
          candidate_id: candidate.id,
          candidate_name: candidate.name,
          exam_id: candidate.examId,
          exam_name: candidate.examName,
          score,
          time_taken: `${(candidate.duration ?? 60) - Math.floor(remaining / 60)} min`,
          warnings,
          status: terminated ? "Terminated" : "Pass",
        }),
        supabase.from("audit_logs").insert({
          actor: candidate.name,
          event: terminated
            ? `Exam terminated (violations): ${candidate.examName}`
            : `Exam submitted: ${candidate.examName}`,
          severity: terminated ? "danger" : "info",
          ip_address: candidate.location
            ? `${candidate.location.lat.toFixed(4)}, ${candidate.location.lng.toFixed(4)}`
            : "Unknown",
          client: navigator.userAgent.slice(0, 80),
        }),
        supabase.from("exam_sessions")
          .update({ status: terminated ? "terminated" : "completed" })
          .eq("candidate_id", candidate.id),
      ]);
    }

    leave();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    terminated ? toast.error("Exam terminated due to violations.") : toast.success("Exam submitted!");
    setTimeout(() => navigate({ to: "/" }), 1000);
  }, [questions, answers, candidate, remaining, warnings, navigate, leave]);

  useEffect(() => { if (remaining === 0) handleSubmit(false); }, [remaining]);

  // ── Violations ──────────────────────────────────────────────────────────
  const handleViolation = useCallback((reason: string) => {
    if (submittingRef.current) return;
    setWarnings((prev) => {
      const next = prev + 1;
      if (next > MAX_WARNINGS) { handleSubmit(true); return prev; }
      setWarningMsg(`Warning ${next}/${MAX_WARNINGS}: ${reason}`);
      return next;
    });
  }, [handleSubmit]);

  useEffect(() => {
    const onFs = () => {
      const inFs = !!document.fullscreenElement;
      setIsFullscreen(inFs);
      if (!inFs && !submittingRef.current && isFullscreen) handleViolation("Exited fullscreen");
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, [handleViolation, isFullscreen]);

  useEffect(() => {
    const onVis = () => { if (document.hidden && !submittingRef.current) handleViolation("Switched tab or window"); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [handleViolation]);

  useEffect(() => {
    setFlags((f) => (f[current] ? f : { ...f, [current]: "notVisited" }));
  }, [current]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const isLow = remaining < 300;

  const stats = useMemo(() => {
    let ans = 0, skip = 0, rev = 0, nv = 0;
    questions.forEach((_, i) => {
      const s: Status = answers[i] !== undefined ? "answered" : flags[i] ?? "notVisited";
      if (s === "answered") ans++; else if (s === "skipped") skip++;
      else if (s === "review") rev++; else nv++;
    });
    return { ans, skip, rev, nv };
  }, [answers, flags, questions]);

  const select = (opt: number) => {
    setAnswers((a) => ({ ...a, [current]: opt }));
    setFlags((f) => ({ ...f, [current]: "answered" }));
  };
  const next = () => setCurrent((c) => Math.min(questions.length - 1, c + 1));
  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const skip = () => { setFlags((f) => ({ ...f, [current]: "skipped" })); next(); };
  const markReview = () => { setFlags((f) => ({ ...f, [current]: "review" })); toast("Marked for review"); };
  const clear = () => {
    setAnswers((a) => { const n = { ...a }; delete n[current]; return n; });
    setFlags((f) => ({ ...f, [current]: "notVisited" }));
  };
  const statusOf = (i: number): Status =>
    answers[i] !== undefined ? "answered" : flags[i] ?? "notVisited";

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen()
      .then(() => setIsFullscreen(true))
      .catch(() => toast.error("Could not enter fullscreen."));
  };

  if (loadingQ) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground text-sm">Loading questions…</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground text-sm">No questions found for this exam.</p>
    </div>
  );

  if (!isFullscreen) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-6">
      <div className="text-center space-y-2">
        <Maximize2 className="h-12 w-12 text-primary mx-auto" />
        <h2 className="text-xl font-semibold">Fullscreen required</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          The exam must be taken in fullscreen mode. Click below to begin.
        </p>
      </div>
      <Button className="rounded-lg px-8" onClick={enterFullscreen}>
        Enter fullscreen &amp; start exam
      </Button>
    </div>
  );

  const q = questions[current];
  const chosen = answers[current];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Warning overlay */}
      {warningMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background border border-destructive rounded-xl p-6 max-w-sm w-full mx-4 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">Violation Detected</p>
                <p className="text-sm text-muted-foreground mt-1">{warningMsg}</p>
                {warnings < MAX_WARNINGS && (
                  <p className="text-xs text-destructive mt-2 font-medium">
                    One more violation will automatically terminate your exam.
                  </p>
                )}
              </div>
            </div>
            <Button className="w-full rounded-lg" onClick={() => {
              setWarningMsg(null);
              document.documentElement.requestFullscreen().catch(() => {});
            }}>
              I understand — return to exam
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-14 border-b flex items-center gap-3 px-4 sticky top-0 bg-background/90 backdrop-blur z-20">
        <div className="font-medium text-sm">{candidate.examName ?? "Exam"}</div>
        <Badge variant="secondary" className="rounded-md">{candidate.name} · {candidate.id}</Badge>
        <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5 text-success" /> Online</span>
          <span className="flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5 text-success" /> Fullscreen</span>
          {warnings > 0 && (
            <span className="flex items-center gap-1.5 text-destructive font-medium">
              <AlertTriangle className="h-3.5 w-3.5" /> {warnings}/{MAX_WARNINGS} warnings
            </span>
          )}
          <span className={`font-mono text-base tabular-nums ${isLow ? "text-destructive font-bold" : "text-foreground"}`}>
            {mm}:{ss}
          </span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-4 p-4">
        {/* Palette */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2 space-y-4">
          <Card className="rounded-xl">
            <CardContent className="p-4 space-y-3">
              <div className="text-xs font-medium text-muted-foreground">Question palette</div>
              <div className="grid grid-cols-8 lg:grid-cols-5 gap-1.5">
                {questions.map((_, i) => {
                  const s = statusOf(i);
                  const base = "h-8 w-8 text-xs rounded-md border transition font-medium";
                  const cls = i === current ? "bg-primary text-primary-foreground border-primary"
                    : s === "answered" ? "bg-success/15 text-success border-success/30"
                    : s === "skipped" ? "bg-destructive/10 text-destructive border-destructive/30"
                    : s === "review" ? "bg-warning/20 text-warning-foreground border-warning/40"
                    : "bg-card text-muted-foreground border-border hover:bg-accent";
                  return <button key={i} onClick={() => setCurrent(i)} className={`${base} ${cls}`}>{i + 1}</button>;
                })}
              </div>
              <div className="pt-2 space-y-1.5 text-[11px] text-muted-foreground">
                <Legend swatch="bg-success/40" label={`Answered · ${stats.ans}`} />
                <Legend swatch="bg-destructive/40" label={`Skipped · ${stats.skip}`} />
                <Legend swatch="bg-warning/40" label={`Review · ${stats.rev}`} />
                <Legend swatch="bg-border" label={`Not visited · ${stats.nv}`} />
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Question */}
        <section className="col-span-12 lg:col-span-6 xl:col-span-7 space-y-4">
          <Card className="rounded-xl">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Question {current + 1} of {questions.length}</div>
                <div className="text-xs text-muted-foreground">+{q.marks ?? 1} mark</div>
              </div>
              <Progress value={((current + 1) / questions.length) * 100} className="h-1" />
              <h2 className="text-base font-medium leading-relaxed">{q.question_text}</h2>
              <div className="space-y-2 pt-1">
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => select(i)}
                    className={`w-full text-left p-3.5 rounded-lg border transition flex items-start gap-3 ${
                      chosen === i ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-accent/40"
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full border shrink-0 grid place-items-center mt-0.5 ${chosen === i ? "border-primary" : "border-border"}`}>
                      {chosen === i && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="rounded-lg" onClick={prev} disabled={current === 0}>Previous</Button>
            <Button variant="outline" className="rounded-lg" onClick={markReview}><Flag className="h-4 w-4 mr-1.5" /> Mark for review</Button>
            <Button variant="outline" className="rounded-lg" onClick={clear}><RotateCcw className="h-4 w-4 mr-1.5" /> Clear</Button>
            <Button variant="outline" className="rounded-lg" onClick={skip}><SkipForward className="h-4 w-4 mr-1.5" /> Skip</Button>
            <div className="ml-auto flex items-center gap-2">
              <Button className="rounded-lg" onClick={next} disabled={current === questions.length - 1}>Save &amp; Next</Button>
              <Button variant="destructive" className="rounded-lg" onClick={() => handleSubmit(false)}>Submit</Button>
            </div>
          </div>
        </section>

        {/* Proctoring panel */}
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="rounded-xl overflow-hidden">
            <div className="aspect-video bg-black relative">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] font-medium bg-background/80 backdrop-blur px-1.5 py-0.5 rounded">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
              </div>
              {camBlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <p className="text-xs text-destructive font-medium">Camera blocked</p>
                </div>
              )}
            </div>
            <CardContent className="p-3 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Mic className={`h-3.5 w-3.5 ${micBlocked ? "text-destructive" : ""}`} /> Audio level
                  </span>
                  <span className={micBlocked ? "text-destructive" : "text-success"}>{micBlocked ? "Blocked" : "Live"}</span>
                </div>
                <div className="flex items-end gap-0.5 h-8">
                  {audioBars.map((h, i) => (
                    <div key={i}
                      className={`flex-1 rounded-sm transition-all duration-75 ${micBlocked ? "bg-destructive/40" : "bg-primary/70"}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground space-y-1 pt-1">
                <div className="flex justify-between"><span>Warnings</span>
                  <span className={warnings > 0 ? "text-destructive font-medium" : "text-foreground"}>{warnings} / {MAX_WARNINGS}</span>
                </div>
                <div className="flex justify-between"><span>Camera</span>
                  <span className={camBlocked ? "text-destructive" : "text-success"}>{camBlocked ? "Blocked" : "Active"}</span>
                </div>
                <div className="flex justify-between"><span>Mic</span>
                  <span className={micBlocked ? "text-destructive" : "text-success"}>{micBlocked ? "Blocked" : "Active"}</span>
                </div>
                <div className="flex justify-between"><span>Location</span>
                  <span className="text-foreground">{candidate.location ? "Verified" : "Unknown"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-warning/30 bg-warning/5">
            <CardContent className="p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Do not exit fullscreen or switch tabs. Your session is being continuously monitored.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-sm ${swatch}`} />
      <span>{label}</span>
    </div>
  );
}
