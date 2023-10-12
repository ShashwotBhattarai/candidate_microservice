"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// gateway/src/app.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const db_connect_1 = __importDefault(require("./database/db.connect"));
// import uploadServiceRoutes from './routes/uploadServiceRoutes';
// import downloadServiceRoutes from './routes/downloadServiceRoutes';
// import emailServiceRoutes from './routes/emailServiceRoutes';
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
(0, db_connect_1.default)();
// app.use('/upload', uploadServiceRoutes);
// app.use('/download', downloadServiceRoutes);
// app.use('/email', emailServiceRoutes);
app.use("/auth", auth_routes_1.default);
app.listen(port, () => {
    console.log(`Gateway is running on port ${port}`);
});
