import {db} from "../database";
import {products} from "../database/schema";
import {desc, eq, SQLWrapper} from "drizzle-orm";

export async function getAllProducts(conditionClause) {
    return db
        .select()
        .from(products)
        .where(conditionClause)
        .orderBy(desc(products.createdAt));
}

export async function retrieveCategories() {
    return db
        .select()
        .from(products)
        .where(eq(products.active, true));
}

export async function retrieveProductsBySlug(comparatorSlug) {
    return db
        .select()
        .from(products)
        .where(eq(products.slug, comparatorSlug))
        .limit(1)
}