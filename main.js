"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const file_1 = __importDefault(require("./routes/file"));
const directory_1 = __importDefault(require("./routes/directory"));
const sessions_1 = __importDefault(require("./sessions"));
const app = (0, express_1.default)();
const port = process.env.PORT || 80;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use('/user', user_1.default);
app.use('/dir', directory_1.default);
app.use('/file', file_1.default);
app.get('/debug/getAllSessions', (req, res) => res.send(sessions_1.default.getAll()));
app.get('/', (req, res) => res.send(`
    <h1>File Manager API</h1>
    <p>API for File Manager</p>
    <p>Created by traszka116</p>
`));
app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
});
