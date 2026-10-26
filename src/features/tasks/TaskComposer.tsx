import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { Button } from '../../components/Button'
import { addTask, hasTaskTitle, selectTasks } from '../../utils/tasksSlice'

export function TaskComposer({ listId }: { listId: string }) {
  return <TaskComposerForm key={listId} />
}

function TaskComposerForm() {
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
    <form className="mt-8" onSubmit={handleSubmit}>
      <label className="mb-2 block text-sm font-medium text-heading" htmlFor="task-title">
        Task
      </label>
      <div className="flex gap-2">
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
      <AnimatePresence>
        {duplicate ? (
          <motion.p
            id="task-title-error"
            role="alert"
            className="mt-2 text-sm text-danger"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            Task already exists
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  )
}
