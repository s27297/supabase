'use client'

import React, { useState } from 'react'
import { useClerkSupabaseClient } from '@/app/utils/supabase/client'
import type { Todo } from '@/app/utils/types'
import '../../css/todos/InsertTodo.css'

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
        setSuccess(true)
        setName('')
        setText('')
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