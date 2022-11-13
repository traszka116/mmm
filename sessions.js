"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const sessions = new Map();
const createSession = (session) => {
    const sessionId = (0, uuid_1.v4)();
    sessions.set(sessionId, session);
    return sessionId;
};
const getSession = (sessionId) => sessions.get(sessionId);
const deleteSession = (sessionId) => sessions.delete(sessionId);
const hasSession = (sessionId) => sessions.has(sessionId);
const authorize = (sessionId, userId) => {
    if (hasSession(sessionId)) {
        const session = getSession(sessionId);
        if (session && session.user.id === userId) {
            return true;
        }
    }
    return false;
};
const getAll = () => {
    let obj = {};
    sessions.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
};
const Sessions = { createSession, getSession, deleteSession, hasSession, authorize, getAll };
exports.default = Sessions;
