import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

export type Task = {
  id: string
  title: string
}

type TasksState = {
  items: Task[]
}

const initialState: TasksState = {
  items: [],
}

export function hasTaskTitle(
  tasks: readonly { id?: string; title: string }[],
  title: string,
  exceptId?: string,
) {
  const normalized = title.trim().toLocaleLowerCase()
  if (!normalized) return false
  return tasks.some(
    (task) =>
      task.id !== exceptId &&
      task.title.trim().toLocaleLowerCase() === normalized,
  )
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action: PayloadAction<Task>) {
        if (!action.payload.title || hasTaskTitle(state.items, action.payload.title)) {
          return
        }
        state.items.push(action.payload)
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title: title.trim(),
          },
        }
      },
    },
    updateTask(state, action: PayloadAction<{ id: string; title: string }>) {
      const title = action.payload.title.trim()
      if (!title || hasTaskTitle(state.items, title, action.payload.id)) return

      const task = state.items.find((item) => item.id === action.payload.id)
      if (!task) return
      task.title = title
    },
    removeTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((task) => task.id !== action.payload)
    },
    reorderTasks(
      state,
      action: PayloadAction<{ activeId: string; overId: string }>,
    ) {
      const fromIndex = state.items.findIndex(
        (task) => task.id === action.payload.activeId,
      )
      const toIndex = state.items.findIndex(
        (task) => task.id === action.payload.overId,
      )
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return

      const [moved] = state.items.splice(fromIndex, 1)
      if (!moved) return
      state.items.splice(toIndex, 0, moved)
    },
  },
})

export const { addTask, updateTask, removeTask, reorderTasks } = tasksSlice.actions

export const selectTasks = (state: RootState) => state.tasks.items

export default tasksSlice.reducer
