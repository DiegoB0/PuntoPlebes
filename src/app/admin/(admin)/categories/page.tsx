'use client'
import { useEffect, useState } from 'react'

import DashboardHeader from '@/components/shared/DashboardHeader'
import ModalDelete from '@/components/shared/ModalDelete'
import TableComponent from '@/components/table/TableComponent'
import { useCategoriesStore } from '@/store/categories/categorySlice'
import { useSelectedRecords } from '@/store/tableRecords/tableRecordsSlice'
import { CategoryTableProps } from '@/types/categories'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'

dayjs.locale('es')
const columns = [
  { key: 'category_name', label: 'Nombre' },
  { key: 'menu_type', label: 'Menu' },
  { key: 'created_at', label: 'Registrado en' }
]

export default function HistoricOrders(): JSX.Element {
  const router = useRouter()
  const { getCategories, categories, setActiveCategory, deleteCategory } =
    useCategoriesStore()
  const { multipleIds } = useSelectedRecords()
  const [rows, setRows] = useState<CategoryTableProps[]>([])
  const [isModalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    void getCategories()
  }, [getCategories])

  useEffect(() => {
    if (categories.length > 0) {
      setRows(
        categories.map((item) => ({
          id: item.id,
          created_at: dayjs(item.created_at).format('DD/MM/YYYY HH:mm'),
          category_name: item.category_name,
          menu_type: item?.menu_type?.toUpperCase()
        }))
      )
    } else {
      setRows([])
    }
  }, [categories])

  const handleEditSelected = () => {
    if (multipleIds.length === 1) {
      setActiveCategory(multipleIds[0])
      router.push(`/admin/categories/form/`)
    }
  }

  const handleDeleteSelected = () => {
    if (multipleIds.length > 0) {
      setModalOpen(true)
    }
  }

  const confirmDelete = async () => {
    if (multipleIds.length > 0) {
      await Promise.all(multipleIds.map(async (id) => await deleteCategory(id)))
      setModalOpen(false)
    }
  }

  return (
    <>
      <DashboardHeader
        title="Categorias"
        subtitle="Aqui puedes ver las categorias"
      />
      <TableComponent
        columns={columns}
        rows={rows}
        linkButton="/admin/categories/form"
        deleteButton
        editButton
        onEditSelected={handleEditSelected}
        onDeleteSelected={handleDeleteSelected}
      />
      {isModalOpen && (
        <ModalDelete
          isOpen={isModalOpen}
          destroyFunction={confirmDelete}
          onClose={() => setModalOpen(false)}
          count={multipleIds.length}
        />
      )}
    </>
  )
}
