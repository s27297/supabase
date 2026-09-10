'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import InsertTodo from "@/app/components/InsertTodo";
import TodoItem from "@/app/components/TodoItem";

import type {Todo} from '@/app/utils/types'

export default function TodosList() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()

        async function fetchTodos() {
            const { data, error } = await supabase.from('todos').select('*')
            if (error) setError(error.message)
            else setTodos(data ?? [])
            setLoading(false)
            console.log(data,error)
        }

        fetchTodos()
    }, [])

    const addTodo = (todo:Todo) => {
        setTodos((prev) => [...prev, todo])
    }
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div>
            <InsertTodo addTodo={addTodo}/>
        <ul>
            {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
            ))}
        </ul>
        </div>
    )
}