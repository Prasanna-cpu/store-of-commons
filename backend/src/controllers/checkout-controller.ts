import express, {NextFunction} from "express";
import {getAuth} from "@clerk/express";
import {cartSchema} from "../validations/cart-schema";
import {getUserById} from "../crud-operations/users";
import {retrieveProductsByIds} from "../crud-operations/products";
import {CheckOutSessionLine} from "../types/CheckOutSessionLine";
import {addCheckOutSessions, updateCheckOutSessions} from "../crud-operations/checkOutSessions";
import {polarCreateCheckout} from "../polar/polar";
import {checkOutSessions} from "../database/schema";

export async function createCheckOut(req : express.Request, res : express.Response, next : NextFunction){
    try{
        const {userId, isAuthenticated} = getAuth(req)

        if (!isAuthenticated || !userId){
            return res.status(401).json({
                message : "Unauthorized",
                statusCode : res.statusCode
            })
        }

        const parsedObject = cartSchema.safeParse(req.body)

        if (!parsedObject.success){
            return res.status(400).json({
                message : "Invalid request",
                statusCode : res.statusCode
            })
        }

        if (!process.env.POLAR_ACCESS_TOKEN){
            return res.status(503).json({
                message : "Payments are not configured",
                statusCode : res.statusCode
            })
        }

        const localUser = await getUserById(userId)

        if (!localUser){
            return res.status(503).json({
                message : "Account Not Synced Yet",
                statusCode : res.statusCode
            })
        }

        const ids = parsedObject.data.items.map(item => item.productId)

        const products = await retrieveProductsByIds(ids)

        if(products.length !== ids.length){
            return res.status(400).json({
                message : "One or more products are invalid",
                statusCode : res.statusCode
            })
        }

        const byId = new Map(products.map((p) => [p.id, p]));
        let totalPrice = 0;
        const lines: CheckOutSessionLine[] =[]

        for (const line of parsedObject.data.items) {
            const p = byId.get(line.productId)!;
            totalPrice += p.price * line.quantity
            lines.push({
                productId: p.id,
                quantity: line.quantity,
                unitPrice: p.price,
            });
        }

        const [sessions] = await addCheckOutSessions(userId, lines, totalPrice, "INR")

        const returnUrl = `${process.env.FRONTEND_URL}/cart`
        const successUrl = `${process.env.FRONTEND_URL}/checkout/return?checkout_id=${sessions.polarCheckoutId}`

        const checkout = await polarCreateCheckout({
            products : [process.env.POLAR_CHECKOUT_PRODUCT_ID as string],
            success_url : successUrl,
            return_url : returnUrl,
            external_customer_id : userId,
            metadata : {checkout_session_id : sessions.id},
            prices : {
                [process.env.POLAR_CHECKOUT_PRODUCT_ID as string] : [
                    {
                        amount_type : "fixed",
                        price_amount : totalPrice,
                        price_currency : "INR"
                    }
                ]
            }
        })

        await updateCheckOutSessions(checkout.id, sessions.id, checkOutSessions.id)

        return res.status(200).json({
            message : "Checkout created successfully",
            id : checkout.id,
            url : checkout.url,
            checkoutSessionId : sessions.id,
            statusCode : res.statusCode
        })


    }
    catch (e){
        next(e)
    }
}