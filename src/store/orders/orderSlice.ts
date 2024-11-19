import { create, type StateCreator } from 'zustand'

import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'

import { type Order, type OrderSlice } from '@/types/order'

export const useOrders: StateCreator<OrderSlice> = (set, get) => ({
  orders: [],
  order: null,
  loading: false,

  getOrders: async () => {
    await axiosInstance.get('/order').then(({ data }) => {
      set({
        orders: data
      })
    })
  },
  saveOrder: async () => {
    set({ loading: true })
    return await axiosInstance
      .post('/order')
      .then(({ data }) => {
        set({
          order: data
        })
        toastAlert({
          title: data.message,
          icon: 'success'
        })
        return true
      })
      .catch((err) => {
        const message =
          err.response?.data.message || 'Error, llame al administrador'
        toastAlert({ title: message, icon: 'error' })
        return false
      })
      .finally(() => {
        set({ loading: false })
      })
  }
})

export const useOrdersStore = create<OrderSlice>()((...a) => ({
  ...useOrders(...a)
}))
