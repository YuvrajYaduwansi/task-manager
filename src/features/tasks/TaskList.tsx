import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { AnimatePresence } from 'motion/react'
import { useCallback, useState } from 'react'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { TaskCard } from './TaskCard'
import { removeTask, reorderTasks, selectTasks, type Task } from '../../utils/tasksSlice'

export function TaskList() {
  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()
  const [pendingTask, setPendingTask] = useState<Task | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const closeDialog = useCallback(() => {
    setPendingTask(null)
  }, [])

  const confirmRemove = useCallback(() => {
    if (!pendingTask) return
    dispatch(removeTask(pendingTask.id))
    setPendingTask(null)
  }, [dispatch, pendingTask])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      dispatch(
        reorderTasks({
          activeId: String(active.id),
          overId: String(over.id),
        }),
      )
    },
    [dispatch],
  )

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="mt-4 flex list-none flex-col p-0">
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onRemove={() => setPendingTask(task)}
                />
              ))}
            </AnimatePresence>
          </ul>
        </SortableContext>
      </DndContext>
      <AnimatePresence>
        {pendingTask ? (
          <ConfirmDialog
            key={pendingTask.id}
            title="Remove task"
            description={`Are you sure you want to remove "${pendingTask.title}"?`}
            confirmLabel="Yes"
            onConfirm={confirmRemove}
            onCancel={closeDialog}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}
