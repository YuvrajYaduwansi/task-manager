import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { Button } from './components/Button'
import { Typewriter } from './components/Typewriter'
import { TaskList } from './features/tasks/TaskList'
import { addTask, hasTaskTitle, selectTasks } from './utils/tasksSlice'

const rise = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

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
    <MotionConfig reducedMotion="user">
      <main className="mx-auto w-full max-w-xl px-6 py-12 text-left">
        <motion.h1
          className="text-3xl tracking-tight"
          variants={rise}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          Tasks
        </motion.h1>
        <Typewriter
          className="mt-3 min-h-[1.45em] text-content"
          text="Add a task, drag it into place, and find the same list when you come back."
          delayMs={280}
        />
        <form className="mt-8" onSubmit={handleSubmit}>
          <motion.label
            className="mb-2 block text-sm font-medium text-heading"
            htmlFor="task-title"
            variants={rise}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
          >
            Task
          </motion.label>
          <motion.div
            className="flex gap-2"
            variants={rise}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.45, delay: 0.28, ease: 'easeOut' }}
          >
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
          </motion.div>
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
        <TaskList />
      </main>
    </MotionConfig>
  )
}

export default App
