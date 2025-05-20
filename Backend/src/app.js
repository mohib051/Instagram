import express from "express"
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import indexRouter from "./routes/index.routes.js"
import messageRouter from "./routes/message.routes.js"
import aiRouter from "./routes/ai.routes.js"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"


const app = express();

const corsOptions = {
    origin : "https://instagram-frontend-ohpm.onrender.com/",
    Credential : true
}
app.use(cookieParser())
app.use(morgan("dev"))

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use("/",indexRouter)
app.use("/ai",aiRouter)
app.use("/users",userRouter)
app.use("/post",postRouter)
app.use("/message",messageRouter)


export default app
