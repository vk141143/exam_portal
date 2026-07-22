// This file is lazy-loaded — never runs on SSR
import { useEffect, useRef, useState } from "react";
import { MeetingProvider, useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Wifi, Maximize2, AlertTriangle, PhoneCall } from "lucide-react";

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

export default function VideoGrid({ sessions, token }: { sessions: ExamSession[]; token: string }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sessions.map((session) =>
        session.candidate_room_id ? (
          <MeetingProvider
            key={session.candidate_id}
            config={{
              meetingId: session.candidate_room_id,
              micEnabled: false,
              webcamEnabled: false,
              name: "__admin__",
              debugMode: false,
            }}
            token={token}
            joinWithoutUserInteraction
          >
            <CandidateCard session={session} />
          </MeetingProvider>
        ) : (
          <WaitingCard key={session.candidate_id} session={session} />
        )
      )}
    </div>
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

function CandidateCard({ session }: { session: ExamSession }) {
  const { participants } = useMeeting();
  const participant = [...participants.values()].find((p) => !p.displayName.startsWith("__admin__"));
  return participant
    ? <ParticipantCard participantId={participant.id} session={session} />
    : <WaitingCard session={session} />;
}

function ParticipantCard({ participantId, session }: { participantId: string; session: ExamSession }) {
  const { webcamStream, micStream, webcamOn, micOn } = useParticipant(participantId);
  const { unmuteMic, muteMic } = useMeeting();
  const [adminTalking, setAdminTalking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [audioBars, setAudioBars] = useState<number[]>(Array(20).fill(6));
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!videoRef.current || !webcamStream) return;
    const ms = new MediaStream([webcamStream.track]);
    videoRef.current.srcObject = ms;
    videoRef.current.play().catch(() => {});
  }, [webcamStream]);

  useEffect(() => {
    if (!micStream) return;
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    ctx.createMediaStreamSource(new MediaStream([micStream.track])).connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      setAudioBars(Array.from({ length: 20 }, (_, i) =>
        Math.max(6, (data[Math.floor((i / 20) * data.length)] / 255) * 100)
      ));
      animRef.current = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(animRef.current); ctx.close(); };
  }, [micStream]);

  const toggleTalk = () => {
    if (adminTalking) { muteMic(); setAdminTalking(false); }
    else { unmuteMic(); setAdminTalking(true); }
  };

  const hasWarnings = session.warnings > 0;
  const qLabel = session.total_questions
    ? `Q ${session.question_index + 1} / ${session.total_questions}`
    : `Q ${session.question_index + 1}`;

  return (
    <Card className={`rounded-xl overflow-hidden transition hover:shadow-sm ${hasWarnings ? "ring-1 ring-destructive/50" : ""}`}>
      <div className={`aspect-video relative bg-black border-b ${hasWarnings ? "border-destructive/40" : "border-success/30"}`}>
        {webcamOn
          ? <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center bg-muted">
              <VideoOff className="h-8 w-8 text-muted-foreground/40" />
            </div>
        }
        <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] font-medium bg-background/80 backdrop-blur px-1.5 py-0.5 rounded">
          <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${hasWarnings ? "bg-destructive" : "bg-success"}`} /> LIVE
        </div>
        {adminTalking && (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded animate-pulse">
            <Mic className="h-3 w-3" /> Talking
          </div>
        )}
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

        <div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              {micOn ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3 text-destructive" />} Voice
            </span>
            <span className={micOn ? "text-success" : "text-destructive"}>{micOn ? "Active" : "Muted"}</span>
          </div>
          <div className="flex items-end gap-px h-6">
            {audioBars.map((h, i) => (
              <div key={i}
                className={`flex-1 rounded-sm transition-all duration-75 ${micOn ? "bg-primary/70" : "bg-muted-foreground/20"}`}
                style={{ height: `${micOn ? h : 6}%` }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <Sig icon={<Wifi className="h-3 w-3" />} ok label="WiFi" />
          <Sig icon={webcamOn ? <Video className="h-3 w-3" /> : <VideoOff className="h-3 w-3" />} ok={webcamOn} label="Cam" />
          <Sig icon={micOn ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />} ok={micOn} label="Mic" />
          <Sig icon={<Maximize2 className="h-3 w-3" />} ok label="FS" />
          {hasWarnings && (
            <span className="flex items-center gap-0.5 text-destructive">
              <AlertTriangle className="h-3 w-3" /> {session.warnings}
            </span>
          )}
          <Button
            size="sm"
            variant={adminTalking ? "default" : "outline"}
            className={`ml-auto h-6 px-2 text-[10px] rounded gap-1 ${adminTalking ? "bg-primary text-primary-foreground" : ""}`}
            onClick={toggleTalk}
          >
            <PhoneCall className="h-3 w-3" />
            {adminTalking ? "Stop" : "Talk"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Sig({ icon, ok = true, label }: { icon: React.ReactNode; ok?: boolean; label: string }) {
  return (
    <span className={`flex items-center gap-0.5 ${ok ? "text-success" : "text-destructive"}`}>
      {icon} {label}
    </span>
  );
}
