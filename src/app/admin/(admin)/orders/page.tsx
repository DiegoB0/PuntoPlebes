'use client'
import TableComponent from '@/components/table/TableComponent'
import { Column } from '@/types/TableProps'
import ActionsButtons from '@/components/shared/ActionButtons'
import { Card } from '@nextui-org/react'
import DashboardHeader from '@/components/shared/DashboardHeader'
import { useUsersStore } from '@/store/user/userSlice'
import { useEffect, useState } from 'react'
import { type User, UsersTableProps } from '@/types/users'

// Static data for columns and rows
const columns: Column[] = [
  {
    key: 'id',
    label: 'Nombre'
  },
  {
    key: 'email',
    label: 'Correo electrónico'
  },
  {
    key: 'role',
    label: 'Rol'
  },
  {
    key: 'actions',
    label: 'Acciones'
  }
]

export default function UsersPage(): JSX.Element {
  const { getUsers, users } = useUsersStore()

  useEffect(() => {
    void getUsers()
  }, [getUsers])

  const [rows, setRows] = useState<UsersTableProps[]>([])

  useEffect(() => {
    console.log(users)
    if (users.length > 0) {
      setRows(
        users.map((user) => ({
          id: user.id,
          email: user.email,
          role: user.role
        }))
      )
    }
  }, [users])

  return (
    <div>
      <DashboardHeader
        title="Pedidos"
        subtitle="Administra los pedidos realizados"
      />
      <Card className="p-8">
        <TableComponent
          columns={columns}
          rows={rows}
          linkButton="/admin/users/form"
          removeWrapper
        />
      </Card>
    </div>
  )
}
