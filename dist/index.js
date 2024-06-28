"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMutation = exports.useQuery = exports.useClient = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "useClient", { enumerable: true, get: function () { return client_1.useClient; } });
var query_1 = require("./query");
Object.defineProperty(exports, "useQuery", { enumerable: true, get: function () { return query_1.useQuery; } });
var mutate_1 = require("./mutate");
Object.defineProperty(exports, "useMutation", { enumerable: true, get: function () { return mutate_1.useMutation; } });
