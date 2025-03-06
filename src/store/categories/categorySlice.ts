import { create, type StateCreator } from 'zustand'

import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'

import type { Category, CategorySlice } from '@/types/categories'

export const useCategories: StateCreator<CategorySlice> = (set, get) => ({
  categories: [],
  activeCategory: null,
  loading: false,

  getCategories: async () => {
    await axiosInstance.get('/category').then(({ data }) => {
      set({
        categories: data
      })
    })
  },

  setActiveCategory: async (id) => {
    const category = get().categories.find((category) => category.id === id)
    set({ activeCategory: category })
  },
  saveCategory: async (category) => {
    try {
      set({ loading: true })
      const { data } = await axiosInstance.post('/category', category)
      set((state) => ({
        categories: [data.category],
        loading: false
      }))
      toastAlert({ title: 'Categoria agregada con éxito', icon: 'success' })
      return data
    } catch (error) {
      console.error('Error al agregar la categoria:', error)
      toastAlert({
        title: 'Error al agregar la categoria',
        icon: 'error'
      })
      set({ loading: false })
      throw error
    }
  },

  updateCategory: async (category, id) => {
    try {
      set({ loading: true })
      const { data } = await axiosInstance.patch(`/category/${id}`, category)
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? data : category
        ),
        loading: false
      }))
      toastAlert({ title: 'Categoria actualizada', icon: 'success' })
      return data
    } catch (error) {
      console.error('Error al actualizar la categoria:', error)
      toastAlert({
        title: 'Error al actualizar la categoria',
        icon: 'error'
      })
      set({ loading: false })
      throw error
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ loading: true })
      await axiosInstance.delete(`/category/${id}`)
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        loading: false
      }))
      toastAlert({ title: 'Categoria eliminada', icon: 'success' })
    } catch (error) {
      console.error('Error al eliminar la categoria:', error)
      toastAlert({
        title: 'Error al eliminar la categoria',
        icon: 'error'
      })
      set({ loading: false })
      throw error
    }
  }
})

export const useCategoriesStore = create<CategorySlice>()((...a) => ({
  ...useCategories(...a)
}))
