'use client'

import React, { useState } from 'react'
import { useClerkSupabaseClient } from '@/app/utils/supabase/client'
import type { Product } from '@/app/utils/types'
import posthog from 'posthog-js'
import '../../css/products/InsertProducts.css'

export default function InsertProduct({ addProduct }: { addProduct: (product: Product) => void }) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const supabase = useClerkSupabaseClient()

    async function handleSubmit(e: React.FormEvent) {
        if(!supabase)
            return;
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        const { data, error } = await supabase
            .from('products')
            .insert([{ name, description, price: parseFloat(price) }])
            .select()
            .single()

        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

        addProduct(data)
        if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
            posthog.capture('product_created', {
                price: data.price,
                currency: 'PLN',
            })
        }
        setSuccess(true)
        setName('')
        setDescription('')
        setPrice('')

    }

    return (
        <form onSubmit={handleSubmit} className="insert-product">
    <div>
        <label htmlFor="name">Name</label>
        <input
    id="name"
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    />
    </div>

    <div>
    <label htmlFor="description">Description</label>
        <textarea
    id="description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    required
    />
    </div>

    <div>
    <label htmlFor="price">Price (PLN)</label>
        <input
    id="price"
    type="number"
    step="0.01"
    min="0"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    required
    />
    </div>

    <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Product'}
        </button>

    {error && <p className="error">{error}</p>}
        {success && <p className="success">Product added!</p>}
        </form>
        )
        }