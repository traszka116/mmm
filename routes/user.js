"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../handlers/user"));
const router = express_1.default.Router();
router.post('/register', user_1.default.register);
router.post('/login', user_1.default.login);
router.post('/logout', user_1.default.logout);
router.delete('/delete', user_1.default.remove);
exports.default = router;
