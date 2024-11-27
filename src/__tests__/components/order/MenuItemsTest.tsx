// import { render, screen, fireEvent } from '@testing-library/react'
// import MenuItems from '@/components/order/MenuItems'

// // Mock de Zustand stores
// const mockGetMeals = jest.fn()
// const mockGetCategories = jest.fn()
// const mockAddItem = jest.fn()

// jest.mock('@/store/meals/mealSlice', () => ({
//   useMealsStore: () => ({
//     meals: [
//       {
//         id: 1,
//         name: 'Hamburguesa',
//         description: 'Deliciosa hamburguesa',
//         price: 100,
//         category_id: 10
//       },
//       {
//         id: 2,
//         name: 'Coca cola',
//         description: 'Refresco de cola',
//         price: 200,
//         category_id: 20
//       }
//     ],
//     getMeals: mockGetMeals
//   })
// }))

// jest.mock('@/store/categories/categorySlice', () => ({
//   useCategoriesStore: () => ({
//     categories: [
//       { id: 10, category_name: 'Comida Rápida', menuType: 'COMIDA' },
//       { id: 20, category_name: 'Bebidas frias', menuType: 'BEBIDA' }
//     ],
//     getCategories: mockGetCategories
//   })
// }))

// jest.mock('@/store/orders/orderSlice', () => ({
//   useOrdersStore: () => ({
//     addItem: mockAddItem
//   })
// }))

// describe('MenuItems Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   it('renders menu options based on categories', () => {
//     render(<MenuItems />)

//     // Verificar que los tipos de menú están renderizados
//     expect(screen.getByText('COMIDA')).toBeInTheDocument()
//     expect(screen.getByText('BEBIDA')).toBeInTheDocument()
//   })

//   it('renders categories and allows switching between them', () => {
//     render(<MenuItems />)

//     // Verificar que las categorías iniciales están renderizadas
//     expect(screen.getByText('Comida Rápida')).toBeInTheDocument()
//     expect(screen.queryByText('Bebidas frias')).not.toBeInTheDocument()

//     // Cambiar a la categoría "BEBIDA"
//     fireEvent.click(screen.getByText('BEBIDA'))

//     // Verificar que las categorías cambian
//     expect(screen.getByText('Bebidas frias')).toBeInTheDocument()
//     expect(screen.queryByText('Comida Rápida')).not.toBeInTheDocument()
//   })

//   it('renders meals and allows adding an item to the order', () => {
//     render(<MenuItems />)

//     // Verificar que los platillos de la categoría inicial están renderizados
//     expect(screen.getByText('Hamburguesa')).toBeInTheDocument()
//     expect(screen.getByText('Deliciosa hamburguesa')).toBeInTheDocument()
//     expect(screen.queryByText('Coca cola')).not.toBeInTheDocument()

//     // Cambiar a la categoría "CENA"
//     fireEvent.click(screen.getByText('CENA'))

//     // Verificar que los platillos de la nueva categoría están renderizados
//     expect(screen.getByText('Coca cola')).toBeInTheDocument()
//     expect(screen.getByText('Refresco de cola')).toBeInTheDocument()

//     // Simular clic en "Agregar" para la bebida
//     fireEvent.click(screen.getByText('Agregar'))

//     // Verificar que `addItem` fue llamado con los datos correctos
//     expect(mockAddItem).toHaveBeenCalledWith({
//       id: 2,
//       name: 'Coca cola',
//       description: 'Refresco de cola',
//       price: 200,
//       category_id: 20,
//       quantity: 1
//     })
//   })

//   it('shows a message when there are no meals in the selected category', () => {
//     jest.mock('@/store/meals/mealSlice', () => ({
//       useMealsStore: () => ({
//         meals: [],
//         getMeals: mockGetMeals
//       })
//     }))

//     render(<MenuItems />)

//     // Verificar que se muestra el mensaje de "No hay platillos"
//     expect(
//       screen.getByText('No hay platillos disponibles para esta categoría.')
//     ).toBeInTheDocument()
//   })
// })
