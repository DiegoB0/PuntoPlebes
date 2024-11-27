import { renderHook, act } from '@testing-library/react'
import { useOrdersStore } from '@/store/orders/orderSlice'

describe('useOrdersStore', () => {
  // Pruebas para la gestión de items
  describe('Item Management', () => {
    it('should add a new item to the cart', () => {
      const { result } = renderHook(() => useOrdersStore())

      const newItem = {
        id: 1,
        name: 'Pizza',
        price: 10,
        quantity: 1
      }

      act(() => {
        result.current.addItem(newItem)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0]).toEqual({
        ...newItem,
        quantity: 1
      })
    })

    it('should increase quantity when adding an existing item', () => {
      const { result } = renderHook(() => useOrdersStore())

      const newItem = {
        id: 1,
        name: 'Pizza',
        price: 10,
        quantity: 1
      }

      act(() => {
        result.current.addItem(newItem)
        result.current.addItem(newItem)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].quantity).toBe(2)
    })

    it('should remove an item from the cart', () => {
      const { result } = renderHook(() => useOrdersStore())

      const newItem = {
        id: 1,
        name: 'Pizza',
        price: 10,
        quantity: 1
      }

      act(() => {
        result.current.addItem(newItem)
        result.current.removeItem(newItem.id)
      })

      expect(result.current.items).toHaveLength(0)
    })

    it('should update an existing item', () => {
      const { result } = renderHook(() => useOrdersStore())

      const newItem = {
        id: 1,
        name: 'Pizza',
        price: 10,
        quantity: 1
      }

      act(() => {
        result.current.addItem(newItem)
        result.current.updateItem(newItem.id, { notes: 'Sin queso' })
      })

      expect(result.current.items[0]).toHaveProperty('notes', 'Sin queso')
    })
  })

  // Pruebas para la información del cliente
  describe('Client Information', () => {
    it('should set client information', () => {
      const { result } = renderHook(() => useOrdersStore())

      const clientInfo = {
        name: 'Juan Pérez',
        phone: '1234567890'
      }

      act(() => {
        result.current.setClientInfo(clientInfo)
      })

      expect(result.current.clientInfo).toEqual(clientInfo)
    })

    it('should check if order is ready to register', () => {
      const { result } = renderHook(() => useOrdersStore())

      const item = {
        id: 1,
        name: 'Pizza',
        price: 10,
        quantity: 1
      }
      const clientInfo = {
        name: 'Juan Pérez',
        phone: '1234567890'
      }

      act(() => {
        result.current.addItem(item)
        result.current.setClientInfo(clientInfo)
      })

      expect(result.current.isOrderReadyToRegister()).toBe(true)
    })

    it('should not be ready to register without items or client info', () => {
      const { result } = renderHook(() => useOrdersStore())

      expect(result.current.isOrderReadyToRegister()).toBe(false)
    })
  })

  // Pruebas para la información de pago
  describe('Payment Information', () => {
    it('should set payment information', () => {
      const { result } = renderHook(() => useOrdersStore())

      const paymentInfo = {
        method: 'Efectivo',
        amountGiven: 50
      }

      act(() => {
        result.current.setPaymentInfo(paymentInfo)
      })

      expect(result.current.paymentInfo).toEqual(paymentInfo)
    })

    it('should check if order is ready for payment', () => {
      const { result } = renderHook(() => useOrdersStore())

      const pendingOrder = {
        id: 1,
        total: 30,
        client_name: 'Juan Pérez',
        client_phone: '1234567890',
        order_number: '123',
        total_price: 30,
        status: 'activa',
        created_at: '2023-08-22T15:30:00.000Z',
        updated_at: '2023-08-22T15:30:00.000Z',
        items: [],
        payments: [],
        order_status: 'pendiente'
      }
      const paymentInfo = {
        method: 'Efectivo',
        amountGiven: 50
      }

      act(() => {
        result.current.pendingOrder = pendingOrder
        result.current.setPaymentInfo(paymentInfo)
      })

      expect(result.current.isOrderReadyToPayment()).toBe(true)
    })
  })

  // Pruebas para limpiar el carrito
  describe('Cart Management', () => {
    it('should clear the cart completely', () => {
      const { result } = renderHook(() => useOrdersStore())

      const item = {
        id: 1,
        name: 'Pizza',
        price: 10,
        quantity: 1
      }
      const clientInfo = {
        name: 'Juan Pérez',
        phone: '1234567890'
      }
      const paymentInfo = {
        method: 'Efectivo',
        amountGiven: 50
      }

      act(() => {
        result.current.addItem(item)
        result.current.setClientInfo(clientInfo)
        result.current.setPaymentInfo(paymentInfo)
        result.current.clearCart()
      })

      expect(result.current.items).toHaveLength(0)
      expect(result.current.clientInfo).toBeNull()
      expect(result.current.paymentInfo).toEqual({ method: '', amountGiven: 0 })
    })
  })

  // Pruebas para selección de items
  describe('Item Selection', () => {
    it('should select a specific item', () => {
      const { result } = renderHook(() => useOrdersStore())

      const item = {
        id: 1,
        name: 'Pizza',
        price: 10,
        quantity: 1
      }

      act(() => {
        result.current.selectItem(item)
      })

      expect(result.current.selectedItem).toEqual(item)
    })
  })
})
