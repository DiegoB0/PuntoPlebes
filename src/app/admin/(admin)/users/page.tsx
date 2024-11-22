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
  const { getUsers, users, setActiveUser, deleteUser } = useUsersStore()
  const { multipleIds, singleId } = useSelectedRecords()

  useEffect(() => {
    void getUsers()
  }, [getUsers])

  const [rows, setRows] = useState<UsersTableProps[]>([])

  // Función de eliminación
  const handleDeleteSelected = () => {
    void deleteUser(multipleIds[0])
  }

  // Función de edición
  const handleEditSelected = () => {
    if (multipleIds.length === 1) {
      setActiveUser(multipleIds[0])
      router.push(`/admin/users/form/`)
    }
  }

  useEffect(() => {
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
