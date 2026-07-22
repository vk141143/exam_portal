import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-Dke1WgR-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { b as Pencil, c as Trash2, h as Search, t as X, v as Plus, z as Ellipsis } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DropdownMenuTrigger, i as DropdownMenuItem, n as DropdownMenu, r as DropdownMenuContent, t as AdminLayout } from "./admin-layout-CHSpl8eo.mjs";
import { n as CardContent, t as Card } from "./card-CGCM0s9z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BQuBX6bn.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BpdftUtE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.question-bank-DQ7gKIO1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = {
	exam_id: "",
	question_text: "",
	subject: "",
	difficulty: "Medium",
	marks: 1,
	options: [
		"",
		"",
		"",
		""
	],
	correct_option: 0
};
var difficulties = [
	"Easy",
	"Medium",
	"Hard"
];
function QuestionBank() {
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [exams, setExams] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [deleteOpen, setDeleteOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [editTarget, setEditTarget] = (0, import_react.useState)(null);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const load = async () => {
		const [{ data: qs }, { data: exList }] = await Promise.all([supabase.from("questions").select("*").order("created_at", { ascending: false }), supabase.from("exams").select("id, name")]);
		if (qs) setQuestions(qs);
		if (exList) setExams(exList);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const examName = (id) => exams.find((e) => e.id === id)?.name ?? "—";
	const filtered = questions.filter((q) => q.question_text.toLowerCase().includes(search.toLowerCase()) || (q.subject ?? "").toLowerCase().includes(search.toLowerCase()) || examName(q.exam_id).toLowerCase().includes(search.toLowerCase()));
	const setOption = (opts, idx, val, setter) => {
		const next = [...opts];
		next[idx] = val;
		setter((f) => ({
			...f,
			options: next
		}));
	};
	const addOption = (opts, setter) => {
		if (opts.length >= 6) return;
		setter((f) => ({
			...f,
			options: [...opts, ""]
		}));
	};
	const removeOption = (opts, idx, correct, setter) => {
		if (opts.length <= 2) return;
		const next = opts.filter((_, i) => i !== idx);
		setter((f) => ({
			...f,
			options: next,
			correct_option: correct >= next.length ? next.length - 1 : correct
		}));
	};
	const validate = (f) => {
		if (!f.question_text.trim()) {
			toast.error("Enter the question");
			return false;
		}
		if (f.options.some((o) => !o.trim())) {
			toast.error("Fill in all options");
			return false;
		}
		if (!f.exam_id) {
			toast.error("Select an exam");
			return false;
		}
		return true;
	};
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
			correct_option: form.correct_option
		});
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Question added");
		setAddOpen(false);
		setForm(emptyForm);
		load();
	};
	const openEdit = (q) => {
		setEditTarget({
			...q,
			options: Array.isArray(q.options) ? q.options : [
				"",
				"",
				"",
				""
			]
		});
		setEditOpen(true);
	};
	const setEditOption = (idx, val) => {
		setEditTarget((t) => {
			if (!t) return t;
			const next = [...t.options];
			next[idx] = val;
			return {
				...t,
				options: next
			};
		});
	};
	const addEditOption = () => {
		setEditTarget((t) => {
			if (!t || t.options.length >= 6) return t;
			return {
				...t,
				options: [...t.options, ""]
			};
		});
	};
	const removeEditOption = (idx) => {
		setEditTarget((t) => {
			if (!t || t.options.length <= 2) return t;
			const next = t.options.filter((_, i) => i !== idx);
			return {
				...t,
				options: next,
				correct_option: t.correct_option >= next.length ? next.length - 1 : t.correct_option
			};
		});
	};
	const handleEdit = async () => {
		if (!editTarget) return;
		if (!editTarget.question_text.trim()) {
			toast.error("Enter the question");
			return;
		}
		if (editTarget.options.some((o) => !o.trim())) {
			toast.error("Fill in all options");
			return;
		}
		setSaving(true);
		const { error } = await supabase.from("questions").update({
			exam_id: editTarget.exam_id,
			question_text: editTarget.question_text,
			subject: editTarget.subject,
			difficulty: editTarget.difficulty,
			marks: editTarget.marks,
			options: editTarget.options,
			correct_option: editTarget.correct_option
		}).eq("id", editTarget.id);
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Question updated");
		setEditOpen(false);
		load();
	};
	const handleDelete = async () => {
		if (!deleteTarget) return;
		setSaving(true);
		const { error } = await supabase.from("questions").delete().eq("id", deleteTarget.id);
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Question deleted");
		setDeleteOpen(false);
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Question Bank",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search questions, subjects, exams…",
								className: "pl-8 h-9 w-80 rounded-lg",
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), " New question"]
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "w-[35%]",
									children: "Question"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Exam" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Subject" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Difficulty" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Marks" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Options" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-12" })
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filtered.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 7,
								className: "text-center text-muted-foreground py-10",
								children: "No questions found."
							}) }), filtered.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: "hover:bg-accent/40 transition align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-medium text-sm leading-snug py-3",
										children: q.question_text
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-sm text-muted-foreground",
										children: examName(q.exam_id)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-sm",
										children: q.subject || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: q.difficulty === "Easy" ? "bg-success/10 text-success border-0" : q.difficulty === "Hard" ? "bg-destructive/10 text-destructive border-0" : "bg-warning/10 text-warning-foreground border-0",
										children: q.difficulty
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-sm font-mono",
										children: q.marks
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-col gap-1",
										children: (Array.isArray(q.options) ? q.options : []).map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `text-xs px-2 py-0.5 rounded-md border ${i === q.correct_option ? "bg-success/10 border-success/30 text-success" : "border-border text-muted-foreground"}`,
											children: [
												String.fromCharCode(65 + i),
												". ",
												opt
											]
										}, i))
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
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onClick: () => openEdit(q),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4 mr-2" }), " Edit"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												className: "text-destructive",
												onClick: () => {
													setDeleteTarget(q);
													setDeleteOpen(true);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 mr-2" }), " Delete"]
											})]
										})] })
									})
								]
							}, q.id))] })] })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add question" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Exam" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
										value: form.exam_id,
										onChange: (e) => setForm((f) => ({
											...f,
											exam_id: e.target.value
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "— Select exam —"
										}), exams.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: ex.id,
											children: ex.name
										}, ex.id))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Question" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										className: "w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring",
										placeholder: "Type your question here…",
										value: form.question_text,
										onChange: (e) => setForm((f) => ({
											...f,
											question_text: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Options ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-xs",
												children: "(click radio to mark correct)"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												className: "h-7 text-xs rounded-md",
												onClick: () => addOption(form.options, setForm),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 mr-1" }), " Add option"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: form.options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "radio",
														name: "correct_add",
														checked: form.correct_option === i,
														onChange: () => setForm((f) => ({
															...f,
															correct_option: i
														})),
														className: "accent-primary shrink-0",
														title: "Mark as correct answer"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs text-muted-foreground w-5 shrink-0",
														children: [String.fromCharCode(65 + i), "."]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: `Option ${String.fromCharCode(65 + i)}`,
														value: opt,
														onChange: (e) => setOption(form.options, i, e.target.value, setForm),
														className: "h-9 flex-1"
													}),
													form.options.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "button",
														variant: "ghost",
														size: "icon",
														className: "h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive",
														onClick: () => removeOption(form.options, i, form.correct_option, setForm),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
													})
												]
											}, i))
										}),
										form.correct_option !== null && form.options[form.correct_option] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-success",
											children: [
												"✓ Correct answer: ",
												String.fromCharCode(65 + form.correct_option),
												". ",
												form.options[form.correct_option]
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "e.g. DBMS",
												value: form.subject,
												onChange: (e) => setForm((f) => ({
													...f,
													subject: e.target.value
												}))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Difficulty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
												value: form.difficulty,
												onChange: (e) => setForm((f) => ({
													...f,
													difficulty: e.target.value
												})),
												children: difficulties.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Marks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: 1,
												value: form.marks,
												onChange: (e) => setForm((f) => ({
													...f,
													marks: Number(e.target.value)
												}))
											})]
										})
									]
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
							children: saving ? "Adding…" : "Add question"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editOpen,
				onOpenChange: setEditOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit question" }) }),
						editTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Exam" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
										value: editTarget.exam_id ?? "",
										onChange: (e) => setEditTarget((t) => t && {
											...t,
											exam_id: e.target.value
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "— Select exam —"
										}), exams.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: ex.id,
											children: ex.name
										}, ex.id))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Question" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										className: "w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring",
										value: editTarget.question_text,
										onChange: (e) => setEditTarget((t) => t && {
											...t,
											question_text: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Options ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-xs",
												children: "(click radio to mark correct)"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												className: "h-7 text-xs rounded-md",
												onClick: addEditOption,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 mr-1" }), " Add option"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: editTarget.options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "radio",
														name: "correct_edit",
														checked: editTarget.correct_option === i,
														onChange: () => setEditTarget((t) => t && {
															...t,
															correct_option: i
														}),
														className: "accent-primary shrink-0",
														title: "Mark as correct answer"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs text-muted-foreground w-5 shrink-0",
														children: [String.fromCharCode(65 + i), "."]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: opt,
														onChange: (e) => setEditOption(i, e.target.value),
														className: "h-9 flex-1"
													}),
													editTarget.options.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "button",
														variant: "ghost",
														size: "icon",
														className: "h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive",
														onClick: () => removeEditOption(i),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
													})
												]
											}, i))
										}),
										editTarget.options[editTarget.correct_option] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-success",
											children: [
												"✓ Correct answer: ",
												String.fromCharCode(65 + editTarget.correct_option),
												". ",
												editTarget.options[editTarget.correct_option]
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: editTarget.subject ?? "",
												onChange: (e) => setEditTarget((t) => t && {
													...t,
													subject: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Difficulty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
												value: editTarget.difficulty,
												onChange: (e) => setEditTarget((t) => t && {
													...t,
													difficulty: e.target.value
												}),
												children: difficulties.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Marks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: 1,
												value: editTarget.marks,
												onChange: (e) => setEditTarget((t) => t && {
													...t,
													marks: Number(e.target.value)
												})
											})]
										})
									]
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Delete question" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground py-2",
							children: "Are you sure you want to delete this question? This cannot be undone."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium border border-border rounded-lg p-3 bg-accent",
							children: deleteTarget?.question_text
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
			})
		]
	});
}
//#endregion
export { QuestionBank as component };
