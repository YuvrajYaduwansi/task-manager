import { useSortable } from '@dnd-kit/sortable'
import { motion } from 'motion/react'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { twMerge } from 'tailwind-merge'
import crossIcon from '../../assets/cross.svg'
import dragIcon from '../../assets/drag.svg'
import editIcon from '../../assets/edit.svg'
import tickIcon from '../../assets/tick.svg'
import { Icon } from '../../components/Icon'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import {
  hasTaskTitle,
  selectTasks,
  setTaskDone,
  updateTask,
  type Task,
} from '../../utils/tasksSlice'
import { TaskCheckbox } from '../../components/TaskCheckbox'
import { cardMotion, iconButtonClassName } from '../../utils/misc'
type TaskCardProps = {
  task: Task
  onRemove: () => void
}

type EditError = 'empty' | 'duplicate'

const editErrorMessage: Record<EditError, string> = {
  empty: 'Task cannot be empty',
  duplicate: 'Task already exists',
}

export function TaskCard({ task, onRemove }: TaskCardProps) {
  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)
  const [error, setError] = useState<EditError | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const errorId = useId()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, disabled: editing })

  useEffect(() => {
    if (!editing) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [editing])

  function startEditing() {
    setDraft(task.title)
    setError(null)
    setEditing(true)
  }

  function cancelEditing() {
    setDraft(task.title)
    setError(null)
    setEditing(false)
  }

  function saveEditing() {
    const trimmed = draft.trim()
    if (!trimmed) {
      setError('empty')
      return
    }
    if (hasTaskTitle(tasks, trimmed, task.id)) {
      setError('duplicate')
      return
    }
    if (trimmed !== task.title) {
      dispatch(updateTask({ id: task.id, title: trimmed }))
    }
    setError(null)
    setEditing(false)
  }

  function handleDraftKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      saveEditing()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      cancelEditing()
    }
  }

  return (
    <motion.li
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={isDragging ? 'relative z-10 overflow-visible' : 'overflow-hidden'}
    >
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Translate.toString(transform),
          transition,
        }}
        className={`group flex flex-col gap-1 rounded-md bg-card py-2 pr-2 pl-2 text-heading ${
          isDragging ? 'shadow-lg' : ''
        }`}
      >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`${iconButtonClassName} cursor-grab active:cursor-grabbing disabled:cursor-default`}
          aria-label={`Reorder ${task.title}`}
          disabled={editing}
          {...(editing ? {} : { ...attributes, ...listeners })}
        >
          <Icon src={dragIcon} />
        </button>
        <TaskCheckbox
          checked={false}
          label={task.title}
          disabled={editing}
          onChange={() => dispatch(setTaskDone({ id: task.id, done: true }))}
        />
        {editing ? (
          <input
            ref={inputRef}
            className="min-w-0 flex-1 rounded-md border border-line bg-canvas px-3 py-1 text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            value={draft}
            aria-label={`Edit ${task.title}`}
            aria-invalid={error !== null}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => {
              setDraft(event.target.value)
              setError(null)
            }}
            onKeyDown={handleDraftKeyDown}
          />
        ) : (
          <span className="min-w-0 flex-1 wrap-break-word">{task.title}</span>
        )}
        {editing ? (
          <>
            <button
              type="button"
              className={twMerge(iconButtonClassName, 'text-accent hover:text-accent')}
              aria-label="Save task"
              onClick={saveEditing}
            >
              <Icon src={tickIcon} />
            </button>
            <button
              type="button"
              className={iconButtonClassName}
              aria-label="Cancel editing"
              onClick={cancelEditing}
            >
              <Icon src={crossIcon} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={twMerge(
                iconButtonClassName,
                'w-0 overflow-hidden opacity-0 pointer-events-none group-hover:w-8 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:w-8 group-focus-within:opacity-100 group-focus-within:pointer-events-auto [@media(hover:none)]:w-8 [@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto',
              )}
              aria-label={`Edit ${task.title}`}
              onClick={startEditing}
            >
              <Icon src={editIcon} />
            </button>
            <button
              type="button"
              className={iconButtonClassName}
              aria-label={`Remove ${task.title}`}
              onClick={onRemove}
            >
              <Icon src={crossIcon} />
            </button>
          </>
        )}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="pl-10 text-sm text-danger">
          {editErrorMessage[error]}
        </p>
      ) : null}
      </div>
    </motion.li>
  )
}

export function CompletedTask({ task, onRemove }: TaskCardProps) {
  const dispatch = useAppDispatch()

  return (
    <motion.li {...cardMotion} className="overflow-hidden">
      <div className="flex items-center gap-2 rounded-md bg-card py-2 pr-2 pl-2">
        <TaskCheckbox
          checked
          label={task.title}
          onChange={() => dispatch(setTaskDone({ id: task.id, done: false }))}
        />
        <span className="min-w-0 flex-1 wrap-break-word text-content line-through">
          {task.title}
        </span>
        <button
          type="button"
          className={iconButtonClassName}
          aria-label={`Remove ${task.title}`}
          onClick={onRemove}
        >
          <Icon src={crossIcon} />
        </button>
      </div>
    </motion.li>
  )
}
