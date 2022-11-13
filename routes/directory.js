"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const directory_1 = __importDefault(require("../handlers/directory"));
const router = express_1.default.Router();
router.post('/create', directory_1.default.create);
router.delete('/delete', directory_1.default.remove);
router.get('/get/:id', directory_1.default.get);
exports.default = router;
