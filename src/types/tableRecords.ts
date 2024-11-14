export interface tableRecordsSlice {
  singleId: number | undefined
  multipleIds: number[]
  setSingleId: (id: number | undefined) => void
  addToSelectedIds: (id: number) => void
  removeFromSelectedIds: (id: number) => void
  clearSelectedIds: () => void
}
