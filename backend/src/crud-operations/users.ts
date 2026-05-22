import {db} from "../database";
import {users} from "../database/schema";
import {eq} from "drizzle-orm";

export async function getUserById(clerkUserId : string) {
    const [row] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1)
}