import express from "express"
import { PORT } from "./config/env.js"
import connectToDatabase from "./database/mongodb.js"
import cookieParser from "cookie-parser"
import errorMiddleware from "./middleware/error.middleware.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(errorMiddleware)

app.listen(PORT, async () => {
    console.log(`Server is running on https://localhost:${PORT}`)
    await connectToDatabase()
})


