export interface Column {
  key: string
  label: string
}

export interface TableProps {
  columns: Column[]
  rows: Array<Record<string, any>>
  linkButton?: string
  linkButtonText?: string
  deleteButton?: boolean
  editButton?: boolean
  showHeader?: boolean
  showFooter?: boolean
  removeWrapper?: boolean
  loading?: boolean
  button?: React.ReactNode
  customCellRender?: (item: any, columnKey: string) => React.ReactNode | null
  onSelectedIdsChange?: (selectedIds: number[]) => void
  onEditSelected?: () => void // Prop para función de edición
  onDeleteSelected?: () => void // Prop para función de eliminación
}
