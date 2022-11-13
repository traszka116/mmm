"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const cosmos_1 = require("@azure/cosmos");
const config_1 = require("./config");
const endpoint = config_1.config.endpoint;
const key = config_1.config.key;
const databaseId = config_1.config.database.id;
const partitionKey = { kind: 'Hash', paths: ['/partitionKey'] };
const options = {
    endpoint: endpoint,
    key: key,
    userAgentSuffix: 'CosmosDBJavascriptQuickstart'
};
const client = new cosmos_1.CosmosClient(options);
exports.client = client;
function create(containerId, object) {
    return __awaiter(this, void 0, void 0, function* () {
        const item = yield client.database(databaseId).container(containerId).items.create(object);
        return item.resource;
    });
}
function remove(containerId, objectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { resource: result } = yield client.database(databaseId).container(containerId).item(objectId, objectId).delete();
            return result;
        }
        catch (err) {
            return null;
        }
    });
}
function query(containerId, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const querySpec = { query: query };
        const { resources: results } = yield client.database(databaseId)
            .container(containerId).items.query(querySpec).fetchAll();
        return results;
    });
}
function update(containerId, objectId, object) {
    return __awaiter(this, void 0, void 0, function* () {
        const { resource: result } = yield client.database(databaseId).container(containerId).item(objectId, objectId).replace(object);
        return result;
    });
}
function has(container, itemId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { resource: result } = yield client.database(databaseId).container(container).item(itemId, itemId).read();
        return (result) ? true : false;
    });
}
const database = {
    create, remove, query, update, has
};
exports.default = database;
