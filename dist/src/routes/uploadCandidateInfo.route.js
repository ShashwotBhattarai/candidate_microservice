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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadCandidateInfo_validate_1 = require("../validators/uploadCandidateInfo.validate");
const checkFile_middleware_1 = require("../middlewares/checkFile.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const uploadCandidateInfo_service_1 = __importDefault(require("../services/uploadCandidateInfo.service"));
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 8000000,
    },
});
const router = express_1.default.Router();
router.post("/", upload.single("cv"), (0, auth_middleware_1.authMiddleware)(["candidate"]), uploadCandidateInfo_validate_1.validateCandidate, checkFile_middleware_1.checkFileMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const currentToken = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : "";
    const { status, message, data } = yield (0, uploadCandidateInfo_service_1.default)(currentToken, req.file, req.body);
    res.status(status).json({ message: message, data: data });
}));
exports.default = router;
