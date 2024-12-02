'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  Checkbox,
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
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { toastAlert } from '@/services/alerts'

interface CheckoutProps {
  onItemClick?: (item: OrderItem) => void
  items?: OrderItem[]
  handleItemClick?: (item: OrderItem) => void
  onRemoveItem?: (id: number) => void
}
const createDynamicOrderSchema = (totalAmount: number) =>
  Yup.object().shape({
    client_name: Yup.string().required('El nombre del cliente es obligatorio'),
    client_phone: Yup.string().required(
      'El teléfono del cliente es obligatorio'
    ),
    items: Yup.array().of(
      Yup.object().shape({
        meal_id: Yup.number().required(),
        quantity: Yup.number().required(),
        details: Yup.array()
      })
    ),
    payments: Yup.array().of(
      Yup.object().shape({
        payment_method: Yup.string().required(
          'El método de pago es obligatorio'
        ),
        amount_given: Yup.number()
          .required('El monto es obligatorio')
          .min(
            totalAmount,
            `El monto debe ser al menos $${totalAmount.toFixed(2)}`
          )
      })
    )
  })

export default function Checkout({
  onItemClick,
  items: propItems,
  handleItemClick,
  onRemoveItem
}: CheckoutProps) {
  const router = useRouter()
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [payLater, setPayLater] = useState(false)

  const {
    registerOrder,
    orders,
    items: storeItems,
    removeItem: storeRemoveItem,
    clearCart,
    getOrders,
    setClientInfo,
    setPaymentInfo,
    clientInfo,
    paymentInfo,
    isOrderReadyToRegister
  } = useOrdersStore()
  const items = propItems || storeItems

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const total = subtotal
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    trigger
  } = useForm<CreateOrderDto>({
    resolver: yupResolver(createDynamicOrderSchema(total)),
    defaultValues: {
      client_name: '',
      client_phone: '',
      items: [],
      payments: [{ payment_method: '', amount_given: 0 }]
    }
  })

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

  const handleOrderRegistration = async (data: CreateOrderDto) => {
    // Check if there are items in the order
    if (items.length === 0) {
      toastAlert({
        title: 'Agrega al menos un producto al carrito',
        icon: 'warning'
      })
      return
    }

    const clientInfo: ClientInfo = {
      name: data.client_name || '',
      phone: data.client_phone || ''
    }
    setClientInfo(clientInfo)

    // Only close the modal, do not automatically open payment modal
    setIsOrderModalOpen(false)
  }

  const handleQuickAction = async () => {
    // Check if there are items in the order
    if (!isOrderReadyToRegister) {
      return toastAlert({
        title: 'Agrega al menos un producto al carrito',
        icon: 'warning'
      })
    }

    // If pay later is selected, try to register order directly
    if (payLater) {
      // Validate client info
      const clientValid = await trigger(['client_name', 'client_phone'])
      if (!clientValid) {
        setIsOrderModalOpen(true)
        return
      }

      const registered = await registerOrder()
      if (registered) {
        router.push('orders')
      }
      return
    }

    // If not pay later, ensure client info and payment are collected
    const clientValid = await trigger(['client_name', 'client_phone'])
    if (!clientValid) {
      setIsOrderModalOpen(true)
      return
    }

    // Open payment modal to collect payment info
    setIsPaymentModalOpen(true)
  }

  const handlePayment = async (data: CreateOrderDto) => {
    const paymentInfo: PaymentInfo = {
      method: data?.payments?.[0]?.payment_method || '',
      amountGiven: data?.payments?.[0]?.amount_given || 0
    }
    setPaymentInfo(paymentInfo)

    // Try to register order with payment info
    const registered = await registerOrder()
    if (registered) {
      setIsPaymentModalOpen(false)
      router.push('orders')
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
    <Card className="w-full mx-auto h-full">
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
              {clientInfo ? 'Editar datos' : 'Añadir datos'}
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
                    <div className="text-sm text-muted-foreground flex flex-row justify-start">
                      {`$${item.price.toFixed(2)} x ${item.quantity}`}
                    </div>
                    <span>
                      {item.details
                        ? item.details.map((detail) => detail).join(', ')
                        : ''}
                    </span>
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
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 space-y-2">
          <Checkbox
            isSelected={payLater}
            size="lg"
            color="danger"
            onValueChange={(checked) => {
              setPayLater(checked)

              trigger()
            }}>
            Pagar después
          </Checkbox>

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
              <div className="text-small text-default-500">
                Total a pagar: ${total.toFixed(2)}
              </div>
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
