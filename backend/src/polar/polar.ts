import {NextFunction} from "express";
import {CheckoutCreateBody} from "../types/CreateCheckoutBody";

export async function polarWebhookHandler(req : Request, res : Response, next : NextFunction){

}

export async function polarCreateCheckout(body : CheckoutCreateBody) {

    const token = process.env.POLAR_ACCESS_TOKEN

    if (!token) {
        throw new Error("Token for Payments are not configured")
    }

    const res = await fetch(`${process.env.POLAR_API_BASE}/v1/checkouts/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to create checkout: ${errorText}`)
    }

    const data = (await res.json()) as { id: string; url: string };
    return {id: data.id, url: data.url}

}