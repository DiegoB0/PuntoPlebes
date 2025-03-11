
import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'
import { type Meal, type MealSlice } from '@/types/meals'
import { create, type StateCreator } from 'zustand'

export const useMeals: StateCreator<MealSlice> = (set, get) => ({
  meals: [],
  activeMeal: null,
  loading: false,
  mealId: null,
  clearActiveMeal: () => {
    set({ mealId: null })
  },
  setActiveMeal: async (id) => {
    set({ mealId: id })
    try {
      const { data } = await axiosInstance.get(`/meal/${id}`)
      set({
        activeMeal: data
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
  saveMeal: async (formData) => {
    try {
      set({ loading: true })
      const { data } = await axiosInstance.post('/meal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      set((state) => ({
        meals: [...state.meals, data.meal],
        activeMeal: null,
        loading: false
      }))

      toastAlert({ title: 'Comida agregada con éxito', icon: 'success' })
      return data
    } catch (error) {
      console.error('Error al agregar la comida:', error)
      toastAlert({
        title: 'Error al agregar la comida',
        icon: 'error'
      })
      set({ loading: false })
      throw error
    }
  },

  updateMeal: async (id, formData) => {
    try {
      set({ loading: true })
      console.log('mealData', formData)

      const { data } = await axiosInstance.patch(`/meal/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      set((state) => ({
        meals: state.meals.map((meal) => (meal.id === id ? data : meal)),
        activeMeal: null,
        loading: false
      }))

      toastAlert({ title: 'Comida actualizada', icon: 'success' })
      return data
    } catch (error) {
      console.error('Error al actualizar la comida:', error)
      toastAlert({
        title: 'Error al actualizar la comida',
        icon: 'error'
      })
      set({ loading: false })
      throw error
    }
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
