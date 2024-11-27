// import { render, screen, fireEvent } from '@testing-library/react'
// import App from '@/app/admin/(admin)/sell/page'
// import { useOrdersStore } from '@/store/orders/orderSlice'

// import { jest } from '@jest/globals'
// // Ajustar el mock
// const useOrdersStoreMock = jest.mocked(useOrdersStore)
// jest.mock('@/store/orders/orderSlice', () => ({
//   useOrdersStore: jest.fn()
// }))

// describe('Order Flow', () => {
//   it('should allow adding items and registering an order', () => {
//     // Mock de `useOrdersStore`
//     const mockAddItem = jest.fn()
//     const mockRegisterOrder = jest.fn()

//     useOrdersStoreMock.mockReturnValue({
//       items: [],
//       addItem: mockAddItem,
//       registerOrder: mockRegisterOrder
//     })

//     render(<App />)

//     // Agregar un producto
//     fireEvent.click(screen.getByText('Hamburguesa'))
//     expect(mockAddItem).toHaveBeenCalledWith({
//       id: 1,
//       name: 'Hamburguesa',
//       price: 100
//     })

//     // Verificar en Checkout
//     expect(screen.getByText('Hamburguesa')).toBeInTheDocument()

//     // Confirmar orden
//     fireEvent.click(screen.getByText('Confirmar Orden'))
//     expect(mockRegisterOrder).toHaveBeenCalled()
//   })
// })
