import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connecDB.js"
dotenv.config()

import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.rout.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"

const app = express()

app.use(cors({
    origin:"https://interviewiq-client-xhes.onrender.com",
    credentials:true
}))



app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/payment", paymentRouter)

const PORT = process.env.PORT || 6000



app.listen(PORT,()=>{
    console.log('server runing on port ${PORT}')
    connectDB()
})
