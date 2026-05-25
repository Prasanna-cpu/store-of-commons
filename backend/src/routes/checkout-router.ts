import express from "express"
import {createCheckOut} from "../controllers/checkout-controller";

const checkoutRouter = express.Router()

checkoutRouter.post("/", createCheckOut)

export default checkoutRouter
