"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const todoSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    maritalstatus: { type: String, required: true },
    profilePic: { type: String, required: true },
}, { timestamps: true, collection: "todo" });
exports.TodoModel = mongoose_1.default.model("todo", todoSchema);
