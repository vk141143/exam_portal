import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-Dke1WgR-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { F as FileText, K as CircleCheck, a as Users, l as Timer, nt as Activity, o as TriangleAlert, p as ShieldAlert, s as TrendingUp, tt as Award } from "../_libs/lucide-react.mjs";
import { t as AdminLayout } from "./admin-layout-CHSpl8eo.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CGCM0s9z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, n as BarChart, o as Line, r as LineChart, s as CartesianGrid } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-C8Kug8UK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function timeAgo(iso) {
	const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1e3);
	if (diff < 60) return `${diff}s ago`;
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	return `${Math.floor(diff / 3600)}h ago`;
}
function Dashboard() {
	const [stats, setStats] = (0, import_react.useState)(null);
	const [dailyExams, setDailyExams] = (0, import_react.useState)([]);
	const [weeklyScores, setWeeklyScores] = (0, import_react.useState)([]);
	const [activities, setActivities] = (0, import_react.useState)([]);
	const [liveCandidates, setLiveCandidates] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		async function load() {
			const [{ count: totalCandidates }, { data: exams }, { data: results }, { data: sessions }, { data: logs }] = await Promise.all([
				supabase.from("candidates").select("*", {
					count: "exact",
					head: true
				}),
				supabase.from("exams").select("id, status, starts_at, ends_at"),
				supabase.from("results").select("score, warnings, candidate_name, exam_name, status, created_at"),
				supabase.from("exam_sessions").select("candidate_name, question_index, total_questions, warnings, started_at, status"),
				supabase.from("audit_logs").select("actor, event, severity, created_at").order("created_at", { ascending: false }).limit(20)
			]);
			const now = /* @__PURE__ */ new Date();
			const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const activeExams = (exams ?? []).filter((e) => e.status === "Active").length;
			const completedExams = (results ?? []).filter((r) => r.status !== "Terminated").length;
			const todayExams = (exams ?? []).filter((e) => e.starts_at && new Date(e.starts_at) >= todayStart).length;
			const onlineCandidates = (sessions ?? []).filter((s) => s.status === "live").length;
			const scores = (results ?? []).map((r) => r.score ?? 0);
			const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
			const highestScore = scores.length ? Math.max(...scores) : 0;
			const lowestScore = scores.length ? Math.min(...scores) : 0;
			const highestResult = (results ?? []).find((r) => r.score === highestScore);
			const totalWarnings = (results ?? []).reduce((a, r) => a + (r.warnings ?? 0), 0);
			setStats({
				totalCandidates: totalCandidates ?? 0,
				activeExams,
				completedExams,
				avgScore,
				highestScore,
				highestScoreName: highestResult?.candidate_name ?? "—",
				lowestScore,
				todayExams,
				onlineCandidates,
				totalWarnings
			});
			const days = Array.from({ length: 14 }, (_, i) => {
				const d = new Date(now);
				d.setDate(d.getDate() - (13 - i));
				const label = `${d.getDate()}/${d.getMonth() + 1}`;
				const dayResults = (results ?? []).filter((r) => {
					return new Date(r.created_at).toDateString() === d.toDateString();
				});
				const pass = dayResults.length ? Math.round(dayResults.filter((r) => r.status !== "Terminated").length / dayResults.length * 100) : 0;
				return {
					d: label,
					exams: dayResults.length,
					pass
				};
			});
			setDailyExams(days);
			const weeks = Array.from({ length: 8 }, (_, i) => {
				const weekStart = new Date(now);
				weekStart.setDate(weekStart.getDate() - 7 * (7 - i));
				const weekEnd = new Date(weekStart);
				weekEnd.setDate(weekEnd.getDate() + 7);
				const weekResults = (results ?? []).filter((r) => {
					const rd = new Date(r.created_at);
					return rd >= weekStart && rd < weekEnd;
				});
				const avg = weekResults.length ? Math.round(weekResults.reduce((a, r) => a + (r.score ?? 0), 0) / weekResults.length) : 0;
				return {
					m: `Wk ${i + 1}`,
					score: avg
				};
			});
			setWeeklyScores(weeks);
			const acts = (logs ?? []).slice(0, 5).map((l) => ({
				who: l.actor,
				what: l.event,
				exam: "",
				time: timeAgo(l.created_at),
				tone: l.severity === "danger" ? "danger" : l.severity === "warn" ? "warn" : l.event.includes("submitted") ? "success" : "muted"
			}));
			setActivities(acts);
			const live = (sessions ?? []).filter((s) => s.status === "live").slice(0, 5);
			setLiveCandidates(live);
		}
		load();
	}, []);
	const statCards = stats ? [
		{
			label: "Total Candidates",
			value: stats.totalCandidates.toLocaleString(),
			icon: Users,
			delta: ""
		},
		{
			label: "Active Exams",
			value: stats.activeExams.toString(),
			icon: FileText,
			delta: `${stats.onlineCandidates} online now`
		},
		{
			label: "Completed Exams",
			value: stats.completedExams.toString(),
			icon: CircleCheck,
			delta: ""
		},
		{
			label: "Average Score",
			value: `${stats.avgScore}%`,
			icon: TrendingUp,
			delta: ""
		},
		{
			label: "Highest Score",
			value: `${stats.highestScore}%`,
			icon: Award,
			delta: stats.highestScoreName
		},
		{
			label: "Lowest Score",
			value: `${stats.lowestScore}%`,
			icon: TriangleAlert,
			delta: ""
		},
		{
			label: "Today's Exams",
			value: stats.todayExams.toString(),
			icon: Timer,
			delta: ""
		},
		{
			label: "Online Candidates",
			value: stats.onlineCandidates.toString(),
			icon: Activity,
			delta: "Live"
		},
		{
			label: "Total Warnings",
			value: stats.totalWarnings.toString(),
			icon: ShieldAlert,
			delta: "All time"
		}
	] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		title: "Dashboard",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4",
					children: statCards.length === 0 ? Array.from({ length: 9 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-xl animate-pulse",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-4 h-20" })
					}, i)) : statCards.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-xl transition hover:shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: s.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl font-semibold tracking-tight mt-1",
										children: s.value
									}),
									s.delta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground mt-1",
										children: s.delta
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-8 w-8 rounded-lg bg-accent grid place-items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-4 w-4 text-primary" })
								})]
							})
						})
					}, s.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid lg:grid-cols-3 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "rounded-xl lg:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Daily exams · pass %"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "h-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: dailyExams,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--border)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "d",
											stroke: "var(--muted-foreground)",
											fontSize: 11
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "var(--muted-foreground)",
											fontSize: 11
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											background: "var(--popover)",
											border: "1px solid var(--border)",
											borderRadius: 8
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "exams",
											stroke: "var(--primary)",
											strokeWidth: 2,
											dot: false,
											name: "Exams"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "pass",
											stroke: "var(--success)",
											strokeWidth: 2,
											dot: false,
											name: "Pass %"
										})
									]
								})
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Average marks by week"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "h-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: weeklyScores,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--border)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "m",
											stroke: "var(--muted-foreground)",
											fontSize: 11
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "var(--muted-foreground)",
											fontSize: 11
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											background: "var(--popover)",
											border: "1px solid var(--border)",
											borderRadius: 8
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "score",
											fill: "var(--primary)",
											radius: [
												6,
												6,
												0,
												0
											],
											name: "Avg Score"
										})
									]
								})
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid lg:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Recent activity"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "divide-y divide-border",
							children: activities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground py-4 text-center",
								children: "No recent activity"
							}) : activities.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-3 flex items-center gap-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-full bg-accent grid place-items-center text-xs font-medium shrink-0",
										children: a.who.split(" ").map((n) => n[0]).join("").slice(0, 2)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "truncate",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: a.who
												}),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: a.what
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: a.time
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: a.tone === "danger" ? "bg-destructive/10 text-destructive border-0" : a.tone === "warn" ? "bg-warning/10 text-warning-foreground border-0" : a.tone === "success" ? "bg-success/10 text-success border-0" : "bg-muted text-muted-foreground border-0",
										children: a.tone
									})
								]
							}, i))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Live candidate status"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "space-y-3",
							children: liveCandidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground py-4 text-center",
								children: "No candidates online"
							}) : liveCandidates.map((c) => {
								const elapsed = Math.floor((Date.now() - new Date(c.started_at).getTime()) / 6e4);
								const status = c.warnings > 0 ? `${c.warnings} warning${c.warnings > 1 ? "s" : ""}` : "OK";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 text-sm p-3 rounded-lg border border-border hover:bg-accent/50 transition",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-8 w-8 rounded-full bg-primary/10 grid place-items-center text-xs font-medium shrink-0",
											children: c.candidate_name.split(" ").map((n) => n[0]).join("").slice(0, 2)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: c.candidate_name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: [
													"Q ",
													c.question_index + 1,
													" / ",
													c.total_questions || "?",
													" · ",
													elapsed,
													"m elapsed"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: status === "OK" ? "bg-success/10 text-success border-0" : "bg-destructive/10 text-destructive border-0",
											children: status
										})
									]
								}, c.candidate_name);
							})
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { Dashboard as component };
