'use client'

import { useState } from 'react'
import '@/app/css/Checkout.css'

export default function CheckoutPage() {
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const res = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, address }),
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.error ?? 'Something went wrong')
            setLoading(false)
            return
        }

        window.location.href = data.url // redirect to Stripe Checkout
    }

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
        <h2>Shipping details</h2>

    <div>
    <label htmlFor="name">Full name</label>
    <input
    id="name"
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    />
    </div>

    <div>
    <label htmlFor="address">Address</label>
        <textarea
    id="address"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    required
    />
    </div>

    <button type="submit" disabled={loading}>
        {loading ? 'Redirecting to payment...' : 'Continue to payment'}
        </button>

    {error && <p className="error">{error}</p>}
        </form>
    )
    }