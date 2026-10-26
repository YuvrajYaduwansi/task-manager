import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { addTask, selectTasks } from './features/tasks/tasksSlice'
import './App.css'

function App() {
  const [title, setTitle] = useState('')
  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    dispatch(addTask(trimmed))
    setTitle('')
  }

  return (
    <main className="app">
      <h1>Tasks</h1>
      <form className="task-form" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="task-title">
          Task
        </label>
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Write a task"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </main>
  )
}

export default App
