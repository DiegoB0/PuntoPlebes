export interface OrderSlice {
  loading: boolean
  // Getters
  orders: Order[]
  order: Order | null
  pendingOrder: Order | null
  detailedOrder: DetailedOrder[]
  clientInfo: Partial<ClientData>
  paymentInfo: PaymentInfo
  lastNumber: number
  getOrders: () => Promise<void>

  // Item methods
  items: OrderItem[]
  selectedItem: OrderItem | null
  addItem: (item: OrderItem) => void
  addItemDetail: (itemId: number, details: number[]) => void
  selectItem: (item: OrderItem | null) => void
  updateItem: (id: number, updatedItem: Partial<OrderItem>) => void
  removeItem: (id: number) => void
  clearCart: () => void

  // Client and payment methods
  setClientInfo: (clientInfo: ClientData) => void
  setPaymentInfo: (paymentInfo: PaymentInfo) => void

  setPartialClientInfo: (clientInfo: Partial<ClientData>) => void
  isClientInfoComplete: () => boolean

  // Order registration methods
  getLastOrderNumber: () => Promise<void>
  prepareOrderData: () => CreateOrderDto
  registerOrder: () => Promise<boolean>
  isOrderReadyToRegister: () => boolean

  // Order status update methods
  updateOrderPayment: (
    orderId: number,
    paymentInfo: PaymentInfo
  ) => Promise<void>
  updateOrderStatus: (orderId: number, status: string) => Promise<void>
}

export interface ClientData {
  client_name: string
  client_phone: string
}

export interface PaymentInfo {
  payment_method: string
  amount_given: number
}

export interface CreateOrderDto {
  client_name: string
  client_phone?: string | null
  items?: {
    meal_id: number
    quantity: number
    details?: number[]
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
  updated_at: string
  items: OrderItem[]
  payments: Payment[]
  order_status: string
  delivered_at: string
  created_at: string
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
  order_number: string
  client_name: string
  client_phone: string
  total_price: number
  payment_method: string
  amount_given: string
  change: string
  created_at: string
  delivered_at: string
  status: string
  items: OrderItem[]
  payments: Payment[]
}

export interface OrderItem {
  cartItemId: number
  id: number
  name: string
  price: number
  quantity: number
  details?: number[]
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
  orderItems: {
    id: number
    quantity: number
    meal: MealOrderItem
    orderItemDetails: number[]
  }[]
  payments: Payment[]
  created_at: string
  delivered_at: string
}
interface MealOrderItem {
  id: number
  name: string
  description: string
  price: number
  isClaveApplied: boolean
}
