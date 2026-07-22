import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Wifi, Maximize2, AlertTriangle } from "lucide-react";

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
  started_at?: string;
};

export default function VideoGrid({ sessions }: { sessions: ExamSession[]; token: string }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sessions.map((session) => (
        <SessionCard key={session.candidate_id} session={session} />
      ))}
    </div>
  );
}

function SessionCard({ session }: { session: ExamSession }) {
  const hasWarnings = session.warnings > 0;
  const elapsed = session.started_at
    ? Math.floor((Date.now() - new Date(session.started_at).getTime()) / 60000)
    : 0;
  const qLabel = session.total_questions
    ? `Q ${session.question_index + 1} / ${session.total_questions}`
    : `Q ${session.question_index + 1}`;
  const initials = session.candidate_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Card className={`rounded-xl overflow-hidden transition hover:shadow-sm ${hasWarnings ? "ring-1 ring-destructive/50" : ""}`}>
      {/* Avatar placeholder instead of webcam */}
      <div className={`aspect-video relative bg-muted flex items-center justify-center border-b ${hasWarnings ? "border-destructive/40" : "border-success/30"}`}>
        <div className="h-16 w-16 rounded-full bg-primary/10 grid place-items-center text-2xl font-semibold text-primary">
          {initials}
        </div>
        <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] font-medium bg-background/80 backdrop-blur px-1.5 py-0.5 rounded">
          <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${hasWarnings ? "bg-destructive" : "bg-success"}`} />
          LIVE
        </div>
        <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground bg-background/70 px-1.5 py-0.5 rounded">
          {elapsed}m elapsed
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{session.candidate_name}</div>
            <div className="text-xs text-muted-foreground">{qLabel} · {session.exam_name}</div>
          </div>
          {hasWarnings
            ? <Badge className="bg-destructive/10 text-destructive border-0 shrink-0">{session.warnings} warn</Badge>
            : <Badge className="bg-success/10 text-success border-0 shrink-0">OK</Badge>
          }
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-0.5 text-success"><Wifi className="h-3 w-3" /> Online</span>
          <span className="flex items-center gap-0.5 text-success"><Mic className="h-3 w-3" /> Active</span>
          <span className="flex items-center gap-0.5 text-success"><Maximize2 className="h-3 w-3" /> Fullscreen</span>
          {hasWarnings && (
            <span className="flex items-center gap-0.5 text-destructive ml-auto">
              <AlertTriangle className="h-3 w-3" /> {session.warnings} violation{session.warnings > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
