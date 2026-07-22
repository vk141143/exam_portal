import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin Login — Proctor" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter your email and password");
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    // Verify admin role
    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (profileError || !profile || profile.role !== "admin") {
      await supabase.auth.signOut();
      toast.error("Access denied. Admins only.");
      return;
    }

    toast.success("Welcome back!");
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border bg-sidebar">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-semibold tracking-tight">Proctor Admin</span>
        </div>

        <div className="space-y-6 max-w-md">
          <h1 className="text-4xl font-semibold tracking-tight leading-tight">
            Admin portal for secure AI-proctored examinations.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Manage exams, candidates, question banks, live monitoring, and audit-ready reporting.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              ["Exams", "Create & schedule"],
              ["Candidates", "Manage & assign"],
              ["Monitoring", "Live proctoring"],
              ["Reports", "Audit & results"],
            ].map(([v, k]) => (
              <div key={k} className="rounded-lg border border-border p-4 bg-card">
                <div className="text-base font-semibold">{v}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{k}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Proctor Systems · Admin Portal
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">Proctor Admin</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <form
            onSubmit={submit}
            className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Admin sign in</h2>
              <p className="text-sm text-muted-foreground">
                Restricted to authorised administrators only.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
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
            </div>

            <Button type="submit" className="w-full h-11 rounded-lg" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Don't have an account?{" "}
              <a href="/admin-register" className="text-foreground hover:underline">
                Register here
              </a>
            </p>
            <div className="flex justify-center text-xs text-muted-foreground">
              <a href="/" className="hover:text-foreground transition">← Candidate login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
