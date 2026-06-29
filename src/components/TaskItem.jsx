import './TaskItem.css'

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={onToggle}
        aria-label={`Mark "${task.text}" as ${task.done ? 'incomplete' : 'complete'}`}
      />
      <span className="task-text">{task.text}</span>
      <button
        className="delete-btn"
        onClick={onDelete}
        aria-label={`Delete "${task.text}"`}
      >
        ✕
      </button>
    </li>
  )
}
