export interface PrintSlice {
  isConnected: boolean
  selectedPrinter: BTPrinter | null
  setIsConnected: (isConnected: boolean) => Promise<void>
  setSelectedPrinter: (printer: BTPrinter) => Promise<void>
}
interface BTPrinter {
  name: string
  address: string
}
