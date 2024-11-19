import { create, type StateCreator } from 'zustand'

import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'

import { type Meal, type MealSlice } from '@/types/meals'

export const useMeals: StateCreator<MealSlice> = (set, get) => ({
  meals: [],

  getMeals: async () => {
    await axiosInstance.get('/meal').then(({ data }) => {
      set({
        meals: data
      })
    })
  }
})

export const useMealsStore = create<MealSlice>()((...a) => ({
  ...useMeals(...a)
}))
