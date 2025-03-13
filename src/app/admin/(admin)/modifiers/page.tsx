'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { useModifierStore } from '@/store/modifiers/modifierSlice'
import { useSelectedRecords } from '@/store/tableRecords/tableRecordsSlice'
import ModalDelete from '@/components/shared/ModalDelete'
import { ModifierTableProps } from '@/types/modifiers'
import DashboardHeader from '@/components/shared/DashboardHeader'
import TableComponent from '@/components/table/TableComponent'
import { currencyFormat } from '@/helpers/formatCurrency'
import { Chip } from '@nextui-org/react'

dayjs.locale('es')

export default function ModifiersPage(): JSX.Element {
  const router = useRouter()
  const { getModifiers, modifiers, setActiveModifier, deleteModifier } =
    useModifierStore()
  const { multipleIds } = useSelectedRecords()
  const [rows, setRows] = useState<ModifierTableProps[]>([])
  const [isModalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    void getModifiers()
  }, [getModifiers])
  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'categories', label: 'Categorias aplicadas' },
    { key: 'price', label: 'Precio' },
    { key: 'created_at', label: 'fecha' }
  ]
  useEffect(() => {
    if (modifiers.length > 0) {
      setRows(
        modifiers.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          hasPrice: item.hasPrice ? 'Yes' : 'No',
          price: item.price ? currencyFormat(item.price) : 'N/A',
          created_at: dayjs(item.created_at).format('DD/MM/YYYY HH:mm'),
          categories: item.categories.map((category) => (
            <Chip
              key={category.id}
              variant="flat"
              color="success"
              className="m-0.5"
              size="sm">
              {category.category_name}{' '}
            </Chip>
          ))
        }))
      )
    } else {
      setRows([])
    }
  }, [modifiers])

  const handleEditSelected = () => {
    if (multipleIds.length === 1) {
      setActiveModifier(multipleIds[0])
      router.push(`/admin/modifiers/form/`)
    }
  }

  const handleDeleteSelected = () => {
    if (multipleIds.length > 0) {
      setModalOpen(true)
    }
  }

  const confirmDelete = async () => {
    if (multipleIds.length > 0) {
      await Promise.all(multipleIds.map(async (id) => await deleteModifier(id)))
      setModalOpen(false)
    }
  }

  return (
    <>
      <DashboardHeader
        title="Modificadores"
        subtitle="Gestiona los modificadores aplicables a las ordenes"
      />
      <TableComponent
        columns={columns}
        rows={rows}
        linkButton="/admin/modifiers/form"
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
