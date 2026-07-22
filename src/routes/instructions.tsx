import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/theme-toggle";
import { ShieldCheck, Camera, Mic, MapPin, Maximize, Wifi, Monitor, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/instructions")({
  head: () => ({ meta: [{ title: "Instructions — Proctor" }] }),
  component: Instructions,
});

type PermStatus = "idle" | "requesting" | "granted" | "denied";

function Instructions() {
  const [agree, setAgree] = useState(false);
  const [camStatus, setCamStatus] = useState<PermStatus>("idle");
  const [micStatus, setMicStatus] = useState<PermStatus>("idle");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  const candidate = (() => {
    try { return JSON.parse(sessionStorage.getItem("candidate") ?? "{}"); }
    catch { return {}; }
  })();

  const requestPermissions = async () => {
    setCamStatus("requesting");
    setMicStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;

      // check tracks
      const hasVideo = stream.getVideoTracks().length > 0;
      const hasAudio = stream.getAudioTracks().length > 0;

      setCamStatus(hasVideo ? "granted" : "denied");
      setMicStatus(hasAudio ? "granted" : "denied");

      if (videoRef.current && hasVideo) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCamStatus("denied");
      setMicStatus("denied");
    }
  };

  // stop stream on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const canStart = agree && camStatus === "granted" && micStatus === "granted";

  const startExam = () => {
    // keep stream alive — exam page will re-acquire
    streamRef.current?.getTracks().forEach((t) => t.stop());
    navigate({ to: "/exam" });
  };

  const StatusIcon = ({ status }: { status: PermStatus }) => {
    if (status === "granted") return <CheckCircle2 className="h-4 w-4 text-success" />;
    if (status === "denied") return <XCircle className="h-4 w-4 text-destructive" />;
    if (status === "requesting") return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b flex items-center px-6 gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="font-semibold">Proctor</div>
        {candidate.name && (
          <span className="text-sm text-muted-foreground ml-2">· {candidate.name}</span>
        )}
        <div className="ml-auto"><ThemeToggle /></div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Exam instructions</h1>
          <p className="text-sm text-muted-foreground mt-1">Please read carefully before starting the examination.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="rounded-xl">
            <CardHeader><CardTitle className="text-base">Exam rules</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              {candidate.examName && <p className="font-medium text-foreground">Exam: {candidate.examName}</p>}
              {candidate.duration && <p>· Duration: {candidate.duration} minutes</p>}
              <p>· You may skip and revisit questions before submission.</p>
              <p>· Do not exit fullscreen or switch tabs during the exam.</p>
              <p>· Any 3 violations will automatically terminate the exam.</p>
              <p>· Only your current device, browser, and location will be used.</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader><CardTitle className="text-base">System requirements</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  [Camera, "Working webcam"],
                  [Mic, "Microphone"],
                  [MapPin, "Location access"],
                  [Maximize, "Fullscreen mode"],
                  [Wifi, "Stable internet"],
                  [Monitor, "Latest Chrome / Edge"],
                ].map(([Icon, label], i) => {
                  const IconComp = Icon as React.ComponentType<{ className?: string }>;
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <IconComp className="h-4 w-4 text-primary" />
                      <span>{label as string}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permission check */}
        <Card className="rounded-xl">
          <CardHeader><CardTitle className="text-base">Camera &amp; microphone access</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <StatusIcon status={camStatus} />
                <span>Camera</span>
                {camStatus === "granted" && <span className="text-xs text-success">Granted</span>}
                {camStatus === "denied" && <span className="text-xs text-destructive">Denied</span>}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <StatusIcon status={micStatus} />
                <span>Microphone</span>
                {micStatus === "granted" && <span className="text-xs text-success">Granted</span>}
                {micStatus === "denied" && <span className="text-xs text-destructive">Denied</span>}
              </div>
              {(camStatus === "idle" || camStatus === "denied" || micStatus === "denied") && (
                <Button size="sm" className="rounded-lg ml-auto" onClick={requestPermissions}>
                  {camStatus === "denied" || micStatus === "denied" ? "Retry permissions" : "Allow camera & mic"}
                </Button>
              )}
              {(camStatus === "denied" || micStatus === "denied") && (
                <p className="text-xs text-destructive w-full">
                  Access was denied. Click "Retry permissions" — if the browser blocked it, click the camera icon in your address bar to allow, then retry.
                </p>
              )}
            </div>

            {/* Live camera preview */}
            {camStatus === "granted" && (
              <div className="rounded-lg overflow-hidden border border-border w-48 aspect-video bg-black">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-start gap-3">
            <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(!!v)} className="mt-0.5" />
            <label htmlFor="agree" className="text-sm text-muted-foreground select-none">
              I have read and agree to the exam rules. I understand that camera, microphone, and location
              access are mandatory and that any violation may lead to termination of my exam.
            </label>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" className="rounded-lg" onClick={() => navigate({ to: "/" })}>Cancel</Button>
          <Button disabled={!canStart} className="rounded-lg" onClick={startExam}>
            Start exam
          </Button>
        </div>
        {!canStart && camStatus !== "idle" && camStatus !== "requesting" && (
          <p className="text-xs text-muted-foreground text-right">
            {!agree ? "Accept the terms to continue." : "Camera and microphone access required."}
          </p>
        )}
      </div>
    </div>
  );
}
