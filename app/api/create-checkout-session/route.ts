import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/app/utils/supabase/server'
import { stripe } from '@/app/utils/stripe/client'

export async function POST(req: Request) {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, address } = await req.json()

    if (!name || !address) {
        return NextResponse.json({ error: 'Missing name or address' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data: basketItems, error } = await supabase
        .from('basket_items')
        .select('quantity, products(id, name, price)')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!basketItems || basketItems.length === 0) {
        return NextResponse.json({ error: 'Basket is empty' }, { status: 400 })
    }

    // Prices come from Supabase (server-side), never trusted from the client —
    // prevents someone tampering with prices before checkout.
    const line_items = basketItems.map((item: any) => ({
        price_data: {
            currency: 'pln',
            product_data: { name: item.products.name },
            unit_amount: Math.round(item.products.price * 100), // Stripe uses smallest currency unit (grosz)
        },
        quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/basket`,
        metadata: {
            userId,
            name,
            address,
        },
    })

    return NextResponse.json({ url: session.url })
}