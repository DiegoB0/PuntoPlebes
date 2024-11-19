import { create, type StateCreator } from 'zustand'

import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'

import type { Category, CategorySlice } from '@/types/categories'

export const useCategories: StateCreator<CategorySlice> = (set, get) => ({
  categories: [],

  getCategories: async () => {
    await axiosInstance.get('/category').then(({ data }) => {
      set({
        categories: data
      })
    })
  }
})

export const useCategoriesStore = create<CategorySlice>()((...a) => ({
  ...useCategories(...a)
}))
