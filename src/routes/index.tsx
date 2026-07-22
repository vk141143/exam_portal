import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Proctor Examination Portal" },
      { name: "description", content: "Sign in to your secure online examination portal." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [candidateId, setCandidateId] = useState("");
  const [password, setPassword] = useState("");
  const [examCode, setExamCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getLocation = (): Promise<{ lat: number; lng: number } | null> =>
    new Promise((resolve) => {
      if (typeof window === "undefined" || !navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 5000 }
      );
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateId || !password || !examCode) {
      toast.error("Enter your User ID, password and Exam Code");
      return;
    }
    setLoading(true);

    // 1. Validate candidate
    const { data: candidate, error: candError } = await supabase
      .from("candidates")
      .select("id, name, email, status, password_hash, assigned_exam_id")
      .eq("id", candidateId)
      .single();

    if (candError || !candidate) {
      setLoading(false);
      toast.error("Invalid User ID");
      return;
    }

    if (candidate.status === "Disabled") {
      setLoading(false);
      toast.error("Your account has been disabled. Contact admin.");
      return;
    }

    if (candidate.password_hash !== password) {
      setLoading(false);
      toast.error("Incorrect password");
      return;
    }

    // 2. Validate exam code
    const { data: exam, error: examError } = await supabase
      .from("exams")
      .select("id, name, duration_minutes, status, starts_at, ends_at")
      .eq("exam_code", examCode.trim().toUpperCase())
      .single();

    if (examError || !exam) {
      setLoading(false);
      toast.error("Invalid Exam Code");
      return;
    }

    // 3. Check exam time window
    const now = new Date();
    if (exam.starts_at && now < new Date(exam.starts_at)) {
      setLoading(false);
      const startsAt = new Date(exam.starts_at).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: false,
      });
      toast.error(`Exam not started yet. It begins on ${startsAt}.`);
      return;
    }
    if (exam.ends_at && now > new Date(exam.ends_at)) {
      setLoading(false);
      const endsAt = new Date(exam.ends_at).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: false,
      });
      toast.error(`Exam expired. It ended on ${endsAt}.`);
      return;
    }

    // 3. Get location
    const location = await getLocation();

    // 4. Log to audit_logs
    await supabase.from("audit_logs").insert({
      actor: candidate.name,
      event: `Login success — joined exam: ${exam.name}`,
      severity: "info",
      ip_address: location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Unknown",
      client: navigator.userAgent.slice(0, 80),
    });

    // 5. Store session for exam page
    sessionStorage.setItem("candidate", JSON.stringify({
      id: candidate.id,
      name: candidate.name,
      examId: exam.id,
      examName: exam.name,
      duration: exam.duration_minutes,
      location,
    }));

    setLoading(false);
    navigate({ to: "/instructions" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 border-r border-border bg-sidebar">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-semibold tracking-tight">Proctor</span>
        </div>
        <div className="space-y-6 max-w-md">
          <h1 className="text-4xl font-semibold tracking-tight leading-tight">
            Secure, AI-proctored online examinations.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Enterprise-grade assessments with live monitoring, face detection,
            fullscreen enforcement, and audit-ready reporting.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              ["99.98%", "Uptime SLA"],
              ["SOC 2", "Compliant"],
              ["24/7", "Monitoring"],
              ["AES-256", "Encryption"],
            ].map(([v, k]) => (
              <div key={k} className="rounded-lg border border-border p-4 bg-card">
                <div className="text-lg font-semibold">{v}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{k}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Proctor Systems · v1.0.0
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">Proctor</span>
          </div>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <form onSubmit={submit} className="w-full max-w-sm space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Sign in to your account</h2>
              <p className="text-sm text-muted-foreground">Use the credentials provided by your administrator.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uid">User ID</Label>
                <Input
                  id="uid"
                  placeholder="e.g. STU10234"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  autoComplete="username"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pwd">Password</Label>
                <div className="relative">
                  <Input
                    id="pwd"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    aria-label="Toggle password"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="examcode">Exam Code</Label>
                <Input
                  id="examcode"
                  placeholder="e.g. EX-A3K9PZ"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value.toUpperCase())}
                  className="h-11 font-mono tracking-widest"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-lg" disabled={loading}>
              {loading ? "Verifying…" : "Sign in"}
            </Button>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Secure login</span>
              <a href="/admin-login" className="hover:text-foreground transition">Admin portal →</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
