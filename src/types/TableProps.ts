export interface Column {
  key: string
  label: string
}

export interface TableProps {
  columns: Column[]
  rows: Array<Record<string, any>>
  linkButton?: string
  linkButtonText?: string
  showHeader?: boolean
  showFooter?: boolean
  removeWrapper?: boolean
  loading?: boolean
  button?: React.ReactNode
}
