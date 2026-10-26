import { motion, MotionConfig } from 'motion/react'
import { useAppSelector } from './utils/hooks'
import { Typewriter } from './components/Typewriter'
import { ListSidebar } from './features/lists/ListSidebar'
import { TaskComposer } from './features/tasks/TaskComposer'
import { TaskList } from './features/tasks/TaskList'
import { selectSelectedList, selectTasks } from './utils/tasksSlice'

const rise = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

function App() {
  const selected = useAppSelector(selectSelectedList)

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-svh flex-col bg-canvas md:flex-row">
        <ListSidebar />
        <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
          <div className="mx-auto w-full max-w-2xl">
            {selected ? (
              <SelectedList id={selected.id} name={selected.name} />
            ) : (
              <EmptyLists />
            )}
          </div>
        </main>
      </div>
    </MotionConfig>
  )
}

function SelectedList({ id, name }: { id: string; name: string }) {
  const tasks = useAppSelector(selectTasks)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={rise}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <h1 className="text-3xl tracking-tight text-yellow-500">{name}</h1>
      <Typewriter
        className="mt-3 min-h-[1.45em] text-content"
        text="Add a task, drag it into place, and find this list when you come back."
        delayMs={280}
      />
      <TaskComposer listId={id} />
      <TaskList key={id} />
      {tasks.length === 0 ? (
        <p className="mt-6 text-content">No tasks in this list yet.</p>
      ) : null}
    </motion.div>
  )
}

function EmptyLists() {
  return (
    <div className="pt-16">
      <h1 className="text-3xl tracking-tight">No lists yet</h1>
      <p className="mt-3 max-w-md text-content">
        Add a list, then fill it with tasks.
      </p>
    </div>
  )
}

export default App
