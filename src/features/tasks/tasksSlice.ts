import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

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

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action: PayloadAction<Task>) {
        if (!action.payload.title) return
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
  },
})

export const { addTask } = tasksSlice.actions

export const selectTasks = (state: RootState) => state.tasks.items

export default tasksSlice.reducer
