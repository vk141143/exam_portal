import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { O as MapPin, h as Search } from "../_libs/lucide-react.mjs";
import { t as AdminLayout } from "./admin-layout-CHSpl8eo.mjs";
import { n as CardContent, t as Card } from "./card-CGCM0s9z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BQuBX6bn.mjs";
import { t as useSupabaseQuery } from "./use-supabase-query-oL_zKofS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.audit-logs-Biuzgjy7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tone = {
	info: "bg-muted text-muted-foreground border-0",
	warn: "bg-warning/15 text-warning-foreground border-0",
	danger: "bg-destructive/10 text-destructive border-0"
};
function formatTime(iso) {
	try {
		return new Date(iso).toLocaleString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false
		});
	} catch {
		return iso;
	}
}
function mapsUrl(ip) {
	const match = ip?.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
	if (!match) return null;
	return `https://www.google.com/maps?q=${match[1]},${match[2]}`;
}
function isCoords(ip) {
	return /(-?\d+\.\d+),\s*(-?\d+\.\d+)/.test(ip ?? "");
}
function groupLogs(logs) {
	const sorted = [...logs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
	const loginMap = {};
	const submitMap = {};
	const otherLogs = [];
	for (const log of sorted) if (log.event.startsWith("Login success")) loginMap[log.actor] = [...loginMap[log.actor] ?? [], log];
	else if (log.event.startsWith("Exam submitted") || log.event.startsWith("Exam terminated")) submitMap[log.actor] = [...submitMap[log.actor] ?? [], log];
	else otherLogs.push(log);
	const rows = [];
	const allActors = /* @__PURE__ */ new Set([...Object.keys(loginMap), ...Object.keys(submitMap)]);
	for (const actor of allActors) {
		const logins = loginMap[actor] ?? [];
		const submits = submitMap[actor] ?? [];
		const maxLen = Math.max(logins.length, submits.length);
		for (let i = 0; i < maxLen; i++) {
			const login = logins[i];
			const submit = submits[i];
			const examName = submit?.event.replace(/^Exam (submitted|terminated)[^:]*:\s*/, "") ?? login?.event.replace(/^Login success — joined exam:\s*/, "") ?? "—";
			const eventLabel = submit ? submit.event.startsWith("Exam terminated") ? "Terminated" : "Completed" : "In progress";
			rows.push({
				key: `${actor}-${i}`,
				actor,
				examName,
				loginTime: login ? formatTime(login.created_at) : "—",
				submitTime: submit ? formatTime(submit.created_at) : "—",
				loginIp: login?.ip_address ?? "—",
				submitIp: submit?.ip_address ?? "—",
				client: login?.client ?? submit?.client ?? "—",
				severity: submit?.severity ?? login?.severity ?? "info",
				eventLabel
			});
		}
	}
	for (const log of otherLogs) rows.push({
		key: log.id,
		actor: log.actor,
		examName: "—",
		loginTime: formatTime(log.created_at),
		submitTime: "—",
		loginIp: log.ip_address,
		submitIp: "—",
		client: log.client,
		severity: log.severity,
		eventLabel: log.event
	});
	return rows.reverse();
}
function AuditLogs() {
	const { data, loading } = useSupabaseQuery("audit_logs", { order: {
		column: "created_at",
		ascending: false
	} });
	const [filter, setFilter] = (0, import_react.useState)("");
	const rows = (0, import_react.useMemo)(() => {
		const grouped = groupLogs(data);
		if (!filter.trim()) return grouped;
		const q = filter.toLowerCase();
		return grouped.filter((r) => r.actor.toLowerCase().includes(q) || r.examName.toLowerCase().includes(q) || r.eventLabel.toLowerCase().includes(q) || r.loginIp.includes(q) || r.submitIp.includes(q));
	}, [data, filter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		title: "Audit Logs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Filter by actor, exam, event, IP…",
							className: "pl-8 h-9 w-80 rounded-lg",
							value: filter,
							onChange: (e) => setFilter(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground ml-auto",
						children: [
							rows.length,
							" session",
							rows.length !== 1 ? "s" : ""
						]
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Actor" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Exam" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Login time" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Submit time" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Login location" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Submit location" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Client" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium",
								children: r.actor
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-muted-foreground text-sm",
								children: r.examName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: r.eventLabel === "Completed" ? "bg-success/10 text-success border-0" : r.eventLabel === "Terminated" ? "bg-warning/15 text-warning-foreground border-0" : r.eventLabel === "In progress" ? "bg-muted text-muted-foreground border-0" : tone[r.severity] ?? tone.info,
								children: r.eventLabel
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-mono text-xs text-muted-foreground whitespace-nowrap",
								children: r.loginTime
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-mono text-xs text-muted-foreground whitespace-nowrap",
								children: r.submitTime
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-mono text-xs text-muted-foreground",
								children: r.loginIp
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-mono text-xs text-muted-foreground",
								children: r.submitIp
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-muted-foreground max-w-[160px] truncate",
								title: r.client,
								children: r.client.length > 40 ? r.client.slice(0, 40) + "…" : r.client
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: (isCoords(r.loginIp) || isCoords(r.submitIp)) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "rounded-lg h-7 px-2 text-xs gap-1",
								onClick: () => {
									const url = mapsUrl(r.loginIp) ?? mapsUrl(r.submitIp);
									if (url) window.open(url, "_blank");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }), " Locate"]
							}) })
						] }, r.key)), rows.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 9,
							className: "text-center text-muted-foreground text-sm py-8",
							children: "No logs found."
						}) })] })] })
					})
				})
			]
		})
	});
}
//#endregion
export { AuditLogs as component };
