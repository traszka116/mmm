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
function create(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield db_1.default.has('directories', directory.id)) {
            return null;
        }
        const created = yield db_1.default.create('directories', directory);
        return created;
    });
}
function remove(directoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield db_1.default.has('directories', directoryId)) {
            const deleted = yield db_1.default.remove('directories', directoryId);
            return deleted;
        }
        return null;
    });
}
function findById(directoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT * FROM directories WHERE directories.id = "${directoryId}"`;
        const found = yield db_1.default.query('directories', query);
        if (found.length > 0) {
            return found[0];
        }
        return null;
    });
}
function update(directoryId, directory) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield db_1.default.has('directories', directoryId)) {
            const updated = yield db_1.default.update('directories', directoryId, directory);
            return updated;
        }
        return null;
    });
}
const Directories = {
    findById,
    remove,
    create,
    update
};
exports.default = Directories;
