import app from "./src/app.js"
import Connect from "./src/db/db.js"
import config from "./src/config/config.js"
import dotenv from "dotenv"
dotenv.config()

const PORT = config.PORT


app.listen(PORT, () => {
  console.log("Server is running on port 3000")
  Connect()
})

