import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-Dke1WgR-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as ThemeProvider } from "./theme-BDFsyzMe.mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-OhMnvDqd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DWlEtmYg.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-semibold tracking-tight text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-medium text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90",
						children: "Back to sign in"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Try refreshing this page or return to the sign-in screen."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent",
						children: "Sign in"
					})]
				})
			]
		})
	});
}
var Route$16 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Proctor — Secure Online Examination Portal" },
			{
				name: "description",
				content: "Enterprise-grade AI-proctored online examination platform."
			},
			{
				property: "og:title",
				content: "Proctor — Secure Online Examination Portal"
			},
			{
				property: "og:description",
				content: "Enterprise-grade AI-proctored online examination platform."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$16.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ThemeProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})] })
	});
}
var $$splitComponentImporter$15 = () => import("./routes-D-Ra31cP.mjs");
var Route$15 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Sign in — Proctor Examination Portal" }, {
		name: "description",
		content: "Sign in to your secure online examination portal."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./admin-rRckGftk.mjs");
var Route$14 = createFileRoute("/admin")({
	beforeLoad: async () => {
		if (typeof window === "undefined") return;
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) throw redirect({ to: "/admin-login" });
		const { data: profile } = await supabase.from("admin_profiles").select("role").eq("id", session.user.id).single();
		if (!profile || profile.role !== "admin") {
			await supabase.auth.signOut();
			throw redirect({ to: "/admin-login" });
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./admin-login-B80caYK7.mjs");
var Route$13 = createFileRoute("/admin-login")({
	head: () => ({ meta: [{ title: "Admin Login — Proctor" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./admin-register-CPjvMS61.mjs");
var Route$12 = createFileRoute("/admin-register")({
	head: () => ({ meta: [{ title: "Admin Register — Proctor" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./exam-DY2MB8Ce.mjs");
var Route$11 = createFileRoute("/exam")({
	head: () => ({ meta: [{ title: "Exam in progress — Proctor" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./instructions-nIB-GGxb.mjs");
var Route$10 = createFileRoute("/instructions")({
	head: () => ({ meta: [{ title: "Instructions — Proctor" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin.index-C8Kug8UK.mjs");
var Route$9 = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "Dashboard — Proctor Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin.audit-logs-Biuzgjy7.mjs");
var Route$8 = createFileRoute("/admin/audit-logs")({
	head: () => ({ meta: [{ title: "Audit Logs — Proctor Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin.candidates-CoEllFnz.mjs");
var Route$7 = createFileRoute("/admin/candidates")({
	head: () => ({ meta: [{ title: "Candidates — Proctor Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin.create-DANJ5Yod.mjs");
var Route$6 = createFileRoute("/admin/create")({
	head: () => ({ meta: [{ title: "Create Admin — Proctor" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.exams-MymeO8bn.mjs");
var Route$5 = createFileRoute("/admin/exams")({
	head: () => ({ meta: [{ title: "Exams — Proctor Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.live-monitoring-q5p6dYzw.mjs");
var Route$4 = createFileRoute("/admin/live-monitoring")({
	head: () => ({ meta: [{ title: "Live Monitoring — Proctor Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.question-bank-DQ7gKIO1.mjs");
var Route$3 = createFileRoute("/admin/question-bank")({
	head: () => ({ meta: [{ title: "Question Bank — Proctor Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.reports-Ct-FMZsA.mjs");
var Route$2 = createFileRoute("/admin/reports")({
	head: () => ({ meta: [{ title: "Reports — Proctor Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.results-D9CalTM6.mjs");
var Route$1 = createFileRoute("/admin/results")({
	head: () => ({ meta: [{ title: "Results — Proctor Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.settings-CbBXX19b.mjs");
var Route = createFileRoute("/admin/settings")({
	head: () => ({ meta: [{ title: "Settings — Proctor Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$15.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$16
});
var AdminRoute = Route$14.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$16
});
var AdminLoginRoute = Route$13.update({
	id: "/admin-login",
	path: "/admin-login",
	getParentRoute: () => Route$16
});
var AdminRegisterRoute = Route$12.update({
	id: "/admin-register",
	path: "/admin-register",
	getParentRoute: () => Route$16
});
var ExamRoute = Route$11.update({
	id: "/exam",
	path: "/exam",
	getParentRoute: () => Route$16
});
var InstructionsRoute = Route$10.update({
	id: "/instructions",
	path: "/instructions",
	getParentRoute: () => Route$16
});
var AdminIndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminRouteChildren = {
	AdminAuditLogsRoute: Route$8.update({
		id: "/audit-logs",
		path: "/audit-logs",
		getParentRoute: () => AdminRoute
	}),
	AdminCandidatesRoute: Route$7.update({
		id: "/candidates",
		path: "/candidates",
		getParentRoute: () => AdminRoute
	}),
	AdminCreateRoute: Route$6.update({
		id: "/create",
		path: "/create",
		getParentRoute: () => AdminRoute
	}),
	AdminExamsRoute: Route$5.update({
		id: "/exams",
		path: "/exams",
		getParentRoute: () => AdminRoute
	}),
	AdminLiveMonitoringRoute: Route$4.update({
		id: "/live-monitoring",
		path: "/live-monitoring",
		getParentRoute: () => AdminRoute
	}),
	AdminQuestionBankRoute: Route$3.update({
		id: "/question-bank",
		path: "/question-bank",
		getParentRoute: () => AdminRoute
	}),
	AdminReportsRoute: Route$2.update({
		id: "/reports",
		path: "/reports",
		getParentRoute: () => AdminRoute
	}),
	AdminResultsRoute: Route$1.update({
		id: "/results",
		path: "/results",
		getParentRoute: () => AdminRoute
	}),
	AdminSettingsRoute: Route.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => AdminRoute
	}),
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	AdminLoginRoute,
	AdminRegisterRoute,
	ExamRoute,
	InstructionsRoute
};
var routeTree = Route$16._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
