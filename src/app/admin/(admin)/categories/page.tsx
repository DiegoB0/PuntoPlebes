'use client'
import TableComponent from '@/components/table/TableComponent'
import { Column } from '@/types/TableProps'
import DashboardHeader from '@/components/shared/DashboardHeader'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { OrderTableProps } from '@/types/order'
import dayjs from 'dayjs'
import { useCategoriesStore } from '@/store/categories/categorySlice'
import { CategoryTableProps } from '@/types/categories'

dayjs.locale('es')
const columns = [
  { key: 'category_name', label: 'Nombre' },
  { key: 'menu_type', label: 'Menu' },
  { key: 'created_at', label: 'Fecha' }
]

export default function HistoricOrders(): JSX.Element {
  const router = useRouter()
  const { getCategories, categories } = useCategoriesStore()

  const [rows, setRows] = useState<CategoryTableProps[]>([])

  useEffect(() => {
    void getCategories()
  }, [getCategories])

  useEffect(() => {
    console.log(categories)
    if (categories.length > 0) {
      setRows(
        categories.map((item) => ({
          id: item.id,
          created_at: item.created_at,
          category_name: item.category_name,
          menu_type: item.menu_type.toUpperCase()
        }))
      )
    } else {
      setRows([])
    }
  }, [categories])

  return (
    <>
      <DashboardHeader
        title="Categorias"
        subtitle="Aqui puedes ver las categorias"
      />
      <TableComponent
        columns={columns}
        deleteButton={false}
        editButton={false}
        rows={rows}
      />
    </>
  )
}
