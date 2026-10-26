import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { Button } from './components/Button'
import { TaskList } from './features/tasks/TaskList'
import { addTask, hasTaskTitle, selectTasks } from './utils/tasksSlice'

function App() {
  const [title, setTitle] = useState('')
  const [duplicate, setDuplicate] = useState(false)
  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    if (hasTaskTitle(tasks, trimmed)) {
      setDuplicate(true)
      return
    }
    dispatch(addTask(trimmed))
    setTitle('')
    setDuplicate(false)
  }

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-12 text-left">
      <h1 className="mb-6 text-3xl tracking-tight">Tasks</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="task-title">
            Task
          </label>
          <input
            id="task-title"
            className="min-w-0 flex-1 rounded-md border border-line bg-canvas px-4 py-2 text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            value={title}
            aria-invalid={duplicate}
            aria-describedby={duplicate ? 'task-title-error' : undefined}
            onChange={(event) => {
              setTitle(event.target.value)
              setDuplicate(false)
            }}
            placeholder="Write a task"
          />
          <Button type="submit" variant="primary" text="Add" />
        </div>
        {duplicate ? (
          <p id="task-title-error" role="alert" className="mt-2 text-sm text-danger">
            Task already exists
          </p>
        ) : null}
      </form>
      <TaskList />
    </main>
  )
}

export default App
