'use client'

import { useState } from 'react'
import { useClerkSupabaseClient } from '@/app/utils/supabase/client'
import type { Product } from '@/app/utils/types'
import '@/app/css/products/ProductsItem.css'

export default function ProductItem({ product }: { product: Product }) {
    const [adding, setAdding] = useState(false)
    const [added, setAdded] = useState(false)
    const supabase = useClerkSupabaseClient()

    async function handleAddToBasket() {
        if(!supabase)
            return
        setAdding(true)

        const { data: existing } = await supabase
            .from('basket_items')
            .select('id, quantity')
            .eq('product_id', product.id)
            .maybeSingle()

        if (existing) {
            await supabase
                .from('basket_items')
                .update({ quantity: existing.quantity + 1 })
                .eq('id', existing.id)
        } else {
            await supabase
                .from('basket_items')
                .insert([{ product_id: product.id, quantity: 1 }])
        }

        setAdding(false)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    return (
        <div className="product-item">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <span className="price">{product.price.toFixed(2)} PLN</span>
            <button onClick={handleAddToBasket} disabled={adding}>
                {added ? 'Added ✓' : adding ? 'Adding...' : 'Add to basket'}
            </button>
        </div>
    )
}