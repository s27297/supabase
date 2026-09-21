'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useClerkSupabaseClient } from '@/app/utils/supabase/client'

export default function CheckoutSuccessPage() {
    const supabase = useClerkSupabaseClient()
    const router = useRouter()

    useEffect(() => {
        async function clearBasket() {
            if(!supabase)
                return
            await supabase.from('basket_items').delete().neq('id', 0) // deletes all rows matching RLS (i.e. this user's)
        }
        clearBasket()
    }, [supabase])

    return (
        <div style={{ textAlign: 'center', marginTop: 80 }}>
            <h2>Payment successful 🎉</h2>
            <p>Thank you for your order!</p>
            <button onClick={() => router.push('/products')}>Continue shopping</button>
        </div>
    )
}