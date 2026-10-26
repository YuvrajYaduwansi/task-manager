import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { twMerge } from 'tailwind-merge'
import crossIcon from '../../assets/cross.svg'
import editIcon from '../../assets/edit.svg'
import tickIcon from '../../assets/tick.svg'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { Icon } from '../../components/Icon'
import {
  hasListName,
  renameList,
  selectList,
  selectLists,
  type TaskList,
} from '../../utils/tasksSlice'

const iconButtonClassName =
  'inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md bg-transparent p-0 text-content hover:bg-line hover:text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

function listActionClassName(selected: boolean) {
  return twMerge(
    iconButtonClassName,
    'md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100',
    selected && 'md:pointer-events-auto md:opacity-100',
  )
}

type ListNavItemProps = {
  list: TaskList
  selected: boolean
  onRemove: () => void
}

export function ListNavItem({ list, selected, onRemove }: ListNavItemProps) {
  const lists = useAppSelector(selectLists)
  const dispatch = useAppDispatch()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(list.name)
  const [error, setError] = useState<'empty' | 'duplicate' | null>(null)
  const errorId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editing) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [editing])

  function save() {
    const trimmed = draft.trim()
    if (!trimmed) {
      setError('empty')
      return
    }
    if (hasListName(lists, trimmed, list.id)) {
      setError('duplicate')
      return
    }
    if (trimmed !== list.name) {
      dispatch(renameList({ id: list.id, name: trimmed }))
    }
    setError(null)
    setEditing(false)
  }

  function cancel() {
    setDraft(list.name)
    setError(null)
    setEditing(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      save()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      cancel()
    }
  }

  return (
    <li
      className={`group flex min-w-40 shrink-0 items-center gap-1 rounded-md px-2 py-1 md:min-w-0 md:w-full ${
        selected ? 'bg-accent-soft text-heading' : 'hover:bg-line/70'
      }`}
    >
      {editing ? (
        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              className="min-w-0 flex-1 rounded-md border border-line bg-canvas px-2 py-1 text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              value={draft}
              aria-label={`Rename ${list.name}`}
              aria-invalid={error !== null}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => {
                setDraft(event.target.value)
                setError(null)
              }}
              onKeyDown={handleKeyDown}
            />
            <button type="button" className={iconButtonClassName} aria-label="Save list" onClick={save}>
              <Icon src={tickIcon} />
            </button>
            <button type="button" className={iconButtonClassName} aria-label="Cancel renaming" onClick={cancel}>
              <Icon src={crossIcon} />
            </button>
          </div>
          {error ? (
            <p id={errorId} role="alert" className="mt-1 text-sm text-danger">
              {error === 'empty' ? 'List name cannot be empty' : 'List already exists'}
            </p>
          ) : null}
        </div>
      ) : (
        <>
          <button
            type="button"
            className="min-w-0 flex-1  text-yellow-500 truncate px-1 py-1.5 text-left text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-current={selected ? 'page' : undefined}
            onClick={() => dispatch(selectList(list.id))}
          >
            {list.name}
          </button>
          <span className="px-1 text-sm text-content">
            {list.tasks.filter((task) => !task.done).length}
          </span>
          <button
            type="button"
            className={listActionClassName(selected)}
            aria-label={`Rename ${list.name}`}
            onClick={() => {
              setDraft(list.name)
              setError(null)
              setEditing(true)
            }}
          >
            <Icon src={editIcon} />
          </button>
          <button
            type="button"
            className={listActionClassName(selected)}
            aria-label={`Remove ${list.name}`}
            onClick={onRemove}
          >
            <Icon src={crossIcon} />
          </button>
        </>
      )}
    </li>
  )
}
