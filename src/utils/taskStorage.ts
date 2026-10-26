import type { Task, TaskList } from './tasksSlice'

const STORAGE_KEY = 'task-manager.lists'
const LEGACY_KEY = 'task-manager.tasks'

export type PersistedTasksState = {
  lists: TaskList[]
  selectedListId: string | null
}

const emptyState = (): PersistedTasksState => ({
  lists: [],
  selectedListId: null,
})

export function readStoredState(): PersistedTasksState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = parsePersisted(JSON.parse(raw))
      if (parsed) return parsed
    }

    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const tasks = parseTasks(JSON.parse(legacy))
      localStorage.removeItem(LEGACY_KEY)
      if (tasks.length === 0) return emptyState()

      const id = crypto.randomUUID()
      const migrated: PersistedTasksState = {
        lists: [{ id, name: 'Tasks', tasks }],
        selectedListId: id,
      }
      writeStoredState(migrated)
      return migrated
    }
  } catch {
    return emptyState()
  }

  return emptyState()
}

export function writeStoredState(state: PersistedTasksState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lists: state.lists,
        selectedListId: state.selectedListId,
      }),
    )
  } catch {
    // The lists still work for this visit if storage is full or blocked.
  }
}

function parsePersisted(value: unknown): PersistedTasksState | null {
  if (typeof value !== 'object' || value === null) return null
  const record = value as Record<string, unknown>
  if (!Array.isArray(record.lists)) return null

  const lists: TaskList[] = []
  const seenIds = new Set<string>()

  for (const item of record.lists) {
    const list = parseList(item, seenIds)
    if (list) lists.push(list)
  }

  if (lists.length === 0) return emptyState()

  const selectedListId =
    typeof record.selectedListId === 'string' &&
    lists.some((list) => list.id === record.selectedListId)
      ? record.selectedListId
      : lists[0].id

  return { lists, selectedListId }
}

function parseList(value: unknown, seenIds: Set<string>): TaskList | null {
  if (typeof value !== 'object' || value === null) return null
  const list = value as Record<string, unknown>
  if (typeof list.id !== 'string' || list.id.length === 0 || seenIds.has(list.id)) {
    return null
  }
  if (typeof list.name !== 'string' || list.name.trim().length === 0) return null
  if (!Array.isArray(list.tasks)) return null

  seenIds.add(list.id)
  return {
    id: list.id,
    name: list.name.trim(),
    tasks: parseTasks(list.tasks),
  }
}

function parseTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) return []

  const tasks: Task[] = []
  const seenIds = new Set<string>()

  for (const item of value) {
    if (!isStoredTask(item) || seenIds.has(item.id)) continue
    seenIds.add(item.id)
    tasks.push({ id: item.id, title: item.title, done: item.done === true })
  }

  return tasks
}

function isStoredTask(
  value: unknown,
): value is { id: string; title: string; done?: unknown } {
  if (typeof value !== 'object' || value === null) return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    task.id.length > 0 &&
    typeof task.title === 'string' &&
    task.title.trim().length > 0
  )
}
