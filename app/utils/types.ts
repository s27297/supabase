export type Todo = {
    id: string | number
    name: string
    text: string
    user_id: string
}

export type Product = {
    id: string | number
    name: string
    description: string
    price: number
}

export type BasketItem = {
    id: number
    product_id: number
    quantity: number
    products: Product   // joined product data
}