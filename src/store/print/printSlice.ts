import { type PrintSlice } from '@/types/print'
import { create, type StateCreator } from 'zustand'

export const usePrint: StateCreator<PrintSlice> = (set, get) => ({
  isConnected: false,
  selectedPrinter: null,
  setIsConnected: async (isConnected) => {
    set({ isConnected })
  },
  setSelectedPrinter: async (printer) => {
    set({ selectedPrinter: printer })
  }
})
export const usePrintSlice = create<PrintSlice>()((...a) => ({
  ...usePrint(...a)
}))
