import { configureStore } from '@reduxjs/toolkit'
import { readStoredTasks, writeStoredTasks } from '../utils/taskStorage'
import tasksReducer from '../utils/tasksSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState: {
    tasks: {
      items: readStoredTasks(),
    },
  },
})

let storedTasks = store.getState().tasks.items

store.subscribe(() => {
  const tasks = store.getState().tasks.items
  if (tasks === storedTasks) return
  storedTasks = tasks
  writeStoredTasks(tasks)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
