import asynchandler from 'express-async-handler'
import { Request, Response } from "express"
import dotenv from "dotenv"

dotenv.config()

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { upload } from '../utils/upload'
import { TodoModel } from '../models/todo.model'

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
})

export const getAllTodoskjgk = asynchandler(async (request: Request, response: Response): Promise<any> => {
    const result = await TodoModel.find()
    return response.status(200).json({ message: "Todos fetched successfully", result })
})
export const createTodos = asynchandler(async (request: Request, response: Response): Promise<any> => {
    upload(request, response, async (err: any) => {
        if (err) {
            return response.status(500).json({ message: "Error uploading file", error: err.message })
        }
        if (!request.file) {
            return response.status(400).json({ message: "No file uploaded" })
        }
        try {
            const cloudinaryResult: UploadApiResponse = await cloudinary.uploader.upload(request.file.path)

            const { name, email, mobile, gender, maritalstatus, dob, address } = request.body

            const result = await TodoModel.create({
                name,
                email,
                profilePic: cloudinaryResult.secure_url,
                maritalstatus,
                mobile,
                gender,
                dob,
                address,
            })
            return response.status(200).json({ message: "Todo created successfully", result })
        } catch (error: any) {
            return response.status(500).json({ message: "Error processing request", error: error.message })
        }
    })
})
export const updateTodo = asynchandler(async (request: Request, response: Response): Promise<any> => {
    const { id } = request.params

    if (!id) {
        return response.status(400).json({ message: "Todo ID is required" })
    }

    let { name, email, mobile, gender, maritalstatus, dob, address, profilePic } = request.body

    try {
        const todo = await TodoModel.findById(id, request.body)
        if (!todo) {
            return response.status(404).json({ message: "Todo not found" })
        }

        let updatedProfilePic = profilePic

        if (request.file) {
            const cloudinaryResult: UploadApiResponse = await cloudinary.uploader.upload(request.file.path)
            updatedProfilePic = cloudinaryResult.secure_url
        } else {
            if (!updatedProfilePic || typeof updatedProfilePic !== "string") {
                updatedProfilePic = todo.profilePic || ""
            }
        }

        const updatedTodo = await TodoModel.findByIdAndUpdate(
            id,
            {
                name,
                email,
                mobile,
                gender,
                maritalstatus,
                dob,
                address,
                profilePic: updatedProfilePic,
            },
        )

        if (!updatedTodo) {
            return response.status(500).json({ message: "Todo update failed" })
        }

        return response.status(200).json({ message: "Todo updated successfully", updatedTodo })

    } catch (error: any) {
        console.error("Error updating todo:", error)
        return response.status(500).json({ message: "Error processing request", error: error.message })
    }
})
export const deleteTodos = asynchandler(async (request: Request, response: Response): Promise<any> => {
    const { id } = request.params
    const todo = await TodoModel.findById(id)

    if (!todo) {
        return response.status(404).json({ message: "Todo not found" })
    }
    await TodoModel.findByIdAndDelete(id)
    return response.status(200).json({ message: "Todo deleted successfully" })

})
