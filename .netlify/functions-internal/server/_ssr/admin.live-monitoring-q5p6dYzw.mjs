import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-Dke1WgR-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { D as Maximize2, T as MicOff, h as Search, i as VideoOff, n as Wifi, o as TriangleAlert, r as Video, w as Mic, y as PhoneCall } from "../_libs/lucide-react.mjs";
import { t as AdminLayout } from "./admin-layout-CHSpl8eo.mjs";
import { n as CardContent, t as Card } from "./card-CGCM0s9z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as getVideoSDKToken } from "./videosdk-DG4_k8-w.mjs";
import { n as useMeeting, r as useParticipant, t as MeetingProvider } from "../_libs/@videosdk.live/react-sdk+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.live-monitoring-q5p6dYzw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LiveMon() {
	const [sessions, setSessions] = (0, import_react.useState)([]);
	const [filter, setFilter] = (0, import_react.useState)("");
	const [token, setToken] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getVideoSDKToken().then(setToken).catch(() => {});
		supabase.from("exam_sessions").select("*").eq("status", "live").then(({ data }) => {
			if (data) setSessions(data);
		});
		const ch = supabase.channel("exam_sessions_live").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "exam_sessions"
		}, ({ eventType, new: n, old: o }) => {
			if (eventType === "INSERT") setSessions((p) => [...p, n]);
			else if (eventType === "UPDATE") {
				const u = n;
				setSessions((p) => u.status !== "live" ? p.filter((s) => s.candidate_id !== u.candidate_id) : p.map((s) => s.candidate_id === u.candidate_id ? u : s));
			} else if (eventType === "DELETE") setSessions((p) => p.filter((s) => s.candidate_id !== o.candidate_id));
		}).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, []);
	const visible = sessions.filter((s) => !filter || s.candidate_name.toLowerCase().includes(filter.toLowerCase()) || s.exam_name.toLowerCase().includes(filter.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		title: "Live Monitoring",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search candidates…",
							className: "pl-8 h-9 w-64 rounded-lg",
							value: filter,
							onChange: (e) => setFilter(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-1.5 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-success animate-pulse" }),
							visible.length,
							" live"
						]
					})]
				}),
				visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center h-48 text-muted-foreground text-sm",
					children: "No candidates currently live."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
					children: visible.map((session) => token && session.candidate_room_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeetingProvider, {
						config: {
							meetingId: session.candidate_room_id,
							micEnabled: false,
							webcamEnabled: false,
							name: "__admin__",
							debugMode: false
						},
						token,
						joinWithoutUserInteraction: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateCard, { session })
					}, session.candidate_id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaitingCard, { session }, session.candidate_id))
				})
			]
		})
	});
}
function WaitingCard({ session }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "rounded-xl overflow-hidden opacity-70",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "aspect-video bg-muted flex flex-col items-center justify-center gap-2 border-b border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Connecting…"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium text-sm truncate",
				children: session.candidate_name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted-foreground",
				children: [
					"Q ",
					session.question_index + 1,
					" / ",
					session.total_questions || "—",
					" · ",
					session.exam_name
				]
			})]
		})]
	});
}
function CandidateCard({ session }) {
	const { participants } = useMeeting();
	const participant = [...participants.values()].find((p) => !p.displayName.startsWith("__admin__"));
	return participant ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParticipantCard, {
		participantId: participant.id,
		session
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaitingCard, { session });
}
function ParticipantCard({ participantId, session }) {
	const { webcamStream, micStream, webcamOn, micOn } = useParticipant(participantId);
	const { unmuteMic, muteMic } = useMeeting();
	const [adminTalking, setAdminTalking] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const [audioBars, setAudioBars] = (0, import_react.useState)(Array(20).fill(6));
	const animRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!videoRef.current || !webcamStream) return;
		const ms = new MediaStream([webcamStream.track]);
		videoRef.current.srcObject = ms;
		videoRef.current.play().catch(() => {});
	}, [webcamStream]);
	(0, import_react.useEffect)(() => {
		if (!micStream) return;
		const ctx = new AudioContext();
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 64;
		ctx.createMediaStreamSource(new MediaStream([micStream.track])).connect(analyser);
		const data = new Uint8Array(analyser.frequencyBinCount);
		const tick = () => {
			analyser.getByteFrequencyData(data);
			setAudioBars(Array.from({ length: 20 }, (_, i) => Math.max(6, data[Math.floor(i / 20 * data.length)] / 255 * 100)));
			animRef.current = requestAnimationFrame(tick);
		};
		tick();
		return () => {
			cancelAnimationFrame(animRef.current);
			ctx.close();
		};
	}, [micStream]);
	const toggleTalk = () => {
		if (adminTalking) {
			muteMic();
			setAdminTalking(false);
		} else {
			unmuteMic();
			setAdminTalking(true);
		}
	};
	const hasWarnings = session.warnings > 0;
	const qLabel = session.total_questions ? `Q ${session.question_index + 1} / ${session.total_questions}` : `Q ${session.question_index + 1}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: `rounded-xl overflow-hidden transition hover:shadow-sm ${hasWarnings ? "ring-1 ring-destructive/50" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `aspect-video relative bg-black border-b ${hasWarnings ? "border-destructive/40" : "border-success/30"}`,
			children: [
				webcamOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					autoPlay: true,
					playsInline: true,
					className: "w-full h-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full h-full flex items-center justify-center bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "h-8 w-8 text-muted-foreground/40" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-2 left-2 flex items-center gap-1.5 text-[10px] font-medium bg-background/80 backdrop-blur px-1.5 py-0.5 rounded",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full animate-pulse ${hasWarnings ? "bg-destructive" : "bg-success"}` }), "LIVE"]
				}),
				adminTalking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-2 right-2 flex items-center gap-1 text-[10px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded animate-pulse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3 w-3" }), " Talking"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-3 space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-sm truncate",
							children: session.candidate_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								qLabel,
								" · ",
								session.exam_name
							]
						})]
					}), hasWarnings ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						className: "bg-destructive/10 text-destructive border-0 shrink-0",
						children: [session.warnings, " warn"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "bg-success/10 text-success border-0 shrink-0",
						children: "OK"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-[10px] text-muted-foreground mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [micOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "h-3 w-3 text-destructive" }), "Voice"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: micOn ? "text-success" : "text-destructive",
						children: micOn ? "Active" : "Muted"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end gap-px h-6",
					children: audioBars.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `flex-1 rounded-sm transition-all duration-75 ${micOn ? "bg-primary/70" : "bg-muted-foreground/20"}`,
						style: { height: `${micOn ? h : 6}%` }
					}, i))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-[11px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sig, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "h-3 w-3" }),
							ok: true,
							label: "WiFi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sig, {
							icon: webcamOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "h-3 w-3" }),
							ok: webcamOn,
							label: "Cam"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sig, {
							icon: micOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "h-3 w-3" }),
							ok: micOn,
							label: "Mic"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sig, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3 w-3" }),
							ok: true,
							label: "FS"
						}),
						hasWarnings && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-0.5 text-destructive",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }),
								" ",
								session.warnings
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: adminTalking ? "default" : "outline",
							className: `ml-auto h-6 px-2 text-[10px] rounded gap-1 ${adminTalking ? "bg-primary text-primary-foreground" : ""}`,
							onClick: toggleTalk,
							title: adminTalking ? "Stop talking" : "Talk to this candidate privately",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneCall, { className: "h-3 w-3" }), adminTalking ? "Stop" : "Talk"]
						})
					]
				})
			]
		})]
	});
}
function Sig({ icon, ok = true, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `flex items-center gap-0.5 ${ok ? "text-success" : "text-destructive"}`,
		children: [
			icon,
			" ",
			label
		]
	});
}
//#endregion
export { LiveMon as component };
