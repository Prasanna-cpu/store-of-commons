import express from "express"
import {requestLogger} from "./middleware/requestLogger";
import {clerkMiddleware} from "@clerk/express";

const app = express()

app.use(requestLogger)
app.use(clerkMiddleware())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

export default app;