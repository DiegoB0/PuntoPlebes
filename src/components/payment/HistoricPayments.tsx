'use client'
import TableComponent from '@/components/table/TableComponent'
import { Column } from '@/types/TableProps'
import { useEffect, useState } from 'react'
import { useOrdersStore } from '@/store/orders/orderSlice'
import { HistoricPaymentRow, Order } from '@/types/order'
import dayjs from 'dayjs'
import { currencyFormat } from '@/helpers/formatCurrency'

const columns: Column[] = [
  { key: 'id', label: 'Id' },
  { key: 'order_number', label: 'Num. de orden' },
  { key: 'client_name', label: 'Cliente' },
  { key: 'total_price', label: 'Total' },
  { key: 'payment_method', label: 'Método de Pago' },
  { key: 'amount_given', label: 'Monto Pagado' },
  { key: 'change', label: 'Cambio' },
  { key: 'created_at', label: 'Fecha' }
]

export default function HistoricPayments(): JSX.Element {
  const { getOrders, orders } = useOrdersStore()

  const [rows, setRows] = useState<HistoricPaymentRow[]>([])

  useEffect(() => {
    void getOrders()
  }, [getOrders])

  useEffect(() => {
    if (orders.length > 0) {
      const mappedRows = orders.map((order) => {
        const payment = order.payments?.[0] || {}

        return {
          id: order.id,
          order_number: order.order_number,
          client_name: order.client_name,
          client_phone: order.client_phone,
          total_price: order.total_price,
          payment_method: payment.payment_method?.toUpperCase() || 'N/A',
          amount_given:
            payment.amount_given != null
              ? currencyFormat(payment.amount_given)
              : '0.00',
          change:
            payment.amount_given != null
              ? currencyFormat(payment.amount_given - order.total_price)
              : '0.00',
          created_at: dayjs(order.created_at).format('DD/MM/YYYY HH:mm:ss'),
          status: order.order_status,
          items: order.items,
          payments: order.payments
        }
      })

      setRows(mappedRows)
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
