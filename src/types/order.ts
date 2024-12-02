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
  addItemDetail: (itemId: number, details: string[]) => void
  selectItem: (item: OrderItem | null) => void
  updateItem: (id: number, updatedItem: Partial<OrderItem>) => void
  removeItem: (id: number) => void
  clearCart: () => void
  getOrders: () => Promise<void>
  registerOrder: () => Promise<boolean>
  prepareOrderData: () => CreateOrderDto
  setClientInfo: (clientInfo: ClientInfo) => void
  setPaymentInfo: (paymentInfo: PaymentInfo) => void
  isOrderReadyToRegister: () => boolean
  updateOrderPayment: (
    orderId: number,
    paymentInfo: PaymentInfo
  ) => Promise<void>
  updateOrderStatus: (orderId: number, status: string) => Promise<void>
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
    details?: string[]
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

export interface OrderTableProps {
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
export interface HistoricPaymentRow {
  id: number
  order_number: number
  client_name: string
  client_phone: string
  total_price: number
  payment_method: string
  amount_given: string
  change: string
  created_at: string
  status: string
  items: OrderItem[]
  payments: Payment[]
}

export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  details?: string[]
  description?: string
}

export interface Payment {
  payment_method: string
  amount_given: number
}

export interface ActiveOrderTableProps {
  id: number
  meal_id: number
  order_id: number
  quantity: number
  meal_name: string
  details: string
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
    details: ItemDetails[]
  }[]
  payments: Payment[]
  created_at: string
}

export interface ItemDetails {
  id: number
  details: string
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
