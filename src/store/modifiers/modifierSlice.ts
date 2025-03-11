import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'
import {
  type ModifierSlice,
  type ModifierInputs,
  type Modifier
} from '@/types/modifiers'
import { create, type StateCreator } from 'zustand'

export const useModifier: StateCreator<ModifierSlice> = (set, get) => ({
  loading: false,
  modifiers: [],
  activeModifier: null,

  async saveModifier(modifier: ModifierInputs) {
    set({ loading: true })
    return await axiosInstance
      .post('/modifier', modifier)
      .then(({ data }) => {
        toastAlert({ title: 'Operación exitosa', icon: 'success' })
        const modifiers = get().modifiers
        set({ modifiers: [data, ...modifiers] })
        return true
      })
      .catch((err) => {
        const message =
          err.response?.data.message || 'Error, contact the administrator'
        toastAlert({ title: message, icon: 'error' })
        return false
      })
      .finally(() => {
        set({ loading: false })
      })
  },

  async updateModifier(modifier: ModifierInputs, id: number) {
    set({ loading: true })
    return await axiosInstance
      .put(`/modifier/${id}`, modifier)
      .then(({ data }) => {
        toastAlert({ title: 'Modifier updated', icon: 'success' })
        const modifiers = get().modifiers.map((mod) =>
          mod.id === id ? data : mod
        )
        set({ modifiers })
      })
      .catch((err) => {
        const message =
          err.response?.data.message || 'Error, contact the administrator'
        toastAlert({ title: message, icon: 'error' })
      })
      .finally(() => {
        set({ loading: false })
      })
  },

  async deleteModifier(id: number) {
    set({ loading: true })
    return await axiosInstance
      .delete(`/modifier/${id}`)
      .then(() => {
        toastAlert({ title: 'Modifier deleted', icon: 'success' })
        const modifiers = get().modifiers.filter((mod) => mod.id !== id)
        set({ modifiers })
      })
      .catch((err) => {
        const message =
          err.response?.data.message || 'Error, contact the administrator'
        toastAlert({ title: message, icon: 'error' })
      })
      .finally(() => {
        set({ loading: false })
      })
  },

  async getModifiers() {
    set({ loading: true })
    return await axiosInstance
      .get('/modifier')
      .then(({ data }) => {
        set({ modifiers: data })
      })
      .catch((err) => {
        const message =
          err.response?.data.message || 'Error, contact the administrator'
        toastAlert({ title: message, icon: 'error' })
      })
      .finally(() => {
        set({ loading: false })
      })
  },

  setActiveModifier: async (id) => {
    const modifier = get().modifiers.find((item) => item.id === id)
    set({ activeModifier: modifier })
  }
})

export const useModifierStore = create<ModifierSlice>()((...a) => ({
  ...useModifier(...a)
}))
