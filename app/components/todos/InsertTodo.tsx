'use client'

import React, { useState } from 'react'
import { useClerkSupabaseClient } from '@/app/utils/supabase/client'
import type { Todo } from '@/app/utils/types'
import posthog from 'posthog-js'
import '@/app/css/todos/InsertTodo.css'

export default function InsertTodo({ addTodo }: { addTodo: (todo: Todo) => void }) {
    const [name, setName] = useState('')
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const supabase = useClerkSupabaseClient()


    async function handleSubmit(e: React.FormEvent) {
        if(!supabase)
            return
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        const { data, error } = await supabase
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
        if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
            posthog.capture('todo_created')
        }
        setSuccess(true)
        setName('')
        setText('')
        console.log("send email")
        // fire-and-forget — don't block the UI on email sending
        fetch('/api/send-todo-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: data.name }),
        }).catch((err) => {
            console.error('Failed to send confirmation email:', err)
        })
    }

    return (
        <form onSubmit={handleSubmit} className="insert-todo">
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

            {error && <p className="error">{error}</p>}
            {success && <p className="success">Todo added!</p>}
        </form>
    )
}