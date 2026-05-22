import express from "express";
import {allProducts, getCategories, getProductBySlug} from "../controllers/product-controller";

const productRouter = express.Router()

productRouter.get("/all-products", allProducts)
productRouter.get("/categories", getCategories)
productRouter.get("/:slug", getProductBySlug)

export default productRouter
