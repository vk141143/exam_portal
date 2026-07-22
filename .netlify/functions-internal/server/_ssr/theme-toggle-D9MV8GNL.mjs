import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as useTheme } from "./theme-BDFsyzMe.mjs";
import { S as Moon, u as Sun } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theme-toggle-D9MV8GNL.js
var import_jsx_runtime = require_jsx_runtime();
function ThemeToggle() {
	const { theme, toggle } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		size: "icon",
		onClick: toggle,
		"aria-label": "Toggle theme",
		className: "rounded-lg",
		children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
	});
}
//#endregion
export { ThemeToggle as t };
