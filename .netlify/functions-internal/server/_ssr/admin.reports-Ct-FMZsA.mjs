import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { B as Download, F as FileText } from "../_libs/lucide-react.mjs";
import { t as AdminLayout } from "./admin-layout-CHSpl8eo.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CGCM0s9z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.reports-Ct-FMZsA.js
var import_jsx_runtime = require_jsx_runtime();
var reports = [
	"Candidate Result",
	"Exam Result",
	"Question Analysis",
	"Difficulty Analysis",
	"Average Score",
	"Pass Percentage",
	"Violation Report",
	"Attendance Report"
];
function Reports() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		title: "Reports",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid md:grid-cols-2 xl:grid-cols-4 gap-4",
			children: reports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-xl transition hover:shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-9 w-9 rounded-lg bg-accent grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base pt-2",
						children: r
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Export the latest ",
							r.toLowerCase(),
							" in your preferred format."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "rounded-lg flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1.5" }), " PDF"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "rounded-lg flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1.5" }), " Excel"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "rounded-lg flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1.5" }), " CSV"]
							})
						]
					})]
				})]
			}, r))
		})
	});
}
//#endregion
export { Reports as component };
