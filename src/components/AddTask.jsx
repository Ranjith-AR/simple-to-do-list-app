import { useState } from 'react'
import './AddTask.css'

export default function AddTask({ onAdd }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a new task…"
        aria-label="New task"
      />
      <button type="submit">Add</button>
    </form>
  )
}
