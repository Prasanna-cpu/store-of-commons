import {db} from "../database";
import {users} from "../database/schema";
import {eq} from "drizzle-orm";

export async function getUserById(clerkUserId : string) {
    return db
        .select()
        .from(users)
        .where(eq(users.clerkUserId, clerkUserId))
        .limit(1)
}