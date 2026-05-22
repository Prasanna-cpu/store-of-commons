import {CronJob} from "cron";
import * as http from "node:http";
import * as https from "node:https";

// Send request to health endpoint every 12 minutes

const job = new CronJob("*/12 * * * *", () => {
    const base = process.env.FRONTEND_URL
    if (!base) return

    const url = new URL("/health", base).href

    const client = url.startsWith("https") ? https : http

    client.get(url, (res) => {
        if (res.statusCode === 200){
            console.log("GET request sent to health endpoint successfully")
        }
        else{
            console.error("GET request sent to health endpoint failed", res.statusCode)
        }
    }).on("error", (err) => {
        console.error("GET request sent to health endpoint failed", err)
    })
})

export default job