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
const file_1 = __importDefault(require("../models/file"));
const uuid_1 = require("uuid");
const sessions_1 = __importDefault(require("../sessions"));
const directory_1 = __importDefault(require("../models/directory"));
function upload(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { directoryId, name, content, session_id } = req.body;
        const file_id = (0, uuid_1.v4)();
        if (!directoryId || !name || !content || !session_id) {
            res.status(400).send("Bad Request");
            return;
        }
        const directory = yield directory_1.default.findById(directoryId);
        if (!directory) {
            res.status(400).send("Bad Request");
            return;
        }
        if (!sessions_1.default.hasSession(session_id)) {
            res.status(401).send("Unauthorized");
            return;
        }
        const s_user = sessions_1.default.getSession(session_id);
        if (!s_user) {
            res.status(401).send("Unauthorized");
            return;
        }
        const file = {
            id: file_id,
            name: name,
            content: content,
            directoryId: directoryId,
            add_date: new Date().toISOString(),
            userId: s_user.user.id
        };
        directory.files.push({ id: file_id, name: name, add_date: file.add_date });
        const created = yield file_1.default.create(file, directoryId);
        if (!created) {
            res.status(500).send("Internal Server Error");
            return;
        }
        directory_1.default.update(directoryId, directory);
        res.status(200).send("OK");
    });
}
function remove(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { file_id, session_id } = req.body;
        if (!file_id || !session_id) {
            res.status(400).send("Bad Request");
            return;
        }
        const file = yield file_1.default.findById(file_id);
        if (!file) {
            res.status(400).send("Bad Request");
            return;
        }
        if (sessions_1.default.authorize(session_id, file.userId)) {
            res.status(401).send("Unauthorized");
            return;
        }
        const directory = yield directory_1.default.findById(file.directoryId);
        if (!directory) {
            res.status(400).send("Bad Request");
            return;
        }
        directory.files = directory.files.filter(f => f.id !== file_id);
        yield file_1.default.remove(file_id);
        yield directory_1.default.update(file.directoryId, directory);
    });
}
function download(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { session_id } = req.body;
        const { id } = req.params;
        if (!id || !session_id) {
            res.status(400).send("Bad Request");
            return;
        }
        const file = yield file_1.default.findById(id);
        if (!file) {
            res.status(400).send("Bad Request");
            return;
        }
        if (!sessions_1.default.authorize(session_id, file.userId)) {
            res.status(401).send("Unauthorized");
            return;
        }
        const fileBuffer = Buffer.from(file.content, 'base64');
        res.status(200).send(fileBuffer);
    });
}
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { session_id } = req.body;
        const { id } = req.params;
        if (!id || !session_id) {
            res.status(400).send("Bad Request");
            return;
        }
        const file = yield file_1.default.findById(id);
        if (!file) {
            res.status(400).send("Bad Request");
            return;
        }
        if (!sessions_1.default.authorize(session_id, file.userId)) {
            res.status(401).send("Unauthorized");
            return;
        }
        res.status(200).send(file);
    });
}
const fileHandler = {
    upload,
    remove,
    download,
    get
};
exports.default = fileHandler;
