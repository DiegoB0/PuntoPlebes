'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Select,
  SelectItem
} from '@nextui-org/react'
import { FaTrash, FaUserCircle } from 'react-icons/fa'
import SlideToConfirmButton from '../UI/slideToConfirm'
import { useOrdersStore } from '@/store/orders/orderSlice'
import {
  OrderItem,
  CreateOrderDto,
  ClientInfo,
  PaymentInfo
} from '@/types/order'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { orderSchema } from '@/schemas/orderSchema'
import { useRouter } from 'next/navigation'

interface CheckoutProps {
  onItemClick?: (item: OrderItem) => void
  items?: OrderItem[]
  handleItemClick?: (item: OrderItem) => void
  onRemoveItem?: (id: number) => void
}

export default function Checkout({
  onItemClick,
  items: propItems,
  handleItemClick,
  onRemoveItem
}: CheckoutProps) {
  const router = useRouter()
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateOrderDto>({
    resolver: yupResolver(orderSchema),
    defaultValues: {
      client_name: '',
      client_phone: '',
      payments: [{ payment_method: '', amount_given: 0 }]
    }
  })

  const {
    registerOrder,
    completePayment,
    orders,
    items: storeItems,
    removeItem: storeRemoveItem,
    clearCart,
    getOrders,
    setClientInfo,
    setPaymentInfo,
    clientInfo,
    paymentInfo,
    pendingOrder,
    isOrderReadyToRegister,
    isOrderReadyToPayment
  } = useOrdersStore()

  useEffect(() => {
    getOrders()
  }, [getOrders])

  useEffect(() => {
    if (isOrderModalOpen) {
      reset({
        client_name: clientInfo?.name || '',
        client_phone: clientInfo?.phone || ''
      })
    }
  }, [isOrderModalOpen, clientInfo, reset])

  const orderNumbers = orders
    ? orders.slice(-1)[0]?.order_number + 1
    : undefined

  const items = propItems || storeItems

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const tax = subtotal * 0.07
  const total = subtotal + tax

  const handleOrderRegistration = async (data: CreateOrderDto) => {
    const clientInfo: ClientInfo = {
      name: data.client_name || '',
      phone: data.client_phone || ''
    }
    setClientInfo(clientInfo)
    setIsOrderModalOpen(false)

    if (isOrderReadyToRegister()) {
      await registerOrder()
    }
  }

  const handlePayment = async (data: CreateOrderDto) => {
    const paymentInfo: PaymentInfo = {
      method: data?.payments?.[0]?.payment_method || '',
      amountGiven: data?.payments?.[0]?.amount_given || 0
    }
    setPaymentInfo(paymentInfo)
    setIsPaymentModalOpen(false)

    if (isOrderReadyToPayment()) {
      await completePayment(paymentInfo).then(() => {
        router.push('/orders')
      })
    }
  }

  const handleQuickAction = () => {
    if (!isOrderReadyToRegister()) {
      setIsOrderModalOpen(true)
    } else {
      registerOrder()
    }
  }

  const handleRemoveItem = (id: number) => {
    if (onRemoveItem) {
      onRemoveItem(id)
    } else {
      storeRemoveItem(id)
    }
  }

  const handleItemClickInternal = (item: OrderItem) => {
    if (onItemClick) {
      onItemClick(item)
    } else if (handleItemClick) {
      handleItemClick(item)
    }
  }

  return (
    <Card className="w-fullmx-auto h-full">
      <CardBody className="p-0">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <h2 className="font-medium">Orden. #{orderNumbers}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary text-sm"
              startContent={<FaUserCircle />}
              onClick={() => setIsOrderModalOpen(true)}>
              {clientInfo ? 'Editar datos' : 'Añadir datos de cliente'}
            </Button>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-y overflow-y-auto max-h-[calc(100vh-300px)]">
          <div className="p-4 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between py-2 px-2 rounded-md hover:bg-gray-100">
                <div
                  className="flex gap-2 cursor-pointer"
                  onClick={() => handleItemClickInternal(item)}>
                  <span className="text-muted-foreground ">
                    {item.quantity}
                  </span>
                  <div>
                    <span className="font-bold hover:underline">
                      {item.name}
                    </span>
                    {item.notes && (
                      <div className="text-sm text-muted-foreground">
                        {item.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    ${(item.price * item.quantity).toFixed(2)}
                    <Button
                      size="sm"
                      variant="solid"
                      color="danger"
                      isIconOnly
                      onClick={() => handleRemoveItem(item.id)}
                      startContent={<FaTrash />}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {`$${item.price.toFixed(2)} x ${item.quantity}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>IVA:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 space-y-2">
          <SlideToConfirmButton
            onConfirm={handleQuickAction}
            text={`Registrar $${total.toFixed(2)}`}
            fillColor="#f54180"
          />

          <Button
            variant="flat"
            color="danger"
            fullWidth
            onClick={() => clearCart()}>
            Vaciar orden
          </Button>
        </div>
      </CardBody>

      {/* Order Registration Modal */}
      <Modal
        backdrop="blur"
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}>
        <ModalContent className="flex justify-center items-center p-1">
          <ModalBody className="gap-2 w-full">
            <form
              onSubmit={handleSubmit(handleOrderRegistration)}
              className="grid grid-cols-1 gap-3 py-3 px-2">
              <Controller
                name="client_name"
                control={control}
                defaultValue={clientInfo?.name || ''}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="bordered"
                    label="Nombre del cliente"
                    placeholder="Ingrese el nombre del cliente"
                    errorMessage={errors.client_name?.message}
                  />
                )}
              />
              <Controller
                name="client_phone"
                control={control}
                defaultValue={clientInfo?.phone || ''}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="bordered"
                    label="Teléfono"
                    placeholder="Ingrese el número de teléfono"
                    errorMessage={errors.client_phone?.message}
                  />
                )}
              />
              <ModalFooter>
                <Button
                  variant="ghost"
                  onPress={() => setIsOrderModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" color="success">
                  Confirmar
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Payment Modal */}
      <Modal
        backdrop="blur"
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}>
        <ModalContent className="flex justify-center items-center p-1">
          <ModalBody className="gap-2 w-full">
            <form
              onSubmit={handleSubmit(handlePayment)}
              className="grid grid-cols-1 gap-3 py-3 px-2">
              <Controller
                name="payments.0.payment_method"
                control={control}
                defaultValue={paymentInfo.method || 'efectivo'}
                render={({ field }) => (
                  <Select
                    {...field}
                    variant="bordered"
                    label="Método de pago"
                    placeholder="Seleccione el método de pago"
                    errorMessage={
                      errors.payments?.[0]?.payment_method?.message
                    }>
                    <SelectItem key="efectivo" value="efectivo">
                      Efectivo
                    </SelectItem>
                    <SelectItem key="tarjeta" value="tarjeta">
                      Tarjeta
                    </SelectItem>
                  </Select>
                )}
              />
              <Controller
                name="payments.0.amount_given"
                control={control}
                defaultValue={paymentInfo.amountGiven || 0}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    variant="bordered"
                    label="Cantidad recibida"
                    placeholder="Ingrese la cantidad recibida"
                    errorMessage={errors.payments?.[0]?.amount_given?.message}
                    value={String(field.value)}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <ModalFooter>
                <Button
                  variant="ghost"
                  onPress={() => setIsPaymentModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" color="success">
                  Confirmar Pago
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  )
}
