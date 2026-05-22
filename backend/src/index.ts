import app from "./app";
import dotenv from "dotenv";
import job from "./cron/cron";

dotenv.config();

const port = process.env.PORT


app.listen(port, () => {
    console.info(`Look at http://localhost:${port}`)
    if (process.env.NODE_ENV === "production"){
        job.start()
    }
})
