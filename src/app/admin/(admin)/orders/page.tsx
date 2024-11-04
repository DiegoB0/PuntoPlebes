'use client'
import TableComponent from '@/components/table/TableComponent'
import { Column } from '@/types/TableProps'
import ActionsButtons from '@/components/shared/ActionButtons'
import { Breadcrumbs, Card } from '@nextui-org/react'
import DashboardHeader from '@/components/shared/DashboardHeader'

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

// Static rows data
const rows = [
  {
    id: 'Juan Pérez',
    email: 'juan.perez@example.com',
    role: 'Administrador',
    actions: (
      <ActionsButtons
        edit
        editFunction={() => {
          console.log('Edit Juan Pérez')
        }}
        destroy
        destroyFunction={() => {
          console.log('Delete Juan Pérez')
        }}
      />
    )
  },
  {
    id: 'Ana López',
    email: 'ana.lopez@example.com',
    role: 'Usuario',
    actions: (
      <ActionsButtons
        editFunction={() => {
          console.log('Edit Ana López')
        }}
        destroyFunction={() => {
          console.log('Delete Ana López')
        }}
      />
    )
  },
  {
    id: 'Carlos García',
    email: 'carlos.garcia@example.com',
    role: 'Editor',
    actions: (
      <ActionsButtons
        editFunction={() => {
          console.log('Edit Carlos García')
        }}
        destroyFunction={() => {
          console.log('Delete Carlos García')
        }}
      />
    )
  }
]

export default function UsersPage(): JSX.Element {
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
