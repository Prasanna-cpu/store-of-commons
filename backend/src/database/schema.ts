import {pgTable, text, timestamp, uuid, boolean, integer, jsonb} from "drizzle-orm/pg-core"
import {relations} from "drizzle-orm"
import {UserRole} from "../types/UserRole";
import {CheckOutSessionLine} from "../types/CheckOutSessionLine";
import {OrderStatus} from "../types/OrderStatus";

export const users = pgTable("users",{
    id : uuid("id").primaryKey().defaultRandom(),
    clerkUserId : text("clerk_user_id").notNull().unique(),
    email : text("email").notNull().unique().default(""),
    displayName : text("display_name").notNull().default(""),
    role : text("role").$type<UserRole>().notNull().default("customer"),
    createdAt : timestamp("created_at",{withTimezone : true}).notNull().defaultNow(),
    updatedAt : timestamp("updated_at",{withTimezone : true}).notNull().defaultNow(),
})

export const products = pgTable("products", {
    id : uuid("id").defaultRandom().primaryKey(),
    slug : text("slug").notNull().unique(),
    name : text("name").notNull(),
    category : text("category").notNull().default("General"),
    description : text("description").notNull().default(""),
    price : integer("price").notNull(),
    currency : text("currency").notNull().default("INR"),
    imageUrl : text("image_url"),
    imageKitFileId : text("imagekit_file_id"),
    active : boolean("active").notNull().default(true),
    createdAt : timestamp("created_at",{withTimezone : true}).notNull().defaultNow(),
    updatedAt : timestamp("updated_at",{withTimezone : true}).notNull().defaultNow(),
})

export const checkOutSessions = pgTable("checkout_sessions", {
    id : uuid("id").defaultRandom().primaryKey(),
    userId : uuid("user_id").notNull().references(() => users.id, {onDelete : "cascade"}),
    polarCheckoutId : text("polar_checkout_id").unique(),
    lines : jsonb("lines").$type<CheckOutSessionLine[]>().notNull(),
    totalAmount : integer("total_amount").notNull(),
    currency : text("currency").notNull().default("INR"),
    createdAt : timestamp("created_at",{withTimezone : true}).notNull().defaultNow(),
    updatedAt : timestamp("updated_at",{withTimezone : true}).notNull().defaultNow(),
})

export const orders = pgTable("orders", {
    id : uuid("id").defaultRandom().primaryKey(),
    userId : uuid("user_id").notNull().references(() => users.id, {onDelete : "cascade"}),
    status : text("status").$type<OrderStatus>().notNull().default("pending"),
    polarOrderId : text("polar_order_id").notNull(),
    polarCheckoutId : text("polar_checkout_id").notNull(),
    totalAmount : integer("total_amount").notNull().default(0),
    createdAt : timestamp("created_at",{withTimezone : true}).notNull().defaultNow(),
    updatedAt : timestamp("updated_at",{withTimezone : true}).notNull().defaultNow(),
})

export const orderItems = pgTable("order_items", {
    id : uuid("id").defaultRandom().primaryKey(),
    orderId : uuid("order_id").notNull().references(() => orders.id, {onDelete : "cascade"}),
    productId : uuid("product_id").notNull().references(() => products.id, {onDelete : "restrict"}),
    quantity : integer("quantity").notNull().default(1),
    unitPrice : integer("unit_price").notNull(),
    createdAt : timestamp("created_at",{withTimezone : true}).notNull().defaultNow(),
    updatedAt : timestamp("updated_at",{withTimezone : true}).notNull().defaultNow(),
})

export const usersRelations = relations(users, ({one, many}) => ({
    orders : many(orders)
}))

export const productsRelations = relations(products, ({one, many}) => ({
    orderItems : many(orderItems)
}))

export const ordersRelations = relations(orders, ({one, many}) => ({
    users : one(users, {
        fields : [orders.userId],
        references : [users.id]
    }),
    items : many(orderItems)
}))

export const orderItemsRelations = relations(orderItems, ({one}) => ({
    order : one(orders, {
        fields : [orderItems.orderId],
        references : [orders.id]
    }),
    product : one(products, {
        fields : [orderItems.productId],
        references : [products.id]
    })
}))

export const orderRelations = relations(orders, ({one, many}) => ({
   user : one(users, {
       fields : [orders.userId],
       references : [users.id]
   }),
   items : many(orderItems)
}))


