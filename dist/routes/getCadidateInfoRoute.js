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
const auth_middleware_1 = require("../middlewares/auth.middleware");
const cadidateInfo_models_1 = require("../database/models/cadidateInfo.models");
const router = express_1.default.Router();
router.get("/all", (0, auth_middleware_1.authMiddleware)(["candidate"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let candidates = yield cadidateInfo_models_1.CandidateInfo.find();
        if (candidates == null) {
            res.status(404).json({ message: "No candidates found" });
        }
        else {
            res.status(200).send(candidates);
        }
    }
    catch (error) {
        res.send(500).json({ error: error });
    }
}));
router.get("/:user_id", (0, auth_middleware_1.authMiddleware)(["candidate"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let candidate = yield cadidateInfo_models_1.CandidateInfo.findOne({
            user_id: req.params.user_id,
        });
        if (candidate == null) {
            res
                .status(404)
                .json({ message: "candidatre with that user_id not found" });
        }
        else {
            res.status(200).send(candidate);
        }
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
}));
exports.default = router;
