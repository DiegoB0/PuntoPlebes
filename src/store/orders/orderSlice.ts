import { create, type StateCreator } from 'zustand'
import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'
import { type Order, type OrderSlice, CreateOrderDto } from '@/types/order'
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
  updateOrderPayment: async (orderId, paymentInfo) => {
    // TODO: Implementar actualizacion cuando el backend sirva bien
    set({ loading: true })
    await axiosInstance
      .put(`/order/${orderId}`, {
        payments: [
          {
            payment_method: paymentInfo.method,
            amount_given: paymentInfo.amountGiven
          }
        ]
      })
      .then(() => {
        set({
          detailedOrder: get().detailedOrder.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  payments: [
                    {
                      payment_method: paymentInfo.method,
                      amount_given: paymentInfo.amountGiven
                    }
                  ]
                }
              : order
          )
        })
        toastAlert({
          title: 'Orden actualizada',
          icon: 'success',
          timer: 1500
        })
      })
      .catch((err) => {
        const message =
          err.response?.data.message ||
          err.message ||
          'Ocurrió un error inesperado'

        toastAlert({
          title: ` ${message}`,
          icon: 'error',
          timer: 3300
        })
        console.error('Error updating order payment:', err.response?.data)
      })
      .finally(() => set({ loading: false }))
  },
  updateOrderStatus: async (orderId, status) => {
    set({ loading: true })
    await axiosInstance
      .put(`/order/${orderId}`, {
        order_status: status,
        payments: get().paymentInfo
      })
      .then(() => {
        console.log('Intentando actualizar la orden, slice', orderId, status)
        set({
          orders: get().orders.map((order) =>
            order.id === orderId ? { ...order, order_status: status } : order
          )
        })
        toastAlert({
          title: 'Orden actualizada',
          icon: 'success',
          timer: 1500
        })
      })
      .catch((err) => {
        const message =
          err.response?.data.message ||
          err.message ||
          'Ocurrió un error inesperado'

        toastAlert({
          title: ` ${message}`,
          icon: 'error',
          timer: 3300
        })
        console.error('Error updating order status:', err.response?.data)
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
  addItemDetail: (itemId: number, newDetails: string[]) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              details: [
                ...(item.details || []),
                ...newDetails.filter(
                  (newDetail) => !(item.details || []).includes(newDetail) // Evita duplicados
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
      await orderSchema.validate(orderData)
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
