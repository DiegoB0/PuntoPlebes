export interface OrderSlice {
  orders: Order[]
  order: Order | null
  pendingOrder: Order | null
  loading: boolean
  items: OrderItem[]
  selectedItem: OrderItem | null
  detailedOrder: DetailedOrder[]
  clientInfo: ClientInfo | null
  paymentInfo: PaymentInfo
  addItem: (item: OrderItem) => void
  selectItem: (item: OrderItem | null) => void
  updateItem: (id: number, updatedItem: Partial<OrderItem>) => void
  removeItem: (id: number) => void
  clearCart: () => void
  getOrders: () => Promise<void>
  registerOrder: () => Promise<boolean>
  completePayment: (paymentInfo: PaymentInfo) => Promise<boolean>
  prepareOrderData: () => CreateOrderDto
  setClientInfo: (clientInfo: ClientInfo) => void
  setPaymentInfo: (paymentInfo: PaymentInfo) => void
  isOrderReadyToRegister: () => boolean
  isOrderReadyToPayment: () => boolean
}

export interface ClientInfo {
  name: string
  phone: string
}

export interface PaymentInfo {
  method: string
  amountGiven: number
}

export interface CreateOrderDto {
  client_name: string
  client_phone: string
  items?: {
    meal_id: number
    quantity: number
    details: { detail: string }[]
  }[]
  payments?: {
    payment_method: string
    amount_given: number
  }[]
}

export interface Order {
  id: number
  order_number: string
  client_name: string
  client_phone: string
  total_price: number
  status: string
  created_at: string
  updated_at: string
  items: OrderItem[]
  payments: Payment[]
  order_status: string
}

export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  notes?: string
}
export interface ActiveOrderTableProps {
  id: number
  meal_id: number
  order_id: number
  quantity: number
  meal_name: string
  details: OrderDetail[]
}
export interface OrderDetail {
  id: number
  details: {
    detail: string
  }
}

export interface Payment {
  id: number
  payment_method: string
  amount_given: number
  created_at: string
}

export interface DetailedOrder {
  id: number
  order_number: number
  order_status: string
  client_name: string
  client_phone: string
  total_price: number
  items: {
    meal_price: number
    meal_id: number
    meal_name: string
    quantity: number
    subtotal: number
    total_price: number
    details?: OrderDetail[]
  }[]
  payments: Payment[]
  created_at: string
}

export interface Meal {
  id: number
  name: string
  price: number
  description: string
  image_url: string
  category_id: number
  created_at: string
  updated_at: string
}
