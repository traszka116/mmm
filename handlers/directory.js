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
const directory_1 = __importDefault(require("../models/directory"));
const uuid_1 = require("uuid");
const sessions_1 = __importDefault(require("../sessions"));
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, parent_directory_id, session_id } = req.body;
        if (!name || !parent_directory_id || !session_id) {
            res.status(400).send("Bad Request");
            return;
        }
        const parent_directory = yield directory_1.default.findById(parent_directory_id);
        if (!parent_directory) {
            res.status(400).send('Parent directory not found');
            return;
        }
        const dir_owner = parent_directory.owner;
        if (!dir_owner) {
            res.status(400).send('Parent directory has no owner');
            return;
        }
        if (!sessions_1.default.authorize(session_id, dir_owner.id)) {
            res.status(401).send('Unauthorized');
            return;
        }
        const directory_id = (0, uuid_1.v4)();
        const new_directory = {
            id: directory_id,
            name: name,
            sub_directories: [],
            files: [],
            owner: dir_owner,
            parent_directory_id: parent_directory_id
        };
        parent_directory.sub_directories.push({ id: directory_id, name: name });
        yield directory_1.default.create(new_directory);
        yield directory_1.default.update(parent_directory_id, parent_directory);
    });
}
function remove(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { directory_id, session_id } = req.body;
        if (!directory_id || !session_id) {
            res.status(400).send("Bad Request");
            return;
        }
        const directory = yield directory_1.default.findById(directory_id);
        if (!directory) {
            res.status(400).send('Directory not found');
            return;
        }
        const dir_owner = directory.owner;
        if (!dir_owner) {
            res.status(400).send('Directory has no owner');
            return;
        }
        if (!sessions_1.default.authorize(session_id, dir_owner.id)) {
            res.status(401).send('Unauthorized');
            return;
        }
        const parent_directory_id = directory.parent_directory_id;
        if (!parent_directory_id) {
            res.status(400).send('Directory has no parent directory');
            return;
        }
        const parent_directory = yield directory_1.default.findById(parent_directory_id);
        if (!parent_directory) {
            res.status(400).send('Parent directory not found');
            return;
        }
        const parent_dir_owner = parent_directory.owner;
        if (!parent_dir_owner) {
            res.status(400).send('Parent directory has no owner');
            return;
        }
        if (!sessions_1.default.authorize(session_id, parent_dir_owner.id)) {
            res.status(401).send('Unauthorized');
            return;
        }
        parent_directory.sub_directories = parent_directory.sub_directories.filter(sub_dir => sub_dir.id !== directory_id);
        yield directory_1.default.update(parent_directory_id, parent_directory);
        yield directory_1.default.remove(directory_id);
    });
}
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { session_id } = req.body;
        if (!id || !session_id) {
            res.status(400).send("Bad Request");
            return;
        }
        const directory = yield directory_1.default.findById(id);
        if (!directory) {
            res.status(400).send('Directory not found');
            return;
        }
        const dir_owner = directory.owner;
        if (!dir_owner) {
            res.status(400).send('Directory has no owner');
            return;
        }
        if (!sessions_1.default.authorize(session_id, dir_owner.id)) {
            res.status(401).send('Unauthorized');
            return;
        }
        res.status(200).send(directory);
    });
}
const directoryHandler = {
    create,
    remove,
    get
};
exports.default = directoryHandler;
