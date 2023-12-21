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
exports.updateAwsKeyInDatabase = void 0;
const cadidateInfo_models_1 = require("../database/models/cadidateInfo.models");
const findCurrentUserId_service_1 = require("./findCurrentUserId.service");
function updateAwsKeyInDatabase(acesstoken, newKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const current_user_id = yield (0, findCurrentUserId_service_1.findCurrentuserId)(acesstoken);
        try {
            const response = yield cadidateInfo_models_1.CandidateInfo.findOneAndUpdate({ user_id: current_user_id }, {
                aws_file_key: newKey,
            });
            return { status: 200, message: "new file key saved to database", data: response };
        }
        catch (error) {
            return {
                status: 500,
                message: "database error in updateAwsKeyInDatabase",
                data: error
            };
        }
    });
}
exports.updateAwsKeyInDatabase = updateAwsKeyInDatabase;
