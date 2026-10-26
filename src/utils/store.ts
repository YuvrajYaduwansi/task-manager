import { configureStore } from '@reduxjs/toolkit'
import { readStoredState, writeStoredState } from '../utils/taskStorage'
import tasksReducer from '../utils/tasksSlice'

const persisted = readStoredState()

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState: {
    tasks: persisted,
  },
})

let storedState = store.getState().tasks

store.subscribe(() => {
  const nextState = store.getState().tasks
  if (nextState === storedState) return
  storedState = nextState
  writeStoredState(nextState)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
