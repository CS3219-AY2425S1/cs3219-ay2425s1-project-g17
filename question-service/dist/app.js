"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const questionRoutes_1 = __importDefault(require("./route/questionRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || '8000';
const uri = (_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : '';
// Connect to mongoDB
mongoose_1.default
    .connect(uri, {
    dbName: "question",
})
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch((error) => console.error("MongoDB connection eror:", error));
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Use the routes defined in questionRoutes
app.use('/questions', questionRoutes_1.default);
// Start express server
app.listen(port, () => console.log("Server started on port " + port));
