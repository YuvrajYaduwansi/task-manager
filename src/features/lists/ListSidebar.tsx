import { AnimatePresence } from 'motion/react'
import { useId, useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { Button } from '../../components/Button'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import {
  addList,
  hasListName,
  removeList,
  selectLists,
  selectSelectedList,
  type TaskList,
} from '../../utils/tasksSlice'
import { ListNavItem } from './ListNavItem'

export function ListSidebar() {
  const lists = useAppSelector(selectLists)
  const selected = useAppSelector(selectSelectedList)
  const dispatch = useAppDispatch()
  const [name, setName] = useState('')
  const [error, setError] = useState<'empty' | 'duplicate' | null>(null)
  const [pendingList, setPendingList] = useState<TaskList | null>(null)
  const errorId = useId()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('empty')
      return
    }
    if (hasListName(lists, trimmed)) {
      setError('duplicate')
      return
    }
    dispatch(addList(trimmed))
    setName('')
    setError(null)
  }

  return (
    <aside className="border-b border-line bg-sidebar md:sticky md:top-0 md:flex md:h-svh md:w-72 md:shrink-0 md:flex-col md:border-r md:border-b-0">
      <div className="px-4 pt-6 pb-3">
        <p className="text-sm font-medium text-[#C084FC]">Task Manager</p>
        <h2 className="mt-4 text-lg">Lists</h2>
      </div>
      <nav aria-label="Task lists" className="md:min-h-0 md:flex-1 md:overflow-y-auto">
        <ul className="flex gap-2 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:px-3">
          {lists.map((list) => (
            <ListNavItem
              key={list.id}
              list={list}
              selected={list.id === selected?.id}
              onRemove={() => setPendingList(list)}
            />
          ))}
        </ul>
      </nav>
      <form className="border-t border-line p-4" onSubmit={handleSubmit}>
        <label className="mb-2 block text-sm font-medium text-heading" htmlFor="list-name">
          New list
        </label>
        <input
          id="list-name"
          className="w-full rounded-md border border-line bg-canvas px-3 py-2 text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          value={name}
          aria-invalid={error !== null}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setName(event.target.value)
            setError(null)
          }}
          placeholder="List name"
        />
        {error ? (
          <p id={errorId} role="alert" className="mt-2 text-sm text-danger">
            {error === 'empty' ? 'List name cannot be empty' : 'List already exists'}
          </p>
        ) : null}
        <Button type="submit" variant="primary" text="Add list" className="mt-3 w-full" />
      </form>
      <AnimatePresence>
        {pendingList ? (
          <ConfirmDialog
            key={pendingList.id}
            title="Remove list"
            description={`Are you sure you want to remove "${pendingList.name}"? The tasks in it will be removed too.`}
            confirmLabel="Yes"
            onConfirm={() => {
              dispatch(removeList(pendingList.id))
              setPendingList(null)
            }}
            onCancel={() => setPendingList(null)}
          />
        ) : null}
      </AnimatePresence>
    </aside>
  )
}
