'use client'

import { useEffect, useState } from 'react'
import { useClerkSupabaseClient } from '@/app/utils/supabase/client'
import InsertProduct from './InsertProduct'
import ProductItem from './ProductsItem'
import type { Product } from '@/app/utils/types'
import '@/app/css/products/ProductsList.css'

export default function ProductsList() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const supabase = useClerkSupabaseClient()

    useEffect(() => {
        async function fetchProducts() {
            if(!supabase)
                return
            const { data, error } = await supabase.from('products').select('*')
            if (error) setError(error.message)
            else setProducts(data ?? [])
            setLoading(false)
        }

        fetchProducts()
    }, [supabase])

    const addProduct = (product: Product) => {
        setProducts((prev) => [product, ...prev])
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="products-list">
        <InsertProduct addProduct={addProduct} />
    <div className="grid">
        {products.map((product) => (
                <ProductItem key={product.id} product={product} />
))}
    </div>
    </div>
)
}