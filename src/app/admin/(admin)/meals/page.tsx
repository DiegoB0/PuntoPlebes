'use client'
import React, { useEffect, useState } from 'react'
import { User, Chip } from '@nextui-org/react'
import CustomCellTable from '@/components/table/CustomCellTable'
import DashboardHeader from '@/components/shared/DashboardHeader'
import { useMealsStore } from '@/store/meals/mealSlice'
import { useRouter } from 'next/navigation'
import { useSelectedRecords } from '@/store/tableRecords/tableRecordsSlice'
import ModalDelete from '@/components/shared/ModalDelete'
import { currencyFormat } from '@/helpers/formatCurrency'

const MealsPage = (): JSX.Element => {
  const router = useRouter()
  const { meals, getMeals, deleteMeal, setActiveMeal } = useMealsStore()
  const { multipleIds } = useSelectedRecords()

  useEffect(() => {
    getMeals()
  }, [getMeals])

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'description', label: 'Descripción', sortable: true },
    { key: 'price', label: 'Precio', sortable: true },
    { key: 'category', label: 'Categoría', sortable: true }
  ]
  const [isModalOpen, setModalOpen] = useState(false)

  const handleEditSelected = () => {
    if (multipleIds.length === 1) {
      setActiveMeal(multipleIds[0])
      router.push(`/admin/meals/form/`)
    }
  }

  const handleDeleteSelected = () => {
    if (multipleIds.length > 0) {
      setModalOpen(true)
    }
  }

  const confirmDelete = async () => {
    if (multipleIds.length > 0) {
      await Promise.all(multipleIds.map(async (id) => await deleteMeal(id)))
      setModalOpen(false)
    }
  }

  const customCellRender = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{
              radius: 'lg',
              src: item.image_url || '/api/placeholder/150/150'
            }}
            name={item.name}></User>
        )
      case 'category':
        return (
          <Chip color="primary" size="sm" variant="flat">
            {item.category_id ?? 'N/A'}
          </Chip>
        )
      case 'price':
        return currencyFormat(item.price)
      default:
        return item[columnKey]
    }
  }

  return (
    <div className="p-4">
      <DashboardHeader
        title="Catálogo"
        subtitle="Gestiona tu catálogo de comidas"
      />
      <CustomCellTable
        columns={columns}
        rows={meals}
        customCellRender={customCellRender}
        linkButton="meals/form"
        linkButtonText="Agregar"
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
    </div>
  )
}

export default MealsPage
