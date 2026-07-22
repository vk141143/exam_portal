import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-Dke1WgR-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { K as CircleCheck, L as Eye, R as EyeOff, f as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as ThemeToggle } from "./theme-toggle-D9MV8GNL.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-register-CPjvMS61.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminRegisterPage() {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [showPwd, setShowPwd] = (0, import_react.useState)(false);
	const [showConfirm, setShowConfirm] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const passwordStrength = () => {
		if (password.length === 0) return null;
		if (password.length < 6) return "weak";
		if (password.length < 10 || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) return "medium";
		return "strong";
	};
	const strength = passwordStrength();
	const submit = async (e) => {
		e.preventDefault();
		if (!name || !email || !password || !confirm) {
			toast.error("All fields are required");
			return;
		}
		if (password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		if (password !== confirm) {
			toast.error("Passwords do not match");
			return;
		}
		setLoading(true);
		const { data, error } = await supabase.auth.signUp({
			email,
			password
		});
		if (error) {
			setLoading(false);
			toast.error(error.message);
			return;
		}
		const { error: profileError } = await supabase.from("admin_profiles").insert({
			id: data.user.id,
			name,
			email,
			role: "admin"
		});
		setLoading(false);
		if (profileError) {
			toast.error("Signup failed: " + profileError.message);
			return;
		}
		toast.success("Account created! Please sign in.");
		navigate({ to: "/admin-login" });
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
							children: "Register as an administrator."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-base leading-relaxed",
							children: "Create your admin account to get full access to the Proctor examination management platform."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 pt-2",
							children: [
								"Create and schedule exams",
								"Manage candidates and assignments",
								"Monitor live proctoring sessions",
								"View results, reports and audit logs"
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary shrink-0" }), item]
							}, item))
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
					className: "w-full max-w-sm space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-semibold tracking-tight",
								children: "Create admin account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Fill in your details to register as an administrator."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "name",
										children: "Full name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										placeholder: "John Smith",
										value: name,
										onChange: (e) => setName(e.target.value),
										className: "h-11"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "Email address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										placeholder: "admin@example.com",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										autoComplete: "email",
										className: "h-11"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "pwd",
											children: "Password"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "pwd",
												type: showPwd ? "text" : "password",
												placeholder: "Min. 8 characters",
												value: password,
												onChange: (e) => setPassword(e.target.value),
												className: "h-11 pr-10"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowPwd((s) => !s),
												className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition",
												"aria-label": "Toggle password",
												children: showPwd ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
											})]
										}),
										strength && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex gap-1 flex-1",
												children: [
													"weak",
													"medium",
													"strong"
												].map((level, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1 flex-1 rounded-full transition-colors ${strength === "weak" && i === 0 ? "bg-destructive" : strength === "medium" && i <= 1 ? "bg-warning" : strength === "strong" ? "bg-success" : "bg-border"}` }, level))
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-xs capitalize ${strength === "weak" ? "text-destructive" : strength === "medium" ? "text-warning-foreground" : "text-success"}`,
												children: strength
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "confirm",
											children: "Confirm password"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "confirm",
												type: showConfirm ? "text" : "password",
												placeholder: "Re-enter password",
												value: confirm,
												onChange: (e) => setConfirm(e.target.value),
												className: "h-11 pr-10"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowConfirm((s) => !s),
												className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition",
												"aria-label": "Toggle confirm password",
												children: showConfirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
											})]
										}),
										confirm && password !== confirm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-destructive",
											children: "Passwords do not match"
										}),
										confirm && password === confirm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-success",
											children: "Passwords match"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full h-11 rounded-lg",
							disabled: loading,
							children: loading ? "Creating account…" : "Create account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center text-xs text-muted-foreground",
							children: [
								"Already have an account?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/admin-login",
									className: "text-foreground hover:underline",
									children: "Sign in"
								})
							]
						})
					]
				})
			})]
		})]
	});
}
//#endregion
export { AdminRegisterPage as component };
