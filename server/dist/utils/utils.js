"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.generateLoginToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// interface DateConstructor {
//     new(): Date;
//     new(value: number | string): Date;
//     new(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): Date;
// }
const generateLoginToken = (user) => {
    const pass = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign(user, pass, { expiresIn: process.env.TOKEN_EXP });
};
exports.generateLoginToken = generateLoginToken;
const pass = process.env.COOKIE_EXP;
exports.options = { expires: new Date(Date.now() +
        pass * 24 * 60 * 60 * 1000) };
