import cookieParser from "cookie-parser"
import express from "express"
import { PORT } from "./config/env.js"
import connectToDatabase from "./database/mongodb.js"
import errorMiddleware from "./middleware/error.middleware.js"
import authRouter from "./routes/auth.routes.js"
import commentRouter from "./routes/comments.routes.js"
import followRouter from "./routes/follow.routes.js"
import postRouter from "./routes/post.routes.js"
import tagRouter from "./routes/tag.routes.js"
import userRouter from "./routes/user.routes.js"
import corsConfig from "./middleware/cors.middleware.js"

const app = express()

app.use(corsConfig)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/tag", tagRouter)
app.use("/api/v1/follow", followRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/user", userRouter)

app.use(errorMiddleware)

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    await connectToDatabase()
})


