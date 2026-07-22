import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-Dke1WgR-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { K as CircleCheck, N as KeyRound, b as Pencil, c as Trash2, et as Ban, h as Search, v as Plus, z as Ellipsis } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DropdownMenuTrigger, i as DropdownMenuItem, n as DropdownMenu, r as DropdownMenuContent, t as AdminLayout } from "./admin-layout-CHSpl8eo.mjs";
import { n as CardContent, t as Card } from "./card-CGCM0s9z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BQuBX6bn.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.candidates-CoEllFnz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = {
	name: "",
	candidate_id: "",
	email: "",
	mobile: "",
	department: "",
	password: "",
	assigned_exam_id: ""
};
function Candidates() {
	const [candidates, setCandidates] = (0, import_react.useState)([]);
	const [exams, setExams] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [deleteOpen, setDeleteOpen] = (0, import_react.useState)(false);
	const [resetOpen, setResetOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [editTarget, setEditTarget] = (0, import_react.useState)(null);
	const [actionTarget, setActionTarget] = (0, import_react.useState)(null);
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const load = async () => {
		const [{ data: cands }, { data: examList }] = await Promise.all([supabase.from("candidates").select("*").order("name", { ascending: true }), supabase.from("exams").select("id, name")]);
		if (cands) setCandidates(cands);
		if (examList) setExams(examList);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const examName = (id) => exams.find((e) => e.id === id)?.name ?? "—";
	const filtered = candidates.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()));
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
			password_hash: form.password,
			status: "Active",
			assigned_exam_id: form.assigned_exam_id || null
		});
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Candidate added");
		setAddOpen(false);
		setForm(emptyForm);
		load();
	};
	const handleEdit = async () => {
		if (!editTarget) return;
		setSaving(true);
		const { error } = await supabase.from("candidates").update({
			name: editTarget.name,
			email: editTarget.email,
			mobile: editTarget.mobile,
			department: editTarget.department,
			assigned_exam_id: editTarget.assigned_exam_id || null
		}).eq("id", editTarget.id);
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Candidate updated");
		setEditOpen(false);
		load();
	};
	const handleDelete = async () => {
		if (!actionTarget) return;
		setSaving(true);
		const { error } = await supabase.from("candidates").delete().eq("id", actionTarget.id);
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Candidate deleted");
		setDeleteOpen(false);
		load();
	};
	const handleToggleStatus = async (c) => {
		const newStatus = c.status === "Active" ? "Disabled" : "Active";
		const { error } = await supabase.from("candidates").update({ status: newStatus }).eq("id", c.id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(`Candidate ${newStatus === "Active" ? "enabled" : "disabled"}`);
		load();
	};
	const handleResetPassword = async () => {
		if (!actionTarget || !newPassword) {
			toast.error("Enter a new password");
			return;
		}
		if (newPassword.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		setSaving(true);
		const { error } = await supabase.from("candidates").update({ password_hash: newPassword }).eq("id", actionTarget.id);
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Password reset");
		setResetOpen(false);
		setNewPassword("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Candidates",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search candidates…",
								className: "pl-8 h-9 w-72 rounded-lg",
								value: search,
								onChange: (e) => setSearch(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ml-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "rounded-lg h-9",
								onClick: () => {
									setForm(emptyForm);
									setAddOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), " Add candidate"]
							})
						})]
					}),
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Loading…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-xl overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Candidate" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "User ID" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mobile" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Department" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Assigned Exam" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-12" })
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filtered.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 7,
								className: "text-center text-muted-foreground py-10",
								children: "No candidates found."
							}) }), filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: "hover:bg-accent/40 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-8 w-8 rounded-full bg-primary/10 grid place-items-center text-xs font-medium shrink-0",
											children: r.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: r.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: r.email
										})] })]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-mono text-xs",
										children: r.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-sm",
										children: r.mobile
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.department }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: examName(r.assigned_exam_id) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: r.status === "Active" ? "bg-success/10 text-success border-0" : "bg-muted text-muted-foreground border-0",
										children: r.status
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-8 w-8 rounded-lg",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
											align: "end",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => {
														setEditTarget({ ...r });
														setEditOpen(true);
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4 mr-2" }), " Edit"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => {
														setActionTarget(r);
														setResetOpen(true);
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 mr-2" }), " Reset password"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
													onClick: () => handleToggleStatus(r),
													children: r.status === "Active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-4 w-4 mr-2" }), " Disable"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 mr-2" }), " Enable"] })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													className: "text-destructive",
													onClick: () => {
														setActionTarget(r);
														setDeleteOpen(true);
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 mr-2" }), " Delete"]
												})
											]
										})] })
									})
								]
							}, r.id))] })] })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add candidate" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Sneha Rao",
											value: form.name,
											onChange: (e) => setForm((f) => ({
												...f,
												name: e.target.value
											}))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Candidate ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "STU10234",
											value: form.candidate_id,
											onChange: (e) => setForm((f) => ({
												...f,
												candidate_id: e.target.value
											}))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "email",
										placeholder: "student@college.edu",
										value: form.email,
										onChange: (e) => setForm((f) => ({
											...f,
											email: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mobile number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "+91 9876543210",
											value: form.mobile,
											onChange: (e) => setForm((f) => ({
												...f,
												mobile: e.target.value
											}))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Department" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "CSE",
											value: form.department,
											onChange: (e) => setForm((f) => ({
												...f,
												department: e.target.value
											}))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "password",
										placeholder: "Set login password",
										value: form.password,
										onChange: (e) => setForm((f) => ({
											...f,
											password: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assign exam" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
										value: form.assigned_exam_id,
										onChange: (e) => setForm((f) => ({
											...f,
											assigned_exam_id: e.target.value
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "— No exam assigned —"
										}), exams.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: ex.id,
											children: ex.name
										}, ex.id))]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setAddOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleAdd,
							disabled: saving,
							children: saving ? "Adding…" : "Add candidate"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editOpen,
				onOpenChange: setEditOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit candidate" }) }),
						editTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editTarget.name,
										onChange: (e) => setEditTarget((t) => t && {
											...t,
											name: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "email",
										value: editTarget.email,
										onChange: (e) => setEditTarget((t) => t && {
											...t,
											email: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mobile number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: editTarget.mobile,
											onChange: (e) => setEditTarget((t) => t && {
												...t,
												mobile: e.target.value
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Department" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: editTarget.department,
											onChange: (e) => setEditTarget((t) => t && {
												...t,
												department: e.target.value
											})
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assign exam" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
										value: editTarget.assigned_exam_id ?? "",
										onChange: (e) => setEditTarget((t) => t && {
											...t,
											assigned_exam_id: e.target.value || null
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "— No exam assigned —"
										}), exams.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: ex.id,
											children: ex.name
										}, ex.id))]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setEditOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleEdit,
							disabled: saving,
							children: saving ? "Saving…" : "Save changes"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: deleteOpen,
				onOpenChange: setDeleteOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Delete candidate" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground py-2",
							children: [
								"Are you sure you want to delete ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: actionTarget?.name
								}),
								"? This cannot be undone."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setDeleteOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "destructive",
							onClick: handleDelete,
							disabled: saving,
							children: saving ? "Deleting…" : "Delete"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: resetOpen,
				onOpenChange: setResetOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Reset password" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"Set a new password for ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: actionTarget?.name
									}),
									"."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									placeholder: "Min. 6 characters",
									value: newPassword,
									onChange: (e) => setNewPassword(e.target.value)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								setResetOpen(false);
								setNewPassword("");
							},
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleResetPassword,
							disabled: saving,
							children: saving ? "Resetting…" : "Reset password"
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { Candidates as component };
