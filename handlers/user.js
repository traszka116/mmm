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
const user_1 = __importDefault(require("../models/user"));
const uuid_1 = require("uuid");
const sessions_1 = __importDefault(require("../sessions"));
const directory_1 = __importDefault(require("../models/directory"));
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).send("Bad Request");
            return;
        }
        const isUsernameTaken = (yield user_1.default.findByName(username)) ? true : false;
        const user_id = (0, uuid_1.v4)();
        const rootDirectoryId = (0, uuid_1.v4)();
        if (isUsernameTaken) {
            res.status(400).send('Username is taken');
            return;
        }
        const user = {
            id: user_id,
            username: username,
            password: password,
            rootDirectoryId: rootDirectoryId
        };
        const root_directory = {
            id: rootDirectoryId,
            name: 'root',
            sub_directories: [],
            parent_directory_id: null,
            files: [],
            owner: { id: user_id, name: username }
        };
        yield user_1.default.create(user);
        yield directory_1.default.create(root_directory);
        res.status(200).send('User created');
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).send('Bad Request');
            return;
        }
        const user = yield user_1.default.findByName(username);
        if (!user) {
            res.status(400).send('User not found');
            return;
        }
        if (user.password !== password) {
            res.status(400).send('Wrong password');
            return;
        }
        const session_id = (0, uuid_1.v4)();
        const session = {
            user: user
        };
        sessions_1.default.createSession(session);
        res.status(200).send({ session: session_id, user_data: user });
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { session } = req.body;
        if (!session) {
            res.status(400).send('Bad Request');
            return;
        }
        if (sessions_1.default.hasSession(session)) {
            sessions_1.default.deleteSession(session);
            res.status(200).send('Logged out');
            return;
        }
        res.status(400).send('Session not found');
    });
}
function remove(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { session, userId } = req.body;
        if (!session || !userId) {
            res.status(400).send('Bad Request');
            return;
        }
        if (sessions_1.default.authorize(session, userId)) {
            yield user_1.default.remove(userId);
            res.status(200).send('User removed');
            return;
        }
        res.status(400).send('Unauthorized');
    });
}
const userHandler = {
    register,
    login,
    logout,
    remove
};
exports.default = userHandler;
