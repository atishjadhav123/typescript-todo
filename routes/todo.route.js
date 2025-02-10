"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todo_controller_1 = require("../controller/todo.controller");
const upload_1 = require("../utils/upload");
const router = express_1.default.Router();
router
    .get("/gettodo", todo_controller_1.getAllTodoskjgk)
    .post("/createtodo", todo_controller_1.createTodos)
    .put("/updatetodo/:id", upload_1.upload, todo_controller_1.updateTodo)
    .delete("/deletetodo/:id", todo_controller_1.deleteTodos);
exports.default = router
