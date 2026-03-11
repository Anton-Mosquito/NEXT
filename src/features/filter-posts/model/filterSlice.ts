// src/features/filter-posts/model/filterSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

interface FilterState {
  search: string
  userId: number | null
  page: number
  limit: number
}

const initialState: FilterState = {
  search: '',
  userId: null,
  page: 1,
  limit: 5,
}

export const filterSlice = createSlice({
  name: 'postsFilter',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
      state.page = 1 // скидаємо на першу сторінку при пошуку
    },
    setUserId: (state, action: PayloadAction<number | null>) => {
      state.userId = action.payload
      state.page = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    resetFilters: () => initialState,
  },
})

export const { setSearch, setUserId, setPage, resetFilters } = filterSlice.actions

export const selectPostsFilter = (state: RootState) => state.postsFilter