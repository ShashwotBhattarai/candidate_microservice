"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCurrentuserId = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function findCurrentuserId(acesstoken) {
    const token = acesstoken.slice(7);
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWTSECRET);
    const user_id = decoded.user_id;
    return user_id;
}
exports.findCurrentuserId = findCurrentuserId;
