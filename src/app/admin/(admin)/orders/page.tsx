'use client'
import { useEffect, useState } from 'react'
import { FaDollarSign, FaBox, FaUser, FaPhone, FaPrint } from 'react-icons/fa'
import { useOrdersStore } from '@/store/orders/orderSlice'

import {
  Button,
  Chip,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Listbox,
  ListboxItem
} from '@nextui-org/react'
import SimpleTableComponent from '@/components/table/SImpleTable'
import { ActiveOrderTableProps, DetailedOrder } from '@/types/order'

export default function OrdersComponent() {
  const { detailedOrder, getOrders } = useOrdersStore()
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null)
  const [rows, setRows] = useState<ActiveOrderTableProps[]>([])
  const [devices, setDevices] = useState<string[]>([]) // Devices list
  const [isListboxVisible, setIsListboxVisible] = useState(false) // Toggle Listbox visibility
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null) // Selected device

  // Simulate fetching nearby devices
  const fetchNearbyDevices = async () => {
    // Mocking device discovery
    return new Promise<string[]>((resolve) =>
      setTimeout(() => {
        resolve([
          'Printer 1 - Office',
          'Printer 2 - Kitchen',
          'Printer 3 - Lobby'
        ])
      }, 1000)
    )
  }

  const handlePrint = async () => {
    setIsListboxVisible((prev) => !prev) // Toggle visibility
    if (!isListboxVisible) {
      const foundDevices = await fetchNearbyDevices()
      setDevices(foundDevices)
    }
  }

  useEffect(() => {
    getOrders()
  }, [getOrders])

  const columns = [
    { key: 'meal_name', label: 'Item' },
    { key: 'quantity', label: 'Cantidad' },
    { key: 'price', label: 'Precio' },
    { key: 'total', label: 'Subtotal' }
  ]

  useEffect(() => {
    if (selectedOrder) {
      const mappedRows = selectedOrder.items.map((item, index) => ({
        id: index,
        meal_name: item.meal_name,
        quantity: item.quantity,
        price: item.meal_price,
        total: item.subtotal,
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

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
  }

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      <div className="w-2/5 p-4 overflow-y-scroll py-8 no-scrollbar">
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
                <div className="flex flex-row gap-2">
                  <Chip className={getStatusColor(selectedOrder.order_status)}>
                    {selectedOrder.order_status}
                  </Chip>
                  <div className="relative">
                    <Button
                      color="success"
                      className="text-white"
                      startContent={<FaPrint />}
                      onClick={handlePrint}>
                      {isListboxVisible ? 'Cerrar' : 'Imprimir'}
                    </Button>
                    {isListboxVisible && (
                      <Listbox
                        label="Seleccionar dispositivo"
                        selectedKeys={selectedDevice ? [selectedDevice] : []}
                        onSelectionChange={(key) => {
                          setSelectedDevice(key as string)
                          setIsListboxVisible(false)
                          console.log(`Selected device: ${key}`)
                        }}>
                        {devices.length === 0 ? (
                          <ListboxItem key="loading">
                            Buscando dispositivos...
                          </ListboxItem>
                        ) : (
                          devices.map((device) => (
                            <ListboxItem key={device}>{device}</ListboxItem>
                          ))
                        )}
                      </Listbox>
                    )}
                  </div>
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
                <SimpleTableComponent columns={columns} rows={rows} />
                <div className="mt-4 text-right">
                  <span className="font-bold">
                    Total: ${selectedOrder.total_price.toFixed(2)}
                  </span>
                </div>
              </CardBody>
              <CardFooter className="flex justify-between">
                <div className="space-x-2">
                  {selectedOrder.order_status.toLowerCase() ===
                    'en proceso' && (
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
          <p>Seleccione una orden para ver los detalles.</p>
        )}
      </div>
    </div>
  )
}
