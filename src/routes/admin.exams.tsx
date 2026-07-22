import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Calendar, Clock, Users, Copy, Check } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/exams")({
  head: () => ({ meta: [{ title: "Exams — Proctor Admin" }] }),
  component: Exams,
});

type Exam = {
  id: string;
  name: string;
  subject: string;
  duration_minutes: number;
  question_count: number;
  starts_at: string;
  ends_at: string;
  status: string;
  exam_code: string;
  room_id: string | null;
};

const tone: Record<string, string> = {
  Live: "bg-success/10 text-success border-0",
  Scheduled: "bg-primary/10 text-primary border-0",
  Completed: "bg-muted text-muted-foreground border-0",
  Draft: "bg-warning/15 text-warning-foreground border-0",
};

const emptyForm = { name: "", subject: "", duration_minutes: "", question_count: "", starts_at: "", ends_at: "", status: "Draft" };

function generateCode() {
  return "EX-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Convert UTC ISO string from Supabase → local datetime-local input value
function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Convert local datetime-local input value → UTC ISO string for Supabase
function toUTCIso(local: string): string {
  if (!local) return "";
  return new Date(local).toISOString();
}

function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  // dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editTarget, setEditTarget] = useState<Exam | null>(null);
  const [assignTarget, setAssignTarget] = useState<Exam | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // load exams
  useState(() => {
    supabase.from("exams").select("*").order("starts_at", { ascending: false }).then(({ data }) => {
      if (data) setExams(data as Exam[]);
      setLoading(false);
    });
  });

  const refresh = async () => {
    const { data } = await supabase.from("exams").select("*").order("starts_at", { ascending: false });
    if (data) setExams(data as Exam[]);
  };

  const handleCreate = async () => {
    if (!form.name || !form.duration_minutes || !form.question_count || !form.starts_at || !form.ends_at) {
      toast.error("Fill in all fields including start and end date/time");
      return;
    }
    if (new Date(form.ends_at) <= new Date(form.starts_at)) {
      toast.error("End date/time must be after start date/time");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("exams").insert({
      name: form.name,
      subject: form.subject,
      duration_minutes: Number(form.duration_minutes),
      question_count: Number(form.question_count),
      starts_at: toUTCIso(form.starts_at),
      ends_at: toUTCIso(form.ends_at),
      status: form.status,
      exam_code: generateCode(),
      candidate_count: 0,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Exam created");
    setCreateOpen(false);
    setForm(emptyForm);
    refresh();
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    if (editTarget.ends_at && editTarget.starts_at && new Date(editTarget.ends_at) <= new Date(editTarget.starts_at)) {
      toast.error("End date/time must be after start date/time");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("exams").update({
      name: editTarget.name,
      subject: editTarget.subject,
      duration_minutes: Number(editTarget.duration_minutes),
      question_count: Number(editTarget.question_count),
      starts_at: editTarget.starts_at,
      ends_at: editTarget.ends_at,
      status: editTarget.status,
    }).eq("id", editTarget.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Exam updated");
    setEditOpen(false);
    refresh();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AdminLayout title="Exams">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Manage exams, schedules, and candidate assignments.</p>
          <Button className="rounded-lg h-9" onClick={() => { setForm(emptyForm); setCreateOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Create exam
          </Button>
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {exams.map((e) => (
            <Card key={e.id} className="rounded-xl transition hover:shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">{e.name}</CardTitle>
                  <Badge className={tone[e.status] ?? tone.Draft}>{e.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{e.subject}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {e.duration_minutes} min</div>
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-3.5 w-3.5" /> {e.question_count} Qs</div>
                  <div className="flex items-center gap-1.5 text-muted-foreground col-span-3">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>{e.starts_at ? new Date(e.starts_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }) : "—"}</span>
                  {e.ends_at && <span className="text-muted-foreground/60">→ {new Date(e.ends_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}</span>}
                </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" className="rounded-lg flex-1" onClick={() => { setEditTarget({ ...e }); setEditOpen(true); }}>Edit</Button>
                  <Button size="sm" className="rounded-lg flex-1" onClick={() => { setAssignTarget(e); setAssignOpen(true); }}>Assign</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Exam Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create exam</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input placeholder="e.g. DBMS Mid-Term" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Input placeholder="e.g. Database Systems" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Duration (minutes)</Label>
                <Input type="number" placeholder="60" value={form.duration_minutes} onChange={(e) => setForm((f) => ({ ...f, duration_minutes: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>No. of questions</Label>
                <Input type="number" placeholder="40" value={form.question_count} onChange={(e) => setForm((f) => ({ ...f, question_count: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start date &amp; time</Label>
                <Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>End date &amp; time</Label>
                <Input type="datetime-local" value={form.ends_at} onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                {["Draft", "Scheduled", "Live", "Completed"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? "Creating…" : "Create exam"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Exam Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit exam</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={editTarget.name} onChange={(e) => setEditTarget((t) => t && ({ ...t, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Input value={editTarget.subject} onChange={(e) => setEditTarget((t) => t && ({ ...t, subject: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Duration (minutes)</Label>
                  <Input type="number" value={editTarget.duration_minutes} onChange={(e) => setEditTarget((t) => t && ({ ...t, duration_minutes: Number(e.target.value) }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>No. of questions</Label>
                  <Input type="number" value={editTarget.question_count} onChange={(e) => setEditTarget((t) => t && ({ ...t, question_count: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Start date &amp; time</Label>
                  <Input type="datetime-local" value={toLocalInput(editTarget.starts_at)}
                    onChange={(e) => setEditTarget((t) => t && ({ ...t, starts_at: toUTCIso(e.target.value) }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>End date &amp; time</Label>
                  <Input type="datetime-local" value={toLocalInput(editTarget.ends_at)}
                    onChange={(e) => setEditTarget((t) => t && ({ ...t, ends_at: toUTCIso(e.target.value) }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editTarget.status}
                  onChange={(e) => setEditTarget((t) => t && ({ ...t, status: e.target.value }))}
                >
                  {["Draft", "Scheduled", "Live", "Completed"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog — shows unique exam code */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign exam</DialogTitle>
          </DialogHeader>
          {assignTarget && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">Share this unique exam code with candidates to assign them to <span className="font-medium text-foreground">{assignTarget.name}</span>.</p>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-accent border border-border">
                <span className="font-mono text-lg font-semibold tracking-widest flex-1 text-center">{assignTarget.exam_code}</span>
                <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => copyCode(assignTarget.exam_code)}>
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">Candidates enter this code on the exam portal to join.</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setAssignOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
