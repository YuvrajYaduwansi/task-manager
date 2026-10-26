import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

export type Task = {
  id: string
  title: string
  done: boolean
}

export type TaskList = {
  id: string
  name: string
  tasks: Task[]
}

type TasksState = {
  lists: TaskList[]
  selectedListId: string | null
}

const initialState: TasksState = {
  lists: [],
  selectedListId: null,
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

export function hasListName(
  lists: readonly { id?: string; name: string }[],
  name: string,
  exceptId?: string,
) {
  const normalized = name.trim().toLocaleLowerCase()
  if (!normalized) return false
  return lists.some(
    (list) =>
      list.id !== exceptId &&
      list.name.trim().toLocaleLowerCase() === normalized,
  )
}

function selectedList(state: TasksState) {
  return state.lists.find((list) => list.id === state.selectedListId)
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    selectList(state, action: PayloadAction<string>) {
      if (!state.lists.some((list) => list.id === action.payload)) return
      state.selectedListId = action.payload
    },
    addList: {
      reducer(state, action: PayloadAction<TaskList>) {
        const name = action.payload.name.trim()
        if (!name || hasListName(state.lists, name)) return
        state.lists.push({ ...action.payload, name, tasks: [] })
        state.selectedListId = action.payload.id
      },
      prepare(name: string) {
        return {
          payload: {
            id: nanoid(),
            name: name.trim(),
            tasks: [],
          },
        }
      },
    },
    renameList(state, action: PayloadAction<{ id: string; name: string }>) {
      const name = action.payload.name.trim()
      if (!name || hasListName(state.lists, name, action.payload.id)) return
      const list = state.lists.find((item) => item.id === action.payload.id)
      if (!list) return
      list.name = name
    },
    removeList(state, action: PayloadAction<string>) {
      const index = state.lists.findIndex((list) => list.id === action.payload)
      if (index < 0) return
      state.lists.splice(index, 1)
      if (state.selectedListId !== action.payload) return
      const next = state.lists[index] ?? state.lists[index - 1]
      state.selectedListId = next?.id ?? null
    },
    addTask: {
      reducer(state, action: PayloadAction<Task>) {
        const list = selectedList(state)
        if (!list || !action.payload.title || hasTaskTitle(list.tasks, action.payload.title)) {
          return
        }
        list.tasks.push(action.payload)
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title: title.trim(),
            done: false,
          },
        }
      },
    },
    setTaskDone(state, action: PayloadAction<{ id: string; done: boolean }>) {
      const task = selectedList(state)?.tasks.find((item) => item.id === action.payload.id)
      if (!task) return
      task.done = action.payload.done
    },
    updateTask(state, action: PayloadAction<{ id: string; title: string }>) {
      const list = selectedList(state)
      const title = action.payload.title.trim()
      if (!list || !title || hasTaskTitle(list.tasks, title, action.payload.id)) return
      const task = list.tasks.find((item) => item.id === action.payload.id)
      if (!task) return
      task.title = title
    },
    removeTask(state, action: PayloadAction<string>) {
      const list = selectedList(state)
      if (!list) return
      list.tasks = list.tasks.filter((task) => task.id !== action.payload)
    },
    reorderTasks(
      state,
      action: PayloadAction<{ activeId: string; overId: string }>,
    ) {
      const list = selectedList(state)
      if (!list) return
      const fromIndex = list.tasks.findIndex(
        (task) => task.id === action.payload.activeId,
      )
      const toIndex = list.tasks.findIndex(
        (task) => task.id === action.payload.overId,
      )
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return

      const [moved] = list.tasks.splice(fromIndex, 1)
      if (!moved) return
      list.tasks.splice(toIndex, 0, moved)
    },
  },
})

export const {
  selectList,
  addList,
  renameList,
  removeList,
  addTask,
  setTaskDone,
  updateTask,
  removeTask,
  reorderTasks,
} = tasksSlice.actions

export const selectLists = (state: RootState) => state.tasks.lists

export const selectSelectedList = (state: RootState) =>
  state.tasks.lists.find((list) => list.id === state.tasks.selectedListId) ?? null

export const selectTasks = (state: RootState) => selectSelectedList(state)?.tasks ?? []

export default tasksSlice.reducer
