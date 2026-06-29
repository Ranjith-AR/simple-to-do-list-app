import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import AddTask from './AddTask'
import TaskItem from './TaskItem'
import './TaskList.css'

export default function TaskList({ session }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTasks()

    const channel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${session.user.id}`,
      }, () => fetchTasks())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [session])

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) setError(error.message)
    else setTasks(data)
    setLoading(false)
  }

  async function addTask(text) {
    const { error } = await supabase
      .from('tasks')
      .insert({ text, user_id: session.user.id })
    if (error) setError(error.message)
  }

  async function toggleTask(id, done) {
    const { error } = await supabase
      .from('tasks')
      .update({ done: !done })
      .eq('id', id)
    if (error) setError(error.message)
  }

  async function deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    if (error) setError(error.message)
  }

  async function clearCompleted() {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('done', true)
      .eq('user_id', session.user.id)
    if (error) setError(error.message)
  }

  const remaining = tasks.filter(t => !t.done).length

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1>To-Do List</h1>
          <div className="user-row">
            <span className="user-email" title={session.user.email}>
              {session.user.email}
            </span>
            <button className="signout-btn" onClick={() => supabase.auth.signOut()}>
              Sign out
            </button>
          </div>
        </header>

        <AddTask onAdd={addTask} />

        {error && <p className="error-banner">{error}</p>}

        {loading ? (
          <div className="list-placeholder">
            <div className="spinner" />
          </div>
        ) : (
          <ul className="task-list">
            {tasks.length === 0 ? (
              <li className="empty-state">No tasks yet — add one above!</li>
            ) : (
              tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id, task.done)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))
            )}
          </ul>
        )}

        <footer className="footer">
          <span className="remaining">
            {remaining} task{remaining !== 1 ? 's' : ''} remaining
          </span>
          <button className="clear-btn" onClick={clearCompleted}>
            Clear completed
          </button>
        </footer>
      </div>
    </div>
  )
}
