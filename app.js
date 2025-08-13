import express from "express"
import { PORT } from "./config/env.js"
import connectToDatabase from "./database/mongodb.js"
import cookieParser from "cookie-parser"
import errorMiddleware from "./middleware/error.middleware.js"
import authRouter from "./routes/auth.routes.js"
import postRouter from "./routes/post.routes.js"
import tagRouter from "./routes/tag.routes.js"
import followRouter from "./routes/follow.routes.js"

await connectToDatabase()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/tag", tagRouter)
app.use("/api/v1/follow", followRouter)

app.use(errorMiddleware)

export default app
