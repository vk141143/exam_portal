import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-Dke1WgR-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { A as Lock, L as Eye, R as EyeOff, f as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as ThemeToggle } from "./theme-toggle-D9MV8GNL.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D-Ra31cP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const [showPwd, setShowPwd] = (0, import_react.useState)(false);
	const [candidateId, setCandidateId] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [examCode, setExamCode] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const getLocation = () => new Promise((resolve) => {
		if (typeof window === "undefined" || !navigator.geolocation) {
			resolve(null);
			return;
		}
		navigator.geolocation.getCurrentPosition((pos) => resolve({
			lat: pos.coords.latitude,
			lng: pos.coords.longitude
		}), () => resolve(null), { timeout: 5e3 });
	});
	const submit = async (e) => {
		e.preventDefault();
		if (!candidateId || !password || !examCode) {
			toast.error("Enter your User ID, password and Exam Code");
			return;
		}
		setLoading(true);
		const { data: candidate, error: candError } = await supabase.from("candidates").select("id, name, email, status, password_hash, assigned_exam_id").eq("id", candidateId).single();
		if (candError || !candidate) {
			setLoading(false);
			toast.error("Invalid User ID");
			return;
		}
		if (candidate.status === "Disabled") {
			setLoading(false);
			toast.error("Your account has been disabled. Contact admin.");
			return;
		}
		if (candidate.password_hash !== password) {
			setLoading(false);
			toast.error("Incorrect password");
			return;
		}
		const { data: exam, error: examError } = await supabase.from("exams").select("id, name, duration_minutes, status, starts_at, ends_at").eq("exam_code", examCode.trim().toUpperCase()).single();
		if (examError || !exam) {
			setLoading(false);
			toast.error("Invalid Exam Code");
			return;
		}
		const now = /* @__PURE__ */ new Date();
		if (exam.starts_at && now < new Date(exam.starts_at)) {
			setLoading(false);
			const startsAt = new Date(exam.starts_at).toLocaleString("en-IN", {
				day: "2-digit",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false
			});
			toast.error(`Exam not started yet. It begins on ${startsAt}.`);
			return;
		}
		if (exam.ends_at && now > new Date(exam.ends_at)) {
			setLoading(false);
			const endsAt = new Date(exam.ends_at).toLocaleString("en-IN", {
				day: "2-digit",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false
			});
			toast.error(`Exam expired. It ended on ${endsAt}.`);
			return;
		}
		const location = await getLocation();
		await supabase.from("audit_logs").insert({
			actor: candidate.name,
			event: `Login success — joined exam: ${exam.name}`,
			severity: "info",
			ip_address: location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Unknown",
			client: navigator.userAgent.slice(0, 80)
		});
		sessionStorage.setItem("candidate", JSON.stringify({
			id: candidate.id,
			name: candidate.name,
			examId: exam.id,
			examName: exam.name,
			duration: exam.duration_minutes,
			location
		}));
		setLoading(false);
		navigate({ to: "/instructions" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen grid lg:grid-cols-2 bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden lg:flex flex-col justify-between p-12 border-r border-border bg-sidebar",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold tracking-tight",
						children: "Proctor"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl font-semibold tracking-tight leading-tight",
							children: "Secure, AI-proctored online examinations."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-base leading-relaxed",
							children: "Enterprise-grade assessments with live monitoring, face detection, fullscreen enforcement, and audit-ready reporting."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-4 pt-4",
							children: [
								["99.98%", "Uptime SLA"],
								["SOC 2", "Compliant"],
								["24/7", "Monitoring"],
								["AES-256", "Encryption"]
							].map(([v, k]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border p-4 bg-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg font-semibold",
									children: v
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: k
								})]
							}, k))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Proctor Systems · v1.0.0"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold tracking-tight",
						children: "Proctor"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ml-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 flex items-center justify-center px-6 pb-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "w-full max-w-sm space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-semibold tracking-tight",
								children: "Sign in to your account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Use the credentials provided by your administrator."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "uid",
										children: "User ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "uid",
										placeholder: "e.g. STU10234",
										value: candidateId,
										onChange: (e) => setCandidateId(e.target.value),
										autoComplete: "username",
										className: "h-11"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pwd",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "pwd",
											type: showPwd ? "text" : "password",
											placeholder: "••••••••",
											value: password,
											onChange: (e) => setPassword(e.target.value),
											autoComplete: "current-password",
											className: "h-11 pr-10"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowPwd((s) => !s),
											className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition",
											"aria-label": "Toggle password",
											children: showPwd ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "examcode",
										children: "Exam Code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "examcode",
										placeholder: "e.g. EX-A3K9PZ",
										value: examCode,
										onChange: (e) => setExamCode(e.target.value.toUpperCase()),
										className: "h-11 font-mono tracking-widest"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full h-11 rounded-lg",
							disabled: loading,
							children: loading ? "Verifying…" : "Sign in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs text-muted-foreground pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }), " Secure login"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/admin-login",
								className: "hover:text-foreground transition",
								children: "Admin portal →"
							})]
						})
					]
				})
			})]
		})]
	});
}
//#endregion
export { LoginPage as component };
