import { n as __exportAll$1 } from "../_runtime.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/videosdk-DG4_k8-w.js
var videosdk_DG4_k8_w_exports = /* @__PURE__ */ __exportAll$1({
	n: () => getVideoSDKToken,
	r: () => videosdk_exports,
	t: () => createVideoRoom
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var videosdk_exports = /* @__PURE__ */ __exportAll({
	createVideoRoom: () => createVideoRoom,
	getVideoSDKToken: () => getVideoSDKToken
});
var EDGE_FN_URL = `${"https://pdjjnzsagevbmyiqwqwa.supabase.co".trim()}/functions/v1/get-videosdk-token`;
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkampuenNhZ2V2Ym15aXF3cXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2OTU1NjgsImV4cCI6MjEwMDI3MTU2OH0.DD-mwfC6W0ctonVqVxjWpjP_F3c95g7ak0jkcHNq12A".trim();
var _cachedToken = null;
async function getVideoSDKToken() {
	if (_cachedToken) return _cachedToken;
	if (!EDGE_FN_URL || false) throw new Error("VideoSDK configuration is incomplete. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
	const res = await fetch(EDGE_FN_URL, {
		method: "POST",
		headers: {
			apikey: SUPABASE_ANON_KEY,
			Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
			"Content-Type": "application/json"
		}
	});
	if (!res.ok) throw new Error(`Failed to fetch VideoSDK token: ${res.status}`);
	const { token, error } = await res.json();
	if (error) throw new Error(error);
	_cachedToken = token;
	return token;
}
async function createVideoRoom() {
	const token = await getVideoSDKToken();
	const res = await fetch("https://api.videosdk.live/v2/rooms", {
		method: "POST",
		headers: {
			Authorization: token,
			"Content-Type": "application/json"
		}
	});
	if (!res.ok) throw new Error(`Failed to create VideoSDK room: ${res.status}`);
	return (await res.json()).roomId;
}
//#endregion
export { getVideoSDKToken as n, videosdk_DG4_k8_w_exports as r, createVideoRoom as t };
