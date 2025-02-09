import express from 'express'
import { createTodos, deleteTodos, getAllTodoskjgk, updateTodo } from '../controller/todo.controller'
import { upload } from '../utils/upload'
const router = express.Router()

router
    .get("/gettodo", getAllTodoskjgk)
    .post("/createtodo", createTodos)
    .put("/updatetodo/:id", upload, updateTodo)
    .delete("/deletetodo/:id", deleteTodos)

export default router
