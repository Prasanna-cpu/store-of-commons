export type CheckoutCreateBody = {
    products: string[];
    prices?: Record<
        string,
        Array<{
            amount_type: "fixed";
            price_amount: number;
            price_currency: string;
        }>
    >;
    success_url: string;
    return_url?: string;
    external_customer_id?: string;
    customer_email?: string;
    metadata?: Record<string, string | number | boolean>;
};