import { create, type StateCreator } from 'zustand'
import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'
import {
  type Order,
  type OrderSlice,
  CreateOrderDto,
  ClientInfo,
  PaymentInfo
} from '@/types/order'
import { orderSchema } from '@/schemas/orderSchema'

export const useOrders: StateCreator<OrderSlice> = (set, get) => ({
  orders: [],
  order: null,
  pendingOrder: null,
  loading: false,
  items: [],
  selectedItem: null,
  detailedOrder: [],
  clientInfo: null,
  paymentInfo: { method: '', amountGiven: 0 },

  prepareOrderData: () => {
    const { items, clientInfo, paymentInfo } = get()
    const formattedItems = items.map((item) => ({
      meal_id: item.id,
      quantity: item.quantity,
      details: [
        {
          detail:
            typeof item.notes === 'string' && item.notes.trim() !== ''
              ? item.notes
              : 'Sin notas'
        }
      ]
    }))

    console.log('Formatted Items:', formattedItems)

    const orderData: CreateOrderDto = {
      client_name: clientInfo?.name || '',
      client_phone: clientInfo?.phone || '',
      items: formattedItems,
      payments: paymentInfo.method
        ? [
            {
              payment_method: paymentInfo.method,
              amount_given: paymentInfo.amountGiven
            }
          ]
        : []
    }
    return orderData
  },

  setClientInfo: (info) => set({ clientInfo: info }),
  setPaymentInfo: (info) => set({ paymentInfo: info }),

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

  clearCart: () =>
    set({
      items: [],
      clientInfo: null,
      paymentInfo: { method: '', amountGiven: 0 }
    }),

  selectItem: (item) => set({ selectedItem: item }),

  getOrders: async () => {
    const { data } = await axiosInstance.get('/order')
    set({
      orders: data,
      detailedOrder: data
    })
  },

  registerOrder: async () => {
    set({ loading: true })

    try {
      const orderData = get().prepareOrderData()

      // Validate data using Yup schema
      await orderSchema.validate(orderData)

      // Submit order
      const { data } = await axiosInstance.post<Order>('/order', orderData)

      set({
        pendingOrder: data,
        items: [],
        clientInfo: null,
        paymentInfo: { method: '', amountGiven: 0 }
      })

      toastAlert({
        title: 'Orden registrada',
        icon: 'success',
        timer: 3300
      })

      return true
    } catch (err: any) {
      const message =
        err.response?.data.message ||
        err.message ||
        'Ocurrió un error inesperado'

      toastAlert({
        title: ` Aqui es el error ${message}`,
        icon: 'error',
        timer: 3300
      })

      return false
    } finally {
      set({ loading: false })
    }
  },

  completePayment: async (paymentInfo: PaymentInfo) => {
    set({ loading: true })

    try {
      const { pendingOrder } = get()
      if (!pendingOrder) {
        throw new Error('No hay una orden pendiente para pagar')
      }

      const paymentData = {
        order_id: pendingOrder.id,
        payment_method: paymentInfo.method,
        amount_given: paymentInfo.amountGiven
      }

      // Submit payment
      const { data } = await axiosInstance.post<Order>(
        '/order/payment',
        paymentData
      )

      set({
        order: data,
        pendingOrder: null,
        paymentInfo: { method: '', amountGiven: 0 }
      })

      toastAlert({
        title: 'Pago completado',
        icon: 'success',
        timer: 3300
      })

      return true
    } catch (err: any) {
      const message =
        err.response?.data.message ||
        err.message ||
        'Ocurrió un error al procesar el pago'

      toastAlert({
        title: message,
        icon: 'error',
        timer: 3300
      })

      return false
    } finally {
      set({ loading: false })
    }
  },

  isOrderReadyToRegister: () => {
    const { items, clientInfo } = get()
    return (
      items.length > 0 &&
      clientInfo !== null &&
      clientInfo.name !== '' &&
      clientInfo.phone !== ''
    )
  },

  isOrderReadyToPayment: () => {
    const { pendingOrder, paymentInfo } = get()
    return (
      pendingOrder !== null &&
      paymentInfo.method !== '' &&
      paymentInfo.amountGiven > 0
    )
  }
})

export const useOrdersStore = create<OrderSlice>()((...a) => ({
  ...useOrders(...a)
}))
