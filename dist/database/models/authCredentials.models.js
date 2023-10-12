"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCredentials = void 0;
const mongoose_1 = require("mongoose");
const authCredentialsSchema = new mongoose_1.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
});
exports.AuthCredentials = (0, mongoose_1.model)('AuthCredentials', authCredentialsSchema);
