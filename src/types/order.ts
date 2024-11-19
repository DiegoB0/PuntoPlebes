export interface OrderSlice {
  loading: boolean
  orders: Order[]
  order: Order | null
  getOrders: () => Promise<void>
  saveOrder: () => Promise<boolean>
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

export interface ActiveOrderTableProps {
  id: number
  meal_id: number
  order_id: number
  quantity: number
  meal_name: string
  details: OrderDetail[]
}

export interface OrderItem {
  id: number
  meal_id: number // ID of the meal
  order_id: number // Reference to the order
  quantity: number // Quantity of the item
  meal_name: string // Name of the meal
  details: OrderDetail[] // Array of additional details for the item
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
