import { create, type StateCreator } from 'zustand'

import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'

import { type Order, type OrderSlice, CreateOrderDto } from '@/types/order'
import { orderSchema } from '@/schemas/orderSchema'
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export const useOrders: StateCreator<OrderSlice> = (set, get) => ({
  ...get(),
  orders: [],
  order: null,
  loading: false,
  items: [],
  selectedItem: null,
  prepareOrderData: () => {
    const { items } = get()
    const orderData: CreateOrderDto = {
      total_price: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      items: items.map((item) => ({
        meal_id: item.id,
        quantity: item.quantity,
        notes: item.notes?.[0] || null
      }))
    }
    return orderData
  },
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id)
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        }
      }
      return { items: [...state.items, { ...item, quantity: 1 }] }
    }),
  updateItem: (id, updatedItem) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      )
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id)
    })),
  clearCart: () => set({ items: [] }),

  selectItem: (item) => set({ selectedItem: item }),

  getOrders: async () => {
    await axiosInstance.get('/order').then(({ data }) => {
      set({
        orders: data
      })
    })
  },
  saveOrder: async (additionalData = {}) => {
    set({ loading: true })

    try {
      // Prepare order data
      const baseOrderData = get().prepareOrderData()

      // Merge with any additional data (like client info)
      const orderData = {
        ...baseOrderData,
        client_name: additionalData.client_name,
        client_phone: additionalData.client_phone
      }

      // Validate data using Yup schema
      await orderSchema.validate(orderData)

      // Submit order
      const { data } = await axiosInstance.post<Order>('/order', orderData)

      set({
        order: data,
        items: [] // Clear cart after successful order
      })

      toastAlert({
        title: 'Orden confirmada',
        icon: 'success'
      })

      return true
    } catch (err: any) {
      const message =
        err.response?.data.message ||
        err.message ||
        'Ocurrio un error inesperado'

      toastAlert({
        title: 'Error',
        icon: 'error',
        timer: 3000
      })

      return false
    } finally {
      set({ loading: false })
    }
  }
})

export const useOrdersStore = create<OrderSlice>()((...a) => ({
  ...useOrders(...a)
}))

export const useOrderForm = () => {
  return useForm<CreateOrderDto>({
    resolver: yupResolver(orderSchema) as Resolver<CreateOrderDto>,
    defaultValues: {
      client_name: '',
      client_phone: '',
      total_price: 0,
      items: []
    },
    mode: 'onChange'
  })
}
