import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, KeyRound, Ban, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/candidates")({
  head: () => ({ meta: [{ title: "Candidates — Proctor Admin" }] }),
  component: Candidates,
});

type Candidate = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  department: string;
  roll_number: string;
  status: string;
  assigned_exam_id: string | null;
  assigned_exam_name?: string;
};

type Exam = { id: string; name: string };

const emptyForm = {
  name: "", candidate_id: "", email: "", mobile: "",
  department: "", password: "", assigned_exam_id: "",
};

function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // dialogs
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editTarget, setEditTarget] = useState<Candidate | null>(null);
  const [actionTarget, setActionTarget] = useState<Candidate | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: cands }, { data: examList }] = await Promise.all([
      supabase.from("candidates").select("*").order("name", { ascending: true }),
      supabase.from("exams").select("id, name"),
    ]);
    if (cands) setCandidates(cands as Candidate[]);
    if (examList) setExams(examList as Exam[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const examName = (id: string | null) => exams.find((e) => e.id === id)?.name ?? "—";

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  // ADD
  const handleAdd = async () => {
    if (!form.name || !form.candidate_id || !form.email || !form.password || !form.mobile || !form.department) {
      toast.error("All fields are required");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("candidates").insert({
      id: form.candidate_id,
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      department: form.department,
      password_hash: form.password, // store as plain or hash server-side
      status: "Active",
      assigned_exam_id: form.assigned_exam_id || null,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Candidate added");
    setAddOpen(false);
    setForm(emptyForm);
    load();
  };

  // EDIT
  const handleEdit = async () => {
    if (!editTarget) return;
    setSaving(true);
    const { error } = await supabase.from("candidates").update({
      name: editTarget.name,
      email: editTarget.email,
      mobile: editTarget.mobile,
      department: editTarget.department,
      assigned_exam_id: editTarget.assigned_exam_id || null,
    }).eq("id", editTarget.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Candidate updated");
    setEditOpen(false);
    load();
  };

  // DELETE
  const handleDelete = async () => {
    if (!actionTarget) return;
    setSaving(true);
    const { error } = await supabase.from("candidates").delete().eq("id", actionTarget.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Candidate deleted");
    setDeleteOpen(false);
    load();
  };

  // DISABLE / ENABLE
  const handleToggleStatus = async (c: Candidate) => {
    const newStatus = c.status === "Active" ? "Disabled" : "Active";
    const { error } = await supabase.from("candidates").update({ status: newStatus }).eq("id", c.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Candidate ${newStatus === "Active" ? "enabled" : "disabled"}`);
    load();
  };

  // RESET PASSWORD
  const handleResetPassword = async () => {
    if (!actionTarget || !newPassword) { toast.error("Enter a new password"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSaving(true);
    const { error } = await supabase.from("candidates").update({ password_hash: newPassword }).eq("id", actionTarget.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password reset");
    setResetOpen(false);
    setNewPassword("");
  };

  return (
    <AdminLayout title="Candidates">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search candidates…"
              className="pl-8 h-9 w-72 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="ml-auto">
            <Button className="rounded-lg h-9" onClick={() => { setForm(emptyForm); setAddOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Add candidate
            </Button>
          </div>
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

        <Card className="rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Assigned Exam</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                      No candidates found.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((r) => (
                  <TableRow key={r.id} className="hover:bg-accent/40 transition">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 grid place-items-center text-xs font-medium shrink-0">
                          {r.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium">{r.name}</div>
                          <div className="text-xs text-muted-foreground">{r.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="text-sm">{r.mobile}</TableCell>
                    <TableCell>{r.department}</TableCell>
                    <TableCell>{examName(r.assigned_exam_id)}</TableCell>
                    <TableCell>
                      <Badge className={r.status === "Active" ? "bg-success/10 text-success border-0" : "bg-muted text-muted-foreground border-0"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditTarget({ ...r }); setEditOpen(true); }}>
                            <Pencil className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setActionTarget(r); setResetOpen(true); }}>
                            <KeyRound className="h-4 w-4 mr-2" /> Reset password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(r)}>
                            {r.status === "Active"
                              ? <><Ban className="h-4 w-4 mr-2" /> Disable</>
                              : <><CheckCircle2 className="h-4 w-4 mr-2" /> Enable</>
                            }
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => { setActionTarget(r); setDeleteOpen(true); }}>
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

      {/* Add Candidate Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add candidate</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input placeholder="Sneha Rao" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Candidate ID</Label>
                <Input placeholder="STU10234" value={form.candidate_id} onChange={(e) => setForm((f) => ({ ...f, candidate_id: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input type="email" placeholder="student@college.edu" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Mobile number</Label>
                <Input placeholder="+91 9876543210" value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Input placeholder="CSE" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input type="password" placeholder="Set login password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Assign exam</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.assigned_exam_id}
                onChange={(e) => setForm((f) => ({ ...f, assigned_exam_id: e.target.value }))}
              >
                <option value="">— No exam assigned —</option>
                {exams.map((ex) => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving}>{saving ? "Adding…" : "Add candidate"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Candidate Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit candidate</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input value={editTarget.name} onChange={(e) => setEditTarget((t) => t && ({ ...t, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Email address</Label>
                <Input type="email" value={editTarget.email} onChange={(e) => setEditTarget((t) => t && ({ ...t, email: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Mobile number</Label>
                  <Input value={editTarget.mobile} onChange={(e) => setEditTarget((t) => t && ({ ...t, mobile: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Department</Label>
                  <Input value={editTarget.department} onChange={(e) => setEditTarget((t) => t && ({ ...t, department: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Assign exam</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editTarget.assigned_exam_id ?? ""}
                  onChange={(e) => setEditTarget((t) => t && ({ ...t, assigned_exam_id: e.target.value || null }))}
                >
                  <option value="">— No exam assigned —</option>
                  {exams.map((ex) => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
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

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete candidate</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete <span className="font-medium text-foreground">{actionTarget?.name}</span>? This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>{saving ? "Deleting…" : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">Set a new password for <span className="font-medium text-foreground">{actionTarget?.name}</span>.</p>
            <div className="space-y-1.5">
              <Label>New password</Label>
              <Input type="password" placeholder="Min. 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setResetOpen(false); setNewPassword(""); }}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={saving}>{saving ? "Resetting…" : "Reset password"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
