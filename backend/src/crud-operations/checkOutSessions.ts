import {db} from "../database";
import {checkOutSessions} from "../database/schema";
import {eq} from "drizzle-orm";

export async function addCheckOutSessions (userId, lines, totalPrice, currency){
    return db
        .insert(checkOutSessions)
        .values({
            userId :userId,
            lines : lines,
            totalAmount : totalPrice,
            currency : currency
        })
        .returning()
}

export async function updateCheckOutSessions(polarCheckOutId, sessionId, checkOutSessionId){
    db
        .update(checkOutSessions)
        .set({
            polarCheckoutId : polarCheckOutId,
        })
        .where(
            eq(checkOutSessionId, sessionId)
        )
}