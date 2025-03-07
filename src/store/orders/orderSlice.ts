import { create, type StateCreator } from 'zustand'
import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'
import { type Order, type OrderSlice, CreateOrderDto } from '@/types/order'
import { orderSchema } from '@/schemas/orderSchema'
import { handleApiError } from '@/services/apiResponses'

export const useOrders: StateCreator<OrderSlice> = (set, get) => ({
  orders: [],
  order: null,
  pendingOrder: null,
  loading: false,
  items: [],
  selectedItem: null,
  detailedOrder: [],
  clientInfo: { name: '', phone: '' },
  paymentInfo: { payment_method: '', amount_given: 0 },
  lastNumber: 0,

  setPartialClientInfo: (info) => set({ clientInfo: info }),
  isClientInfoComplete: () => {
    const { clientInfo } = get()
    return Boolean(clientInfo?.name && clientInfo?.phone)
  },

  getLastOrderNumber: async () => {
    const { data } = await axiosInstance.get('/order/last')
    set({ lastNumber: data })
  },
  updateOrderPayment: async (orderId, paymentInfo) => {
    set({ loading: true })
    await axiosInstance
      .put(`/order/${orderId}`, {
        payments: [
          {
            payment_method: paymentInfo.payment_method,
            amount_given: paymentInfo.amount_given
          }
        ]
      })
      .then(() => {
        get().getOrders()
        toastAlert({
          title: 'Orden actualizada',
          icon: 'success',
          timer: 1500
        })
      })
      .catch((err) => {
        handleApiError(err, 'Ocurrio un error inesperado')
      })
      .finally(() => set({ loading: false }))
  },
  updateOrderStatus: async (orderId, status) => {
    set({ loading: true })
    await axiosInstance
      .put(`/order/${orderId}`, {
        order_status: status
      })
      .then((response) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, order_status: status } : order
          )
        }))
        toastAlert({
          title: 'Orden actualizada',
          icon: 'success',
          timer: 1500
        })
      })
      .catch((err) => {
        handleApiError(err, 'Ocurrio un error inesperado')
      })
      .finally(() => set({ loading: false }))
  },

  prepareOrderData: () => {
    const { items, clientInfo, paymentInfo } = get()
    const formattedItems = items.map((item) => ({
      meal_id: item.id,
      quantity: item.quantity,
      details: item.details || []
    }))

    return {
      client_name: clientInfo?.name || '',
      client_phone: clientInfo?.phone || '',
      items: formattedItems,
      payments: paymentInfo.payment_method
        ? [
            {
              payment_method: paymentInfo.payment_method,
              amount_given: paymentInfo.amount_given
            }
          ]
        : []
    }
  },
  addItemDetail: (itemId: number, newDetails: string[]) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              details: [
                ...(item.details || []),
                ...newDetails.filter(
                  (newDetail) => !(item.details || []).includes(newDetail)
                )
              ]
            }
          : item
      )
    }))
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
    set((state) => {
      const itemToRemove = state.items.find((item) => item.id === id)
      if (itemToRemove) {
        if (itemToRemove.quantity > 1) {
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
          }
        }
        return {
          items: state.items.filter((item) => item.id !== id)
        }
      }
      return state
    }),

  clearCart: () =>
    set({
      items: [],
      clientInfo: { name: '', phone: '' },
      paymentInfo: { payment_method: '', amount_given: 0 }
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
      await orderSchema.validate(orderData)

      const { data } = await axiosInstance.post<Order>('/order', orderData)
      console.log(data)
      // ✅ Only set order if the request was successful
      set({
        pendingOrder: data,
        items: [],
        clientInfo: { name: '', phone: '' },
        paymentInfo: { payment_method: '', amount_given: 0 }
      })

      toastAlert({
        title: 'Orden registrada',
        icon: 'success',
        timer: 3300
      })

      return true
    } catch (err: any) {
      const message =
        err.response?.data?.message || // ✅ Get error message from backend
        err.message ||
        'Ocurrió un error inesperado'

      // ✅ Show error and prevent success alert
      toastAlert({
        title: `${message}`,
        icon: 'error',
        timer: 3300
      })

      return false // ✅ Stop execution on error
    } finally {
      set({ loading: false })
    }
  },

  isOrderReadyToRegister: () => {
    const { items, clientInfo, paymentInfo } = get()
    return (
      items.length >= 1 &&
      clientInfo !== null &&
      clientInfo.name !== '' &&
      clientInfo.phone !== ''
    )
  }
})

export const useOrdersStore = create<OrderSlice>()((...a) => ({
  ...useOrders(...a)
}))
