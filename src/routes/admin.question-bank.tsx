import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/question-bank")({
  head: () => ({ meta: [{ title: "Question Bank — Proctor Admin" }] }),
  component: QuestionBank,
});

type Question = {
  id: string;
  exam_id: string | null;
  question_text: string;
  subject: string;
  difficulty: string;
  marks: number;
  options: string[];
  correct_option: number;
};

type Exam = { id: string; name: string };

const emptyForm = {
  exam_id: "",
  question_text: "",
  subject: "",
  difficulty: "Medium",
  marks: 1,
  options: ["", "", "", ""],
  correct_option: 0,
};

const difficulties = ["Easy", "Medium", "Hard"];

function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editTarget, setEditTarget] = useState<Question | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: qs }, { data: exList }] = await Promise.all([
      supabase.from("questions").select("*").order("created_at", { ascending: false }),
      supabase.from("exams").select("id, name"),
    ]);
    if (qs) setQuestions(qs as Question[]);
    if (exList) setExams(exList as Exam[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const examName = (id: string | null) => exams.find((e) => e.id === id)?.name ?? "—";

  const filtered = questions.filter((q) =>
    q.question_text.toLowerCase().includes(search.toLowerCase()) ||
    (q.subject ?? "").toLowerCase().includes(search.toLowerCase()) ||
    examName(q.exam_id).toLowerCase().includes(search.toLowerCase())
  );

  // option helpers
  const setOption = (
    opts: string[],
    idx: number,
    val: string,
    setter: (fn: (prev: typeof emptyForm) => typeof emptyForm) => void
  ) => {
    const next = [...opts];
    next[idx] = val;
    setter((f) => ({ ...f, options: next }));
  };

  const addOption = (
    opts: string[],
    setter: (fn: (prev: typeof emptyForm) => typeof emptyForm) => void
  ) => {
    if (opts.length >= 6) return;
    setter((f) => ({ ...f, options: [...opts, ""] }));
  };

  const removeOption = (
    opts: string[],
    idx: number,
    correct: number,
    setter: (fn: (prev: typeof emptyForm) => typeof emptyForm) => void
  ) => {
    if (opts.length <= 2) return;
    const next = opts.filter((_, i) => i !== idx);
    setter((f) => ({
      ...f,
      options: next,
      correct_option: correct >= next.length ? next.length - 1 : correct,
    }));
  };

  const validate = (f: typeof emptyForm) => {
    if (!f.question_text.trim()) { toast.error("Enter the question"); return false; }
    if (f.options.some((o) => !o.trim())) { toast.error("Fill in all options"); return false; }
    if (!f.exam_id) { toast.error("Select an exam"); return false; }
    return true;
  };

  // ADD
  const handleAdd = async () => {
    if (!validate(form)) return;
    setSaving(true);
    const { error } = await supabase.from("questions").insert({
      exam_id: form.exam_id,
      question_text: form.question_text,
      subject: form.subject,
      difficulty: form.difficulty,
      marks: form.marks,
      options: form.options,
      correct_option: form.correct_option,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Question added");
    setAddOpen(false);
    setForm(emptyForm);
    load();
  };

  // EDIT
  const openEdit = (q: Question) => {
    setEditTarget({
      ...q,
      options: Array.isArray(q.options) ? q.options : ["", "", "", ""],
    });
    setEditOpen(true);
  };

  const setEditOption = (idx: number, val: string) => {
    setEditTarget((t) => {
      if (!t) return t;
      const next = [...t.options];
      next[idx] = val;
      return { ...t, options: next };
    });
  };

  const addEditOption = () => {
    setEditTarget((t) => {
      if (!t || t.options.length >= 6) return t;
      return { ...t, options: [...t.options, ""] };
    });
  };

  const removeEditOption = (idx: number) => {
    setEditTarget((t) => {
      if (!t || t.options.length <= 2) return t;
      const next = t.options.filter((_, i) => i !== idx);
      return {
        ...t,
        options: next,
        correct_option: t.correct_option >= next.length ? next.length - 1 : t.correct_option,
      };
    });
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    if (!editTarget.question_text.trim()) { toast.error("Enter the question"); return; }
    if (editTarget.options.some((o) => !o.trim())) { toast.error("Fill in all options"); return; }
    setSaving(true);
    const { error } = await supabase.from("questions").update({
      exam_id: editTarget.exam_id,
      question_text: editTarget.question_text,
      subject: editTarget.subject,
      difficulty: editTarget.difficulty,
      marks: editTarget.marks,
      options: editTarget.options,
      correct_option: editTarget.correct_option,
    }).eq("id", editTarget.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Question updated");
    setEditOpen(false);
    load();
  };

  // DELETE
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    const { error } = await supabase.from("questions").delete().eq("id", deleteTarget.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Question deleted");
    setDeleteOpen(false);
    load();
  };

  return (
    <AdminLayout title="Question Bank">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search questions, subjects, exams…"
              className="pl-8 h-9 w-80 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="ml-auto">
            <Button className="rounded-lg h-9" onClick={() => { setForm(emptyForm); setAddOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> New question
            </Button>
          </div>
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

        <Card className="rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Question</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                      No questions found.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((q) => (
                  <TableRow key={q.id} className="hover:bg-accent/40 transition align-top">
                    <TableCell className="font-medium text-sm leading-snug py-3">{q.question_text}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{examName(q.exam_id)}</TableCell>
                    <TableCell className="text-sm">{q.subject || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={
                        q.difficulty === "Easy" ? "bg-success/10 text-success border-0" :
                        q.difficulty === "Hard" ? "bg-destructive/10 text-destructive border-0" :
                        "bg-warning/10 text-warning-foreground border-0"
                      }>
                        {q.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono">{q.marks}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {(Array.isArray(q.options) ? q.options : []).map((opt, i) => (
                          <span
                            key={i}
                            className={`text-xs px-2 py-0.5 rounded-md border ${
                              i === q.correct_option
                                ? "bg-success/10 border-success/30 text-success"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(q)}>
                            <Pencil className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => { setDeleteTarget(q); setDeleteOpen(true); }}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Question Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Exam</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.exam_id}
                onChange={(e) => setForm((f) => ({ ...f, exam_id: e.target.value }))}
              >
                <option value="">— Select exam —</option>
                {exams.map((ex) => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>Question</Label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Type your question here…"
                value={form.question_text}
                onChange={(e) => setForm((f) => ({ ...f, question_text: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Options <span className="text-muted-foreground text-xs">(click radio to mark correct)</span></Label>
                <Button type="button" variant="outline" size="sm" className="h-7 text-xs rounded-md" onClick={() => addOption(form.options, setForm)}>
                  <Plus className="h-3 w-3 mr-1" /> Add option
                </Button>
              </div>
              <div className="space-y-2">
                {form.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_add"
                      checked={form.correct_option === i}
                      onChange={() => setForm((f) => ({ ...f, correct_option: i }))}
                      className="accent-primary shrink-0"
                      title="Mark as correct answer"
                    />
                    <span className="text-xs text-muted-foreground w-5 shrink-0">{String.fromCharCode(65 + i)}.</span>
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      value={opt}
                      onChange={(e) => setOption(form.options, i, e.target.value, setForm)}
                      className="h-9 flex-1"
                    />
                    {form.options.length > 2 && (
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeOption(form.options, i, form.correct_option, setForm)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {form.correct_option !== null && form.options[form.correct_option] && (
                <p className="text-xs text-success">✓ Correct answer: {String.fromCharCode(65 + form.correct_option)}. {form.options[form.correct_option]}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Input placeholder="e.g. DBMS" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.difficulty}
                  onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                >
                  {difficulties.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Marks</Label>
                <Input type="number" min={1} value={form.marks} onChange={(e) => setForm((f) => ({ ...f, marks: Number(e.target.value) }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving}>{saving ? "Adding…" : "Add question"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit question</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Exam</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editTarget.exam_id ?? ""}
                  onChange={(e) => setEditTarget((t) => t && ({ ...t, exam_id: e.target.value }))}
                >
                  <option value="">— Select exam —</option>
                  {exams.map((ex) => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Question</Label>
                <textarea
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  value={editTarget.question_text}
                  onChange={(e) => setEditTarget((t) => t && ({ ...t, question_text: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Options <span className="text-muted-foreground text-xs">(click radio to mark correct)</span></Label>
                  <Button type="button" variant="outline" size="sm" className="h-7 text-xs rounded-md" onClick={addEditOption}>
                    <Plus className="h-3 w-3 mr-1" /> Add option
                  </Button>
                </div>
                <div className="space-y-2">
                  {editTarget.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct_edit"
                        checked={editTarget.correct_option === i}
                        onChange={() => setEditTarget((t) => t && ({ ...t, correct_option: i }))}
                        className="accent-primary shrink-0"
                        title="Mark as correct answer"
                      />
                      <span className="text-xs text-muted-foreground w-5 shrink-0">{String.fromCharCode(65 + i)}.</span>
                      <Input
                        value={opt}
                        onChange={(e) => setEditOption(i, e.target.value)}
                        className="h-9 flex-1"
                      />
                      {editTarget.options.length > 2 && (
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeEditOption(i)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {editTarget.options[editTarget.correct_option] && (
                  <p className="text-xs text-success">✓ Correct answer: {String.fromCharCode(65 + editTarget.correct_option)}. {editTarget.options[editTarget.correct_option]}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Subject</Label>
                  <Input value={editTarget.subject ?? ""} onChange={(e) => setEditTarget((t) => t && ({ ...t, subject: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Difficulty</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={editTarget.difficulty}
                    onChange={(e) => setEditTarget((t) => t && ({ ...t, difficulty: e.target.value }))}
                  >
                    {difficulties.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Marks</Label>
                  <Input type="number" min={1} value={editTarget.marks} onChange={(e) => setEditTarget((t) => t && ({ ...t, marks: Number(e.target.value) }))} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete question</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete this question? This cannot be undone.
          </p>
          <p className="text-sm font-medium border border-border rounded-lg p-3 bg-accent">
            {deleteTarget?.question_text}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>{saving ? "Deleting…" : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
