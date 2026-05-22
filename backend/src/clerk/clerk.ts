import express from "express";
import {verifyWebhook} from "@clerk/backend/webhooks";
import {parseRole} from "../role/role";
import {db} from "../database";
import {users} from "../database/schema";
import {eq} from "drizzle-orm";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function clerkWebhookHandler(req : express.Request, res : express.Response) {

    try{
        if (!webhookSecret){
            return res.status(503).json({
                message : "Webhook secret not found , or not configured",
                status : 503
            })
        }

        const payload = req.body instanceof  Buffer ? req.body.toString() : String(req.body);

        const request = new Request("http://internal/webhooks/clerk", {
            method : "POST",
            body : payload,
            headers : new Headers(req.headers as HeadersInit)
        })

        const event = await verifyWebhook(
            request, {
                signingSecret : webhookSecret
            }
        )

        if (event.type === "user.created" || event.type === "user.updated"){
            const u = event.data

            const email = u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address ??
                u.email_addresses?.[0]?.email_address

            const displayName = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || undefined;

            const role = parseRole(u.public_metadata?.role);

            await db.insert(users).values({
                clerkUserId : u.id,
                email : email,
                displayName : displayName,
                role : role
            }).onConflictDoUpdate({
                target : users.clerkUserId,
                set : {
                    email : email,
                    displayName : displayName,
                    role : role,
                    updatedAt : new Date()
                }
            })

        }

        if (event.type === "user.deleted"){
            const id = event.data.id
            if (id){
                await db.delete(users).where(eq(users.clerkUserId, id))
            }

        }
        return res.json({
            message : "Success",
            status : 200
        })

    }
    catch (e){
        return res.status(500).json({
            message : "Internal Server Error",
            status : 500
        })
    }

}