import type { Task } from './tasksSlice'

const STORAGE_KEY = 'task-manager.tasks'

export function readStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const tasks: Task[] = []
    const seenIds = new Set<string>()

    for (const item of parsed) {
      if (!isStoredTask(item) || seenIds.has(item.id)) continue
      seenIds.add(item.id)
      tasks.push({ id: item.id, title: item.title })
    }

    return tasks
  } catch {
    return []
  }
}

export function writeStoredTasks(tasks: readonly Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // The list still works for this visit if storage is full or blocked.
  }
}

function isStoredTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false

  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    task.id.length > 0 &&
    typeof task.title === 'string' &&
    task.title.trim().length > 0
  )
}
