import mongoose, { Date } from "mongoose"
import { deflate } from "zlib"

export interface ITodo {
    name: string
    email: string
    mobile: string
    gender: string
    address: string
    dob: Date
    maritalstatus: string
    profilePic: string
}

const todoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    maritalstatus: { type: String, required: true },
    profilePic: { type: String, required: true },
}, { timestamps: true, collection: "todo" })
export const TodoModel = mongoose.model<ITodo>("todo", todoSchema)