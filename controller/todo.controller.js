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
exports.deleteTodos = exports.updateTodo = exports.createTodos = exports.getAllTodoskjgk = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cloudinary_1 = require("cloudinary");
const upload_1 = require("../utils/upload");
const todo_model_1 = require("../models/todo.model");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
});
exports.getAllTodoskjgk = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield todo_model_1.TodoModel.find();
    return response.status(200).json({ message: "Todos fetched successfully", result });
}));
exports.createTodos = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    (0, upload_1.upload)(request, response, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return response.status(500).json({ message: "Error uploading file", error: err.message });
        }
        if (!request.file) {
            return response.status(400).json({ message: "No file uploaded" });
        }
        try {
            const cloudinaryResult = yield cloudinary_1.v2.uploader.upload(request.file.path);
            const { name, email, mobile, gender, maritalstatus, dob, address } = request.body;
            const result = yield todo_model_1.TodoModel.create({
                name,
                email,
                profilePic: cloudinaryResult.secure_url,
                maritalstatus,
                mobile,
                gender,
                dob,
                address,
            });
            return response.status(200).json({ message: "Todo created successfully", result });
        }
        catch (error) {
            return response.status(500).json({ message: "Error processing request", error: error.message });
        }
    }));
}));
exports.updateTodo = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    if (!id) {
        return response.status(400).json({ message: "Todo ID is required" });
    }
    let { name, email, mobile, gender, maritalstatus, dob, address, profilePic } = request.body;
    try {
        const todo = yield todo_model_1.TodoModel.findById(id, request.body);
        if (!todo) {
            return response.status(404).json({ message: "Todo not found" });
        }
        let updatedProfilePic = profilePic;
        if (request.file) {
            const cloudinaryResult = yield cloudinary_1.v2.uploader.upload(request.file.path);
            updatedProfilePic = cloudinaryResult.secure_url;
        }
        else {
            if (!updatedProfilePic || typeof updatedProfilePic !== "string") {
                updatedProfilePic = todo.profilePic || "";
            }
        }
        const updatedTodo = yield todo_model_1.TodoModel.findByIdAndUpdate(id, {
            name,
            email,
            mobile,
            gender,
            maritalstatus,
            dob,
            address,
            profilePic: updatedProfilePic,
        });
        if (!updatedTodo) {
            return response.status(500).json({ message: "Todo update failed" });
        }
        return response.status(200).json({ message: "Todo updated successfully", updatedTodo });
    }
    catch (error) {
        console.error("Error updating todo:", error);
        return response.status(500).json({ message: "Error processing request", error: error.message });
    }
}));
exports.deleteTodos = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const todo = yield todo_model_1.TodoModel.findById(id);
    if (!todo) {
        return response.status(404).json({ message: "Todo not found" });
    }
    yield todo_model_1.TodoModel.findByIdAndDelete(id);
    return response.status(200).json({ message: "Todo deleted successfully" });
}));
