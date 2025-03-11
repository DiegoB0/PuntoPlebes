'use client'
import { useEffect, useState } from 'react'

import DashboardHeader from '@/components/shared/DashboardHeader'
import SimpleTableComponent from '@/components/table/SImpleTable'
import { currencyFormat } from '@/helpers/formatCurrency'
import { useOrdersStore } from '@/store/orders/orderSlice'
import { ActiveOrderTableProps, DetailedOrder } from '@/types/order'
import {
  Button,
  Chip,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem
} from '@nextui-org/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  FaDollarSign,
  FaBox,
  FaUser,
  FaPhone,
  FaArrowLeft,
  FaClock,
  FaMoneyBillWave,
  FaCreditCard,
  FaCheckCircle,
  FaPrint
} from 'react-icons/fa'

require('dayjs/locale/es')

dayjs.extend(relativeTime)
dayjs.locale('es')

export default function OrdersComponent() {
  const { detailedOrder, getOrders, updateOrderPayment, updateOrderStatus } =
    useOrdersStore()
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null)
  const [rows, setRows] = useState<ActiveOrderTableProps[]>([])
  const [isMobileView, setIsMobileView] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  console.log(detailedOrder, 'detailedOrder')
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('')
  const [amountGiven, setAmountGiven] = useState<string>('')

  const paymentMethods = [
    { key: 'Efectivo', label: 'Efectivo' },
    { key: 'Tarjeta', label: 'Tarjeta' },
    { key: 'Transferencia', label: 'Transferencia' }
  ]

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleUpdatePayment = async () => {
    if (!selectedOrder) return

    try {
      const paymentInfo = {
        payment_method: paymentMethod,
        amount_given: parseFloat(amountGiven)
      }

      await updateOrderPayment(selectedOrder.id, paymentInfo)

      // Close modal and reset form
      setIsPaymentModalOpen(false)
      setPaymentMethod('')
      setAmountGiven('')
    } catch (error) {
      console.error('Failed to update order payment:', error)
    }
  }

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
  console.log(detailedOrder, 'detailedOrder')
  const columns = [
    { key: 'meal_name', label: 'Item' },
    { key: 'quantity', label: 'Cantidad' },
    { key: 'price', label: 'Precio' },
    { key: 'details', label: 'Detalles' },
    { key: 'subtotal', label: 'Subtotal' }
  ]
  // TODO : Agregar una lista breve de las ordenes en la tarjeta antes de seleccionar
  useEffect(() => {
    if (selectedOrder) {
      console.log(selectedOrder)
      const mappedRows = selectedOrder.orderItems.map((item, index) => ({
        id: index,
        meal_name: item.meal.name,
        quantity: item.quantity,
        price: item.meal.price,
        subtotal: item.meal.price * item.quantity,
        meal_id: item.meal.id,
        order_id: selectedOrder.id,
        order_status: selectedOrder.order_status,
        client_phone: '',
        client_name: '',
        order_number: 0,
        payments: [],
        details:
          Array.isArray(item.orderItemDetails) &&
          item.orderItemDetails.length > 0
            ? item.orderItemDetails.map((detail) => detail.details).join(', ')
            : 'Sin instrucciones'
      }))
      setRows(mappedRows)
    } else {
      setRows([])
    }
  }, [selectedOrder])

  const getStatusColor = (status: string) => {
    if (status != null) {
      switch (status.toLowerCase()) {
        case 'en proceso':
          return 'warning'
        case 'terminada':
          return 'primary'
        default:
          return 'danger'
      }
    }
  }
  const getPaymentStatusColor = (order: DetailedOrder) => {
    return order.payments && order.payments.length > 0 ? 'success' : 'danger'
  }

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden">
        <div
          className={`w-full md:w-2/5 p-4 overflow-y-auto no-scrollbar ${isMobileView && selectedOrder ? 'hidden' : ''}`}>
          <DashboardHeader
            title="Pedidos activos"
            subtitle={dayjs().format('dddd D [de] MMMM')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            {detailedOrder
              // .filter((order) => dayjs(order.created_at).isSame(dayjs(), 'day'))
              .sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at)))
              .map((order) => (
                <Card
                  key={order.id}
                  isPressable
                  className="cursor-pointer hover:bg-gray-100 h-full p-2 transition-colors"
                  onPress={() => setSelectedOrder(order)}>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">
                        Orden #{order.order_number}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {dayjs(order.created_at).format('hh:mm A')}
                      </span>
                    </div>
                    <Chip
                      color={getStatusColor(order.order_status)}
                      variant="bordered">
                      {order.order_status}
                    </Chip>
                  </CardHeader>

                  <CardBody>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <FaUser className="h-4 w-4 text-gray-400" />
                        <span className="truncate">
                          {order.client_name || 'Sin nombre'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCreditCard className="h-4 w-4 text-gray-400" />
                        <Chip
                          color={getPaymentStatusColor(order)}
                          variant="flat">
                          {order.payments && order.payments.length > 0
                            ? 'Pagado'
                            : 'Pendiente'}
                        </Chip>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {currencyFormat(order.total_price)}
                        </span>
                      </div>
                    </div>

                    {/* Brief list of items */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-start gap-2">
                        <FaBox className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">
                            {order.orderItems.length} items:
                          </span>
                          <ul className="text-sm text-gray-400">
                            {order.orderItems.slice(0, 2).map((item) => (
                              <li key={item.id} className="truncate">
                                {item.quantity}x {item.meal.name}
                              </li>
                            ))}
                            {order.orderItems.length > 2 && (
                              <li className="text-xs italic">
                                +{order.orderItems.length - 2} más
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter className="p-4 pt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <FaClock className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-400">
                          Creado: {dayjs(order.created_at).format('hh:mm A')}
                        </span>
                      </div>

                      {order.delivered_at && (
                        <div className="flex items-center gap-1">
                          <FaCheckCircle className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400">
                            Entregado:{' '}
                            {dayjs(order.delivered_at).format('hh:mm A')}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
        <div
          className={`flex-1 p-4 overflow-auto w-full md:w-3/5 ${isMobileView && !selectedOrder ? 'hidden' : ''}`}>
          {isMobileView && (
            <Button
              className="mb-4"
              onPress={() => setSelectedOrder(null)}
              variant="bordered">
              <FaArrowLeft /> Volver a la lista
            </Button>
          )}

          {selectedOrder && (
            <Card className="p-5">
              {/* Order Header */}
              <CardHeader className="flex justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Orden #{selectedOrder.order_number}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Creada el{' '}
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <Tooltip content="Marcar como terminada" color="warning">
                  <Chip
                    size="md"
                    onClick={() => {
                      if (selectedOrder.order_status !== 'Terminada') {
                        handleUpdate(selectedOrder.id, 'Terminada')
                      }
                    }}
                    className={
                      selectedOrder.order_status === 'Terminada'
                        ? 'cursor-not-allowed opacity-50 pointer-events-none'
                        : 'cursor-pointer'
                    }
                    variant="bordered"
                    color={getStatusColor(selectedOrder.order_status)}>
                    {selectedOrder.order_status}
                  </Chip>
                </Tooltip>
              </CardHeader>

              <Divider className="my-4" />

              {/* Client Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <FaUser className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOrder.client_name || 'Sin nombre'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOrder.client_phone || 'Sin teléfono'}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Productos</h3>
                <SimpleTableComponent
                  columns={columns}
                  rows={selectedOrder.orderItems.map((item) => ({
                    id: item.id,
                    meal_name: item.meal.name,
                    details:
                      item.orderItemDetails && item.orderItemDetails.length > 0
                        ? item.orderItemDetails
                            .map((detail) => detail.details)
                            .join(', ')
                        : 'N/A',
                    quantity: item.quantity,
                    price: currencyFormat(item.meal.price),
                    subtotal: currencyFormat(item.meal.price * item.quantity)
                  }))}
                />
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Información de Pago
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">
                        Estado de pago:
                      </span>
                      <Chip
                        color={
                          selectedOrder.payments?.length ? 'success' : 'danger'
                        }
                        variant="flat">
                        {selectedOrder.payments?.length
                          ? 'Pagado'
                          : 'Pendiente'}
                      </Chip>
                    </div>

                    {selectedOrder.payments?.length > 0 &&
                      selectedOrder.payments[0].payment_method && (
                        <div>
                          <span className="text-sm text-muted-foreground block mb-1">
                            Método de pago:
                          </span>
                          <Chip color="primary" variant="dot">
                            {selectedOrder.payments[0].payment_method}
                          </Chip>
                        </div>
                      )}

                    <div className="flex gap-2 flex-row">
                      <Button
                        onClick={() => window.print()}
                        color="primary"
                        variant="bordered">
                        <FaPrint className="mr-2" /> Imprimir orden
                      </Button>
                      {!selectedOrder.payments?.length && (
                        <Button
                          onClick={() => setIsPaymentModalOpen(true)}
                          color="success"
                          variant="bordered">
                          <FaMoneyBillWave className="mr-2" /> Agregar pago
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedOrder.payments?.length > 0 &&
                      selectedOrder.payments[0].amount_given && (
                        <>
                          <div>
                            <span className="text-sm text-muted-foreground block mb-1">
                              Monto recibido:
                            </span>
                            <span className="text-lg font-medium">
                              {currencyFormat(
                                selectedOrder.payments[0].amount_given
                              )}
                            </span>
                          </div>

                          <div>
                            <span className="text-sm text-muted-foreground block mb-1">
                              Cambio:
                            </span>
                            <span className="text-lg font-medium">
                              {currencyFormat(
                                selectedOrder.payments[0].amount_given -
                                  selectedOrder.total_price
                              )}
                            </span>
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onOpenChange={() => setIsPaymentModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Registrar Pago</ModalHeader>
          <ModalBody>
            <Select
              label="Método de Pago"
              placeholder="Selecciona un método"
              value={paymentMethod}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string
                setPaymentMethod(selectedKey)
              }}>
              {paymentMethods.map((method) => (
                <SelectItem key={method.key} value={method.key}>
                  {method.label}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Monto Recibido"
              type="number"
              placeholder="Ingrese el monto"
              value={amountGiven}
              onChange={(e) => setAmountGiven(e.target.value)}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsPaymentModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleUpdatePayment}
              disabled={!paymentMethod || !amountGiven}>
              Guardar Pago
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
