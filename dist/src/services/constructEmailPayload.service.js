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
exports.ConstructEmailPayload = void 0;
const cadidateInfo_models_1 = require("../database/models/cadidateInfo.models");
const findCurrentUserId_service_1 = require("./findCurrentUserId.service");
class ConstructEmailPayload {
    constructEmailPayload(currentUserToken, subject, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = (0, findCurrentUserId_service_1.findCurrentuserId)(currentUserToken);
            let namedSubject;
            try {
                const response = yield cadidateInfo_models_1.CandidateInfo.findOne({ user_id: user_id });
                const email = response === null || response === void 0 ? void 0 : response.email;
                const fullname = response === null || response === void 0 ? void 0 : response.fullname;
                namedSubject = "Hi " + fullname + " " + subject;
                const emailPayload = {
                    to: email || "",
                    subject: namedSubject,
                    text: text,
                };
                return { status: 200, message: emailPayload };
            }
            catch (error) {
                return {
                    status: 500,
                    message: error,
                };
            }
        });
    }
}
exports.ConstructEmailPayload = ConstructEmailPayload;
