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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
function remove(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield db_1.default.has('users', userId)) {
            const removed = yield db_1.default.remove('users', userId);
            return removed;
        }
        return null;
    });
}
function create(user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield db_1.default.has('users', user.id)) {
            return null;
        }
        const created = yield db_1.default.create('users', user);
        return created;
    });
}
function findByName(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT * FROM users WHERE users.username = "${username}"`;
        const found = yield db_1.default.query('users', query);
        if (found.length > 0) {
            return found[0];
        }
        return null;
    });
}
function findById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT * FROM users WHERE users.id = "${userId}"`;
        const found = yield db_1.default.query('users', query);
        if (found.length > 0) {
            return found[0];
        }
        return null;
    });
}
function update(userId, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield db_1.default.has('users', userId)) {
            const updated = yield db_1.default.update('users', userId, user);
            return updated;
        }
        return null;
    });
}
const Users = { remove, create, findByName, findById, update };
exports.default = Users;
