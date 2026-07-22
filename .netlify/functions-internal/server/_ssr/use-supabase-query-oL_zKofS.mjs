import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-Dke1WgR-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-supabase-query-oL_zKofS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useSupabaseQuery(table, options) {
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let q = supabase.from(table).select(options?.select ?? "*");
		if (options?.order) q = q.order(options.order.column, { ascending: options.order.ascending ?? false });
		q.then(({ data: rows, error: err }) => {
			if (err) setError(err.message);
			else setData(rows ?? []);
			setLoading(false);
		});
	}, [table]);
	return {
		data,
		loading,
		error
	};
}
//#endregion
export { useSupabaseQuery as t };
