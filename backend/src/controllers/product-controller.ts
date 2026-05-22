import {NextFunction, Request, Response} from "express";
import {db} from "../database";
import {products} from "../database/schema";
import {eq, and, desc} from "drizzle-orm";
import {getAllProducts, retrieveCategories, retrieveProductsBySlug} from "../crud-operations/products";


export async function allProducts(req : Request, res : Response, next : NextFunction) {
    try{
        const category = typeof req.query.category === "string" ? req.query.category.trim() : ""

        const activeOnlyProducts = eq(products.active, true)
        const whereClause = category ? and(activeOnlyProducts, eq(products.category, category)) : activeOnlyProducts

        const rows = await getAllProducts(whereClause)

        return res.status(200).json({
            message : "Products found",
            statusCode : res.statusCode,
            data : {
                products : rows
            }
        })

    }
    catch (e){
        next(e)
    }
}

export async function getCategories(req : Request, res : Response, next : NextFunction) {
    try{
        const rows = await retrieveCategories()

        // Unique categories by ascending order
        const categories = Array.from(new Set(rows.map(row => row.category)))

        return res.status(200).json({
            message : "Categories found",
            statusCode : res.statusCode,
            data : {
                categories : categories
            }
        })

    }
    catch (e){
        next(e)
    }
}

export async function getProductBySlug(req : Request, res : Response, next : NextFunction) {
    try{
        const comparatorSlug = (req.params.slug as string).trim()

        const [row] = await retrieveProductsBySlug(comparatorSlug)

        if (!row || !row.active){
            return res.status(404).json({
                message : "Product not found",
                statusCode : res.statusCode
            })
        }

        return res.status(200).json({
            message : "Product found",
            statusCode : res.statusCode,
            data : {
                product : row
            }
        })
    }
    catch (e){
        next(e)
    }
}