"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = createClient;
exports.resolveClient = resolveClient;
exports.useClient = useClient;
const uniqueId_1 = require("lodash/uniqueId");
let url = '';
let headers = {};
let axiosOpts = {};
let activeQueryTags = [];
let activeClient = null;
function createClient(opts) {
    if (opts) {
        url = opts.url;
        headers = { ...opts.headers };
        axiosOpts = { ...opts.axiosOpts };
    }
    const registerTags = (tags, refetch) => {
        const tagId = (0, uniqueId_1.default)();
        activeQueryTags.push({ id: tagId, tags, refetch });
        return tagId;
    };
    const unregisterTags = (tagId) => {
        activeQueryTags = activeQueryTags.filter(tag => tag.id !== tagId);
    };
    const refetchTaggedQueries = (tags) => {
        const queries = activeQueryTags.filter(tq => {
            return tq.tags.some(t => tags.includes(t));
        });
        return Promise.all(queries.map(q => q.refetch())).then(() => undefined);
    };
    return {
        url,
        registerTags,
        unregisterTags,
        refetchTaggedQueries
    };
}
function resolveClient() {
    if (!activeClient) {
        throw new Error("No client has been set");
    }
    return activeClient;
}
function useClient(opts) {
    const client = createClient(opts);
    if (!activeClient) {
        activeClient = client;
    }
    return client;
}
