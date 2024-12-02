import { create, type StateCreator } from 'zustand'

import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'

import { type Meal, type MealSlice } from '@/types/meals'

export const useMeals: StateCreator<MealSlice> = (set, get) => ({
  meals: [],
  meal: null,
  loading: false,
  activeMeal: null,
  clearActiveMeal: () => {
    set({ meal: null })
  },
  setActiveMeal: async (id) => {
    set({ meal: null, activeMeal: id })
    try {
      const { data } = await axiosInstance.get(`/meal/${id}`)
      set({
        meal: data
      })
      console.log('Comida activa cargada:', data)
    } catch (error) {
      console.error('Error al cargar los datos de la comida:', error)
      toastAlert({
        title: 'Error al cargar los datos del usuario',
        icon: 'error'
      })
    }
  },
  getMeals: async () => {
    set({ loading: true })
    await axiosInstance.get('/meal').then(({ data }) => {
      set({
        meals: data,
        loading: false
      })
    })
  },
  saveMeal: async (meal) => {
    const formData: FormData = new FormData()
    Object.entries(meal).forEach(([key, value]) => {
      formData.append(key, value)
    })
    await axiosInstance
      .post('/meal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(({ data }) => {
        set({ meals: [...get().meals, data] })
        toastAlert({ title: 'Comida agregada', icon: 'success' })
      })
      .catch((error) => {
        console.error(error)
        toastAlert({ title: 'Error al agregar la comida', icon: 'error' })
      })
  },

  updateMeal: async (id, meal) => {
    console.log(meal)
    const formData: FormData = new FormData()
    Object.entries(meal).forEach(([key, value]) => {
      formData.append(key, value)
    })
    await axiosInstance
      .put(`/meal/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        set({
          meals: get().meals.map((m) => (m.id === id ? { ...m, ...meal } : m)),
          activeMeal: null
        })
        toastAlert({ title: 'Comida actualizada', icon: 'success' })
      })
      .catch((error) => {
        console.error(error)
        toastAlert({ title: 'Error al actualizar la comida', icon: 'error' })
      })
  },

  deleteMeal: async (id) => {
    await axiosInstance
      .delete(`/meal/${id}`)
      .then(() => {
        set({ meals: get().meals.filter((m) => m.id !== id) })
        toastAlert({ title: 'Comida eliminada', icon: 'success' })
      })
      .catch((error) => {
        console.error(error)
        toastAlert({ title: 'Error al eliminar la comida', icon: 'error' })
      })
  }
})

export const useMealsStore = create<MealSlice>()((...a) => ({
  ...useMeals(...a)
}))
