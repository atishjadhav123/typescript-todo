import express, { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import todoRoutes from './routes/todo.route'

dotenv.config()

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors({ origin: "http://localhost:5173", credentials: true }))

app.use("/api/todo", todoRoutes)

app.use("*", (req: Request, res: Response) => {
    res.status(400).json({ message: "Route not found" })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    res.status(400).json({ message: "Something went wrong", error: err.message })
})

const PORT = process.env.PORT || 5000
const MONGO_URL = process.env.MONGO_URL as string

if (!MONGO_URL) {
    console.error("Error: MongoDB URL is not defined")
    process.exit(1)
}

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("MongoDB connected")
        app.listen(PORT, () => console.log(`Server running  ${PORT}`))
    })
    .catch((error) => {
        console.error("MongoDB connection error", error)
        process.exit(1)
    })
