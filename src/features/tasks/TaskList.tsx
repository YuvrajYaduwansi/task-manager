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

  if (tasks.length === 0) return null

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
          <ul className="mt-6 flex list-none flex-col gap-2 p-0">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onRemove={() => setPendingTask(task)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {pendingTask ? (
        <ConfirmDialog
          title="Remove task"
          description={`Are you sure you want to remove "${pendingTask.title}"?`}
          confirmLabel="Yes"
          onConfirm={confirmRemove}
          onCancel={closeDialog}
        />
      ) : null}
    </>
  )
}
