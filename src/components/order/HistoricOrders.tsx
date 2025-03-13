'use client'
import { useEffect, useState } from 'react'

import DashboardHeader from '@/components/shared/DashboardHeader'
import TableComponent from '@/components/table/TableComponent'
import { useOrdersStore } from '@/store/orders/orderSlice'
import { OrderTableProps } from '@/types/order'
import { Column } from '@/types/TableProps'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'

dayjs.locale('es')
const columns: Column[] = [
  { key: 'id', label: 'Id' },
  { key: 'order_number', label: 'Num. de orden' },
  { key: 'total_price', label: 'Total' },
  { key: 'hour', label: 'Hora' },
  { key: 'created_at', label: 'Fecha' }
]

export default function HistoricOrders(): JSX.Element {
  const router = useRouter()
  const { getOrders, orders } = useOrdersStore()

  const [rows, setRows] = useState<OrderTableProps[]>([])

  useEffect(() => {
    void getOrders()
  }, [getOrders])

  useEffect(() => {
    if (orders.length > 0) {
      setRows(
        orders.map((order) => ({
          id: order.id,
          order_number: order.order_number,
          client_name: order.client_name,
          client_phone: order.client_phone,
          total_price: order.total_price,
          status: order.status,
          created_at: dayjs(order.created_at).format('DD/MM/YYYY '),
          hour: dayjs(order.created_at).format('HH:mm:ss '),
          updated_at: order.updated_at,
          items: order.items,
          payments: order.payments,
          order_status: order.order_status
        }))
      )
    } else {
      setRows([])
    }
  }, [orders])

  return (
    <TableComponent
      columns={columns}
      deleteButton={false}
      editButton={false}
      rows={rows}
    />
  )
}
