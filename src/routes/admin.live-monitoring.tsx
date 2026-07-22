import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/live-monitoring")({
  head: () => ({ meta: [{ title: "Live Monitoring — Proctor Admin" }] }),
  component: LiveMon,
});

type ExamSession = {
  candidate_id: string;
  candidate_name: string;
  exam_id: string;
  exam_name: string;
  candidate_room_id: string | null;
  question_index: number;
  total_questions: number;
  warnings: number;
  status: string;
};

// Lazy-load the entire VideoSDK grid — never imported on SSR
const VideoGrid = lazy(() => import("@/components/live-monitoring-grid"));

function LiveMon() {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    supabase
      .from("exam_sessions")
      .select("*")
      .eq("status", "live")
      .then(({ data }) => { if (data) setSessions(data as ExamSession[]); });

    const ch = supabase
      .channel("exam_sessions_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "exam_sessions" }, ({ eventType, new: n, old: o }) => {
        if (eventType === "INSERT") setSessions((p) => [...p, n as ExamSession]);
        else if (eventType === "UPDATE") {
          const u = n as ExamSession;
          setSessions((p) =>
            u.status !== "live"
              ? p.filter((s) => s.candidate_id !== u.candidate_id)
              : p.map((s) => s.candidate_id === u.candidate_id ? u : s)
          );
        } else if (eventType === "DELETE") {
          setSessions((p) => p.filter((s) => s.candidate_id !== (o as ExamSession).candidate_id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  const visible = sessions.filter((s) =>
    !filter ||
    s.candidate_name.toLowerCase().includes(filter.toLowerCase()) ||
    s.exam_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <AdminLayout title="Live Monitoring">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search candidates…"
              className="pl-8 h-9 w-64 rounded-lg"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            {visible.length} live
          </div>
        </div>

        {visible.length === 0 && (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            No candidates currently live.
          </div>
        )}

        <Suspense fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visible.map((s) => <WaitingCard key={s.candidate_id} session={s} />)}
          </div>
        }>
          {visible.length > 0 && (
            <VideoGrid sessions={visible} token="" />
          )}
        </Suspense>
      </div>
    </AdminLayout>
  );
}

function WaitingCard({ session }: { session: ExamSession }) {
  return (
    <Card className="rounded-xl overflow-hidden opacity-70">
      <div className="aspect-video bg-muted flex flex-col items-center justify-center gap-2 border-b border-border">
        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" />
        <p className="text-xs text-muted-foreground">Connecting…</p>
      </div>
      <CardContent className="p-3">
        <div className="font-medium text-sm truncate">{session.candidate_name}</div>
        <div className="text-xs text-muted-foreground">
          Q {session.question_index + 1} / {session.total_questions || "—"} · {session.exam_name}
        </div>
      </CardContent>
    </Card>
  );
}
