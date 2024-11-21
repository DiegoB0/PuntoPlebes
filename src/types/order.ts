import { Meal } from './meals'

export interface OrderSlice {
  items: OrderItem[]
  loading: boolean
  orders: Order[]
  order: Order | null
  detailedOrder: DetailedOrder[]
  selectedItem: OrderItem | null
  addItem: (item: OrderItem) => void
  selectItem: (item: OrderItem | null) => void
  updateItem: (id: number, updatedItem: Partial<OrderItem>) => void
  removeItem: (id: number) => void
  clearCart: () => void
  getOrders: () => Promise<void>
  saveOrder: (data: Partial<CreateOrderDto>) => Promise<boolean>
  prepareOrderData: () => CreateOrderDto
}

export interface CreateOrderDto {
  client_name?: string
  client_phone?: string
  total_price: number
  items: {
    meal_id: number
    quantity: number
    notes?: string | null
  }[]
}

export interface Order {
  id: number
  order_number: number
  order_status: string // Status of the order (e.g., "terminada", "en proceso")
  client_name: string // Optional, customer name
  client_phone: string // Optional, customer phone number
  total_price: number // Total price of the order
  items: OrderItem[] // Array of items in the order
  payments: Payment[] // Array of payments related to the order
}

export interface OrderItem extends Meal {
  quantity: number
  notes?: string[]
  details?: OrderDetail[]
  meal_id?: number
}

export interface ActiveOrderTableProps {
  id: number
  meal_id?: number
  order_id: number
  quantity: number
  meal_name: string
  details?: OrderDetail[]
  order_status: string
  client_name: string
  client_phone: string
  total_price: number
  order_number: number
  payments: Payment[]
}

export interface DetailedOrder {
  id: number
  order_number: number
  order_status: string
  client_name: string
  client_phone: string
  total_price: number
  items: {
    meal_id: number
    meal_name: string
    quantity: number
    subtotal: number
    total_price: number
    details?: OrderDetail[]
  }[]
  payments: Payment[]
}

export interface OrderDetail {
  id: number
  details: {
    detail: string // A string representing the detail of the item
  }
}

export interface Payment {
  order_id: number // Reference to the order
  amount_given: number // Amount paid
  payment_method: string // Payment method used (e.g., "efectivo", "credit card")
}
