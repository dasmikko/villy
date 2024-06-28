"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuery = useQuery;
const client_js_1 = require("./client.js");
const vue_1 = require("vue");
const axios_1 = require("axios");
const noop = () => { };
function unravel(obj) {
    if ((0, vue_1.isRef)(obj)) {
        return obj.value;
    }
    return obj;
}
function useQuery(opts) {
    var _a, _b, _c, _d, _e;
    const { url, registerTags, unregisterTags } = (0, client_js_1.resolveClient)();
    let queryName = opts.query;
    let abortController = null;
    let currentFetchOnMount = (_a = opts.fetchOnMount) !== null && _a !== void 0 ? _a : true;
    let data = (0, vue_1.ref)(null);
    let isFetching = (0, vue_1.ref)(false);
    let error = (0, vue_1.ref)(null);
    let paused = (_b = opts.paused) !== null && _b !== void 0 ? _b : noop;
    let onData = (_c = opts.onData) !== null && _c !== void 0 ? _c : noop;
    let onError = (_d = opts.onError) !== null && _d !== void 0 ? _d : noop;
    let skip = (_e = opts.skip) !== null && _e !== void 0 ? _e : false;
    const vm = (0, vue_1.getCurrentInstance)();
    if (currentFetchOnMount) {
        vm ? (0, vue_1.onMounted)(() => execute()) : execute();
    }
    (0, vue_1.onBeforeMount)(() => {
        if (opts.tags) {
            const id = registerTags(opts.tags, () => {
                execute();
            });
            (0, vue_1.onBeforeUnmount)(() => {
                unregisterTags(id);
            });
        }
        // Reactive variables
        if (opts.variables && (0, vue_1.isReactive)(opts.variables)) {
            (0, vue_1.watch)(opts.variables, () => {
                // Abort previous request if it's still fetching
                if (isFetching.value && abortController) {
                    abortController.abort();
                }
                execute();
            });
        }
    });
    const _parseVariablesToFormData = (variables) => {
        let formData = new FormData();
        for (let key in (0, vue_1.toRaw)(variables)) {
            formData.append(key, variables[key]);
        }
        return formData;
    };
    async function execute() {
        if (unravel(skip))
            return;
        if (paused(opts.variables))
            return;
        isFetching.value = true;
        error.value = null;
        abortController = new AbortController();
        try {
            const response = await (0, axios_1.default)({
                url: queryName,
                baseURL: url,
                method: 'post',
                signal: abortController.signal,
                withCredentials: true,
                data: _parseVariablesToFormData({ ...opts.variables }),
            });
            data.value = response.data;
            onData(response.data);
        }
        catch (e) {
            if (e.code === 'ERR_CANCELED') {
                console.log('Request was canceled');
                return;
            }
            console.log(e);
            error.value = e.response.data;
            console.log(e.response.data);
            onError(e.response.data);
        }
        isFetching.value = false;
    }
    return {
        data,
        error,
        isFetching,
        execute,
    };
}
