'use client'

import React, { useState } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import {Todo} from "@/app/utils/types";

export default function InsertTodo({ addTodo }: { addTodo: (todo: Todo) => void }) {
    const [name, setName] = useState('')
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        const {data, error } = await supabase
            .from('todos')
            .insert([{ name, text }])
            .select()
            .single()

        setLoading(false)


        if (error) {
            setError(error.message)
            return
        }
        addTodo(data)

        setSuccess(true)
        setName('')
        setText('')
    }

    return (
        <form onSubmit={handleSubmit}>
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
                <label htmlFor="text">Text</label>
                <textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Todo'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Todo added!</p>}
        </form>
    )
}