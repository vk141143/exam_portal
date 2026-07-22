import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as AdminLayout } from "./admin-layout-CHSpl8eo.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CGCM0s9z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BQuBX6bn.mjs";
import { t as useSupabaseQuery } from "./use-supabase-query-oL_zKofS.mjs";
import { d as ResponsiveContainer, f as Tooltip, l as Pie, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.results-D9CalTM6.js
var import_jsx_runtime = require_jsx_runtime();
var fallback = Array.from({ length: 10 }, (_, i) => {
	const score = [
		92,
		45,
		88,
		67,
		78,
		12,
		84,
		71,
		95,
		60
	][i];
	return {
		id: String(i),
		candidate_name: [
			"Sneha Rao",
			"Vivek Pillai",
			"Ayesha Malik",
			"Rohit Tandon",
			"Priya Nair",
			"Karan Verma",
			"Aditi Sen",
			"Nikhil Bose",
			"Meera Iyer",
			"Arjun Menon"
		][i],
		exam_name: "DBMS Mid-Term",
		score,
		time_taken: `${30 + i * 2}:${(10 + i) % 60}`,
		warnings: [
			0,
			3,
			0,
			1,
			0,
			5,
			0,
			2,
			0,
			1
		][i],
		status: score >= 40 ? "Pass" : "Fail"
	};
});
var dist = [
	{
		name: "Pass",
		value: 82,
		color: "var(--success)"
	},
	{
		name: "Fail",
		value: 12,
		color: "var(--destructive)"
	},
	{
		name: "Terminated",
		value: 6,
		color: "var(--warning)"
	}
];
function Results() {
	const { data, loading } = useSupabaseQuery("results", { order: {
		column: "id",
		ascending: false
	} });
	const results = data.length > 0 ? data : fallback;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		title: "Results",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-3 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-xl lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Recent results"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-0",
					children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground p-4",
						children: "Loading…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Candidate" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Exam" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Score" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Time" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Warnings" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: results.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: r.candidate_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-muted-foreground",
							children: r.exam_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "font-mono",
							children: [r.score, "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-muted-foreground",
							children: r.time_taken
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: r.warnings > 2 ? "bg-destructive/10 text-destructive border-0" : "bg-muted text-muted-foreground border-0",
							children: r.warnings
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: r.status === "Pass" ? "bg-success/10 text-success border-0" : r.status === "Terminated" ? "bg-warning/15 text-warning-foreground border-0" : "bg-destructive/10 text-destructive border-0",
							children: r.status
						}) })
					] }, r.id)) })] })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Outcome distribution"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "h-72",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: dist,
							dataKey: "value",
							innerRadius: 55,
							outerRadius: 90,
							paddingAngle: 2,
							children: dist.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.color }, d.name))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
							background: "var(--popover)",
							border: "1px solid var(--border)",
							borderRadius: 8
						} })] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center gap-4 text-xs text-muted-foreground",
						children: dist.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-2 w-2 rounded-full",
									style: { background: d.color }
								}),
								" ",
								d.name,
								" · ",
								d.value,
								"%"
							]
						}, d.name))
					})]
				})]
			})]
		})
	});
}
//#endregion
export { Results as component };
