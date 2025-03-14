'use client'
import { useEffect, useState } from 'react'

import DashboardHeader from '@/components/shared/DashboardHeader'
import ModalDelete from '@/components/shared/ModalDelete'
import TableComponent from '@/components/table/TableComponent'
import { useSelectedRecords } from '@/store/tableRecords/tableRecordsSlice'
import { useUsersStore } from '@/store/user/userSlice'
import { Column } from '@/types/TableProps'
import { type UsersTableProps } from '@/types/users'
import { useRouter } from 'next/navigation'

const columns: Column[] = [
  { key: 'id', label: 'Id' },
  { key: 'email', label: 'Correo' },
  { key: 'role', label: 'Rol' },
  { key: 'name', label: 'Nombre' }
]

export default function UsersPage(): JSX.Element {
  const router = useRouter()
  const { getUsers, users, setActiveUser, deleteUser } = useUsersStore()
  const { multipleIds } = useSelectedRecords()

  const [rows, setRows] = useState<UsersTableProps[]>([])
  const [isModalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    void getUsers()
  }, [getUsers])

  const handleDeleteSelected = () => {
    if (multipleIds.length > 0) {
      setModalOpen(true)
    }
  }

  const confirmDelete = async () => {
    if (multipleIds.length > 0) {
      await Promise.all(multipleIds.map(async (id) => await deleteUser(id)))
      setModalOpen(false)
    }
  }

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
    <div className="p-1 md:p-8">
      <DashboardHeader
        title="Usuarios"
        subtitle="Administra a los usuarios que tienen acceso al sistema."
      />
      <TableComponent
        columns={columns}
        rows={rows}
        linkButton="/admin/users/form"
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
