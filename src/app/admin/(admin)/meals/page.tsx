'use client'
import React, { useEffect } from 'react'
import { User, Chip } from '@nextui-org/react'
import CustomCellTable from '@/components/table/CustomCellTable'
import DashboardHeader from '@/components/shared/DashboardHeader'
import { useMealsStore } from '@/store/meals/mealSlice'
import { useRouter } from 'next/navigation'
import { useSelectedRecords } from '@/store/tableRecords/tableRecordsSlice'

const statusColorMap: Record<string, string> = {
  active: 'success',
  inactive: 'danger'
}

const MealsPage = (): JSX.Element => {
  const router = useRouter()
  const { meals, getMeals, deleteMeal, setActiveMeal } = useMealsStore()
  const { multipleIds, singleId } = useSelectedRecords()

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

  const handleEditSelected = () => {
    if (multipleIds.length === 1) {
      setActiveMeal(multipleIds[0])
      router.push(`/admin/meals/form/${multipleIds[0]}`)
    }
  }

  const handleDeleteSelected = () => {
    void deleteMeal(multipleIds[0])
  }
  const customCellRender = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{
              radius: 'lg',
              src: item.image_path || '/api/placeholder/150/150'
            }}
            description={item.description}
            name={item.name}>
            {item.name}
          </User>
        )
      case 'category':
        return (
          <Chip color="primary" size="sm" variant="flat">
            {item.category_id || 'Uncategorized'}
          </Chip>
        )
      case 'price':
        return `$${item.price.toFixed(2)}`
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
    </div>
  )
}

export default MealsPage
