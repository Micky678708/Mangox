import app from "./app.js"
import { connectDB } from "./config/db.js"

const PORT = process.env.PORT || 10000

async function startServer(){
  try{

    await connectDB()

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })

  }catch(err){
    console.error("Server start error:", err)
    process.exit(1)
  }
}

startServer()