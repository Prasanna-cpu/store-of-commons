import {db} from "../database";
import {products} from "../database/schema";
import {and, desc, eq, SQLWrapper} from "drizzle-orm";
import {inArray} from "drizzle-orm/sql/expressions/conditions";

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

export async function retrieveProductsByIds(ids) {
    return db
        .select()
        .from(products)
        .where(and(inArray(products.id, ids), eq(products.active, true)))
}