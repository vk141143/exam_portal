import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-Dke1WgR-.js
var supabaseUrl = "https://pdjjnzsagevbmyiqwqwa.supabase.co".trim();
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkampuenNhZ2V2Ym15aXF3cXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2OTU1NjgsImV4cCI6MjEwMDI3MTU2OH0.DD-mwfC6W0ctonVqVxjWpjP_F3c95g7ak0jkcHNq12A".trim();
var isSupabaseConfigured = Boolean(supabaseUrl.startsWith("http"));
function createFallbackClient() {
	const createBuilder = () => ({
		select: () => createBuilder(),
		insert: async () => ({
			data: null,
			error: /* @__PURE__ */ new Error("Supabase is not configured")
		}),
		update: async () => ({
			data: null,
			error: /* @__PURE__ */ new Error("Supabase is not configured")
		}),
		upsert: async () => ({
			data: null,
			error: /* @__PURE__ */ new Error("Supabase is not configured")
		}),
		delete: async () => ({
			data: null,
			error: /* @__PURE__ */ new Error("Supabase is not configured")
		}),
		eq: () => createBuilder(),
		neq: () => createBuilder(),
		gt: () => createBuilder(),
		gte: () => createBuilder(),
		lt: () => createBuilder(),
		lte: () => createBuilder(),
		in: () => createBuilder(),
		order: () => createBuilder(),
		limit: () => createBuilder(),
		range: () => createBuilder(),
		single: async () => ({
			data: null,
			error: /* @__PURE__ */ new Error("Supabase is not configured")
		}),
		maybeSingle: async () => ({
			data: null,
			error: /* @__PURE__ */ new Error("Supabase is not configured")
		})
	});
	return new Proxy({}, { get(_target, prop) {
		if (prop === "from") return () => createBuilder();
		return () => void 0;
	} });
}
var supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : createFallbackClient();
//#endregion
export { supabase as t };
