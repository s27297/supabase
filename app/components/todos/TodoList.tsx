'use client'

import { useEffect, useState } from 'react'
import { useClerkSupabaseClient } from '@/app/utils/supabase/client'
import InsertTodo from '@/app/components/todos/InsertTodo'
import TodoItem from '@/app/components/todos/TodoItem'
import type { Todo } from '@/app/utils/types'
import posthog from 'posthog-js'
import '../../css/todos/TodosList.css'
import {useAuth} from "@clerk/nextjs";

export default function TodosList() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = useClerkSupabaseClient()
    const {isSignedIn } = useAuth()
    useEffect(() => {

        async function fetchTodos() {
            if(!isSignedIn || !supabase)
                return;
            const { data, error } = await supabase.from('todos').select('*')
            if (error) setError(error.message)
            else setTodos(data ?? [])
            setLoading(false)
        }

        fetchTodos()
    }, [supabase,isSignedIn])

    const addTodo = (todo: Todo) => {
        setTodos((prev) => [...prev, todo])
    }

    const updateTodo = async (updated: Todo) => {
        if(!supabase)
            return
        const { data, error } = await supabase
            .from('todos')
            .update({ name: updated.name, text: updated.text })
            .eq('id', updated.id)
            .select()
            .single()

        if (error) {
            setError(error.message)
            return
        }
        setTodos((prev) => prev.map((t) => (t.id === data.id ? data : t)))
        if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
            posthog.capture('todo_updated')
        }
    }

    const deleteTodo = async (id: Todo['id']) => {
        if(!supabase)
            return
        const { error } = await supabase.from('todos').delete().eq('id', id)

        if (error) {
            setError(error.message)
            return
        }
        setTodos((prev) => prev.filter((t) => t.id !== id))
        if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
            posthog.capture('todo_deleted')
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="todos-list">
            <InsertTodo addTodo={addTodo} />
            <ul>
                {todos.map((todo) => (
                   <li key={todo.id}> <TodoItem  todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} /></li>
                ))}
            </ul>
        </div>
    )
}