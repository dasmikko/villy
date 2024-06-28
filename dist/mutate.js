"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMutation = useMutation;
const client_js_1 = require("./client.js");
const vue_1 = require("vue");
const axios_1 = require("axios");
function useMutation(mutation, opts = {}) {
    var _a, _b, _c;
    const { url, refetchTaggedQueries } = (0, client_js_1.useClient)();
    let mutationName = mutation;
    let tagsToRefetch = (_a = opts.refetchTags) !== null && _a !== void 0 ? _a : [];
    let data = (0, vue_1.ref)(null);
    let isFetching = (0, vue_1.ref)(false);
    let error = (0, vue_1.ref)(null);
    let onData = (_b = opts.onData) !== null && _b !== void 0 ? _b : noop;
    let onError = (_c = opts.onError) !== null && _c !== void 0 ? _c : noop;
    (0, vue_1.onBeforeMount)(() => {
        if (!mutationName) {
            throw new Error("No mutation provided");
        }
    });
    const _parseVariablesToFormData = (variables) => {
        let formData = new FormData();
        for (let key in variables) {
            formData.append(key, variables[key]);
        }
        return formData;
    };
    async function execute(variables) {
        isFetching.value = true;
        error.value = null;
        try {
            const response = await (0, axios_1.default)({
                url: mutationName,
                baseURL: url,
                method: 'post',
                withCredentials: true,
                data: _parseVariablesToFormData({ ...variables }),
            });
            data.value = response.data;
            onData(response.data);
            if (tagsToRefetch.length)
                await refetchTaggedQueries(tagsToRefetch);
        }
        catch (e) {
            console.error(e);
            error.value = e.response.data;
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
