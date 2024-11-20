'use client'
import TableComponent from '@/components/table/TableComponent'
import { Column } from '@/types/TableProps'
import { Card } from '@nextui-org/react'
import DashboardHeader from '@/components/shared/DashboardHeader'
import { useUsersStore } from '@/store/user/userSlice'
import { useEffect, useState } from 'react'
import { type UsersTableProps } from '@/types/users'
import { useSelectedRecords } from '@/store/tableRecords/tableRecordsSlice'
import { useRouter } from 'next/navigation'

// Static data for columns and rows
const columns: Column[] = [
  {
    key: 'id',
    label: 'Id'
  },
  {
    key: 'email',
    label: 'Correo'
  },
  {
    key: 'role',
    label: 'Rol'
  },
  {
    key: 'name',
    label: 'Nombre'
  }
]

export default function UsersPage(): JSX.Element {
  const router = useRouter()
  const { getUsers, users, setActiveUser } = useUsersStore()
  const { multipleIds, singleId } = useSelectedRecords()

  useEffect(() => {
    void getUsers()
  }, [getUsers])

  const [rows, setRows] = useState<UsersTableProps[]>([])

  // Función de eliminación
  const handleDeleteSelected = () => {
    console.log('Presionaste eliminar')
    console.log('IDs seleccionados para eliminar:', multipleIds)
    // Lógica para eliminar los registros con los IDs seleccionados
  }

  // Función de edición
  const handleEditSelected = () => {
    console.log('Presionaste editar')
    if (multipleIds.length === 1) {
      console.log('ID seleccionado para editar:', multipleIds[0])
      setActiveUser(multipleIds[0])
      // router.push(`/admin/users/form/`)
      // Lógica para editar el registro con el ID seleccionado
    } else {
      console.log('Selecciona un solo registro para editar.')
    }
  }

  useEffect(() => {
    console.log(users)
    if (users.length > 0) {
      setRows(
        users.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }))
      )
    } else {
      setRows([])
    }
  }, [users])

  return (
    <div>
      <DashboardHeader
        title="Usuarios"
        subtitle="Administra a los usuarios que tienen acceso al sistema."
      />
      <Card className="p-8">
        <TableComponent
          columns={columns}
          rows={rows}
          linkButton="/admin/users/form"
          removeWrapper
          onEditSelected={handleEditSelected}
          onDeleteSelected={handleDeleteSelected}
        />
      </Card>
    </div>
  )
}
