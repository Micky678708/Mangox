import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"

import authRoutes from "./routes/auth.routes.js"
import profileRoutes from "./routes/profile.routes.js"
import reelsRoutes from "./routes/reels.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import homeRoutes from "./routes/home.routes.js"
import devRoutes from "./routes/dev.routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors({
origin: [
"http://localhost:5173",
"https://mangox-zeta.vercel.app"
],
credentials: true
}))

app.options("*", cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/uploads",express.static(path.join(__dirname,"../uploads")))

app.get("/ping",(req,res)=>{
res.json({ok:true})
})

app.use("/api/auth",authRoutes)
app.use("/api/profile",profileRoutes)
app.use("/api/reels",reelsRoutes)
app.use("/api/home",homeRoutes)
app.use("/api/dev",devRoutes)
app.use("/api/chat",chatRoutes)

export default app