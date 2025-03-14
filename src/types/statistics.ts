export interface TopSeller {
  meal_id: number
  meal_name: string
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
  meal_name: string
  total_sales: number
}

export interface RevenueDistribution {
  meal_id: number
  meal_name: string
  total_sales: number
  revenue_percentage: number
}

export interface StatisticsSlice {
  topSellers: TopSeller[] | null
  salesByPeriod: SalesByPeriod[] | null
  totalSalesPerProduct: TotalSalesPerProduct[] | null
  revenueDistribution: RevenueDistribution[] | null
  loading: boolean
  getStatistics: (startDate?: string, endDate?: string) => Promise<void>
  getRevenueDistribution: (
    startDate?: string,
    endDate?: string
  ) => Promise<void>
}
