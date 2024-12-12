export interface TopSeller {
  meal_id: number
  total_quantity: number
  total_revenue: number
}

export interface SalesByPeriod {
  created_at: string
  total_sales: number
  total_quantity: number
}

export interface TotalSalesPerProduct {
  meal_id: number
  total_sales: number
}

export interface RevenueDistribution {
  meal_id: number
  total_sales: number
  revenue_percentage: number
}

export interface StatisticsResponse {
  topSellers: TopSeller[]
  salesByPeriod: SalesByPeriod[]
  totalSalesPerProduct: TotalSalesPerProduct[]
  revenueDistribution: RevenueDistribution[]
}
export interface StatisticsSlice {
  data: StatisticsResponse | null
  loading: boolean
  getStatistics: () => Promise<void>
}
