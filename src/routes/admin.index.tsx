import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, FileText, CheckCircle2, TrendingUp, Award, AlertTriangle,
  Activity, ShieldAlert, Timer,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar, CartesianGrid,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")(({
  head: () => ({ meta: [{ title: "Dashboard — Proctor Admin" }] }),
  component: Dashboard,
}));

type Stats = {
  totalCandidates: number;
  activeExams: number;
  completedExams: number;
  avgScore: number;
  highestScore: number;
  highestScoreName: string;
  lowestScore: number;
  todayExams: number;
  onlineCandidates: number;
  totalWarnings: number;
};

type DailyPoint = { d: string; exams: number; pass: number };
type WeeklyPoint = { m: string; score: number };
type Activity = { who: string; what: string; exam: string; time: string; tone: "success" | "warn" | "danger" | "muted" };
type LiveCandidate = { name: string; question_index: number; total_questions: number; warnings: number; started_at: string };

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [dailyExams, setDailyExams] = useState<DailyPoint[]>([]);
  const [weeklyScores, setWeeklyScores] = useState<WeeklyPoint[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [liveCandidates, setLiveCandidates] = useState<LiveCandidate[]>([]);

  useEffect(() => {
    async function load() {
      const [
        { count: totalCandidates },
        { data: exams },
        { data: results },
        { data: sessions },
        { data: logs },
      ] = await Promise.all([
        supabase.from("candidates").select("*", { count: "exact", head: true }),
        supabase.from("exams").select("id, status, starts_at, ends_at"),
        supabase.from("results").select("score, warnings, candidate_name, exam_name, status, created_at"),
        supabase.from("exam_sessions").select("candidate_name, question_index, total_questions, warnings, started_at, status"),
        supabase.from("audit_logs").select("actor, event, severity, created_at").order("created_at", { ascending: false }).limit(20),
      ]);

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const activeExams = (exams ?? []).filter(e => e.status === "Active").length;
      const completedExams = (results ?? []).filter(r => r.status !== "Terminated").length;
      const todayExams = (exams ?? []).filter(e => e.starts_at && new Date(e.starts_at) >= todayStart).length;
      const onlineCandidates = (sessions ?? []).filter(s => s.status === "live").length;
      const scores = (results ?? []).map(r => r.score ?? 0);
      const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const highestScore = scores.length ? Math.max(...scores) : 0;
      const lowestScore = scores.length ? Math.min(...scores) : 0;
      const highestResult = (results ?? []).find(r => r.score === highestScore);
      const totalWarnings = (results ?? []).reduce((a, r) => a + (r.warnings ?? 0), 0);

      setStats({
        totalCandidates: totalCandidates ?? 0,
        activeExams,
        completedExams,
        avgScore,
        highestScore,
        highestScoreName: highestResult?.candidate_name ?? "—",
        lowestScore,
        todayExams,
        onlineCandidates,
        totalWarnings,
      });

      // Daily chart: last 14 days of results
      const days: DailyPoint[] = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (13 - i));
        const label = `${d.getDate()}/${d.getMonth() + 1}`;
        const dayResults = (results ?? []).filter(r => {
          const rd = new Date(r.created_at);
          return rd.toDateString() === d.toDateString();
        });
        const pass = dayResults.length ? Math.round((dayResults.filter(r => r.status !== "Terminated").length / dayResults.length) * 100) : 0;
        return { d: label, exams: dayResults.length, pass };
      });
      setDailyExams(days);

      // Weekly avg scores: last 8 weeks
      const weeks: WeeklyPoint[] = Array.from({ length: 8 }, (_, i) => {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (7 * (7 - i)));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const weekResults = (results ?? []).filter(r => {
          const rd = new Date(r.created_at);
          return rd >= weekStart && rd < weekEnd;
        });
        const avg = weekResults.length ? Math.round(weekResults.reduce((a, r) => a + (r.score ?? 0), 0) / weekResults.length) : 0;
        return { m: `Wk ${i + 1}`, score: avg };
      });
      setWeeklyScores(weeks);

      // Recent activity from audit_logs
      const acts: Activity[] = (logs ?? []).slice(0, 5).map(l => ({
        who: l.actor,
        what: l.event,
        exam: "",
        time: timeAgo(l.created_at),
        tone: l.severity === "danger" ? "danger" : l.severity === "warn" ? "warn" : l.event.includes("submitted") ? "success" : "muted",
      }));
      setActivities(acts);

      // Live candidates
      const live = (sessions ?? []).filter(s => s.status === "live").slice(0, 5);
      setLiveCandidates(live);
    }

    load();
  }, []);

  const statCards = stats ? [
    { label: "Total Candidates", value: stats.totalCandidates.toLocaleString(), icon: Users, delta: "" },
    { label: "Active Exams", value: stats.activeExams.toString(), icon: FileText, delta: `${stats.onlineCandidates} online now` },
    { label: "Completed Exams", value: stats.completedExams.toString(), icon: CheckCircle2, delta: "" },
    { label: "Average Score", value: `${stats.avgScore}%`, icon: TrendingUp, delta: "" },
    { label: "Highest Score", value: `${stats.highestScore}%`, icon: Award, delta: stats.highestScoreName },
    { label: "Lowest Score", value: `${stats.lowestScore}%`, icon: AlertTriangle, delta: "" },
    { label: "Today's Exams", value: stats.todayExams.toString(), icon: Timer, delta: "" },
    { label: "Online Candidates", value: stats.onlineCandidates.toString(), icon: Activity, delta: "Live" },
    { label: "Total Warnings", value: stats.totalWarnings.toString(), icon: ShieldAlert, delta: "All time" },
  ] : [];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.length === 0
            ? Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="rounded-xl animate-pulse">
                  <CardContent className="p-4 h-20" />
                </Card>
              ))
            : statCards.map((s) => (
                <Card key={s.label} className="rounded-xl transition hover:shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">{s.label}</div>
                        <div className="text-2xl font-semibold tracking-tight mt-1">{s.value}</div>
                        {s.delta && <div className="text-[11px] text-muted-foreground mt-1">{s.delta}</div>}
                      </div>
                      <div className="h-8 w-8 rounded-lg bg-accent grid place-items-center">
                        <s.icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="rounded-xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Daily exams · pass %</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyExams}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="exams" stroke="var(--primary)" strokeWidth={2} dot={false} name="Exams" />
                  <Line type="monotone" dataKey="pass" stroke="var(--success)" strokeWidth={2} dot={false} name="Pass %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-base">Average marks by week</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="score" fill="var(--primary)" radius={[6, 6, 0, 0]} name="Avg Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activity + Live */}
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-base">Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {activities.length === 0
                ? <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
                : activities.map((a, i) => (
                    <div key={i} className="py-3 flex items-center gap-3 text-sm">
                      <div className="h-8 w-8 rounded-full bg-accent grid place-items-center text-xs font-medium shrink-0">
                        {a.who.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate">
                          <span className="font-medium">{a.who}</span>{" "}
                          <span className="text-muted-foreground">{a.what}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{a.time}</div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          a.tone === "danger" ? "bg-destructive/10 text-destructive border-0"
                          : a.tone === "warn" ? "bg-warning/10 text-warning-foreground border-0"
                          : a.tone === "success" ? "bg-success/10 text-success border-0"
                          : "bg-muted text-muted-foreground border-0"
                        }
                      >
                        {a.tone}
                      </Badge>
                    </div>
                  ))}
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-base">Live candidate status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {liveCandidates.length === 0
                ? <p className="text-sm text-muted-foreground py-4 text-center">No candidates online</p>
                : liveCandidates.map((c) => {
                    const elapsed = Math.floor((Date.now() - new Date(c.started_at).getTime()) / 60000);
                    const status = c.warnings > 0 ? `${c.warnings} warning${c.warnings > 1 ? "s" : ""}` : "OK";
                    return (
                      <div key={c.candidate_name} className="flex items-center gap-3 text-sm p-3 rounded-lg border border-border hover:bg-accent/50 transition">
                        <div className="h-8 w-8 rounded-full bg-primary/10 grid place-items-center text-xs font-medium shrink-0">
                          {c.candidate_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{c.candidate_name}</div>
                          <div className="text-xs text-muted-foreground">
                            Q {c.question_index + 1} / {c.total_questions || "?"} · {elapsed}m elapsed
                          </div>
                        </div>
                        <Badge className={status === "OK" ? "bg-success/10 text-success border-0" : "bg-destructive/10 text-destructive border-0"}>
                          {status}
                        </Badge>
                      </div>
                    );
                  })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
