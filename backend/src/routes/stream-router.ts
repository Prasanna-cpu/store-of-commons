import express from "express";
import {createStreamToken} from "../controllers/stream-controller";

const streamRouter = express.Router()

streamRouter.post("/token", createStreamToken)

export default streamRouter