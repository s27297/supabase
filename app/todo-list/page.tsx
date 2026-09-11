'use client'

import { useEffect, useState } from 'react'
import { useClerkSupabaseClient } from '@/app/utils/supabase/client'
import InsertTodo from '@/app/components/InsertTodo'
import TodoItem from '@/app/components/TodoItem'
import type { Todo } from '@/app/utils/types'
import '../css/TodosList.css'

export default function TodosList() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = useClerkSupabaseClient()

    useEffect(() => {

        async function fetchTodos() {
            const { data, error } = await supabase.from('todos').select('*')
            if (error) setError(error.message)
            else setTodos(data ?? [])
            setLoading(false)
        }

        fetchTodos()
    }, [])

    const addTodo = (todo: Todo) => {
        setTodos((prev) => [...prev, todo])
    }

    const updateTodo = async (updated: Todo) => {
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
    }

    const deleteTodo = async (id: Todo['id']) => {
        const { error } = await supabase.from('todos').delete().eq('id', id)

        if (error) {
            setError(error.message)
            return
        }
        setTodos((prev) => prev.filter((t) => t.id !== id))
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