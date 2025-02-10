"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const todo_route_1 = __importDefault(require("./routes/todo.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/todo", todo_route_1.default);
app.use("*", (req, res) => {
    res.status(400).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
    console.log(err);
    res.status(400).json({ message: "Something went wrong", error: err.message });
});
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    console.error("Error: MongoDB URL is not defined");
    process.exit(1);
}
mongoose_1.default.connect(MONGO_URL)
    .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running  ${PORT}`));
})
    .catch((error) => {
    console.error("MongoDB connection error", error);
    process.exit(1);
});
