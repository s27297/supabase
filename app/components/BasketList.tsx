'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClerkSupabaseClient } from '@/app/utils/supabase/client'
import type { BasketItem } from '@/app/utils/types'
import '@/app/css/BasketList.css'

export default function BasketList() {
    const [items, setItems] = useState<BasketItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = useClerkSupabaseClient()
    const router = useRouter()

    useEffect(() => {
        fetchBasket()
    }, [supabase])

    async function fetchBasket() {
        if(!supabase)
            return
        setLoading(true)
        const { data, error } = await supabase
            .from('basket_items')
            .select('id, product_id, quantity, products(*)')

        if (error) setError(error.message)
        else setItems((data as unknown as BasketItem[]) ?? [])
        setLoading(false)
    }

    async function updateQuantity(id: number, quantity: number) {
        if(!supabase)
            return
        if (quantity < 1) return

        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))

        const { error } = await supabase
            .from('basket_items')
            .update({ quantity })
            .eq('id', id)

        if (error) {
            setError(error.message)
            fetchBasket()
        }
    }

    async function removeItem(id: number) {
        if(!supabase)
            return
        setItems((prev) => prev.filter((i) => i.id !== id))

        const { error } = await supabase.from('basket_items').delete().eq('id', id)

        if (error) {
            setError(error.message)
            fetchBasket()
        }
    }

    const total = items.reduce((sum, i) => sum + i.products.price * i.quantity, 0)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="basket-list">
            <h2>Your Basket</h2>

            {items.length === 0 ? (
                <p>Your basket is empty.</p>
            ) : (
                <>
                    <div className="items">
                        {items.map((item) => (
                            <div key={item.id} className="basket-item">
                                <div className="info">
                                    <h4>{item.products.name}</h4>
                                    <span>{item.products.price.toFixed(2)} PLN</span>
                                </div>

                                <div className="quantity">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                </div>

                                <span className="subtotal">
                  {(item.products.price * item.quantity).toFixed(2)} PLN
                </span>

                                <button className="remove" onClick={() => removeItem(item.id)}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="footer">
                        <span className="total">Total: {total.toFixed(2)} PLN</span>
                        <button className="buy" onClick={() => router.push('/checkout')}>
                            Buy
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}