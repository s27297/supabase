'use client'

import type {Todo} from '@/app/utils/types'

export default function TodoItem({ todo }: { todo: Todo }) {
    return (
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 8 }}>
    <h3 style={{ margin: 0 }}>{todo.name}</h3>
    <p style={{ margin: '4px 0 0' }}>{todo.text}</p>
    </div>
)
}