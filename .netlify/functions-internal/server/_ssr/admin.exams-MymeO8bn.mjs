import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-Dke1WgR-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { H as Clock, J as Check, V as Copy, Z as Calendar, a as Users, v as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as AdminLayout } from "./admin-layout-CHSpl8eo.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CGCM0s9z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.mjs";
import { t as createVideoRoom } from "./videosdk-DG4_k8-w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.exams-MymeO8bn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tone = {
	Live: "bg-success/10 text-success border-0",
	Scheduled: "bg-primary/10 text-primary border-0",
	Completed: "bg-muted text-muted-foreground border-0",
	Draft: "bg-warning/15 text-warning-foreground border-0"
};
var emptyForm = {
	name: "",
	subject: "",
	duration_minutes: "",
	question_count: "",
	starts_at: "",
	ends_at: "",
	status: "Draft"
};
function generateCode() {
	return "EX-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}
function toLocalInput(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function toUTCIso(local) {
	if (!local) return "";
	return new Date(local).toISOString();
}
function Exams() {
	const [exams, setExams] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [assignOpen, setAssignOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [editTarget, setEditTarget] = (0, import_react.useState)(null);
	const [assignTarget, setAssignTarget] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	(0, import_react.useState)(() => {
		supabase.from("exams").select("*").order("starts_at", { ascending: false }).then(({ data }) => {
			if (data) setExams(data);
			setLoading(false);
		});
	});
	const refresh = async () => {
		const { data } = await supabase.from("exams").select("*").order("starts_at", { ascending: false });
		if (data) setExams(data);
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
		let roomId = null;
		try {
			roomId = await createVideoRoom();
		} catch {}
		const { error } = await supabase.from("exams").insert({
			name: form.name,
			subject: form.subject,
			duration_minutes: Number(form.duration_minutes),
			question_count: Number(form.question_count),
			starts_at: toUTCIso(form.starts_at),
			ends_at: toUTCIso(form.ends_at),
			status: form.status,
			exam_code: generateCode(),
			room_id: roomId,
			candidate_count: 0
		});
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
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
			status: editTarget.status
		}).eq("id", editTarget.id);
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Exam updated");
		setEditOpen(false);
		refresh();
	};
	const copyCode = (code) => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Exams",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Manage exams, schedules, and candidate assignments."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "rounded-lg h-9",
							onClick: () => {
								setForm(emptyForm);
								setCreateOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), " Create exam"]
						})]
					}),
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Loading…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid md:grid-cols-2 xl:grid-cols-3 gap-4",
						children: exams.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "rounded-xl transition hover:shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-base font-semibold",
										children: e.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: tone[e.status] ?? tone.Draft,
										children: e.status
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: e.subject
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
												" ",
												e.duration_minutes,
												" min"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }),
												" ",
												e.question_count,
												" Qs"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-muted-foreground col-span-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 shrink-0" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.starts_at ? new Date(e.starts_at).toLocaleString("en-IN", {
													day: "2-digit",
													month: "short",
													year: "numeric",
													hour: "2-digit",
													minute: "2-digit",
													hour12: false
												}) : "—" }),
												e.ends_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground/60",
													children: ["→ ", new Date(e.ends_at).toLocaleString("en-IN", {
														day: "2-digit",
														month: "short",
														year: "numeric",
														hour: "2-digit",
														minute: "2-digit",
														hour12: false
													})]
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										className: "rounded-lg flex-1",
										onClick: () => {
											setEditTarget({ ...e });
											setEditOpen(true);
										},
										children: "Edit"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										className: "rounded-lg flex-1",
										onClick: () => {
											setAssignTarget(e);
											setAssignOpen(true);
										},
										children: "Assign"
									})]
								})]
							})]
						}, e.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create exam" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. DBMS Mid-Term",
										value: form.name,
										onChange: (e) => setForm((f) => ({
											...f,
											name: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. Database Systems",
										value: form.subject,
										onChange: (e) => setForm((f) => ({
											...f,
											subject: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duration (minutes)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											placeholder: "60",
											value: form.duration_minutes,
											onChange: (e) => setForm((f) => ({
												...f,
												duration_minutes: e.target.value
											}))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "No. of questions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											placeholder: "40",
											value: form.question_count,
											onChange: (e) => setForm((f) => ({
												...f,
												question_count: e.target.value
											}))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Start date & time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "datetime-local",
											value: form.starts_at,
											onChange: (e) => setForm((f) => ({
												...f,
												starts_at: e.target.value
											}))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "End date & time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "datetime-local",
											value: form.ends_at,
											onChange: (e) => setForm((f) => ({
												...f,
												ends_at: e.target.value
											}))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
										value: form.status,
										onChange: (e) => setForm((f) => ({
											...f,
											status: e.target.value
										})),
										children: [
											"Draft",
											"Scheduled",
											"Live",
											"Completed"
										].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setCreateOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleCreate,
							disabled: saving,
							children: saving ? "Creating…" : "Create exam"
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit exam" }) }),
						editTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editTarget.name,
										onChange: (e) => setEditTarget((t) => t && {
											...t,
											name: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editTarget.subject,
										onChange: (e) => setEditTarget((t) => t && {
											...t,
											subject: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duration (minutes)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: editTarget.duration_minutes,
											onChange: (e) => setEditTarget((t) => t && {
												...t,
												duration_minutes: Number(e.target.value)
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "No. of questions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: editTarget.question_count,
											onChange: (e) => setEditTarget((t) => t && {
												...t,
												question_count: Number(e.target.value)
											})
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Start date & time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "datetime-local",
											value: toLocalInput(editTarget.starts_at),
											onChange: (e) => setEditTarget((t) => t && {
												...t,
												starts_at: toUTCIso(e.target.value)
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "End date & time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "datetime-local",
											value: toLocalInput(editTarget.ends_at),
											onChange: (e) => setEditTarget((t) => t && {
												...t,
												ends_at: toUTCIso(e.target.value)
											})
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
										value: editTarget.status,
										onChange: (e) => setEditTarget((t) => t && {
											...t,
											status: e.target.value
										}),
										children: [
											"Draft",
											"Scheduled",
											"Live",
											"Completed"
										].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
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
				open: assignOpen,
				onOpenChange: setAssignOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Assign exam" }) }),
						assignTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										"Share this unique exam code with candidates to assign them to ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: assignTarget.name
										}),
										"."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 p-3 rounded-lg bg-accent border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-lg font-semibold tracking-widest flex-1 text-center",
										children: assignTarget.exam_code
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "h-8 w-8 shrink-0",
										onClick: () => copyCode(assignTarget.exam_code),
										children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground text-center",
									children: "Candidates enter this code on the exam portal to join."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setAssignOpen(false),
							children: "Done"
						}) })
					]
				})
			})
		]
	});
}
//#endregion
export { Exams as component };
