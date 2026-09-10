'use client'

import { useState } from 'react'
import type { Todo } from '@/app/utils/types'
import '../css/TodoItem.css'

type TodoItemProps = {
    todo: Todo
    onDelete: (id: Todo['id']) => void
    onUpdate: (todo: Todo) => void
}

export default function TodoItem({ todo, onDelete, onUpdate }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(todo.name)
    const [text, setText] = useState(todo.text)

    function handleSave() {
        onUpdate({ ...todo, name, text })
        setIsEditing(false)
    }

    function handleCancel() {
        setName(todo.name)
        setText(todo.text)
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <div className="todo-item">
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <textarea value={text} onChange={(e) => setText(e.target.value)} />
                <div className="actions">
                    <button className="save-btn" onClick={handleSave}>Save</button>
                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        )
    }

    return (
        <div className="todo-item">
            <h3>{todo.name}</h3>
            <p>{todo.text}</p>
            <div className="actions">
                <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                <button className="delete-btn" onClick={() => onDelete(todo.id)}>Delete</button>
            </div>
        </div>
    )
}