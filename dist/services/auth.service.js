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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const authCredentials_models_1 = require("../database/models/authCredentials.models");
class AuthService {
    registerNewUser(newFullname, newEmail, newUsername, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(newFullname, newEmail, newUsername, newPassword);
            const registerNewUser = new authCredentials_models_1.AuthCredentials({
                fullname: newFullname,
                email: newEmail,
                username: newUsername,
                password: newPassword,
            });
            try {
                yield registerNewUser.save();
                return {
                    "message": "New user registered"
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AuthService = AuthService;
