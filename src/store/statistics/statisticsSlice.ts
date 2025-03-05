import { create, type StateCreator } from 'zustand'
import axiosInstance from '@/services/axiosInstance'
import {
  TopSeller,
  SalesByPeriod,
  RevenueDistribution,
  TotalSalesPerProduct,
  StatisticsSlice
} from '@/types/statistics'

export const useStatistics: StateCreator<StatisticsSlice> = (set) => ({
  // Estado inicial para cada conjunto de datos
  topSellers: null,
  salesByPeriod: null,
  totalSalesPerProduct: null,
  revenueDistribution: null,
  loading: false,

  // Obtener datos generales de estadísticas
  getStatistics: async (startDate?: string, endDate?: string) => {
    set({ loading: true })
    try {
      const { data } = await axiosInstance.get<{
        topSellers: TopSeller[]
        salesByPeriod: SalesByPeriod[]
        totalSalesPerProduct: TotalSalesPerProduct[]
      }>('/order/reportes', {
        params: { startDate, endDate }
      })

      // Actualizar los datos correspondientes
      set({
        topSellers: data.topSellers,
        salesByPeriod: data.salesByPeriod,
        totalSalesPerProduct: data.totalSalesPerProduct,
        loading: false
      })
    } catch (error) {
      set({ loading: false })
      console.error(error)
    }
  },

  // Obtener distribución de ingresos
  getRevenueDistribution: async (startDate?: string, endDate?: string) => {
    set({ loading: true })
    try {
      const { data } = await axiosInstance.get<{
        revenueDistribution: RevenueDistribution[]
      }>('/order/reportes', {
        params: { startDate, endDate }
      })

      // Actualizar solo la distribución de ingresos
      set({
        revenueDistribution: data.revenueDistribution,
        loading: false
      })
    } catch (error) {
      set({ loading: false })
      console.error(error)
    }
  }
})

export const useStatisticsStore = create<StatisticsSlice>()((...a) => ({
  ...useStatistics(...a)
}))
