import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-Dke1WgR-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { L as Eye, R as EyeOff, f as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as ThemeToggle } from "./theme-toggle-D9MV8GNL.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-login-B80caYK7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLoginPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPwd, setShowPwd] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const submit = async (e) => {
		e.preventDefault();
		if (!email || !password) {
			toast.error("Enter your email and password");
			return;
		}
		setLoading(true);
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (error) {
			setLoading(false);
			toast.error(error.message);
			return;
		}
		const { data: profile, error: profileError } = await supabase.from("admin_profiles").select("role").eq("id", data.user.id).single();
		setLoading(false);
		if (profileError || !profile || profile.role !== "admin") {
			await supabase.auth.signOut();
			toast.error("Access denied. Admins only.");
			return;
		}
		toast.success("Welcome back!");
		navigate({ to: "/admin" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen grid lg:grid-cols-2 bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden lg:flex flex-col justify-between p-12 border-r border-border bg-sidebar",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold tracking-tight",
						children: "Proctor Admin"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl font-semibold tracking-tight leading-tight",
							children: "Admin portal for secure AI-proctored examinations."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-base leading-relaxed",
							children: "Manage exams, candidates, question banks, live monitoring, and audit-ready reporting."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-4 pt-4",
							children: [
								["Exams", "Create & schedule"],
								["Candidates", "Manage & assign"],
								["Monitoring", "Live proctoring"],
								["Reports", "Audit & results"]
							].map(([v, k]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border p-4 bg-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-base font-semibold",
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
						" Proctor Systems · Admin Portal"
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
						children: "Proctor Admin"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ml-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 flex items-center justify-center px-6 pb-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-semibold tracking-tight",
								children: "Admin sign in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Restricted to authorised administrators only."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									placeholder: "admin@example.com",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									autoComplete: "email",
									className: "h-11"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full h-11 rounded-lg",
							disabled: loading,
							children: loading ? "Signing in…" : "Sign in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center text-xs text-muted-foreground",
							children: [
								"Don't have an account?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/admin-register",
									className: "text-foreground hover:underline",
									children: "Register here"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center text-xs text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/",
								className: "hover:text-foreground transition",
								children: "← Candidate login"
							})
						})
					]
				})
			})]
		})]
	});
}
//#endregion
export { AdminLoginPage as component };
