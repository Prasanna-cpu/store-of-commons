import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT


app.listen(port, () => {
    console.info(`Look at http://localhost:${port}`)
})
