'use client'

import { useEffect, useState } from 'react'
import { FaDollarSign, FaBox, FaUser, FaPhone } from 'react-icons/fa'

import { useOrdersStore } from '@/store/orders/orderSlice'
import {
  Button,
  Chip,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@nextui-org/react'
import SimpleTableComponent from '@/components/table/SImpleTable'
import {
  ActiveOrderTableProps,
  DetailedOrder,
  Order,
  OrderDetail
} from '@/types/order'
import { orderSchema } from '@/schemas/orderSchema'

export default function OrdersComponent() {
  const { detailedOrder, getOrders } = useOrdersStore()
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null)
  const [rows, setRows] = useState<ActiveOrderTableProps[]>([])

  useEffect(() => {
    getOrders()
  }, [getOrders])
  console.log(detailedOrder)

  const columns = [
    { key: 'meal_name', label: 'Item' },
    { key: 'quantity', label: 'Cantidad' },
    { key: 'price', label: 'Precio' },
    { key: 'total', label: 'Subtotal' }
  ]

  useEffect(() => {
    if (selectedOrder) {
      console.log(selectedOrder)
      // Filtra los detalles de la orden seleccionada
      const mappedRows = selectedOrder.items.map((item, index) => ({
        id: index,
        meal_name: item.meal_name,
        quantity: item.quantity,
        price: item.subtotal,
        total: item.total_price,
        meal_id: item.meal_id,
        order_id: 0,
        order_status: '',
        total_price: item.total_price,
        client_phone: '',
        client_name: '',
        order_number: 0,
        payments: []
      }))
      setRows(mappedRows)
    } else {
      setRows([])
    }
  }, [selectedOrder])

  const getStatusColor = (status: string) => {
    if (detailedOrder.length > 0) {
      switch (status.toLowerCase()) {
        case 'en proceso':
          return 'bg-yellow-500 text-white'
        case 'preparando':
          return 'bg-blue-500 text-white'
        case 'lista':
          return 'bg-green-500 text-white'
        case 'terminada':
          return 'bg-violet-500 text-white'
        default:
          return 'bg-gray-500 text-white'
      }
    }
  }

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    // Implement the logic to update order status
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
  }

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      <div className="w-2/5 p-4">
        <h2 className="text-2xl font-bold mb-4 ">Órdenes Activas</h2>
        <div className="grid grid-cols-2 gap-4">
          {detailedOrder.map((order) => (
            <Card
              key={order.id}
              isPressable
              className="cursor-pointer hover:bg-gray-100 h-full p-2"
              onClick={() => setSelectedOrder(order)}>
              <CardHeader className="flex items-center justify-between">
                <span>Orden #{order.order_number}</span>
                <Chip className={getStatusColor(order.order_status)}>
                  {order.order_status}
                </Chip>
              </CardHeader>
              <CardBody>
                <div className="flex items-center mb-2">
                  <FaUser className="mr-2 h-4 w-4" />
                  <span>{order.client_name || 'Sin nombre'}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaBox className="mr-2 h-4 w-4" />
                  <span>{order.items.length || 0} items</span>
                </div>
                <div className="flex items-center">
                  <FaDollarSign className="mr-2 h-4 w-4" />
                  <span>${order.total_price.toFixed(2) || 0}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto w-3/5">
        {selectedOrder ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Detalles de la Orden</h2>
            <Card className="p-5">
              <CardHeader className="flex justify-between items-center">
                <span className="font-bold text-xl ">
                  Orden #{selectedOrder.order_number}
                </span>
                <Chip className={getStatusColor(selectedOrder.order_status)}>
                  {selectedOrder.order_status}
                </Chip>
              </CardHeader>
              <CardBody>
                <div className="flex items-center mb-2">
                  <FaUser className="mr-2 h-4 w-4" />
                  <span>{selectedOrder.client_name}</span>
                </div>
                <div className="flex items-center mb-4">
                  <FaPhone className="mr-2 h-4 w-4" />
                  <span>{selectedOrder.client_phone}</span>
                </div>
                <SimpleTableComponent columns={columns} rows={rows} />
                <div className="mt-4 text-right">
                  <span className="font-bold">
                    Total: ${selectedOrder.total_price.toFixed(2)}
                  </span>
                </div>
              </CardBody>
              <CardFooter className="flex justify-between">
                <div className="space-x-2">
                  {selectedOrder.order_status.toLowerCase() === 'pendiente' && (
                    <Button
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, 'preparando')
                      }>
                      Iniciar Preparación
                    </Button>
                  )}
                  {selectedOrder.order_status.toLowerCase() ===
                    'preparando' && (
                    <Button
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, 'lista')
                      }>
                      Marcar como Lista
                    </Button>
                  )}
                  {selectedOrder.order_status.toLowerCase() === 'lista' && (
                    <Button
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, 'terminada')
                      }>
                      Completar Orden
                    </Button>
                  )}
                </div>
                <div>
                  <span className="font-bold mr-2">Método de Pago:</span>
                  <span>{selectedOrder.payments[0]?.payment_method}</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Selecciona una orden para ver los detalles
          </div>
        )}
      </div>
    </div>
  )
}
