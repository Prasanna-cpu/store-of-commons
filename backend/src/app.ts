import express from "express"
import {requestLogger} from "./middleware/requestLogger";
import {clerkMiddleware} from "@clerk/express";
import cors from "cors";
import {clerkWebhookHandler} from "./clerk/clerk";
import meRouter from "./routes/me-router";
import productRouter from "./routes/product-router";
import streamRouter from "./routes/stream-router";

const app = express()

const rawJson = express.raw({type : "application/json", limit : "1mb"})

app.post('/webhooks/clerk',rawJson, (req, res) => {
    void clerkWebhookHandler(req, res)
})


app.use(requestLogger)
app.use(clerkMiddleware())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())

app.get("/health", (req, res) => {
    res.json({
        status : "request sent successfully",
        statusCode : res.statusCode
    })
})

app.use("/api/me", meRouter)
app.use("/api/products", productRouter)
app.use("/api/stream", streamRouter)

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

export default app;