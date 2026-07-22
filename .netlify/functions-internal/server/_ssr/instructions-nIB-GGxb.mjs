import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime, n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { C as Monitor, E as Maximize, J as Check, K as CircleCheck, O as MapPin, W as CircleX, X as Camera, f as ShieldCheck, j as LoaderCircle, n as Wifi, w as Mic } from "../_libs/lucide-react.mjs";
import { t as ThemeToggle } from "./theme-toggle-D9MV8GNL.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CGCM0s9z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/instructions-nIB-GGxb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
function Instructions() {
	const [agree, setAgree] = (0, import_react.useState)(false);
	const [camStatus, setCamStatus] = (0, import_react.useState)("idle");
	const [micStatus, setMicStatus] = (0, import_react.useState)("idle");
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const navigate = useNavigate();
	const candidate = (() => {
		if (typeof window === "undefined") return {};
		try {
			return JSON.parse(sessionStorage.getItem("candidate") ?? "{}");
		} catch {
			return {};
		}
	})();
	const requestPermissions = async () => {
		setCamStatus("requesting");
		setMicStatus("requesting");
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true
			});
			streamRef.current = stream;
			const hasVideo = stream.getVideoTracks().length > 0;
			const hasAudio = stream.getAudioTracks().length > 0;
			setCamStatus(hasVideo ? "granted" : "denied");
			setMicStatus(hasAudio ? "granted" : "denied");
			if (videoRef.current && hasVideo) videoRef.current.srcObject = stream;
		} catch {
			setCamStatus("denied");
			setMicStatus("denied");
		}
	};
	(0, import_react.useEffect)(() => {
		return () => {
			streamRef.current?.getTracks().forEach((t) => t.stop());
		};
	}, []);
	const canStart = agree && camStatus === "granted" && micStatus === "granted";
	const startExam = () => {
		streamRef.current?.getTracks().forEach((t) => t.stop());
		navigate({ to: "/exam" });
	};
	const StatusIcon = ({ status }) => {
		if (status === "granted") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-success" });
		if (status === "denied") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-destructive" });
		if (status === "requesting") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4 rounded-full border-2 border-muted-foreground/40" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "h-14 border-b flex items-center px-6 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold",
					children: "Proctor"
				}),
				candidate.name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-muted-foreground ml-2",
					children: ["· ", candidate.name]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ml-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-4xl mx-auto px-6 py-10 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Exam instructions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Please read carefully before starting the examination."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid md:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Exam rules"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "text-sm space-y-2 text-muted-foreground",
							children: [
								candidate.examName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium text-foreground",
									children: ["Exam: ", candidate.examName]
								}),
								candidate.duration && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"· Duration: ",
									candidate.duration,
									" minutes"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "· You may skip and revisit questions before submission." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "· Do not exit fullscreen or switch tabs during the exam." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "· Any 3 violations will automatically terminate the exam." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "· Only your current device, browser, and location will be used." })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "System requirements"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [
									[Camera, "Working webcam"],
									[Mic, "Microphone"],
									[MapPin, "Location access"],
									[Maximize, "Fullscreen mode"],
									[Wifi, "Stable internet"],
									[Monitor, "Latest Chrome / Edge"]
								].map(([Icon, label], i) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
									}, i);
								})
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Camera & microphone access"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { status: camStatus }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Camera" }),
										camStatus === "granted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-success",
											children: "Granted"
										}),
										camStatus === "denied" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-destructive",
											children: "Denied"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { status: micStatus }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Microphone" }),
										micStatus === "granted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-success",
											children: "Granted"
										}),
										micStatus === "denied" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-destructive",
											children: "Denied"
										})
									]
								}),
								(camStatus === "idle" || camStatus === "denied" || micStatus === "denied") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									className: "rounded-lg ml-auto",
									onClick: requestPermissions,
									children: camStatus === "denied" || micStatus === "denied" ? "Retry permissions" : "Allow camera & mic"
								}),
								(camStatus === "denied" || micStatus === "denied") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-destructive w-full",
									children: "Access was denied. Click \"Retry permissions\" — if the browser blocked it, click the camera icon in your address bar to allow, then retry."
								})
							]
						}), camStatus === "granted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg overflow-hidden border border-border w-48 aspect-video bg-black",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								ref: videoRef,
								autoPlay: true,
								muted: true,
								playsInline: true,
								className: "w-full h-full object-cover"
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "rounded-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4 flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							id: "agree",
							checked: agree,
							onCheckedChange: (v) => setAgree(!!v),
							className: "mt-0.5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "agree",
							className: "text-sm text-muted-foreground select-none",
							children: "I have read and agree to the exam rules. I understand that camera, microphone, and location access are mandatory and that any violation may lead to termination of my exam."
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "rounded-lg",
						onClick: () => navigate({ to: "/" }),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !canStart,
						className: "rounded-lg",
						onClick: startExam,
						children: "Start exam"
					})]
				}),
				!canStart && camStatus !== "idle" && camStatus !== "requesting" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground text-right",
					children: !agree ? "Accept the terms to continue." : "Camera and microphone access required."
				})
			]
		})]
	});
}
//#endregion
export { Instructions as component };
