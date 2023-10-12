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
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const auth_service_1 = require("../services/auth.service");
const authCredentials_models_1 = require("../database/models/authCredentials.models");
const router = express_1.default.Router();
// Define a route for user-related operations
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const result = yield authCredentials_models_1.AuthCredentials.findOne({ username: username });
    if (result == null) {
        const authService = new auth_service_1.AuthService();
        const status = yield authService.registerNewUser(fullname, email, username, password);
        res.json(status);
    }
    else {
        res.status(400).send({ message: "username already exists" });
    }
}));
exports.default = router;
