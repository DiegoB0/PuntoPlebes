import { useOrdersStore } from '@/store/orders/orderSlice'
import axiosInstance from '@/services/axiosInstance'
import { toastAlert } from '@/services/alerts'
import { act } from '@testing-library/react'

// Mock solo las dependencias externas
jest.mock('@/services/axiosInstance')
jest.mock('@/services/alerts')

describe('useOrdersStore - Async Methods', () => {
  beforeEach(() => {
    // Resetear el estado del store
    useOrdersStore.setState({
      items: [],
      clientInfo: null,
      paymentInfo: { method: '', amountGiven: 0 },
      pendingOrder: null
    })

    // Limpiar mocks
    jest.clearAllMocks()
  })

  it('should register an order successfully', async () => {
    // Mockear la respuesta de axios
    ;(axiosInstance.post as jest.Mock).mockResolvedValue({
      data: { id: '123', total: 100 }
    })

    // Preparar datos para la orden
    act(() => {
      useOrdersStore
        .getState()
        .addItem({ id: 1, name: 'Pizza', price: 10, quantity: 1 })
      useOrdersStore.getState().setClientInfo({
        name: 'John Doe',
        phone: '1234567890'
      })
    })

    // Registrar la orden
    const result = await act(
      async () => await useOrdersStore.getState().registerOrder()
    )

    // Verificaciones
    expect(result).toBe(true)
    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/order',
      expect.any(Object)
    )
    expect(toastAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Orden registrada',
        icon: 'success'
      })
    )

    const state = useOrdersStore.getState()
    expect(state.items).toHaveLength(0)
    expect(state.clientInfo).toBeNull()
  })
})
