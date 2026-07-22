import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-Dke1WgR-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { D as Maximize2, P as Flag, _ as RotateCcw, d as SkipForward, n as Wifi, o as TriangleAlert, w as Mic } from "../_libs/lucide-react.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./card-CGCM0s9z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as getVideoSDKToken } from "./videosdk-DG4_k8-w.mjs";
import { n as useMeeting, t as MeetingProvider } from "../_libs/@videosdk.live/react-sdk+[...].mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exam-DY2MB8Ce.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
var MAX_WARNINGS = 2;
function ExamBootstrap() {
	const [roomId, setRoomId] = (0, import_react.useState)(null);
	const [token, setToken] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const candidate = (0, import_react.useMemo)(() => {
		if (typeof window === "undefined") return {};
		try {
			return JSON.parse(sessionStorage.getItem("candidate") ?? "{}");
		} catch {
			return {};
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!candidate.examId) {
			setError("No exam session found. Please log in again.");
			return;
		}
		(async () => {
			try {
				let candidateRoomId = null;
				try {
					const { createVideoRoom } = await import("./videosdk-DG4_k8-w.mjs").then((n) => n.r).then((n) => n.r);
					candidateRoomId = await createVideoRoom();
				} catch {}
				const { error: upsertError } = await supabase.from("exam_sessions").upsert({
					candidate_id: candidate.id,
					candidate_name: candidate.name,
					exam_id: candidate.examId,
					exam_name: candidate.examName,
					room_id: candidateRoomId ?? "",
					candidate_room_id: candidateRoomId,
					question_index: 0,
					total_questions: 0,
					warnings: 0,
					status: "live",
					started_at: (/* @__PURE__ */ new Date()).toISOString()
				}, { onConflict: "candidate_id" });
				if (upsertError) console.error("exam_sessions upsert error:", upsertError);
				if (candidateRoomId) {
					const tok = await getVideoSDKToken();
					setToken(tok);
					setRoomId(candidateRoomId);
				} else setRoomId("__none__");
			} catch {
				setError("Failed to start exam. Please refresh.");
			}
		})();
	}, [candidate.examId]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-background px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-destructive text-sm text-center",
			children: error
		})
	});
	if (!roomId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground text-sm",
			children: "Starting exam…"
		})
	});
	if (roomId === "__none__") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamUI, { leave: () => {} });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeetingProvider, {
		config: {
			meetingId: roomId,
			micEnabled: true,
			webcamEnabled: true,
			name: candidate.name ?? "Candidate",
			debugMode: false
		},
		token,
		joinWithoutUserInteraction: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamUIWithMeeting, {})
	});
}
function ExamUIWithMeeting() {
	const { leave } = useMeeting();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamUI, { leave });
}
function ExamUI({ leave }) {
	const navigate = useNavigate();
	const candidate = (0, import_react.useMemo)(() => {
		if (typeof window === "undefined") return {};
		try {
			return JSON.parse(sessionStorage.getItem("candidate") ?? "{}");
		} catch {
			return {};
		}
	}, []);
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [loadingQ, setLoadingQ] = (0, import_react.useState)(true);
	const [current, setCurrent] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [flags, setFlags] = (0, import_react.useState)({});
	const [remaining, setRemaining] = (0, import_react.useState)((candidate.duration ?? 60) * 60);
	const [isFullscreen, setIsFullscreen] = (0, import_react.useState)(false);
	const [warnings, setWarnings] = (0, import_react.useState)(0);
	const [warningMsg, setWarningMsg] = (0, import_react.useState)(null);
	const submittingRef = (0, import_react.useRef)(false);
	const videoRef = (0, import_react.useRef)(null);
	const animFrameRef = (0, import_react.useRef)(0);
	const [audioBars, setAudioBars] = (0, import_react.useState)(Array(28).fill(10));
	const [micBlocked, setMicBlocked] = (0, import_react.useState)(false);
	const [camBlocked, setCamBlocked] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!candidate.examId) {
			setLoadingQ(false);
			return;
		}
		supabase.from("questions").select("id, question_text, options, marks").eq("exam_id", candidate.examId).then(({ data }) => {
			if (data?.length) {
				setQuestions(data.map((q) => ({
					...q,
					options: Array.isArray(q.options) ? q.options : Object.values(q.options ?? {})
				})));
				if (candidate.id) supabase.from("exam_sessions").update({ total_questions: data.length }).eq("candidate_id", candidate.id);
			}
			setLoadingQ(false);
		});
	}, [candidate.examId]);
	(0, import_react.useEffect)(() => {
		if (!candidate.id) return;
		supabase.from("exam_sessions").update({
			question_index: current,
			warnings
		}).eq("candidate_id", candidate.id);
	}, [current, warnings]);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1e3);
		return () => clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => {
		navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true
		}).then((stream) => {
			if (videoRef.current) videoRef.current.srcObject = stream;
			setCamBlocked(!stream.getVideoTracks()[0]?.enabled);
			setMicBlocked(!stream.getAudioTracks()[0]?.enabled);
			const ctx = new AudioContext();
			const analyser = ctx.createAnalyser();
			analyser.fftSize = 64;
			ctx.createMediaStreamSource(stream).connect(analyser);
			const data = new Uint8Array(analyser.frequencyBinCount);
			const tick = () => {
				analyser.getByteFrequencyData(data);
				setAudioBars(Array.from({ length: 28 }, (_, i) => Math.max(6, data[Math.floor(i / 28 * data.length)] / 255 * 100)));
				animFrameRef.current = requestAnimationFrame(tick);
			};
			tick();
		}).catch(() => {
			setCamBlocked(true);
			setMicBlocked(true);
			toast.error("Camera/mic access lost.");
		});
		return () => cancelAnimationFrame(animFrameRef.current);
	}, []);
	const handleSubmit = (0, import_react.useCallback)(async (terminated = false) => {
		if (submittingRef.current) return;
		submittingRef.current = true;
		const score = questions.reduce((acc, q, i) => acc + (answers[i] !== void 0 ? q.marks ?? 1 : 0), 0);
		if (candidate.id && candidate.examId) await Promise.all([
			supabase.from("results").insert({
				candidate_id: candidate.id,
				candidate_name: candidate.name,
				exam_id: candidate.examId,
				exam_name: candidate.examName,
				score,
				time_taken: `${(candidate.duration ?? 60) - Math.floor(remaining / 60)} min`,
				warnings,
				status: terminated ? "Terminated" : "Pass"
			}),
			supabase.from("audit_logs").insert({
				actor: candidate.name,
				event: terminated ? `Exam terminated (violations): ${candidate.examName}` : `Exam submitted: ${candidate.examName}`,
				severity: terminated ? "danger" : "info",
				ip_address: candidate.location ? `${candidate.location.lat.toFixed(4)}, ${candidate.location.lng.toFixed(4)}` : "Unknown",
				client: navigator.userAgent.slice(0, 80)
			}),
			supabase.from("exam_sessions").update({ status: terminated ? "terminated" : "completed" }).eq("candidate_id", candidate.id)
		]);
		leave();
		if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
		terminated ? toast.error("Exam terminated due to violations.") : toast.success("Exam submitted!");
		setTimeout(() => navigate({ to: "/" }), 1e3);
	}, [
		questions,
		answers,
		candidate,
		remaining,
		warnings,
		navigate,
		leave
	]);
	(0, import_react.useEffect)(() => {
		if (remaining === 0) handleSubmit(false);
	}, [remaining]);
	const handleViolation = (0, import_react.useCallback)((reason) => {
		if (submittingRef.current) return;
		setWarnings((prev) => {
			const next = prev + 1;
			if (next > MAX_WARNINGS) {
				handleSubmit(true);
				return prev;
			}
			setWarningMsg(`Warning ${next}/${MAX_WARNINGS}: ${reason}`);
			return next;
		});
	}, [handleSubmit]);
	(0, import_react.useEffect)(() => {
		const onFs = () => {
			const inFs = !!document.fullscreenElement;
			setIsFullscreen(inFs);
			if (!inFs && !submittingRef.current && isFullscreen) handleViolation("Exited fullscreen");
		};
		document.addEventListener("fullscreenchange", onFs);
		return () => document.removeEventListener("fullscreenchange", onFs);
	}, [handleViolation, isFullscreen]);
	(0, import_react.useEffect)(() => {
		const onVis = () => {
			if (document.hidden && !submittingRef.current) handleViolation("Switched tab or window");
		};
		document.addEventListener("visibilitychange", onVis);
		return () => document.removeEventListener("visibilitychange", onVis);
	}, [handleViolation]);
	(0, import_react.useEffect)(() => {
		setFlags((f) => f[current] ? f : {
			...f,
			[current]: "notVisited"
		});
	}, [current]);
	const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
	const ss = String(remaining % 60).padStart(2, "0");
	const isLow = remaining < 300;
	const stats = (0, import_react.useMemo)(() => {
		let ans = 0, skip = 0, rev = 0, nv = 0;
		questions.forEach((_, i) => {
			const s = answers[i] !== void 0 ? "answered" : flags[i] ?? "notVisited";
			if (s === "answered") ans++;
			else if (s === "skipped") skip++;
			else if (s === "review") rev++;
			else nv++;
		});
		return {
			ans,
			skip,
			rev,
			nv
		};
	}, [
		answers,
		flags,
		questions
	]);
	const select = (opt) => {
		setAnswers((a) => ({
			...a,
			[current]: opt
		}));
		setFlags((f) => ({
			...f,
			[current]: "answered"
		}));
	};
	const next = () => setCurrent((c) => Math.min(questions.length - 1, c + 1));
	const prev = () => setCurrent((c) => Math.max(0, c - 1));
	const skip = () => {
		setFlags((f) => ({
			...f,
			[current]: "skipped"
		}));
		next();
	};
	const markReview = () => {
		setFlags((f) => ({
			...f,
			[current]: "review"
		}));
		toast("Marked for review");
	};
	const clear = () => {
		setAnswers((a) => {
			const n = { ...a };
			delete n[current];
			return n;
		});
		setFlags((f) => ({
			...f,
			[current]: "notVisited"
		}));
	};
	const statusOf = (i) => answers[i] !== void 0 ? "answered" : flags[i] ?? "notVisited";
	const enterFullscreen = () => {
		document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => toast.error("Could not enter fullscreen."));
	};
	if (loadingQ) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground text-sm",
			children: "Loading questions…"
		})
	});
	if (questions.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground text-sm",
			children: "No questions found for this exam."
		})
	});
	if (!isFullscreen) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-12 w-12 text-primary mx-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-semibold",
					children: "Fullscreen required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground max-w-sm",
					children: "The exam must be taken in fullscreen mode. Click below to begin."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "rounded-lg px-8",
			onClick: enterFullscreen,
			children: "Enter fullscreen & start exam"
		})]
	});
	const q = questions[current];
	const chosen = answers[current];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background flex flex-col",
		children: [
			warningMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-background border border-destructive rounded-xl p-6 max-w-sm w-full mx-4 space-y-4 shadow-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6 text-destructive shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-destructive",
								children: "Violation Detected"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: warningMsg
							}),
							warnings < MAX_WARNINGS && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive mt-2 font-medium",
								children: "One more violation will automatically terminate your exam."
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full rounded-lg",
						onClick: () => {
							setWarningMsg(null);
							document.documentElement.requestFullscreen().catch(() => {});
						},
						children: "I understand — return to exam"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "h-14 border-b flex items-center gap-3 px-4 sticky top-0 bg-background/90 backdrop-blur z-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium text-sm",
						children: candidate.examName ?? "Exam"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "rounded-md",
						children: [
							candidate.name,
							" · ",
							candidate.id
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-4 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "h-3.5 w-3.5 text-success" }), " Online"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3.5 w-3.5 text-success" }), " Fullscreen"]
							}),
							warnings > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-destructive font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }),
									" ",
									warnings,
									"/",
									MAX_WARNINGS,
									" warnings"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `font-mono text-base tabular-nums ${isLow ? "text-destructive font-bold" : "text-foreground"}`,
								children: [
									mm,
									":",
									ss
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 grid grid-cols-12 gap-4 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "col-span-12 lg:col-span-3 xl:col-span-2 space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-4 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-medium text-muted-foreground",
										children: "Question palette"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-8 lg:grid-cols-5 gap-1.5",
										children: questions.map((_, i) => {
											const s = statusOf(i);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setCurrent(i),
												className: `h-8 w-8 text-xs rounded-md border transition font-medium ${i === current ? "bg-primary text-primary-foreground border-primary" : s === "answered" ? "bg-success/15 text-success border-success/30" : s === "skipped" ? "bg-destructive/10 text-destructive border-destructive/30" : s === "review" ? "bg-warning/20 text-warning-foreground border-warning/40" : "bg-card text-muted-foreground border-border hover:bg-accent"}`,
												children: i + 1
											}, i);
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 space-y-1.5 text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
												swatch: "bg-success/40",
												label: `Answered · ${stats.ans}`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
												swatch: "bg-destructive/40",
												label: `Skipped · ${stats.skip}`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
												swatch: "bg-warning/40",
												label: `Review · ${stats.rev}`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
												swatch: "bg-border",
												label: `Not visited · ${stats.nv}`
											})
										]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "col-span-12 lg:col-span-6 xl:col-span-7 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6 space-y-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												"Question ",
												current + 1,
												" of ",
												questions.length
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												"+",
												q.marks ?? 1,
												" mark"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
										value: (current + 1) / questions.length * 100,
										className: "h-1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-base font-medium leading-relaxed",
										children: q.question_text
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2 pt-1",
										children: q.options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => select(i),
											className: `w-full text-left p-3.5 rounded-lg border transition flex items-start gap-3 ${chosen === i ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-accent/40"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `h-5 w-5 rounded-full border shrink-0 grid place-items-center mt-0.5 ${chosen === i ? "border-primary" : "border-border"}`,
												children: chosen === i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 w-2.5 rounded-full bg-primary" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground mr-2",
													children: [String.fromCharCode(65 + i), "."]
												}), opt]
											})]
										}, i))
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									className: "rounded-lg",
									onClick: prev,
									disabled: current === 0,
									children: "Previous"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "rounded-lg",
									onClick: markReview,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-4 w-4 mr-1.5" }), " Mark for review"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "rounded-lg",
									onClick: clear,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 mr-1.5" }), " Clear"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "rounded-lg",
									onClick: skip,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "h-4 w-4 mr-1.5" }), " Skip"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ml-auto flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "rounded-lg",
										onClick: next,
										disabled: current === questions.length - 1,
										children: "Save & Next"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "destructive",
										className: "rounded-lg",
										onClick: () => handleSubmit(false),
										children: "Submit"
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "col-span-12 lg:col-span-3 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "rounded-xl overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "aspect-video bg-black relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
										ref: videoRef,
										autoPlay: true,
										muted: true,
										playsInline: true,
										className: "w-full h-full object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute top-2 left-2 flex items-center gap-1.5 text-[10px] font-medium bg-background/80 backdrop-blur px-1.5 py-0.5 rounded",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-success animate-pulse" }), " Live"]
									}),
									camBlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 flex items-center justify-center bg-black/70",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-destructive font-medium",
											children: "Camera blocked"
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-3 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: `h-3.5 w-3.5 ${micBlocked ? "text-destructive" : ""}` }), " Audio level"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: micBlocked ? "text-destructive" : "text-success",
										children: micBlocked ? "Blocked" : "Live"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-end gap-0.5 h-8",
									children: audioBars.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `flex-1 rounded-sm transition-all duration-75 ${micBlocked ? "bg-destructive/40" : "bg-primary/70"}`,
										style: { height: `${h}%` }
									}, i))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground space-y-1 pt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Warnings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: warnings > 0 ? "text-destructive font-medium" : "text-foreground",
												children: [
													warnings,
													" / ",
													MAX_WARNINGS
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Camera" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: camBlocked ? "text-destructive" : "text-success",
												children: camBlocked ? "Blocked" : "Active"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mic" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: micBlocked ? "text-destructive" : "text-success",
												children: micBlocked ? "Blocked" : "Active"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Location" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground",
												children: candidate.location ? "Verified" : "Unknown"
											})]
										})
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "rounded-xl border-warning/30 bg-warning/5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-3 flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-warning-foreground shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: "Do not exit fullscreen or switch tabs. Your session is being continuously monitored."
								})]
							})
						})]
					})
				]
			})
		]
	});
}
function Legend({ swatch, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2.5 w-2.5 rounded-sm ${swatch}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
	});
}
//#endregion
export { ExamBootstrap as component };
