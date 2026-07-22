import { i as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
import { u as require_react } from "../@floating-ui/react-dom+[...].mjs";
import { t as require_videosdk } from "../videosdk.live__js-sdk.mjs";
import EventEmitter from "events";
//#region node_modules/scheduler/cjs/scheduler.production.js
/**
* @license React
* scheduler.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_scheduler_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	function push(heap, node) {
		var index = heap.length;
		heap.push(node);
		a: for (; 0 < index;) {
			var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
			if (0 < compare(parent, node)) heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
			else break a;
		}
	}
	function peek(heap) {
		return 0 === heap.length ? null : heap[0];
	}
	function pop(heap) {
		if (0 === heap.length) return null;
		var first = heap[0], last = heap.pop();
		if (last !== first) {
			heap[0] = last;
			a: for (var index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength;) {
				var leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
				if (0 > compare(left, last)) rightIndex < length && 0 > compare(right, left) ? (heap[index] = right, heap[rightIndex] = last, index = rightIndex) : (heap[index] = left, heap[leftIndex] = last, index = leftIndex);
				else if (rightIndex < length && 0 > compare(right, last)) heap[index] = right, heap[rightIndex] = last, index = rightIndex;
				else break a;
			}
		}
		return first;
	}
	function compare(a, b) {
		var diff = a.sortIndex - b.sortIndex;
		return 0 !== diff ? diff : a.id - b.id;
	}
	exports.unstable_now = void 0;
	if ("object" === typeof performance && "function" === typeof performance.now) {
		var localPerformance = performance;
		exports.unstable_now = function() {
			return localPerformance.now();
		};
	} else {
		var localDate = Date, initialTime = localDate.now();
		exports.unstable_now = function() {
			return localDate.now() - initialTime;
		};
	}
	var taskQueue = [];
	var timerQueue = [];
	var taskIdCounter = 1;
	var currentTask = null;
	var currentPriorityLevel = 3;
	var isPerformingWork = !1;
	var isHostCallbackScheduled = !1;
	var isHostTimeoutScheduled = !1;
	var needsPaint = !1;
	var localSetTimeout = "function" === typeof setTimeout ? setTimeout : null;
	var localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null;
	var localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
	function advanceTimers(currentTime) {
		for (var timer = peek(timerQueue); null !== timer;) {
			if (null === timer.callback) pop(timerQueue);
			else if (timer.startTime <= currentTime) pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
			else break;
			timer = peek(timerQueue);
		}
	}
	function handleTimeout(currentTime) {
		isHostTimeoutScheduled = !1;
		advanceTimers(currentTime);
		if (!isHostCallbackScheduled) if (null !== peek(taskQueue)) isHostCallbackScheduled = !0, isMessageLoopRunning || (isMessageLoopRunning = !0, schedulePerformWorkUntilDeadline());
		else {
			var firstTimer = peek(timerQueue);
			null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
		}
	}
	var isMessageLoopRunning = !1;
	var taskTimeoutID = -1;
	var frameInterval = 5;
	var startTime = -1;
	function shouldYieldToHost() {
		return needsPaint ? !0 : exports.unstable_now() - startTime < frameInterval ? !1 : !0;
	}
	function performWorkUntilDeadline() {
		needsPaint = !1;
		if (isMessageLoopRunning) {
			var currentTime = exports.unstable_now();
			startTime = currentTime;
			var hasMoreWork = !0;
			try {
				a: {
					isHostCallbackScheduled = !1;
					isHostTimeoutScheduled && (isHostTimeoutScheduled = !1, localClearTimeout(taskTimeoutID), taskTimeoutID = -1);
					isPerformingWork = !0;
					var previousPriorityLevel = currentPriorityLevel;
					try {
						b: {
							advanceTimers(currentTime);
							for (currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && shouldYieldToHost());) {
								var callback = currentTask.callback;
								if ("function" === typeof callback) {
									currentTask.callback = null;
									currentPriorityLevel = currentTask.priorityLevel;
									var continuationCallback = callback(currentTask.expirationTime <= currentTime);
									currentTime = exports.unstable_now();
									if ("function" === typeof continuationCallback) {
										currentTask.callback = continuationCallback;
										advanceTimers(currentTime);
										hasMoreWork = !0;
										break b;
									}
									currentTask === peek(taskQueue) && pop(taskQueue);
									advanceTimers(currentTime);
								} else pop(taskQueue);
								currentTask = peek(taskQueue);
							}
							if (null !== currentTask) hasMoreWork = !0;
							else {
								var firstTimer = peek(timerQueue);
								null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
								hasMoreWork = !1;
							}
						}
						break a;
					} finally {
						currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = !1;
					}
					hasMoreWork = void 0;
				}
			} finally {
				hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = !1;
			}
		}
	}
	var schedulePerformWorkUntilDeadline;
	if ("function" === typeof localSetImmediate) schedulePerformWorkUntilDeadline = function() {
		localSetImmediate(performWorkUntilDeadline);
	};
	else if ("undefined" !== typeof MessageChannel) {
		var channel = new MessageChannel(), port = channel.port2;
		channel.port1.onmessage = performWorkUntilDeadline;
		schedulePerformWorkUntilDeadline = function() {
			port.postMessage(null);
		};
	} else schedulePerformWorkUntilDeadline = function() {
		localSetTimeout(performWorkUntilDeadline, 0);
	};
	function requestHostTimeout(callback, ms) {
		taskTimeoutID = localSetTimeout(function() {
			callback(exports.unstable_now());
		}, ms);
	}
	exports.unstable_IdlePriority = 5;
	exports.unstable_ImmediatePriority = 1;
	exports.unstable_LowPriority = 4;
	exports.unstable_NormalPriority = 3;
	exports.unstable_Profiling = null;
	exports.unstable_UserBlockingPriority = 2;
	exports.unstable_cancelCallback = function(task) {
		task.callback = null;
	};
	exports.unstable_forceFrameRate = function(fps) {
		0 > fps || 125 < fps ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5;
	};
	exports.unstable_getCurrentPriorityLevel = function() {
		return currentPriorityLevel;
	};
	exports.unstable_next = function(eventHandler) {
		switch (currentPriorityLevel) {
			case 1:
			case 2:
			case 3:
				var priorityLevel = 3;
				break;
			default: priorityLevel = currentPriorityLevel;
		}
		var previousPriorityLevel = currentPriorityLevel;
		currentPriorityLevel = priorityLevel;
		try {
			return eventHandler();
		} finally {
			currentPriorityLevel = previousPriorityLevel;
		}
	};
	exports.unstable_requestPaint = function() {
		needsPaint = !0;
	};
	exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
		switch (priorityLevel) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: priorityLevel = 3;
		}
		var previousPriorityLevel = currentPriorityLevel;
		currentPriorityLevel = priorityLevel;
		try {
			return eventHandler();
		} finally {
			currentPriorityLevel = previousPriorityLevel;
		}
	};
	exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
		var currentTime = exports.unstable_now();
		"object" === typeof options && null !== options ? (options = options.delay, options = "number" === typeof options && 0 < options ? currentTime + options : currentTime) : options = currentTime;
		switch (priorityLevel) {
			case 1:
				var timeout = -1;
				break;
			case 2:
				timeout = 250;
				break;
			case 5:
				timeout = 1073741823;
				break;
			case 4:
				timeout = 1e4;
				break;
			default: timeout = 5e3;
		}
		timeout = options + timeout;
		priorityLevel = {
			id: taskIdCounter++,
			callback,
			priorityLevel,
			startTime: options,
			expirationTime: timeout,
			sortIndex: -1
		};
		options > currentTime ? (priorityLevel.sortIndex = options, push(timerQueue, priorityLevel), null === peek(taskQueue) && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = !0, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = !0, isMessageLoopRunning || (isMessageLoopRunning = !0, schedulePerformWorkUntilDeadline())));
		return priorityLevel;
	};
	exports.unstable_shouldYield = shouldYieldToHost;
	exports.unstable_wrapCallback = function(callback) {
		var parentPriorityLevel = currentPriorityLevel;
		return function() {
			var previousPriorityLevel = currentPriorityLevel;
			currentPriorityLevel = parentPriorityLevel;
			try {
				return callback.apply(this, arguments);
			} finally {
				currentPriorityLevel = previousPriorityLevel;
			}
		};
	};
}));
//#endregion
//#region node_modules/scheduler/index.js
var require_scheduler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_scheduler_production();
}));
//#endregion
//#region node_modules/use-context-selector/dist/index.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_scheduler = require_scheduler();
var CONTEXT_VALUE = Symbol();
var ORIGINAL_PROVIDER = Symbol();
var useIsomorphicLayoutEffect = typeof window === "undefined" || /ServerSideRendering/.test(window.navigator && window.navigator.userAgent) ? import_react.useEffect : import_react.useLayoutEffect;
var runWithNormalPriority = import_scheduler.unstable_runWithPriority ? (fn) => {
	try {
		(0, import_scheduler.unstable_runWithPriority)(import_scheduler.unstable_NormalPriority, fn);
	} catch (e) {
		if (e.message === "Not implemented.") fn();
		else throw e;
	}
} : (fn) => fn();
var createProvider = (ProviderOrig) => {
	const ContextProvider = ({ value, children }) => {
		const valueRef = (0, import_react.useRef)(value);
		const versionRef = (0, import_react.useRef)(0);
		const [resolve, setResolve] = (0, import_react.useState)(null);
		if (resolve) {
			resolve(value);
			setResolve(null);
		}
		const contextValue = (0, import_react.useRef)();
		if (!contextValue.current) {
			const listeners = /* @__PURE__ */ new Set();
			const update = (fn, options) => {
				versionRef.current += 1;
				const action = { n: versionRef.current };
				if (options === null || options === void 0 ? void 0 : options.suspense) {
					action.n *= -1;
					action.p = new Promise((r) => {
						setResolve(() => (v) => {
							action.v = v;
							delete action.p;
							r(v);
						});
					});
				}
				listeners.forEach((listener) => listener(action));
				fn();
			};
			contextValue.current = { [CONTEXT_VALUE]: {
				v: valueRef,
				n: versionRef,
				l: listeners,
				u: update
			} };
		}
		useIsomorphicLayoutEffect(() => {
			valueRef.current = value;
			versionRef.current += 1;
			runWithNormalPriority(() => {
				contextValue.current[CONTEXT_VALUE].l.forEach((listener) => {
					listener({
						n: versionRef.current,
						v: value
					});
				});
			});
		}, [value]);
		return (0, import_react.createElement)(ProviderOrig, { value: contextValue.current }, children);
	};
	return ContextProvider;
};
/**
* This creates a special context for `useContextSelector`.
*
* @example
* import { createContext } from 'use-context-selector';
*
* const PersonContext = createContext({ firstName: '', familyName: '' });
*/
function createContext$1(defaultValue) {
	const context = (0, import_react.createContext)({ [CONTEXT_VALUE]: {
		v: { current: defaultValue },
		n: { current: -1 },
		l: /* @__PURE__ */ new Set(),
		u: (f) => f()
	} });
	context[ORIGINAL_PROVIDER] = context.Provider;
	context.Provider = createProvider(context.Provider);
	delete context.Consumer;
	return context;
}
/**
* This hook returns context selected value by selector.
*
* It will only accept context created by `createContext`.
* It will trigger re-render if only the selected value is referentially changed.
*
* The selector should return referentially equal result for same input for better performance.
*
* @example
* import { useContextSelector } from 'use-context-selector';
*
* const firstName = useContextSelector(PersonContext, (state) => state.firstName);
*/
function useContextSelector(context, selector) {
	const { v: { current: value }, n: { current: version }, l: listeners } = (0, import_react.useContext)(context)[CONTEXT_VALUE];
	const selected = selector(value);
	const [state, dispatch] = (0, import_react.useReducer)((prev, action) => {
		if (!action) return [value, selected];
		if ("p" in action) throw action.p;
		if (action.n === version) {
			if (Object.is(prev[1], selected)) return prev;
			return [value, selected];
		}
		try {
			if ("v" in action) {
				if (Object.is(prev[0], action.v)) return prev;
				const nextSelected = selector(action.v);
				if (Object.is(prev[1], nextSelected)) return prev;
				return [action.v, nextSelected];
			}
		} catch (_e) {}
		return [...prev];
	}, [value, selected]);
	if (!Object.is(state[1], selected)) dispatch();
	useIsomorphicLayoutEffect(() => {
		listeners.add(dispatch);
		return () => {
			listeners.delete(dispatch);
		};
	}, [listeners]);
	return state[1];
}
/**
* This hook returns an update function to wrap an updating function
*
* Use this for a function that will change a value in
* concurrent rendering in React 18.
* Otherwise, there's no need to use this hook.
*
* @example
* import { useContextUpdate } from 'use-context-selector';
*
* const update = useContextUpdate();
*
* // Wrap set state function
* update(() => setState(...));
*
* // Experimental suspense mode
* update(() => setState(...), { suspense: true });
*/
function useContextUpdate(context) {
	const { u: update } = (0, import_react.useContext)(context)[CONTEXT_VALUE];
	return update;
}
//#endregion
//#region node_modules/proxy-compare/dist/index.js
var TRACK_MEMO_SYMBOL = Symbol();
var GET_ORIGINAL_SYMBOL = Symbol();
var AFFECTED_PROPERTY = "a";
var IS_TARGET_COPIED_PROPERTY = "f";
var PROXY_PROPERTY = "p";
var PROXY_CACHE_PROPERTY = "c";
var TARGET_CACHE_PROPERTY = "t";
var HAS_KEY_PROPERTY = "h";
var ALL_OWN_KEYS_PROPERTY = "w";
var HAS_OWN_KEY_PROPERTY = "o";
var KEYS_PROPERTY = "k";
var newProxy = (target, handler) => new Proxy(target, handler);
var getProto = Object.getPrototypeOf;
var objectsToTrack = /* @__PURE__ */ new WeakMap();
var isObjectToTrack = (obj) => obj && (objectsToTrack.has(obj) ? objectsToTrack.get(obj) : getProto(obj) === Object.prototype || getProto(obj) === Array.prototype);
var isObject = (x) => typeof x === "object" && x !== null;
var needsToCopyTargetObject = (obj) => Object.values(Object.getOwnPropertyDescriptors(obj)).some((descriptor) => !descriptor.configurable && !descriptor.writable);
var copyTargetObject = (obj) => {
	if (Array.isArray(obj)) return Array.from(obj);
	const descriptors = Object.getOwnPropertyDescriptors(obj);
	Object.values(descriptors).forEach((desc) => {
		desc.configurable = true;
	});
	return Object.create(getProto(obj), descriptors);
};
var createProxyHandler = (origObj, isTargetCopied) => {
	const state = { [IS_TARGET_COPIED_PROPERTY]: isTargetCopied };
	let trackObject = false;
	const recordUsage = (type, key) => {
		if (!trackObject) {
			let used = state[AFFECTED_PROPERTY].get(origObj);
			if (!used) {
				used = {};
				state[AFFECTED_PROPERTY].set(origObj, used);
			}
			if (type === ALL_OWN_KEYS_PROPERTY) used[ALL_OWN_KEYS_PROPERTY] = true;
			else {
				let set = used[type];
				if (!set) {
					set = /* @__PURE__ */ new Set();
					used[type] = set;
				}
				set.add(key);
			}
		}
	};
	const recordObjectAsUsed = () => {
		trackObject = true;
		state[AFFECTED_PROPERTY].delete(origObj);
	};
	const handler = {
		get(target, key) {
			if (key === GET_ORIGINAL_SYMBOL) return origObj;
			recordUsage(KEYS_PROPERTY, key);
			return createProxy(Reflect.get(target, key), state[AFFECTED_PROPERTY], state[PROXY_CACHE_PROPERTY], state[TARGET_CACHE_PROPERTY]);
		},
		has(target, key) {
			if (key === TRACK_MEMO_SYMBOL) {
				recordObjectAsUsed();
				return true;
			}
			recordUsage(HAS_KEY_PROPERTY, key);
			return Reflect.has(target, key);
		},
		getOwnPropertyDescriptor(target, key) {
			recordUsage(HAS_OWN_KEY_PROPERTY, key);
			return Reflect.getOwnPropertyDescriptor(target, key);
		},
		ownKeys(target) {
			recordUsage(ALL_OWN_KEYS_PROPERTY);
			return Reflect.ownKeys(target);
		}
	};
	if (isTargetCopied) handler.set = handler.deleteProperty = () => false;
	return [handler, state];
};
var getOriginalObject = (obj) => obj[GET_ORIGINAL_SYMBOL] || obj;
/**
* Create a proxy.
*
* This function will create a proxy at top level and proxy nested objects as you access them,
* in order to keep track of which properties were accessed via get/has proxy handlers:
*
* NOTE: Printing of WeakMap is hard to inspect and not very readable
* for this purpose you can use the `affectedToPathList` helper.
*
* @param {object} obj - Object that will be wrapped on the proxy.
* @param {WeakMap<object, unknown>} affected -
* WeakMap that will hold the tracking of which properties in the proxied object were accessed.
* @param {WeakMap<object, unknown>} [proxyCache] -
* WeakMap that will help keep referential identity for proxies.
* @returns {Proxy<object>} - Object wrapped in a proxy.
*
* @example
* import { createProxy } from 'proxy-compare';
*
* const original = { a: "1", c: "2", d: { e: "3" } };
* const affected = new WeakMap();
* const proxy = createProxy(original, affected);
*
* proxy.a // Will mark as used and track its value.
* // This will update the affected WeakMap with original as key
* // and a Set with "a"
*
* proxy.d // Will mark "d" as accessed to track and proxy itself ({ e: "3" }).
* // This will update the affected WeakMap with original as key
* // and a Set with "d"
*/
var createProxy = (obj, affected, proxyCache, targetCache) => {
	if (!isObjectToTrack(obj)) return obj;
	let targetAndCopied = targetCache && targetCache.get(obj);
	if (!targetAndCopied) {
		const target = getOriginalObject(obj);
		if (needsToCopyTargetObject(target)) targetAndCopied = [target, copyTargetObject(target)];
		else targetAndCopied = [target];
		targetCache === null || targetCache === void 0 || targetCache.set(obj, targetAndCopied);
	}
	const [target, copiedTarget] = targetAndCopied;
	let handlerAndState = proxyCache && proxyCache.get(target);
	if (!handlerAndState || handlerAndState[1][IS_TARGET_COPIED_PROPERTY] !== !!copiedTarget) {
		handlerAndState = createProxyHandler(target, !!copiedTarget);
		handlerAndState[1][PROXY_PROPERTY] = newProxy(copiedTarget || target, handlerAndState[0]);
		if (proxyCache) proxyCache.set(target, handlerAndState);
	}
	handlerAndState[1][AFFECTED_PROPERTY] = affected;
	handlerAndState[1][PROXY_CACHE_PROPERTY] = proxyCache;
	handlerAndState[1][TARGET_CACHE_PROPERTY] = targetCache;
	return handlerAndState[1][PROXY_PROPERTY];
};
var isAllOwnKeysChanged = (prevObj, nextObj) => {
	const prevKeys = Reflect.ownKeys(prevObj);
	const nextKeys = Reflect.ownKeys(nextObj);
	return prevKeys.length !== nextKeys.length || prevKeys.some((k, i) => k !== nextKeys[i]);
};
/**
* Compare changes on objects.
*
* This will compare the affected properties on tracked objects inside the proxy
* to check if there were any changes made to it,
* by default if no property was accessed on the proxy it will attempt to do a
* reference equality check for the objects provided (Object.is(a, b)). If you access a property
* on the proxy, then isChanged will only compare the affected properties.
*
* @param {object} prevObj - The previous object to compare.
* @param {object} nextObj - Object to compare with the previous one.
* @param {WeakMap<object, unknown>} affected -
* WeakMap that holds the tracking of which properties in the proxied object were accessed.
* @param {WeakMap<object, unknown>} [cache] -
* WeakMap that holds a cache of the comparisons for better performance with repetitive comparisons,
* and to avoid infinite loop with circular structures.
* @returns {boolean} - Boolean indicating if the affected property on the object has changed.
*
* @example
* import { createProxy, isChanged } from 'proxy-compare';
*
* const obj = { a: "1", c: "2", d: { e: "3" } };
* const affected = new WeakMap();
*
* const proxy = createProxy(obj, affected);
*
* proxy.a
*
* isChanged(obj, { a: "1" }, affected) // false
*
* proxy.a = "2"
*
* isChanged(obj, { a: "1" }, affected) // true
*/
var isChanged = (prevObj, nextObj, affected, cache, isEqual = Object.is) => {
	if (isEqual(prevObj, nextObj)) return false;
	if (!isObject(prevObj) || !isObject(nextObj)) return true;
	const used = affected.get(getOriginalObject(prevObj));
	if (!used) return true;
	if (cache) {
		if (cache.get(prevObj) === nextObj) return false;
		cache.set(prevObj, nextObj);
	}
	let changed = null;
	for (const key of used[HAS_KEY_PROPERTY] || []) {
		changed = Reflect.has(prevObj, key) !== Reflect.has(nextObj, key);
		if (changed) return changed;
	}
	if (used[ALL_OWN_KEYS_PROPERTY] === true) {
		changed = isAllOwnKeysChanged(prevObj, nextObj);
		if (changed) return changed;
	} else for (const key of used[HAS_OWN_KEY_PROPERTY] || []) {
		changed = !!Reflect.getOwnPropertyDescriptor(prevObj, key) !== !!Reflect.getOwnPropertyDescriptor(nextObj, key);
		if (changed) return changed;
	}
	for (const key of used[KEYS_PROPERTY] || []) {
		changed = isChanged(prevObj[key], nextObj[key], affected, cache, isEqual);
		if (changed) return changed;
	}
	if (changed === null) throw new Error("invalid used");
	return changed;
};
//#endregion
//#region node_modules/react-tracked/dist/createTrackedSelector.js
var createTrackedSelector = (useSelector) => {
	const useTrackedSelector = () => {
		const [, forceUpdate] = (0, import_react.useReducer)((c) => c + 1, 0);
		const affected = (0, import_react.useMemo)(() => /* @__PURE__ */ new WeakMap(), []);
		const prevState = (0, import_react.useRef)();
		const lastState = (0, import_react.useRef)();
		(0, import_react.useEffect)(() => {
			if (prevState.current !== lastState.current && isChanged(prevState.current, lastState.current, affected, /* @__PURE__ */ new WeakMap())) {
				prevState.current = lastState.current;
				forceUpdate();
			}
		});
		return createProxy(useSelector((0, import_react.useCallback)((nextState) => {
			lastState.current = nextState;
			if (prevState.current && prevState.current !== nextState && !isChanged(prevState.current, nextState, affected, /* @__PURE__ */ new WeakMap())) return prevState.current;
			prevState.current = nextState;
			return nextState;
		}, [affected])), affected, (0, import_react.useMemo)(() => /* @__PURE__ */ new WeakMap(), []));
	};
	return useTrackedSelector;
};
//#endregion
//#region node_modules/react-tracked/dist/createContainer.js
var createContainer = (useValue, options) => {
	if (typeof options === "boolean") {
		console.warn("boolean option is deprecated, please specify { concurrentMode: true }");
		options = { concurrentMode: options };
	}
	const { stateContextName = "StateContainer", updateContextName = "UpdateContainer", concurrentMode } = options || {};
	const StateContext = createContext$1(options === null || options === void 0 ? void 0 : options.defaultState);
	const UpdateContext = (0, import_react.createContext)(options === null || options === void 0 ? void 0 : options.defaultUpdate);
	StateContext.displayName = stateContextName;
	UpdateContext.displayName = updateContextName;
	const Provider = (props) => {
		const [state, update] = useValue(props);
		return (0, import_react.createElement)(UpdateContext.Provider, { value: update }, (0, import_react.createElement)(StateContext.Provider, { value: state }, props.children));
	};
	const useSelector = (selector) => {
		const selected = useContextSelector(StateContext, selector);
		(0, import_react.useDebugValue)(selected);
		return selected;
	};
	const useTrackedState = createTrackedSelector(useSelector);
	const useUpdate = concurrentMode ? () => {
		const contextUpdate = useContextUpdate(StateContext);
		const update = (0, import_react.useContext)(UpdateContext);
		return (0, import_react.useCallback)((...args) => {
			let result;
			contextUpdate(() => {
				result = update(...args);
			});
			return result;
		}, [contextUpdate, update]);
	} : () => {
		return (0, import_react.useContext)(UpdateContext);
	};
	const useTracked = () => [useTrackedState(), useUpdate()];
	return {
		Provider,
		useTrackedState,
		useTracked,
		useUpdate,
		useSelector
	};
};
//#endregion
//#region node_modules/@videosdk.live/react-sdk/dist/index.modern.js
var import_videosdk = require_videosdk();
function _extends() {
	_extends = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _toPrimitive(input, hint) {
	if (typeof input !== "object" || input === null) return input;
	var prim = input[Symbol.toPrimitive];
	if (prim !== void 0) {
		var res = prim.call(input, hint || "default");
		if (typeof res !== "object") return res;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
	var key = _toPrimitive(arg, "string");
	return typeof key === "symbol" ? key : String(key);
}
typeof Symbol !== "undefined" && (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")));
/*#__PURE__*/ typeof Symbol !== "undefined" && (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator")));
var eventPrifix = "videosdk-live-react-sdk";
var events = {
	"participant-joined": eventPrifix + "-participant-joined",
	"participant-left": eventPrifix + "-participant-left",
	"speaker-changed": eventPrifix + "-speaker-changed",
	"presenter-changed": eventPrifix + "-presenter-changed",
	"main-participant-changed": eventPrifix + "-main-participant-changed",
	"entry-requested": eventPrifix + "-entry-requested",
	"entry-responded": eventPrifix + "-entry-responded",
	"recording-started": eventPrifix + "-recording-started",
	"recording-stopped": eventPrifix + "-recording-stopped",
	data: eventPrifix + "-data",
	"meeting-joined": eventPrifix + "-meeting-joined",
	"meeting-left": eventPrifix + "-meeting-left",
	"live-stream-started": eventPrifix + "-live-stream-started",
	"live-stream-stopped": eventPrifix + "-live-stream-stopped",
	"webcam-requested": eventPrifix + "-webcam-requested",
	"mic-requested": eventPrifix + "-mic-requested",
	"pin-state-changed": eventPrifix + "-pin-state-changed",
	"connection-open": eventPrifix + "-connection-open",
	"connection-close": eventPrifix + "-connection-close",
	"switch-meeting": eventPrifix + "-switch-meeting",
	error: eventPrifix + "-error",
	"hls-started": eventPrifix + "-hls-started",
	"hls-stopped": eventPrifix + "-hls-stopped",
	"hls-state-changed": eventPrifix + "-hls-state-changed",
	"hls-playable-state-changed": eventPrifix + "-hls-playable-state-changed",
	"recording-state-changed": eventPrifix + "-recording-state-changed",
	"livestream-state-changed": eventPrifix + "-livestream-state-changed",
	"meeting-state-changed": eventPrifix + "-meeting-state-changed",
	"participant-mode-changed": eventPrifix + "-participant-mode-changed",
	"transcription-state-changed": eventPrifix + "-transcription-state-changed",
	"transcription-text": eventPrifix + "-transcription-text",
	"translation-state-changed": eventPrifix + "-translation-state-changed",
	"translation-language-changed": eventPrifix + "-translation-language-changed",
	"translation-text": eventPrifix + "-translation-text",
	"character-joined": eventPrifix + "-character-joined",
	"character-left": eventPrifix + "-character-left",
	"whiteboard-started": eventPrifix + "-whiteboard-started",
	"whiteboard-stopped": eventPrifix + "-whiteboard-stopped",
	"paused-all-streams": eventPrifix + "-paused-all-streams",
	"resumed-all-streams": eventPrifix + "-resumed-all-streams",
	"media-relay-started": eventPrifix + "-media-relay-started",
	"media-relay-stopped": eventPrifix + "-media-relay-stopped",
	"media-relay-error": eventPrifix + "-media-relay-error",
	"media-relay-request-response": eventPrifix + "-media-relay-request-response",
	"media-relay-request-received": eventPrifix + "-media-relay-request-received",
	"quality-limitation": eventPrifix + "-quality-limitation",
	"audio-input-silence": eventPrifix + "-audio-input-silence",
	"codec-changed": eventPrifix + "-codec-changed",
	"participant-stream-enabled": eventPrifix + "-p-stream-enabled",
	"participant-stream-disabled": eventPrifix + "-p-stream-disabled",
	"participant-media-status-changed": eventPrifix + "-p-media-status-changed",
	"participant-video-quality-changed": eventPrifix + "-p-video-quality-changed",
	"participant-stream-paused": eventPrifix + "-p-stream-paused",
	"participant-stream-resumed": eventPrifix + "-p-stream-resumed",
	"participant-producer-added": eventPrifix + "-p-producer-added",
	"participant-producer-removed": eventPrifix + "-p-producer-removed",
	"participant-consumer-added": eventPrifix + "-p-consumer-added",
	"participant-consumer-removed": eventPrifix + "-p-consumer-removed",
	"agent-state-changed": eventPrifix + "-p-agent-state-changed",
	"agent-transcription-received": eventPrifix + "-p-agent-transcription-received",
	"agent-metrics": eventPrifix + "-p-agent-metrics",
	"character-state-changed": eventPrifix + "-c-state-changed",
	"character-message": eventPrifix + "-c-message",
	"user-message": eventPrifix + "-c-user-message",
	"character-data": eventPrifix + "-c-data",
	"character-error": eventPrifix + "-c-error"
};
var eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(9999);
var rejectNotJoined = function rejectNotJoined(method) {
	var err = /* @__PURE__ */ new Error("You must join the meeting before calling the " + method + "() method.");
	err.name = "ERROR_ACTION_PERFORMED_BEFORE_MEETING_JOINED";
	err.code = 3035;
	eventEmitter.emit(events["error"], {
		name: err.name,
		code: err.code,
		message: err.message
	});
	return Promise.reject(err);
};
var rejectUnavailable = function rejectUnavailable(method, subject) {
	var err = /* @__PURE__ */ new Error("The " + subject + " is no longer available, so " + method + "() could not be called.");
	err.name = "ERROR_ACTION_PERFORMED_BEFORE_MEETING_JOINED";
	err.code = 3035;
	return Promise.reject(err);
};
var NOOP = function NOOP() {};
var INITIAL_STATE = {
	meetingId: null,
	meeting: null,
	baseUrl: null,
	localParticipant: null,
	mainParticipant: null,
	activeSpeakerId: null,
	presenterId: null,
	participants: /* @__PURE__ */ new Map(),
	characters: /* @__PURE__ */ new Map(),
	pinnedParticipants: /* @__PURE__ */ new Map(),
	connections: /* @__PURE__ */ new Map(),
	localMicOn: false,
	localWebcamOn: false,
	localScreenShareOn: false,
	messages: [],
	isMeetingJoined: false,
	isRecording: false,
	isLiveStreaming: false,
	isHls: false,
	recordingState: "RECORDING_STOPPED",
	livestreamState: "LIVESTREAM_STOPPED",
	hlsState: "HLS_STOPPED",
	hlsUrls: {
		downstreamUrl: null,
		playbackHlsUrl: null,
		livestreamUrl: null
	},
	transcriptionState: "TRANSCRIPTION_STOPPED",
	translationState: "TRANSLATION_STOPPED",
	selectedCameraDevice: null,
	selectedMicrophoneDevice: null
};
var reducer = function reducer(state, patch) {
	if (patch === "RESET") return _extends({}, INITIAL_STATE);
	var changes = typeof patch === "function" ? patch(state) : patch;
	if (!Object.keys(changes).some(function(k) {
		return state[k] !== changes[k];
	})) return state;
	return _extends({}, state, changes);
};
var _createContainer = createContainer(function() {
	return (0, import_react.useReducer)(reducer, INITIAL_STATE);
});
var MeetingStateProviderBase = _createContainer.Provider;
var useMeetingState = _createContainer.useTrackedState;
var useMeetingSelector = _createContainer.useSelector;
var useMeetingDispatch = _createContainer.useUpdate;
var MeetingStateProvider = function MeetingStateProvider(_ref) {
	var children = _ref.children;
	return /*#__PURE__*/ import_react.createElement(MeetingStateProviderBase, null, children);
};
var MeetingMethodsContext = (0, import_react.createContext)(null);
var MeetingLiveStateContext = (0, import_react.createContext)(null);
var useStableEvent = function useStableEvent(eventName, handler) {
	var handlerRef = (0, import_react.useRef)(handler);
	(0, import_react.useEffect)(function() {
		handlerRef.current = handler;
	});
	(0, import_react.useEffect)(function() {
		var stable = function stable() {
			return handlerRef.current.apply(handlerRef, arguments);
		};
		eventEmitter.on(eventName, stable);
		return function() {
			return eventEmitter.off(eventName, stable);
		};
	}, [eventName]);
};
var useMeeting = function useMeeting(_temp) {
	var _ref2 = _temp === void 0 ? {} : _temp, _ref2$onParticipantJo = _ref2.onParticipantJoined, onParticipantJoined = _ref2$onParticipantJo === void 0 ? NOOP : _ref2$onParticipantJo, _ref2$onParticipantLe = _ref2.onParticipantLeft, onParticipantLeft = _ref2$onParticipantLe === void 0 ? NOOP : _ref2$onParticipantLe, _ref2$onSpeakerChange = _ref2.onSpeakerChanged, onSpeakerChanged = _ref2$onSpeakerChange === void 0 ? NOOP : _ref2$onSpeakerChange, _ref2$onPresenterChan = _ref2.onPresenterChanged, onPresenterChanged = _ref2$onPresenterChan === void 0 ? NOOP : _ref2$onPresenterChan, _ref2$onMainParticipa = _ref2.onMainParticipantChanged, onMainParticipantChanged = _ref2$onMainParticipa === void 0 ? NOOP : _ref2$onMainParticipa, _ref2$onEntryRequeste = _ref2.onEntryRequested, onEntryRequested = _ref2$onEntryRequeste === void 0 ? NOOP : _ref2$onEntryRequeste, _ref2$onEntryResponde = _ref2.onEntryResponded, onEntryResponded = _ref2$onEntryResponde === void 0 ? NOOP : _ref2$onEntryResponde, _ref2$onPausedAllStre = _ref2.onPausedAllStreams, onPausedAllStreams = _ref2$onPausedAllStre === void 0 ? NOOP : _ref2$onPausedAllStre, _ref2$onResumedAllStr = _ref2.onResumedAllStreams, onResumedAllStreams = _ref2$onResumedAllStr === void 0 ? NOOP : _ref2$onResumedAllStr, _ref2$onRecordingStar = _ref2.onRecordingStarted, onRecordingStarted = _ref2$onRecordingStar === void 0 ? NOOP : _ref2$onRecordingStar, _ref2$onRecordingStop = _ref2.onRecordingStopped, onRecordingStopped = _ref2$onRecordingStop === void 0 ? NOOP : _ref2$onRecordingStop, _ref2$onData = _ref2.onData, onData = _ref2$onData === void 0 ? NOOP : _ref2$onData, _ref2$onMeetingJoined = _ref2.onMeetingJoined, onMeetingJoined = _ref2$onMeetingJoined === void 0 ? NOOP : _ref2$onMeetingJoined, _ref2$onMeetingLeft = _ref2.onMeetingLeft, onMeetingLeft = _ref2$onMeetingLeft === void 0 ? NOOP : _ref2$onMeetingLeft, _ref2$onLiveStreamSta = _ref2.onLiveStreamStarted, onLiveStreamStarted = _ref2$onLiveStreamSta === void 0 ? NOOP : _ref2$onLiveStreamSta, _ref2$onLiveStreamSto = _ref2.onLiveStreamStopped, onLiveStreamStopped = _ref2$onLiveStreamSto === void 0 ? NOOP : _ref2$onLiveStreamSto, _ref2$onWebcamRequest = _ref2.onWebcamRequested, onWebcamRequested = _ref2$onWebcamRequest === void 0 ? NOOP : _ref2$onWebcamRequest, _ref2$onMicRequested = _ref2.onMicRequested, onMicRequested = _ref2$onMicRequested === void 0 ? NOOP : _ref2$onMicRequested, _ref2$onPinStateChang = _ref2.onPinStateChanged, onPinStateChanged = _ref2$onPinStateChang === void 0 ? NOOP : _ref2$onPinStateChang, _ref2$onConnectionOpe = _ref2.onConnectionOpen, onConnectionOpen = _ref2$onConnectionOpe === void 0 ? NOOP : _ref2$onConnectionOpe, _ref2$onConnetionClos = _ref2.onConnetionClose, onConnetionClose = _ref2$onConnetionClos === void 0 ? NOOP : _ref2$onConnetionClos, _ref2$onSwitchMeeting = _ref2.onSwitchMeeting, onSwitchMeeting = _ref2$onSwitchMeeting === void 0 ? NOOP : _ref2$onSwitchMeeting, _ref2$onError = _ref2.onError, onError = _ref2$onError === void 0 ? NOOP : _ref2$onError, _ref2$onHlsStarted = _ref2.onHlsStarted, onHlsStarted = _ref2$onHlsStarted === void 0 ? NOOP : _ref2$onHlsStarted, _ref2$onHlsStopped = _ref2.onHlsStopped, onHlsStopped = _ref2$onHlsStopped === void 0 ? NOOP : _ref2$onHlsStopped, _ref2$onHlsStateChang = _ref2.onHlsStateChanged, onHlsStateChanged = _ref2$onHlsStateChang === void 0 ? NOOP : _ref2$onHlsStateChang, _ref2$onRecordingStat = _ref2.onRecordingStateChanged, onRecordingStateChanged = _ref2$onRecordingStat === void 0 ? NOOP : _ref2$onRecordingStat, _ref2$onLivestreamSta = _ref2.onLivestreamStateChanged, onLivestreamStateChanged = _ref2$onLivestreamSta === void 0 ? NOOP : _ref2$onLivestreamSta, _ref2$onMeetingStateC = _ref2.onMeetingStateChanged, onMeetingStateChanged = _ref2$onMeetingStateC === void 0 ? NOOP : _ref2$onMeetingStateC, _ref2$onParticipantMo = _ref2.onParticipantModeChanged, onParticipantModeChanged = _ref2$onParticipantMo === void 0 ? NOOP : _ref2$onParticipantMo, _ref2$onCharacterJoin = _ref2.onCharacterJoined, onCharacterJoined = _ref2$onCharacterJoin === void 0 ? NOOP : _ref2$onCharacterJoin, _ref2$onCharacterLeft = _ref2.onCharacterLeft, onCharacterLeft = _ref2$onCharacterLeft === void 0 ? NOOP : _ref2$onCharacterLeft, _ref2$onMediaRelaySta = _ref2.onMediaRelayStarted, onMediaRelayStarted = _ref2$onMediaRelaySta === void 0 ? NOOP : _ref2$onMediaRelaySta, _ref2$onMediaRelaySto = _ref2.onMediaRelayStopped, onMediaRelayStopped = _ref2$onMediaRelaySto === void 0 ? NOOP : _ref2$onMediaRelaySto, _ref2$onMediaRelayErr = _ref2.onMediaRelayError, onMediaRelayError = _ref2$onMediaRelayErr === void 0 ? NOOP : _ref2$onMediaRelayErr, _ref2$onMediaRelayReq = _ref2.onMediaRelayRequestResponse, onMediaRelayRequestResponse = _ref2$onMediaRelayReq === void 0 ? NOOP : _ref2$onMediaRelayReq, _ref2$onMediaRelayReq2 = _ref2.onMediaRelayRequestReceived, onMediaRelayRequestReceived = _ref2$onMediaRelayReq2 === void 0 ? NOOP : _ref2$onMediaRelayReq2, _ref2$onQualityLimita = _ref2.onQualityLimitation, onQualityLimitation = _ref2$onQualityLimita === void 0 ? NOOP : _ref2$onQualityLimita, _ref2$onAudioInputSil = _ref2.onAudioInputSilence, onAudioInputSilence = _ref2$onAudioInputSil === void 0 ? NOOP : _ref2$onAudioInputSil, _ref2$onCodecChanged = _ref2.onCodecChanged, onCodecChanged = _ref2$onCodecChanged === void 0 ? NOOP : _ref2$onCodecChanged;
	useStableEvent(events["participant-joined"], onParticipantJoined);
	useStableEvent(events["participant-left"], onParticipantLeft);
	useStableEvent(events["speaker-changed"], onSpeakerChanged);
	useStableEvent(events["presenter-changed"], onPresenterChanged);
	useStableEvent(events["main-participant-changed"], onMainParticipantChanged);
	useStableEvent(events["entry-requested"], onEntryRequested);
	useStableEvent(events["entry-responded"], onEntryResponded);
	useStableEvent(events["paused-all-streams"], onPausedAllStreams);
	useStableEvent(events["resumed-all-streams"], onResumedAllStreams);
	useStableEvent(events["recording-started"], onRecordingStarted);
	useStableEvent(events["recording-stopped"], onRecordingStopped);
	useStableEvent(events["data"], onData);
	useStableEvent(events["meeting-joined"], onMeetingJoined);
	useStableEvent(events["meeting-left"], onMeetingLeft);
	useStableEvent(events["live-stream-started"], onLiveStreamStarted);
	useStableEvent(events["live-stream-stopped"], onLiveStreamStopped);
	useStableEvent(events["webcam-requested"], onWebcamRequested);
	useStableEvent(events["mic-requested"], onMicRequested);
	useStableEvent(events["pin-state-changed"], onPinStateChanged);
	useStableEvent(events["connection-open"], onConnectionOpen);
	useStableEvent(events["connection-close"], onConnetionClose);
	useStableEvent(events["switch-meeting"], onSwitchMeeting);
	useStableEvent(events["error"], onError);
	useStableEvent(events["hls-started"], onHlsStarted);
	useStableEvent(events["hls-stopped"], onHlsStopped);
	useStableEvent(events["hls-state-changed"], onHlsStateChanged);
	useStableEvent(events["recording-state-changed"], onRecordingStateChanged);
	useStableEvent(events["livestream-state-changed"], onLivestreamStateChanged);
	useStableEvent(events["meeting-state-changed"], onMeetingStateChanged);
	useStableEvent(events["participant-mode-changed"], onParticipantModeChanged);
	useStableEvent(events["character-joined"], onCharacterJoined);
	useStableEvent(events["character-left"], onCharacterLeft);
	useStableEvent(events["media-relay-started"], onMediaRelayStarted);
	useStableEvent(events["media-relay-stopped"], onMediaRelayStopped);
	useStableEvent(events["media-relay-error"], onMediaRelayError);
	useStableEvent(events["media-relay-request-response"], onMediaRelayRequestResponse);
	useStableEvent(events["media-relay-request-received"], onMediaRelayRequestReceived);
	useStableEvent(events["quality-limitation"], onQualityLimitation);
	useStableEvent(events["audio-input-silence"], onAudioInputSilence);
	useStableEvent(events["codec-changed"], onCodecChanged);
	var state = useMeetingState();
	var methods = (0, import_react.useContext)(MeetingMethodsContext);
	var liveStateRef = (0, import_react.useContext)(MeetingLiveStateContext);
	var methodsRef = (0, import_react.useRef)(methods);
	methodsRef.current = methods;
	return (0, import_react.useMemo)(function() {
		return new Proxy(state, {
			get: function get(target, prop, receiver) {
				if (prop in INITIAL_STATE) {
					var trackedValue = target[prop];
					var live = liveStateRef && liveStateRef.current;
					return live ? live[prop] : trackedValue;
				}
				var m = methodsRef.current;
				if (m && prop in m) return m[prop];
				return Reflect.get(target, prop, receiver);
			},
			has: function has(target, prop) {
				return prop in INITIAL_STATE || !!(methodsRef.current && prop in methodsRef.current);
			},
			ownKeys: function ownKeys() {
				var _methodsRef$current;
				var stateKeys = Object.keys(INITIAL_STATE);
				var methodKeys = Object.keys((_methodsRef$current = methodsRef.current) != null ? _methodsRef$current : {});
				return [].concat(new Set([].concat(stateKeys, methodKeys)));
			},
			getOwnPropertyDescriptor: function getOwnPropertyDescriptor() {
				return {
					configurable: true,
					enumerable: true,
					writable: false
				};
			}
		});
	}, [state, liveStateRef]);
};
var ParticipantLiveStateContext = (0, import_react.createContext)(null);
var DEFAULT_PIN_STATE = {
	cam: false,
	share: false
};
var PARTICIPANT_STATE_KEYS = {
	participant: true,
	displayName: true,
	metaData: true,
	micOn: true,
	webcamOn: true,
	screenShareOn: true,
	screenShareAudioOn: true,
	webcamStream: true,
	micStream: true,
	screenShareStream: true,
	screenShareAudioStream: true,
	isLocal: true,
	isActiveSpeaker: true,
	isMainParticipant: true,
	pinState: true,
	mode: true,
	agentState: true,
	agentId: true,
	id: true,
	isAgent: true
};
var EMPTY_PARTICIPANT_STATE = {
	participant: null,
	displayName: void 0,
	metaData: void 0,
	micOn: false,
	webcamOn: false,
	screenShareOn: false,
	screenShareAudioOn: false,
	webcamStream: null,
	micStream: null,
	screenShareStream: null,
	screenShareAudioStream: null,
	isLocal: false,
	isActiveSpeaker: false,
	isMainParticipant: false,
	pinState: DEFAULT_PIN_STATE,
	mode: void 0,
	agentState: null,
	agentId: void 0,
	id: void 0,
	isAgent: false
};
var reducer$1 = function reducer(state, action) {
	if (action === "RESET") return {};
	var type = action.type, id = action.id, data = action.data;
	switch (type) {
		case "INIT":
			var _extends2;
			return _extends({}, state, (_extends2 = {}, _extends2[id] = _extends({}, EMPTY_PARTICIPANT_STATE, data), _extends2));
		case "REMOVE": return _objectWithoutPropertiesLoose(state, [id].map(_toPropertyKey));
		case "UPDATE":
			var _extends3;
			var prev = state[id];
			if (!prev) return state;
			if (!Object.keys(data).some(function(k) {
				return prev[k] !== data[k];
			})) return state;
			return _extends({}, state, (_extends3 = {}, _extends3[id] = _extends({}, prev, data), _extends3));
		default: return state;
	}
};
var _createContainer$1 = createContainer(function() {
	return (0, import_react.useReducer)(reducer$1, {});
});
var ParticipantStateProviderBase = _createContainer$1.Provider;
var useParticipantTrackedState = _createContainer$1.useTrackedState;
var useParticipantSelector = _createContainer$1.useSelector;
var useParticipantDispatch = _createContainer$1.useUpdate;
var ParticipantStateProvider = function ParticipantStateProvider(_ref) {
	var children = _ref.children;
	return /*#__PURE__*/ import_react.createElement(ParticipantStateProviderBase, null, children);
};
var CharacterLiveStateContext = (0, import_react.createContext)(null);
var EMPTY_CHARACTER_STATE = {
	character: null,
	displayName: void 0,
	interactionId: void 0,
	id: void 0,
	micOn: false,
	webcamOn: false,
	webcamStream: null,
	micStream: null,
	characterState: null,
	characterMode: void 0,
	characterRole: void 0,
	knowledgeBases: void 0,
	language: void 0,
	metaData: void 0,
	isActiveSpeaker: false
};
var reducer$2 = function reducer(state, action) {
	if (action === "RESET") return {};
	var type = action.type, id = action.id, data = action.data;
	switch (type) {
		case "INIT":
			var _extends2;
			return _extends({}, state, (_extends2 = {}, _extends2[id] = _extends({}, EMPTY_CHARACTER_STATE, data), _extends2));
		case "REMOVE": return _objectWithoutPropertiesLoose(state, [id].map(_toPropertyKey));
		case "UPDATE":
			var _extends3;
			var prev = state[id];
			if (!prev) return state;
			if (!Object.keys(data).some(function(k) {
				return prev[k] !== data[k];
			})) return state;
			return _extends({}, state, (_extends3 = {}, _extends3[id] = _extends({}, prev, data), _extends3));
		default: return state;
	}
};
var _createContainer$2 = createContainer(function() {
	return (0, import_react.useReducer)(reducer$2, {});
});
var CharacterStateProviderBase = _createContainer$2.Provider;
_createContainer$2.useTrackedState;
var useCharacterSelector = _createContainer$2.useSelector;
var useCharacterDispatch = _createContainer$2.useUpdate;
var CharacterStateProvider = function CharacterStateProvider(_ref) {
	var children = _ref.children;
	return /*#__PURE__*/ import_react.createElement(CharacterStateProviderBase, null, children);
};
var version = "1.0.0";
var StateRefSync = function StateRefSync(_ref) {
	var stateRef = _ref.stateRef;
	stateRef.current = useMeetingSelector(function(s) {
		return s;
	});
	return null;
};
var ParticipantStateRefSync = function ParticipantStateRefSync(_ref2) {
	var stateRef = _ref2.stateRef;
	stateRef.current = useParticipantSelector(function(s) {
		return s;
	});
	return null;
};
var CharacterStateRefSync = function CharacterStateRefSync(_ref3) {
	var stateRef = _ref3.stateRef;
	stateRef.current = useCharacterSelector(function(s) {
		return s;
	});
	return null;
};
var MeetingProviderInner = function MeetingProviderInner(_ref4) {
	var children = _ref4.children, config = _ref4.config, token = _ref4.token, joinWithoutUserInteraction = _ref4.joinWithoutUserInteraction, _reinitialiseMeetingOnConfigChange = _ref4.reinitialiseMeetingOnConfigChange, deviceInfo = _ref4.deviceInfo, keyProvider = _ref4.keyProvider, stateRef = _ref4.stateRef;
	var configRef_ = (0, import_react.useRef)(config);
	var tokenRef = (0, import_react.useRef)(token);
	var keyProviderRef = (0, import_react.useRef)(keyProvider);
	var deviceInfoRef = (0, import_react.useRef)(deviceInfo);
	var joinedOnFirstRender = (0, import_react.useRef)(false);
	var reinitialiseMeetingOnConfigChange = (0, import_react.useRef)(_reinitialiseMeetingOnConfigChange).current;
	configRef_.current = config;
	tokenRef.current = token;
	keyProviderRef.current = keyProvider;
	deviceInfoRef.current = deviceInfo;
	var dispatch = useMeetingDispatch();
	var pDispatch = useParticipantDispatch();
	var cDispatch = useCharacterDispatch();
	var prevActiveSpeakerRef = (0, import_react.useRef)(null);
	var prevMainParticipantRef = (0, import_react.useRef)(null);
	var participantListenersRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	var characterListenersRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	var _attachParticipantListeners = (0, import_react.useCallback)(function(participant, isLocal) {
		var _participant$micOn, _participant$webcamOn, _participant$screenSh, _participant$screenSh2, _participant$agentSta, _participant$streams;
		var pid = participant.id;
		pDispatch({
			type: "INIT",
			id: pid,
			data: {
				participant,
				displayName: participant.displayName,
				metaData: participant.metaData,
				micOn: (_participant$micOn = participant.micOn) != null ? _participant$micOn : false,
				webcamOn: (_participant$webcamOn = participant.webcamOn) != null ? _participant$webcamOn : false,
				screenShareOn: (_participant$screenSh = participant.screenShareOn) != null ? _participant$screenSh : false,
				screenShareAudioOn: (_participant$screenSh2 = participant.screenShareAudioOn) != null ? _participant$screenSh2 : false,
				mode: participant.mode,
				isLocal: !!isLocal,
				isAgent: !!participant.isAgent,
				agentId: participant.agentId,
				agentState: (_participant$agentSta = participant.agentState) != null ? _participant$agentSta : null,
				id: pid
			}
		});
		var streamKeyMap = {
			video: "webcamStream",
			audio: "micStream",
			share: "screenShareStream",
			shareAudio: "screenShareAudioStream"
		};
		var mediaKeyMap = {
			audio: "micOn",
			video: "webcamOn",
			share: "screenShareOn",
			shareAudio: "screenShareAudioOn"
		};
		(_participant$streams = participant.streams) === null || _participant$streams === void 0 || _participant$streams.forEach(function(stream) {
			var _extends2, _ref5;
			if (stream.track.readyState !== "live") return;
			var key = streamKeyMap[stream.kind];
			var onKey = mediaKeyMap[stream.kind];
			if (key) pDispatch({
				type: "UPDATE",
				id: pid,
				data: _extends((_extends2 = {}, _extends2[key] = stream, _extends2), onKey ? (_ref5 = {}, _ref5[onKey] = true, _ref5) : {})
			});
		});
		var onStreamEnabled = function onStreamEnabled(stream) {
			var _extends3, _ref6;
			if (stream.track.readyState !== "live") return;
			var key = streamKeyMap[stream.kind];
			var onKey = mediaKeyMap[stream.kind];
			if (key) pDispatch({
				type: "UPDATE",
				id: pid,
				data: _extends((_extends3 = {}, _extends3[key] = stream, _extends3), onKey ? (_ref6 = {}, _ref6[onKey] = true, _ref6) : {})
			});
			eventEmitter.emit(events["participant-stream-enabled"] + "-" + pid, stream);
		};
		var onStreamDisabled = function onStreamDisabled(stream) {
			var _extends4, _ref7;
			var key = streamKeyMap[stream.kind];
			var onKey = mediaKeyMap[stream.kind];
			if (key) pDispatch({
				type: "UPDATE",
				id: pid,
				data: _extends((_extends4 = {}, _extends4[key] = null, _extends4), onKey ? (_ref7 = {}, _ref7[onKey] = false, _ref7) : {})
			});
			eventEmitter.emit(events["participant-stream-disabled"] + "-" + pid, stream);
		};
		var onMediaStatusChanged = function onMediaStatusChanged(data) {
			var _data;
			var key = mediaKeyMap[data.kind];
			if (key) pDispatch({
				type: "UPDATE",
				id: pid,
				data: (_data = {}, _data[key] = data.newStatus, _data)
			});
			eventEmitter.emit(events["participant-media-status-changed"] + "-" + pid, data);
		};
		var onVideoQualityChanged = function onVideoQualityChanged(data) {
			eventEmitter.emit(events["participant-video-quality-changed"] + "-" + pid, data);
		};
		var onStreamPaused = function onStreamPaused(data) {
			eventEmitter.emit(events["participant-stream-paused"] + "-" + pid, data);
		};
		var onStreamResumed = function onStreamResumed(data) {
			eventEmitter.emit(events["participant-stream-resumed"] + "-" + pid, data);
		};
		var onProducerAdded = function onProducerAdded(data) {
			eventEmitter.emit(events["participant-producer-added"] + "-" + pid, data);
		};
		var onProducerRemoved = function onProducerRemoved(data) {
			eventEmitter.emit(events["participant-producer-removed"] + "-" + pid, data);
		};
		var onConsumerAdded = function onConsumerAdded(data) {
			eventEmitter.emit(events["participant-consumer-added"] + "-" + pid, data);
		};
		var onConsumerRemoved = function onConsumerRemoved(data) {
			eventEmitter.emit(events["participant-consumer-removed"] + "-" + pid, data);
		};
		var onAgentStateChanged = function onAgentStateChanged(s) {
			pDispatch({
				type: "UPDATE",
				id: pid,
				data: { agentState: s }
			});
			eventEmitter.emit(events["agent-state-changed"] + "-" + pid, s);
		};
		var onAgentTranscriptionReceived = function onAgentTranscriptionReceived(data) {
			eventEmitter.emit(events["agent-transcription-received"] + "-" + pid, data);
		};
		var onAgentMetrics = function onAgentMetrics(data) {
			eventEmitter.emit(events["agent-metrics"] + "-" + pid, data);
		};
		participant.on("stream-enabled", onStreamEnabled);
		participant.on("stream-disabled", onStreamDisabled);
		participant.on("media-status-changed", onMediaStatusChanged);
		participant.on("video-quality-changed", onVideoQualityChanged);
		participant.on("stream-paused", onStreamPaused);
		participant.on("stream-resumed", onStreamResumed);
		participant.on("producer-added", onProducerAdded);
		participant.on("producer-removed", onProducerRemoved);
		participant.on("consumer-added", onConsumerAdded);
		participant.on("consumer-removed", onConsumerRemoved);
		if (participant.isAgent) {
			participant.on("agent-state-changed", onAgentStateChanged);
			participant.on("agent-transcription-received", onAgentTranscriptionReceived);
			participant.on("agent-metrics", onAgentMetrics);
		}
		participantListenersRef.current.set(pid, {
			participant,
			onStreamEnabled,
			onStreamDisabled,
			onMediaStatusChanged,
			onVideoQualityChanged,
			onStreamPaused,
			onStreamResumed,
			onProducerAdded,
			onProducerRemoved,
			onConsumerAdded,
			onConsumerRemoved,
			onAgentStateChanged,
			onAgentTranscriptionReceived,
			onAgentMetrics
		});
	}, [pDispatch]);
	var _detachParticipantListeners = (0, import_react.useCallback)(function(pid) {
		var entry = participantListenersRef.current.get(pid);
		if (!entry) return;
		var p = entry.participant;
		p.off("stream-enabled", entry.onStreamEnabled);
		p.off("stream-disabled", entry.onStreamDisabled);
		p.off("media-status-changed", entry.onMediaStatusChanged);
		p.off("video-quality-changed", entry.onVideoQualityChanged);
		p.off("stream-paused", entry.onStreamPaused);
		p.off("stream-resumed", entry.onStreamResumed);
		p.off("producer-added", entry.onProducerAdded);
		p.off("producer-removed", entry.onProducerRemoved);
		p.off("consumer-added", entry.onConsumerAdded);
		p.off("consumer-removed", entry.onConsumerRemoved);
		if (p.isAgent) {
			p.off("agent-state-changed", entry.onAgentStateChanged);
			p.off("agent-transcription-received", entry.onAgentTranscriptionReceived);
			p.off("agent-metrics", entry.onAgentMetrics);
		}
		participantListenersRef.current["delete"](pid);
	}, []);
	var _attachCharacterListeners = (0, import_react.useCallback)(function(character) {
		var _character$characterS, _character$micOn, _character$webcamOn, _character$streams;
		var cid = character.id;
		cDispatch({
			type: "INIT",
			id: cid,
			data: {
				character,
				displayName: character.displayName,
				interactionId: character.interactionId,
				id: cid,
				characterMode: character.characterMode,
				characterRole: character.characterRole,
				characterState: (_character$characterS = character.characterState) != null ? _character$characterS : null,
				knowledgeBases: character.knowledgeBases,
				language: character.language,
				metaData: character.metaData,
				micOn: (_character$micOn = character.micOn) != null ? _character$micOn : false,
				webcamOn: (_character$webcamOn = character.webcamOn) != null ? _character$webcamOn : false
			}
		});
		(_character$streams = character.streams) === null || _character$streams === void 0 || _character$streams.forEach(function(stream) {
			var _data2;
			if (stream.track.readyState !== "live") return;
			var key = {
				video: "webcamStream",
				audio: "micStream"
			}[stream.kind];
			if (key) cDispatch({
				type: "UPDATE",
				id: cid,
				data: (_data2 = {}, _data2[key] = stream, _data2)
			});
		});
		var streamKeyMap = {
			video: "webcamStream",
			audio: "micStream"
		};
		var mediaKeyMap = {
			audio: "micOn",
			video: "webcamOn"
		};
		var onStreamEnabled = function onStreamEnabled(stream) {
			var _data3;
			if (stream.track.readyState !== "live") return;
			var key = streamKeyMap[stream.kind];
			if (key) cDispatch({
				type: "UPDATE",
				id: cid,
				data: (_data3 = {}, _data3[key] = stream, _data3)
			});
			eventEmitter.emit(events["participant-stream-enabled"] + "-" + cid, stream);
		};
		var onStreamDisabled = function onStreamDisabled(stream) {
			var _data4;
			var key = streamKeyMap[stream.kind];
			if (key) cDispatch({
				type: "UPDATE",
				id: cid,
				data: (_data4 = {}, _data4[key] = null, _data4)
			});
			eventEmitter.emit(events["participant-stream-disabled"] + "-" + cid, stream);
		};
		var onMediaStatusChanged = function onMediaStatusChanged(data) {
			var _data5;
			var key = mediaKeyMap[data.kind];
			if (key) cDispatch({
				type: "UPDATE",
				id: cid,
				data: (_data5 = {}, _data5[key] = data.newStatus, _data5)
			});
			eventEmitter.emit(events["participant-media-status-changed"] + "-" + cid, data);
		};
		var onVideoQualityChanged = function onVideoQualityChanged(data) {
			eventEmitter.emit(events["participant-video-quality-changed"] + "-" + cid, data);
		};
		var onCharacterStateChanged = function onCharacterStateChanged(d) {
			var _d$status;
			cDispatch({
				type: "UPDATE",
				id: cid,
				data: { characterState: (_d$status = d === null || d === void 0 ? void 0 : d.status) != null ? _d$status : d }
			});
			eventEmitter.emit(events["character-state-changed"] + "-" + cid, d);
		};
		var onCharacterMessage = function onCharacterMessage(d) {
			eventEmitter.emit(events["character-message"] + "-" + cid, d);
		};
		var onUserMessage = function onUserMessage(d) {
			eventEmitter.emit(events["user-message"] + "-" + cid, d);
		};
		var onData = function onData(topic, d) {
			eventEmitter.emit(events["character-data"] + "-" + cid, topic, d);
		};
		var onError = function onError(d) {
			eventEmitter.emit(events["character-error"] + "-" + cid, d);
		};
		var onCharacterJoinedInstance = function onCharacterJoinedInstance() {
			eventEmitter.emit(events["character-joined"] + "-" + cid);
		};
		var onCharacterLeftInstance = function onCharacterLeftInstance() {
			eventEmitter.emit(events["character-left"] + "-" + cid);
		};
		character.on("stream-enabled", onStreamEnabled);
		character.on("stream-disabled", onStreamDisabled);
		character.on("media-status-changed", onMediaStatusChanged);
		character.on("video-quality-changed", onVideoQualityChanged);
		character.on("character-state-changed", onCharacterStateChanged);
		character.on("character-message", onCharacterMessage);
		character.on("user-message", onUserMessage);
		character.on("data", onData);
		character.on("error", onError);
		character.on("character-joined", onCharacterJoinedInstance);
		character.on("character-left", onCharacterLeftInstance);
		characterListenersRef.current.set(cid, {
			character,
			onStreamEnabled,
			onStreamDisabled,
			onMediaStatusChanged,
			onVideoQualityChanged,
			onCharacterStateChanged,
			onCharacterMessage,
			onUserMessage,
			onData,
			onError,
			onCharacterJoinedInstance,
			onCharacterLeftInstance
		});
	}, [cDispatch]);
	var _detachCharacterListeners = (0, import_react.useCallback)(function(cid) {
		var entry = characterListenersRef.current.get(cid);
		if (!entry) return;
		var c = entry.character;
		c.off("stream-enabled", entry.onStreamEnabled);
		c.off("stream-disabled", entry.onStreamDisabled);
		c.off("media-status-changed", entry.onMediaStatusChanged);
		c.off("video-quality-changed", entry.onVideoQualityChanged);
		c.off("character-state-changed", entry.onCharacterStateChanged);
		c.off("character-message", entry.onCharacterMessage);
		c.off("user-message", entry.onUserMessage);
		c.off("data", entry.onData);
		c.off("error", entry.onError);
		c.off("character-joined", entry.onCharacterJoinedInstance);
		c.off("character-left", entry.onCharacterLeftInstance);
		characterListenersRef.current["delete"](cid);
	}, []);
	var _handle_participant_joined = (0, import_react.useCallback)(function(participant) {
		dispatch(function(prev) {
			var next = new Map(prev.participants);
			next.set(participant.id, participant);
			return { participants: next };
		});
		_attachParticipantListeners(participant, false);
		eventEmitter.emit(events["participant-joined"], participant);
	}, [dispatch, _attachParticipantListeners]);
	var _handle_participant_left = (0, import_react.useCallback)(function(participant, reason) {
		_detachParticipantListeners(participant.id);
		pDispatch({
			type: "REMOVE",
			id: participant.id
		});
		dispatch(function(prev) {
			var next = new Map(prev.participants);
			next["delete"](participant.id);
			return { participants: next };
		});
		eventEmitter.emit(events["participant-left"], participant, reason);
	}, [
		dispatch,
		pDispatch,
		_detachParticipantListeners
	]);
	var _handle_presenter_changed = (0, import_react.useCallback)(function(presenterId) {
		dispatch(function(prev) {
			var _prev$meeting, _prev$meeting$localPa;
			return {
				presenterId,
				localScreenShareOn: presenterId === ((_prev$meeting = prev.meeting) === null || _prev$meeting === void 0 ? void 0 : (_prev$meeting$localPa = _prev$meeting.localParticipant) === null || _prev$meeting$localPa === void 0 ? void 0 : _prev$meeting$localPa.id)
			};
		});
		eventEmitter.emit(events["presenter-changed"], presenterId);
	}, [dispatch]);
	var _handle_main_participant_changed = (0, import_react.useCallback)(function(participant) {
		dispatch({ mainParticipant: participant });
		var prev = prevMainParticipantRef.current;
		if (prev) pDispatch({
			type: "UPDATE",
			id: prev,
			data: { isMainParticipant: false }
		});
		if (participant !== null && participant !== void 0 && participant.id) pDispatch({
			type: "UPDATE",
			id: participant.id,
			data: { isMainParticipant: true }
		});
		prevMainParticipantRef.current = participant === null || participant === void 0 ? void 0 : participant.id;
		eventEmitter.emit(events["main-participant-changed"], participant);
	}, [dispatch, pDispatch]);
	var _handle_speaker_changed = (0, import_react.useCallback)(function(activeSpeakerId) {
		dispatch({ activeSpeakerId });
		var prev = prevActiveSpeakerRef.current;
		if (prev) {
			pDispatch({
				type: "UPDATE",
				id: prev,
				data: { isActiveSpeaker: false }
			});
			cDispatch({
				type: "UPDATE",
				id: prev,
				data: { isActiveSpeaker: false }
			});
		}
		if (activeSpeakerId) {
			pDispatch({
				type: "UPDATE",
				id: activeSpeakerId,
				data: { isActiveSpeaker: true }
			});
			cDispatch({
				type: "UPDATE",
				id: activeSpeakerId,
				data: { isActiveSpeaker: true }
			});
		}
		prevActiveSpeakerRef.current = activeSpeakerId;
		eventEmitter.emit(events["speaker-changed"], activeSpeakerId);
	}, [
		dispatch,
		pDispatch,
		cDispatch
	]);
	var _handle_chat_message = (0, import_react.useCallback)(function(data) {
		dispatch(function(prev) {
			return { messages: [].concat(prev.messages, [data]) };
		});
		eventEmitter.emit(events["data"], data);
	}, [dispatch]);
	var _handle_entry_requested = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["entry-requested"], data);
	}, []);
	var _handle_entry_responded = (0, import_react.useCallback)(function(id, d) {
		eventEmitter.emit(events["entry-responded"], id, d);
	}, []);
	var _handle_webcam_requested = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["webcam-requested"], data);
	}, []);
	var _handle_mic_requested = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["mic-requested"], data);
	}, []);
	var _handle_switch_meeting = (0, import_react.useCallback)(function(d) {
		eventEmitter.emit(events["switch-meeting"], d);
	}, []);
	var _handle_error = (0, import_react.useCallback)(function(d) {
		eventEmitter.emit(events["error"], d);
	}, []);
	var _handle_streams_paused = (0, import_react.useCallback)(function(_ref8) {
		var kind = _ref8.kind;
		eventEmitter.emit(events["paused-all-streams"], { kind });
	}, []);
	var _handle_streams_resumed = (0, import_react.useCallback)(function(_ref9) {
		var kind = _ref9.kind;
		eventEmitter.emit(events["resumed-all-streams"], { kind });
	}, []);
	var _handle_whiteboard_started = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["whiteboard-started"], data);
	}, []);
	var _handle_whiteboard_stopped = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["whiteboard-stopped"], data);
	}, []);
	var _handle_transcription_text = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["transcription-text"], data);
	}, []);
	var _handle_translation_text = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["translation-text"], data);
	}, []);
	var _handle_translation_language_changed = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["translation-language-changed"], data);
	}, []);
	var _handle_media_relay_started = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["media-relay-started"], data);
	}, []);
	var _handle_media_relay_stopped = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["media-relay-stopped"], data);
	}, []);
	var _handle_media_relay_error = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["media-relay-error"], data);
	}, []);
	var _handle_media_relay_request_response = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["media-relay-request-response"], data);
	}, []);
	var _handle_media_relay_request_received = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["media-relay-request-received"], data);
	}, []);
	var _handle_quality_limitation_received = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["quality-limitation"], data);
	}, []);
	var _handle_audio_input_silence = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["audio-input-silence"], data);
	}, []);
	var _handle_codec_changed = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["codec-changed"], data);
	}, []);
	var _handle_recording_started = (0, import_react.useCallback)(function() {
		dispatch({ isRecording: true });
		eventEmitter.emit(events["recording-started"]);
	}, [dispatch]);
	var _handle_recording_stopped = (0, import_react.useCallback)(function() {
		dispatch({ isRecording: false });
		eventEmitter.emit(events["recording-stopped"]);
	}, [dispatch]);
	var _handle_localParticipant_stream_enabled = (0, import_react.useCallback)(function(stream) {
		if (stream.track.readyState === "live") {
			if (stream.kind === "video") dispatch({ localWebcamOn: true });
			else if (stream.kind === "audio") dispatch({ localMicOn: true });
		}
	}, [dispatch]);
	var _handle_localParticipant_stream_disabled = (0, import_react.useCallback)(function(stream) {
		if (stream.kind === "video") dispatch({ localWebcamOn: false });
		else if (stream.kind === "audio") dispatch({ localMicOn: false });
	}, [dispatch]);
	var _handle_live_stream_started = (0, import_react.useCallback)(function(data) {
		dispatch({ isLiveStreaming: true });
		eventEmitter.emit(events["live-stream-started"], data);
	}, [dispatch]);
	var _handle_live_stream_stopped = (0, import_react.useCallback)(function() {
		dispatch({ isLiveStreaming: false });
		eventEmitter.emit(events["live-stream-stopped"]);
	}, [dispatch]);
	var _handle_hls_started = (0, import_react.useCallback)(function(data) {
		dispatch({ isHls: true });
		eventEmitter.emit(events["hls-started"], data);
	}, [dispatch]);
	var _handle_hls_stopped = (0, import_react.useCallback)(function() {
		dispatch({ isHls: false });
		eventEmitter.emit(events["hls-stopped"]);
	}, [dispatch]);
	var _handle_meeting_joined = (0, import_react.useCallback)(function(data) {
		if (data.switchRoomId) dispatch(function(prev) {
			return { messages: [].concat(prev.messages, data.messages) };
		});
		else {
			joinedOnFirstRender.current = true;
			dispatch(function(prev) {
				return {
					messages: [].concat(prev.messages, data.messages),
					isMeetingJoined: true
				};
			});
		}
		eventEmitter.emit(events["meeting-joined"], data);
	}, [dispatch]);
	var _handle_pin_state_changed = (0, import_react.useCallback)(function(_ref10) {
		var participantId = _ref10.participantId, state = _ref10.state, pinnedBy = _ref10.pinnedBy;
		dispatch(function(prev) {
			var next = new Map(prev.pinnedParticipants);
			if (!state.cam && !state.share) next["delete"](participantId);
			else next.set(participantId, state);
			return { pinnedParticipants: next };
		});
		pDispatch({
			type: "UPDATE",
			id: participantId,
			data: { pinState: !state.cam && !state.share ? {
				cam: false,
				share: false
			} : state }
		});
		eventEmitter.emit(events["pin-state-changed"], {
			participantId,
			state,
			pinnedBy
		});
	}, [dispatch, pDispatch]);
	var _handle_connection_open = (0, import_react.useCallback)(function(connection) {
		dispatch(function(prev) {
			var next = new Map(prev.connections);
			next.set(connection.id, connection);
			return { connections: next };
		});
		eventEmitter.emit(events["connection-open"], connection);
	}, [dispatch]);
	var _handle_connection_close = (0, import_react.useCallback)(function(connectionId) {
		dispatch(function(prev) {
			var next = new Map(prev.connections);
			next["delete"](connectionId);
			return { connections: next };
		});
		eventEmitter.emit(events["connection-close"], connectionId);
	}, [dispatch]);
	var _handle_recording_state_changed = (0, import_react.useCallback)(function(data) {
		dispatch({ recordingState: data === null || data === void 0 ? void 0 : data.status });
		eventEmitter.emit(events["recording-state-changed"], data);
	}, [dispatch]);
	var _handle_livestream_state_changed = (0, import_react.useCallback)(function(data) {
		dispatch({ livestreamState: data === null || data === void 0 ? void 0 : data.status });
		eventEmitter.emit(events["livestream-state-changed"], data);
	}, [dispatch]);
	var _handle_hls_state_changed = (0, import_react.useCallback)(function(data) {
		var patch = { hlsState: data === null || data === void 0 ? void 0 : data.status };
		if ((data === null || data === void 0 ? void 0 : data.status) === "HLS_PLAYABLE") patch.hlsUrls = {
			downstreamUrl: data.downstreamUrl,
			playbackHlsUrl: data.playbackHlsUrl,
			livestreamUrl: data.livestreamUrl
		};
		else if ((data === null || data === void 0 ? void 0 : data.status) === "HLS_STOPPED") patch.hlsUrls = {
			downstreamUrl: null,
			playbackHlsUrl: null,
			livestreamUrl: null
		};
		dispatch(patch);
		eventEmitter.emit(events["hls-state-changed"], data);
	}, [dispatch]);
	var _handle_meeting_state_changed = (0, import_react.useCallback)(function(data) {
		if ((data === null || data === void 0 ? void 0 : data.state) === "RECONNECTING") dispatch({ isMeetingJoined: false });
		eventEmitter.emit(events["meeting-state-changed"], data);
	}, [dispatch]);
	var _handle_socket_state_changed = (0, import_react.useCallback)(function(data) {
		if ((data === null || data === void 0 ? void 0 : data.state) === "SOCKET_DISCONNECTED") dispatch({ isMeetingJoined: false });
	}, [dispatch]);
	var _handle_transcription_state_changed = (0, import_react.useCallback)(function(data) {
		dispatch({ transcriptionState: data === null || data === void 0 ? void 0 : data.status });
		eventEmitter.emit(events["transcription-state-changed"], data);
	}, [dispatch]);
	var _handle_translation_state_changed = (0, import_react.useCallback)(function(data) {
		dispatch({ translationState: data === null || data === void 0 ? void 0 : data.status });
		eventEmitter.emit(events["translation-state-changed"], data);
	}, [dispatch]);
	var _handle_participant_mode_changed = (0, import_react.useCallback)(function(data) {
		pDispatch({
			type: "UPDATE",
			id: data.participantId,
			data: { mode: data.mode }
		});
		eventEmitter.emit(events["participant-mode-changed"], data);
	}, [pDispatch]);
	var _handle_character_joined = (0, import_react.useCallback)(function(character) {
		dispatch(function(prev) {
			var next = new Map(prev.characters);
			next.set(character.id, character);
			return { characters: next };
		});
		_attachCharacterListeners(character);
		eventEmitter.emit(events["character-joined"], character);
	}, [dispatch, _attachCharacterListeners]);
	var _handle_character_left = (0, import_react.useCallback)(function(character) {
		_detachCharacterListeners(character.id);
		cDispatch({
			type: "REMOVE",
			id: character.id
		});
		dispatch(function(prev) {
			var next = new Map(prev.characters);
			next["delete"](character.id);
			return { characters: next };
		});
		eventEmitter.emit(events["character-left"], character);
	}, [
		dispatch,
		cDispatch,
		_detachCharacterListeners
	]);
	var handlersRef = (0, import_react.useRef)({});
	handlersRef.current = {
		_handle_meeting_state_changed,
		_handle_socket_state_changed,
		_handle_participant_joined,
		_handle_participant_left,
		_handle_presenter_changed,
		_handle_main_participant_changed,
		_handle_speaker_changed,
		_handle_entry_requested,
		_handle_entry_responded,
		_handle_chat_message,
		_handle_recording_started,
		_handle_recording_stopped,
		_handle_meeting_joined,
		_handle_live_stream_started,
		_handle_live_stream_stopped,
		_handle_webcam_requested,
		_handle_mic_requested,
		_handle_pin_state_changed,
		_handle_streams_paused,
		_handle_streams_resumed,
		_handle_connection_open,
		_handle_connection_close,
		_handle_switch_meeting,
		_handle_error,
		_handle_hls_started,
		_handle_hls_stopped,
		_handle_recording_state_changed,
		_handle_livestream_state_changed,
		_handle_hls_state_changed,
		_handle_participant_mode_changed,
		_handle_whiteboard_started,
		_handle_whiteboard_stopped,
		_handle_transcription_state_changed,
		_handle_transcription_text,
		_handle_translation_state_changed,
		_handle_translation_text,
		_handle_translation_language_changed,
		_handle_character_joined,
		_handle_character_left,
		_handle_media_relay_started,
		_handle_media_relay_stopped,
		_handle_media_relay_error,
		_handle_media_relay_request_response,
		_handle_media_relay_request_received,
		_handle_quality_limitation_received,
		_handle_audio_input_silence,
		_handle_codec_changed,
		_handle_localParticipant_stream_enabled,
		_handle_localParticipant_stream_disabled,
		_attachParticipantListeners,
		_attachCharacterListeners
	};
	var _handle_meeting_left = (0, import_react.useCallback)(function(data) {
		eventEmitter.emit(events["meeting-left"], data);
		var meeting = stateRef.current.meeting;
		var h = handlersRef.current;
		if (meeting && typeof meeting.off === "function") {
			var _meeting$localPartici, _meeting$localPartici2;
			meeting.off("meeting-state-changed", h._handle_meeting_state_changed);
			meeting.off("socket-state-changed", h._handle_socket_state_changed);
			meeting.off("participant-joined", h._handle_participant_joined);
			meeting.off("participant-left", h._handle_participant_left);
			meeting.off("presenter-changed", h._handle_presenter_changed);
			meeting.off("main-participant-changed", h._handle_main_participant_changed);
			meeting.off("speaker-changed", h._handle_speaker_changed);
			meeting.off("entry-requested", h._handle_entry_requested);
			meeting.off("entry-responded", h._handle_entry_responded);
			meeting.off("data", h._handle_chat_message);
			meeting.off("recording-started", h._handle_recording_started);
			meeting.off("recording-stopped", h._handle_recording_stopped);
			meeting.off("meeting-joined", h._handle_meeting_joined);
			meeting.off("meeting-left", h._handle_meeting_left);
			meeting.off("livestream-started", h._handle_live_stream_started);
			meeting.off("livestream-stopped", h._handle_live_stream_stopped);
			meeting.off("webcam-requested", h._handle_webcam_requested);
			meeting.off("mic-requested", h._handle_mic_requested);
			meeting.off("pin-state-changed", h._handle_pin_state_changed);
			meeting.off("paused-all-streams", h._handle_streams_paused);
			meeting.off("resumed-all-streams", h._handle_streams_resumed);
			meeting.off("connection-open", h._handle_connection_open);
			meeting.off("connection-close", h._handle_connection_close);
			meeting.off("switch-meeting", h._handle_switch_meeting);
			meeting.off("error", h._handle_error);
			meeting.off("hls-started", h._handle_hls_started);
			meeting.off("hls-stopped", h._handle_hls_stopped);
			meeting.off("recording-state-changed", h._handle_recording_state_changed);
			meeting.off("livestream-state-changed", h._handle_livestream_state_changed);
			meeting.off("hls-state-changed", h._handle_hls_state_changed);
			meeting.off("participant-mode-changed", h._handle_participant_mode_changed);
			meeting.off("whiteboard-stopped", h._handle_whiteboard_stopped);
			meeting.off("whiteboard-started", h._handle_whiteboard_started);
			meeting.off("transcription-state-changed", h._handle_transcription_state_changed);
			meeting.off("transcription-text", h._handle_transcription_text);
			meeting.off("translation-state-changed", h._handle_translation_state_changed);
			meeting.off("translation-text", h._handle_translation_text);
			meeting.off("translation-language-changed", h._handle_translation_language_changed);
			meeting.off("character-joined", h._handle_character_joined);
			meeting.off("character-left", h._handle_character_left);
			meeting.off("media-relay-started", h._handle_media_relay_started);
			meeting.off("media-relay-stopped", h._handle_media_relay_stopped);
			meeting.off("media-relay-error", h._handle_media_relay_error);
			meeting.off("media-relay-request-response", h._handle_media_relay_request_response);
			meeting.off("media-relay-request-received", h._handle_media_relay_request_received);
			meeting.off("quality-limitation", h._handle_quality_limitation_received);
			meeting.off("audio-input-silence", h._handle_audio_input_silence);
			meeting.off("codec-changed", h._handle_codec_changed);
			(_meeting$localPartici = meeting.localParticipant) === null || _meeting$localPartici === void 0 || _meeting$localPartici.off("stream-enabled", h._handle_localParticipant_stream_enabled);
			(_meeting$localPartici2 = meeting.localParticipant) === null || _meeting$localPartici2 === void 0 || _meeting$localPartici2.off("stream-disabled", h._handle_localParticipant_stream_disabled);
		}
		for (var _i = 0, _arr = [].concat(participantListenersRef.current.keys()); _i < _arr.length; _i++) {
			var pid = _arr[_i];
			_detachParticipantListeners(pid);
		}
		for (var _i2 = 0, _arr2 = [].concat(characterListenersRef.current.keys()); _i2 < _arr2.length; _i2++) {
			var cid = _arr2[_i2];
			_detachCharacterListeners(cid);
		}
		pDispatch("RESET");
		cDispatch("RESET");
		dispatch("RESET");
	}, [
		dispatch,
		pDispatch,
		cDispatch,
		_detachParticipantListeners,
		_detachCharacterListeners
	]);
	handlersRef.current._handle_meeting_left = _handle_meeting_left;
	var methods = (0, import_react.useMemo)(function() {
		return {
			join: function join() {
				if (stateRef.current.meeting) return stateRef.current.meeting.join();
				var m = import_videosdk.VideoSDK.initMeeting(configRef_.current);
				var localParticipant = m.localParticipant, participants = m.participants, characters = m.characters;
				participants.set(localParticipant.id, localParticipant);
				var initPatch = {
					meetingId: m.id,
					meeting: m,
					baseUrl: m.baseUrl,
					localParticipant,
					participants,
					characters,
					selectedCameraDevice: m.selectedCameraDevice,
					selectedMicrophoneDevice: m.selectedMicrophoneDevice
				};
				dispatch(initPatch);
				stateRef.current = _extends({}, stateRef.current, initPatch);
				var h = handlersRef.current;
				m.on("meeting-state-changed", h._handle_meeting_state_changed);
				m.on("socket-state-changed", h._handle_socket_state_changed);
				m.on("participant-joined", h._handle_participant_joined);
				m.on("participant-left", h._handle_participant_left);
				m.on("presenter-changed", h._handle_presenter_changed);
				m.on("main-participant-changed", h._handle_main_participant_changed);
				m.on("speaker-changed", h._handle_speaker_changed);
				m.on("entry-requested", h._handle_entry_requested);
				m.on("entry-responded", h._handle_entry_responded);
				m.on("data", h._handle_chat_message);
				m.on("recording-started", h._handle_recording_started);
				m.on("recording-stopped", h._handle_recording_stopped);
				m.on("meeting-joined", h._handle_meeting_joined);
				m.on("meeting-left", h._handle_meeting_left);
				m.on("livestream-started", h._handle_live_stream_started);
				m.on("livestream-stopped", h._handle_live_stream_stopped);
				m.on("webcam-requested", h._handle_webcam_requested);
				m.on("mic-requested", h._handle_mic_requested);
				m.on("pin-state-changed", h._handle_pin_state_changed);
				m.on("paused-all-streams", h._handle_streams_paused);
				m.on("resumed-all-streams", h._handle_streams_resumed);
				m.on("connection-open", h._handle_connection_open);
				m.on("connection-close", h._handle_connection_close);
				m.on("switch-meeting", h._handle_switch_meeting);
				m.on("error", h._handle_error);
				m.on("hls-started", h._handle_hls_started);
				m.on("hls-stopped", h._handle_hls_stopped);
				m.on("recording-state-changed", h._handle_recording_state_changed);
				m.on("livestream-state-changed", h._handle_livestream_state_changed);
				m.on("hls-state-changed", h._handle_hls_state_changed);
				m.on("participant-mode-changed", h._handle_participant_mode_changed);
				m.on("transcription-state-changed", h._handle_transcription_state_changed);
				m.on("transcription-text", h._handle_transcription_text);
				m.on("translation-state-changed", h._handle_translation_state_changed);
				m.on("translation-text", h._handle_translation_text);
				m.on("translation-language-changed", h._handle_translation_language_changed);
				m.on("whiteboard-started", h._handle_whiteboard_started);
				m.on("whiteboard-stopped", h._handle_whiteboard_stopped);
				m.on("character-joined", h._handle_character_joined);
				m.on("character-left", h._handle_character_left);
				m.on("media-relay-started", h._handle_media_relay_started);
				m.on("media-relay-stopped", h._handle_media_relay_stopped);
				m.on("media-relay-error", h._handle_media_relay_error);
				m.on("media-relay-request-response", h._handle_media_relay_request_response);
				m.on("media-relay-request-received", h._handle_media_relay_request_received);
				m.on("quality-limitation", h._handle_quality_limitation_received);
				m.on("audio-input-silence", h._handle_audio_input_silence);
				m.on("codec-changed", h._handle_codec_changed);
				m.localParticipant.on("stream-enabled", h._handle_localParticipant_stream_enabled);
				m.localParticipant.on("stream-disabled", h._handle_localParticipant_stream_disabled);
				h._attachParticipantListeners(m.localParticipant, true);
				return m.join();
			},
			leave: function leave() {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("leave");
				return meeting.leave();
			},
			end: function end() {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("end");
				return meeting.end();
			},
			muteMic: function muteMic() {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("muteMic");
				return meeting.muteMic();
			},
			unmuteMic: function unmuteMic(t) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("unmuteMic");
				return meeting.unmuteMic(t).then(function() {
					dispatch({ selectedMicrophoneDevice: meeting.selectedMicrophoneDevice });
				});
			},
			toggleMic: function toggleMic(t) {
				var _stateRef$current = stateRef.current, localMicOn = _stateRef$current.localMicOn, meeting = _stateRef$current.meeting;
				if (!meeting) return rejectNotJoined("toggleMic");
				if (localMicOn) return meeting.muteMic();
				return meeting.unmuteMic(t).then(function() {
					dispatch({ selectedMicrophoneDevice: meeting.selectedMicrophoneDevice });
				});
			},
			disableWebcam: function disableWebcam() {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("disableWebcam");
				return meeting.disableWebcam();
			},
			enableWebcam: function enableWebcam(t) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("enableWebcam");
				return meeting.enableWebcam(t).then(function() {
					dispatch({ selectedCameraDevice: meeting.selectedCameraDevice });
				});
			},
			toggleWebcam: function toggleWebcam(t) {
				var _stateRef$current2 = stateRef.current, localWebcamOn = _stateRef$current2.localWebcamOn, meeting = _stateRef$current2.meeting;
				if (!meeting) return rejectNotJoined("toggleWebcam");
				if (localWebcamOn) return meeting.disableWebcam();
				return meeting.enableWebcam(t).then(function() {
					dispatch({ selectedCameraDevice: meeting.selectedCameraDevice });
				});
			},
			disableScreenShare: function disableScreenShare() {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("disableScreenShare");
				return meeting.disableScreenShare();
			},
			enableScreenShare: function enableScreenShare(t) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("enableScreenShare");
				return meeting.enableScreenShare(t);
			},
			toggleScreenShare: function toggleScreenShare(t) {
				var _stateRef$current3 = stateRef.current, localScreenShareOn = _stateRef$current3.localScreenShareOn, meeting = _stateRef$current3.meeting;
				if (!meeting) return rejectNotJoined("toggleScreenShare");
				return localScreenShareOn ? meeting.disableScreenShare() : meeting.enableScreenShare(t);
			},
			pauseAllStreams: function pauseAllStreams(k) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("pauseAllStreams");
				return meeting.pauseAllStreams(k);
			},
			resumeAllStreams: function resumeAllStreams(k) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("resumeAllStreams");
				return meeting.resumeAllStreams(k);
			},
			startRecording: function startRecording(w, a, c, t) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("startRecording");
				return meeting.startRecording(w, a, c, t);
			},
			stopRecording: function stopRecording() {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("stopRecording");
				return meeting.stopRecording();
			},
			changeWebcam: function changeWebcam(obj) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("changeWebcam");
				return meeting.changeWebcam(obj).then(function() {
					dispatch({ selectedCameraDevice: meeting.selectedCameraDevice });
				});
			},
			changeMic: function changeMic(obj) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("changeMic");
				return meeting.changeMic(obj).then(function() {
					dispatch({ selectedMicrophoneDevice: meeting.selectedMicrophoneDevice });
				});
			},
			send: function send(p, o) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("send");
				return meeting.send(p, o);
			},
			respondEntry: function respondEntry(id, d) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("respondEntry");
				return meeting.respondEntry(id, d);
			},
			getMics: function getMics() {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("getMics");
				return meeting.getMics();
			},
			getWebcams: function getWebcams() {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("getWebcams");
				return meeting.getWebcams();
			},
			replaceWebcamStream: function replaceWebcamStream(s) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("replaceWebcamStream");
				return meeting.replaceWebcamStream(s);
			},
			switchTo: function switchTo(_ref11) {
				var meetingId = _ref11.meetingId, token = _ref11.token;
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("switchTo");
				return meeting.switchTo({
					meetingId,
					token
				});
			},
			changeMode: function changeMode(mode) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("changeMode");
				return meeting.changeMode(mode);
			},
			startLivestream: function startLivestream(i, c) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("startLivestream");
				return meeting.startLivestream(i, c);
			},
			stopLivestream: function stopLivestream() {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("stopLivestream");
				return meeting.stopLivestream();
			},
			startHls: function startHls(c, t) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("startHls");
				return meeting.startHls(c, t);
			},
			stopHls: function stopHls() {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("stopHls");
				return meeting.stopHls();
			},
			enableAdaptiveSubscription: function enableAdaptiveSubscription() {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("enableAdaptiveSubscription");
				return meeting.enableAdaptiveSubscription();
			},
			disableAdaptiveSubscription: function disableAdaptiveSubscription() {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("disableAdaptiveSubscription");
				return meeting.disableAdaptiveSubscription();
			},
			requestMediaRelay: function requestMediaRelay(o) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("requestMediaRelay");
				return meeting.requestMediaRelay(o);
			},
			stopMediaRelay: function stopMediaRelay(id) {
				var meeting = stateRef.current.meeting;
				if (!meeting) return rejectNotJoined("stopMediaRelay");
				return meeting.stopMediaRelay(id);
			}
		};
	}, [dispatch]);
	var initSDK = (0, import_react.useCallback)(function() {
		import_videosdk.VideoSDK.config(tokenRef.current);
		keyProviderRef.current && import_videosdk.VideoSDK.setKeyProvider(keyProviderRef.current);
		import_videosdk.VideoSDK.analytics(deviceInfoRef.current || {
			sdkType: "react-web",
			sdkVersion: version
		});
		if (joinWithoutUserInteraction) methods.join();
	}, [methods, joinWithoutUserInteraction]);
	(0, import_react.useEffect)(function() {
		initSDK();
		return function() {
			for (var _i3 = 0, _arr3 = [].concat(participantListenersRef.current.keys()); _i3 < _arr3.length; _i3++) {
				var pid = _arr3[_i3];
				_detachParticipantListeners(pid);
			}
			for (var _i4 = 0, _arr4 = [].concat(characterListenersRef.current.keys()); _i4 < _arr4.length; _i4++) {
				var cid = _arr4[_i4];
				_detachCharacterListeners(cid);
			}
		};
	}, []);
	(0, import_react.useEffect)(function() {
		if (reinitialiseMeetingOnConfigChange && joinedOnFirstRender.current) {
			methods.leave();
			initSDK();
			if (!joinWithoutUserInteraction) methods.join();
		}
	}, [
		config.meetingId,
		token,
		reinitialiseMeetingOnConfigChange
	]);
	return /*#__PURE__*/ import_react.createElement(MeetingMethodsContext.Provider, { value: methods }, children);
};
var MeetingProvider = function MeetingProvider(props) {
	var localStateRef = (0, import_react.useRef)(_extends({}, INITIAL_STATE));
	var participantLiveStateRef = (0, import_react.useRef)({});
	var characterLiveStateRef = (0, import_react.useRef)({});
	return /*#__PURE__*/ import_react.createElement(MeetingLiveStateContext.Provider, { value: localStateRef }, /*#__PURE__*/ import_react.createElement(ParticipantLiveStateContext.Provider, { value: participantLiveStateRef }, /*#__PURE__*/ import_react.createElement(CharacterLiveStateContext.Provider, { value: characterLiveStateRef }, /*#__PURE__*/ import_react.createElement(MeetingStateProvider, null, /*#__PURE__*/ import_react.createElement(ParticipantStateProvider, null, /*#__PURE__*/ import_react.createElement(CharacterStateProvider, null, /*#__PURE__*/ import_react.createElement(StateRefSync, { stateRef: localStateRef }), /*#__PURE__*/ import_react.createElement(ParticipantStateRefSync, { stateRef: participantLiveStateRef }), /*#__PURE__*/ import_react.createElement(CharacterStateRefSync, { stateRef: characterLiveStateRef }), /*#__PURE__*/ import_react.createElement(MeetingProviderInner, _extends({}, props, { stateRef: localStateRef }))))))));
};
var NOOP$1 = function NOOP() {};
var useParticipant = function useParticipant(participantId, _temp) {
	var _ref = _temp === void 0 ? {} : _temp, _ref$onStreamEnabled = _ref.onStreamEnabled, onStreamEnabled = _ref$onStreamEnabled === void 0 ? NOOP$1 : _ref$onStreamEnabled, _ref$onStreamDisabled = _ref.onStreamDisabled, onStreamDisabled = _ref$onStreamDisabled === void 0 ? NOOP$1 : _ref$onStreamDisabled, _ref$onMediaStatusCha = _ref.onMediaStatusChanged, onMediaStatusChanged = _ref$onMediaStatusCha === void 0 ? NOOP$1 : _ref$onMediaStatusCha, _ref$onVideoQualityCh = _ref.onVideoQualityChanged, onVideoQualityChanged = _ref$onVideoQualityCh === void 0 ? NOOP$1 : _ref$onVideoQualityCh, _ref$onStreamPaused = _ref.onStreamPaused, onStreamPaused = _ref$onStreamPaused === void 0 ? NOOP$1 : _ref$onStreamPaused, _ref$onStreamResumed = _ref.onStreamResumed, onStreamResumed = _ref$onStreamResumed === void 0 ? NOOP$1 : _ref$onStreamResumed, _ref$onProducerAdded = _ref.onProducerAdded, onProducerAdded = _ref$onProducerAdded === void 0 ? NOOP$1 : _ref$onProducerAdded, _ref$onProducerRemove = _ref.onProducerRemoved, onProducerRemoved = _ref$onProducerRemove === void 0 ? NOOP$1 : _ref$onProducerRemove, _ref$onConsumerAdded = _ref.onConsumerAdded, onConsumerAdded = _ref$onConsumerAdded === void 0 ? NOOP$1 : _ref$onConsumerAdded, _ref$onConsumerRemove = _ref.onConsumerRemoved, onConsumerRemoved = _ref$onConsumerRemove === void 0 ? NOOP$1 : _ref$onConsumerRemove;
	var allState = useParticipantTrackedState();
	var liveStateRef = (0, import_react.useContext)(ParticipantLiveStateContext);
	var participant = useMeetingSelector((0, import_react.useCallback)(function(s) {
		var _s$participants;
		return (_s$participants = s.participants) === null || _s$participants === void 0 ? void 0 : _s$participants.get(participantId);
	}, [participantId]));
	var participantRef = (0, import_react.useRef)(participant);
	participantRef.current = participant;
	if (participant !== null && participant !== void 0 && participant.isAgent) throw new Error("useParticipant: \"" + participantId + "\" is an agent participant. Use useAgentParticipant() instead.");
	useStableEvent(events["participant-stream-enabled"] + "-" + participantId, onStreamEnabled);
	useStableEvent(events["participant-stream-disabled"] + "-" + participantId, onStreamDisabled);
	useStableEvent(events["participant-media-status-changed"] + "-" + participantId, onMediaStatusChanged);
	useStableEvent(events["participant-video-quality-changed"] + "-" + participantId, onVideoQualityChanged);
	useStableEvent(events["participant-stream-paused"] + "-" + participantId, onStreamPaused);
	useStableEvent(events["participant-stream-resumed"] + "-" + participantId, onStreamResumed);
	useStableEvent(events["participant-producer-added"] + "-" + participantId, onProducerAdded);
	useStableEvent(events["participant-producer-removed"] + "-" + participantId, onProducerRemoved);
	useStableEvent(events["participant-consumer-added"] + "-" + participantId, onConsumerAdded);
	useStableEvent(events["participant-consumer-removed"] + "-" + participantId, onConsumerRemoved);
	var setQuality = (0, import_react.useCallback)(function(q) {
		if (!participantRef.current) return rejectUnavailable("setQuality", "participant");
		return participantRef.current.setQuality(q);
	}, []);
	var setViewPort = (0, import_react.useCallback)(function(w, h) {
		var _participantRef$curre;
		return (_participantRef$curre = participantRef.current) === null || _participantRef$curre === void 0 ? void 0 : _participantRef$curre.setViewPort(w, h);
	}, []);
	var setScreenShareQuality = (0, import_react.useCallback)(function(q) {
		if (!participantRef.current) return rejectUnavailable("setScreenShareQuality", "participant");
		return participantRef.current.setScreenShareQuality(q);
	}, []);
	var enableMic = (0, import_react.useCallback)(function() {
		if (!participantRef.current) return rejectUnavailable("enableMic", "participant");
		return participantRef.current.enableMic();
	}, []);
	var disableMic = (0, import_react.useCallback)(function() {
		if (!participantRef.current) return rejectUnavailable("disableMic", "participant");
		return participantRef.current.disableMic();
	}, []);
	var enableWebcam = (0, import_react.useCallback)(function() {
		if (!participantRef.current) return rejectUnavailable("enableWebcam", "participant");
		return participantRef.current.enableWebcam();
	}, []);
	var disableWebcam = (0, import_react.useCallback)(function() {
		if (!participantRef.current) return rejectUnavailable("disableWebcam", "participant");
		return participantRef.current.disableWebcam();
	}, []);
	var pin = (0, import_react.useCallback)(function(d) {
		if (!participantRef.current) return rejectUnavailable("pin", "participant");
		return participantRef.current.pin(d);
	}, []);
	var unpin = (0, import_react.useCallback)(function(d) {
		if (!participantRef.current) return rejectUnavailable("unpin", "participant");
		return participantRef.current.unpin(d);
	}, []);
	var remove = (0, import_react.useCallback)(function() {
		if (!participantRef.current) return rejectUnavailable("remove", "participant");
		return participantRef.current.remove();
	}, []);
	var captureImage = (0, import_react.useCallback)(function(_temp2) {
		var _ref2 = _temp2 === void 0 ? {} : _temp2, height = _ref2.height, width = _ref2.width;
		if (!participantRef.current) return rejectUnavailable("captureImage", "participant");
		return participantRef.current.captureImage({
			height,
			width
		});
	}, []);
	var getAudioStats = (0, import_react.useCallback)(function() {
		var _participantRef$curre2;
		return (_participantRef$curre2 = participantRef.current) === null || _participantRef$curre2 === void 0 ? void 0 : _participantRef$curre2.getAudioStats();
	}, []);
	var getVideoStats = (0, import_react.useCallback)(function() {
		var _participantRef$curre3;
		return (_participantRef$curre3 = participantRef.current) === null || _participantRef$curre3 === void 0 ? void 0 : _participantRef$curre3.getVideoStats();
	}, []);
	var getTransportStats = (0, import_react.useCallback)(function() {
		var _participantRef$curre4;
		return (_participantRef$curre4 = participantRef.current) === null || _participantRef$curre4 === void 0 ? void 0 : _participantRef$curre4.getTransportStats();
	}, []);
	var getShareStats = (0, import_react.useCallback)(function() {
		var _participantRef$curre5;
		return (_participantRef$curre5 = participantRef.current) === null || _participantRef$curre5 === void 0 ? void 0 : _participantRef$curre5.getShareStats();
	}, []);
	var getShareAudioStats = (0, import_react.useCallback)(function() {
		var _participantRef$curre6;
		return (_participantRef$curre6 = participantRef.current) === null || _participantRef$curre6 === void 0 ? void 0 : _participantRef$curre6.getShareAudioStats();
	}, []);
	var consumeWebcamStreams = (0, import_react.useCallback)(function() {
		if (!participantRef.current) return rejectUnavailable("consumeWebcamStreams", "participant");
		return participantRef.current.consumeWebcamStreams();
	}, []);
	var consumeMicStreams = (0, import_react.useCallback)(function() {
		if (!participantRef.current) return rejectUnavailable("consumeMicStreams", "participant");
		return participantRef.current.consumeMicStreams();
	}, []);
	var stopConsumingWebcamStreams = (0, import_react.useCallback)(function() {
		if (!participantRef.current) return rejectUnavailable("stopConsumingWebcamStreams", "participant");
		return participantRef.current.stopConsumingWebcamStreams();
	}, []);
	var stopConsumingMicStreams = (0, import_react.useCallback)(function() {
		if (!participantRef.current) return rejectUnavailable("stopConsumingMicStreams", "participant");
		return participantRef.current.stopConsumingMicStreams();
	}, []);
	var methodsRef = (0, import_react.useRef)(null);
	methodsRef.current = {
		consumeMicStreams,
		consumeWebcamStreams,
		stopConsumingMicStreams,
		stopConsumingWebcamStreams,
		setQuality,
		setScreenShareQuality,
		setViewPort,
		enableMic,
		disableMic,
		enableWebcam,
		disableWebcam,
		captureImage,
		pin,
		unpin,
		remove,
		getAudioStats,
		getVideoStats,
		getShareStats,
		getShareAudioStats,
		getTransportStats
	};
	return (0, import_react.useMemo)(function() {
		return new Proxy(allState, {
			get: function get(target, prop, receiver) {
				if (prop in PARTICIPANT_STATE_KEYS) {
					var pState = target[participantId];
					var trackedValue = pState ? pState[prop] : EMPTY_PARTICIPANT_STATE[prop];
					var live = liveStateRef && liveStateRef.current;
					var livePState = live ? live[participantId] : null;
					return livePState ? livePState[prop] : trackedValue;
				}
				var m = methodsRef.current;
				if (m && prop in m) {
					if (!participantRef.current) return function() {
						console.warn("useParticipant: " + String(prop) + "() called but participant \"" + participantId + "\" not found.");
					};
					return m[prop];
				}
				return Reflect.get(target, prop, receiver);
			},
			has: function has(target, prop) {
				return prop in PARTICIPANT_STATE_KEYS || !!(methodsRef.current && prop in methodsRef.current);
			},
			ownKeys: function ownKeys() {
				var _methodsRef$current;
				var stateKeys = Object.keys(PARTICIPANT_STATE_KEYS);
				var mKeys = Object.keys((_methodsRef$current = methodsRef.current) != null ? _methodsRef$current : {});
				return [].concat(new Set([].concat(stateKeys, mKeys)));
			},
			getOwnPropertyDescriptor: function getOwnPropertyDescriptor() {
				return {
					configurable: true,
					enumerable: true,
					writable: false
				};
			}
		});
	}, [
		allState,
		participantId,
		liveStateRef
	]);
};
import_videosdk.VideoSDK.Constants;
import_videosdk.VideoSDK.runPreCallTest.bind(import_videosdk.VideoSDK);
(0, import_react.forwardRef)(function(_ref4, ref) {
	var participantId = _ref4.participantId, _ref4$type = _ref4.type, type = _ref4$type === void 0 ? "video" : _ref4$type, _ref4$containerStyle = _ref4.containerStyle, containerStyle = _ref4$containerStyle === void 0 ? {} : _ref4$containerStyle, _ref4$className = _ref4.className, className = _ref4$className === void 0 ? "" : _ref4$className, _ref4$classNameVideo = _ref4.classNameVideo, classNameVideo = _ref4$classNameVideo === void 0 ? "" : _ref4$classNameVideo, _ref4$videoStyle = _ref4.videoStyle, videoStyle = _ref4$videoStyle === void 0 ? {} : _ref4$videoStyle, videoRef = _ref4.videoRef;
	var _useParticipant2 = useParticipant(participantId), webcamOn = _useParticipant2.webcamOn, webcamStream = _useParticipant2.webcamStream, isLocal = _useParticipant2.isLocal, screenShareStream = _useParticipant2.screenShareStream, screenShareOn = _useParticipant2.screenShareOn;
	var internalRef = (0, import_react.useRef)(null);
	var finalVideoRef = videoRef || internalRef;
	(0, import_react.useEffect)(function() {
		var stream = type === "share" ? screenShareStream : webcamStream;
		var isOn = type === "share" ? screenShareOn : webcamOn;
		if (finalVideoRef.current) if (isOn && stream) {
			var mediaStream = new MediaStream();
			mediaStream.addTrack(stream.track);
			finalVideoRef.current.setAttribute("muted", "");
			finalVideoRef.current.srcObject = mediaStream;
			finalVideoRef.current.setAttribute("playsinline", "");
			finalVideoRef.current.setAttribute("x5-playsinline", "");
			finalVideoRef.current.setAttribute("webkit-playsinline", "");
			finalVideoRef.current.play()["catch"](function(error) {
				return console.error("finalVideoRef.current.play() failed", error);
			});
		} else finalVideoRef.current.srcObject = null;
	}, [type].concat(type === "share" ? [screenShareOn, screenShareStream] : type === "video" ? [webcamOn, webcamStream] : []));
	return /*#__PURE__*/ import_react.createElement("div", {
		ref,
		className: "video-container participant-video-" + participantId + " " + (className || ""),
		style: _extends({
			objectFit: type === "share" ? "contain" : "none",
			height: "100%"
		}, containerStyle)
	}, /*#__PURE__*/ import_react.createElement("video", {
		width: "100%",
		height: "100%",
		ref: finalVideoRef,
		autoPlay: true,
		className: classNameVideo,
		muted: true,
		style: isLocal && type !== "share" ? _extends({
			transform: "scaleX(-1)",
			WebkitTransform: "scaleX(-1)"
		}, videoStyle) : videoStyle
	}));
});
//#endregion
export { useMeeting as n, useParticipant as r, MeetingProvider as t };
