import { render, screen, fireEvent } from '@testing-library/react'
import Checkout from '@/components/order/Checkout'

import { useRouter } from 'next/navigation'

jest.mock('@/store/orders/orderSlice', () => {
  const actual = jest.requireActual('@/store/orders/orderSlice')
  return {
    ...actual,
    useOrdersStore: jest.fn()
  }
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper })
}

// Mock de navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock de Zustand
const mockItems = [
  { id: 1, name: 'Hamburguesa', price: 100, quantity: 2 },
  { id: 2, name: 'Pizza', price: 200, quantity: 1 }
]
const mockRegisterOrder = jest.fn()
const mockGetOrders = jest.fn()
const mockIsOrderReadyToRegister = true
jest.mock('@/store/orders/orderSlice', () => ({
  useOrdersStore: () => ({
    items: mockItems,
    registerOrder: mockRegisterOrder,
    removeItem: jest.fn(),
    getOrders: mockGetOrders,
    isOrderReadyToRegister: mockIsOrderReadyToRegister
  })
}))

describe('Checkout Component', () => {
  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      back: jest.fn()
    })
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    renderWithProviders(<Checkout />)
    expect(mockGetOrders).toHaveBeenCalled()
  })

  it('should display the items in the cart', () => {
    renderWithProviders(<Checkout />)

    expect(screen.getByText('Hamburguesa')).toBeInTheDocument()
    expect(screen.getByText('Pizza')).toBeInTheDocument()
  })

  it('should display the total price', () => {
    renderWithProviders(<Checkout />)

    expect(screen.getByText('$428.00')).toBeInTheDocument()
  })

  jest.mock('@/components/UI/slideToConfirm', () => ({
    __esModule: true,
    default: ({ onConfirm, text, fillColor }: any) => (
      <button onClick={onConfirm} style={{ backgroundColor: fillColor }}>
        {text}
      </button>
    )
  }))

  it('should call registerOrder when confirming the order', () => {
    renderWithProviders(<Checkout />)

    const registerButton = screen.getByText('Registrar $428.00')
    fireEvent.click(registerButton) // Simula la acción de confirmación
    expect(mockIsOrderReadyToRegister).toBe(true)
  })
})
