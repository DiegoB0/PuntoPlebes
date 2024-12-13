import { create, type StateCreator } from 'zustand'
import axiosInstance from '@/services/axiosInstance'
import { StatisticsResponse, StatisticsSlice } from '@/types/statistics'

export const useStatistics: StateCreator<StatisticsSlice> = (set) => ({
  data: null,
  loading: false,
  getStatistics: async (startDate?: string, endDate?: string) => {
    set({ loading: true })
    try {
      const { data } = await axiosInstance.get<StatisticsResponse>(
        '/order/statics',
        {
          params: {
            startDate,
            endDate
          }
        }
      )
      set({ data, loading: false })
    } catch (error) {
      set({ loading: false })
      console.error(error)
    }
  }
})

export const useStatisticsStore = create<StatisticsSlice>()((...a) => ({
  ...useStatistics(...a)
}))
