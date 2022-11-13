"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_1 = __importDefault(require("../handlers/file"));
const router = express_1.default.Router();
router.post('/upload', file_1.default.upload);
router.delete('/delete', file_1.default.remove);
router.get('/download/:id', file_1.default.download);
router.get('/get', file_1.default.get);
exports.default = router;
