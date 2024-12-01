'use client'
import { useEffect, useState } from 'react'
import {
  FaDollarSign,
  FaBox,
  FaUser,
  FaPhone,
  FaArrowLeft,
  FaClock
} from 'react-icons/fa'
import { useOrdersStore } from '@/store/orders/orderSlice'

import {
  Button,
  Chip,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Tooltip
} from '@nextui-org/react'
import SimpleTableComponent from '@/components/table/SImpleTable'
import { ActiveOrderTableProps, DetailedOrder } from '@/types/order'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
require('dayjs/locale/es')
dayjs.extend(relativeTime)
dayjs.locale('es')
export default function OrdersComponent() {
  const { detailedOrder, getOrders } = useOrdersStore()
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null)
  const [rows, setRows] = useState<ActiveOrderTableProps[]>([])
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { updateOrderStatus } = useOrdersStore()

  const handleUpdate = async (orderId: number, status: string) => {
    try {
      console.log('Intentando actualizar la orden', orderId, status)
      await updateOrderStatus(orderId, status)
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, order_status: status })
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  useEffect(() => {
    getOrders()
  }, [getOrders])

  const columns = [
    { key: 'meal_name', label: 'Item' },
    { key: 'quantity', label: 'Cantidad' },
    { key: 'price', label: 'Precio' },
    { key: 'details', label: 'Detalles' },
    { key: 'total', label: 'Subtotal' }
  ]

  useEffect(() => {
    if (selectedOrder) {
      console.log(selectedOrder)
      const mappedRows = selectedOrder.items.map((item, index) => ({
        id: index,
        meal_name: item.meal_name,
        quantity: item.quantity,
        price: item.meal_price,
        total: item.subtotal,
        meal_id: item.meal_id,
        order_id: selectedOrder.id,
        order_status: selectedOrder.order_status,
        total_price: item.total_price,
        client_phone: '',
        client_name: '',
        order_number: 0,
        payments: [],
        details:
          Array.isArray(item.details) && item.details.length > 0
            ? item.details.map((detail) => detail.details).join(', ')
            : 'Sin instrucciones'
      }))
      setRows(mappedRows)
    } else {
      setRows([])
    }
  }, [selectedOrder])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en proceso':
        return 'bg-yellow-500 text-white'
      case 'terminada':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-red-700/50 text-white'
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden">
      <div
        className={`w-full md:w-2/5 p-4 overflow-y-auto no-scrollbar ${isMobileView && selectedOrder ? 'hidden' : ''}`}>
        <h2 className="text-2xl font-bold mb-4">Órdenes Activas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          {detailedOrder
            .filter((order) => dayjs(order.created_at).isSame(dayjs(), 'day'))
            .sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at)))
            .map((order) => (
              <Card
                key={order.id}
                isPressable
                className="cursor-pointer hover:bg-gray-100 h-full p-2"
                onClick={() => setSelectedOrder(order)}>
                <CardHeader className="flex items-center justify-between">
                  <span className="font-bold text-lg">
                    Orden #{order.order_number}
                  </span>
                  <Chip className={getStatusColor(order.order_status)}>
                    {order.order_status}
                  </Chip>
                </CardHeader>
                <Divider />
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
                <CardFooter>
                  <span className="flex gap-2">
                    <FaClock /> {dayjs(order.created_at).format('hh:mm A')} -{' '}
                    {dayjs(order.created_at).fromNow()}
                  </span>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
      <div
        className={`flex-1 p-4 overflow-auto w-full md:w-3/5 ${isMobileView && !selectedOrder ? 'hidden' : ''}`}>
        {selectedOrder ? (
          <div>
            {isMobileView && (
              <Button
                className="mb-4"
                onClick={() => setSelectedOrder(null)}
                variant="bordered">
                <FaArrowLeft /> Volver a la lista
              </Button>
            )}
            <h2 className="text-2xl font-bold mb-4">Detalles de la Orden</h2>
            <Card className="p-5">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <span className="font-bold text-xl mb-2 sm:mb-0">
                  Orden #{selectedOrder.order_number}
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Tooltip content="Marcar como terminada" color="warning">
                    <Button
                      size="md"
                      onClick={() =>
                        handleUpdate(selectedOrder.id, 'Terminada')
                      }
                      disabled={selectedOrder.order_status === 'Terminada'}
                      className={
                        getStatusColor(selectedOrder.order_status) +
                        'px-5 py-1 text-white'
                      }>
                      {selectedOrder.order_status}
                    </Button>
                  </Tooltip>
                </div>
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
                <div className="overflow-x-auto">
                  <SimpleTableComponent columns={columns} rows={rows} />
                </div>
              </CardBody>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <span className="text-gray-400 mr-2">Monto recibido:</span>
                    <Chip color="success" variant="flat">
                      {selectedOrder.payments[0]?.amount_given ??
                        'No se registro'}
                    </Chip>
                  </div>
                  <div>
                    <span className="text-gray-400 mr-2">Método de pago:</span>
                    <Chip color="primary" variant="flat">
                      {selectedOrder.payments[0]?.payment_method ??
                        'No agregado'}
                    </Chip>
                  </div>
                </div>
                <div>
                  <span className="font-bold mr-2">Total:</span>
                  <Chip
                    variant="bordered"
                    size="lg"
                    className="text-gray-600"
                    color="warning">
                    ${selectedOrder.total_price.toFixed(2)}
                  </Chip>
                </div>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <p>Seleccione una orden para ver los detalles.</p>
        )}
      </div>
    </div>
  )
}
