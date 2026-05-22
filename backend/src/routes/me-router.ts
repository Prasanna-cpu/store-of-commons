import express from "express"
import {getMe} from "../controllers/me-controller";

const meRouter = express.Router()

meRouter.get("/", getMe)

export default meRouter