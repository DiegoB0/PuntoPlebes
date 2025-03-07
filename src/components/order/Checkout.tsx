'use client'

import { useEffect, useState } from 'react'
import { Button, Card, CardBody, Checkbox } from '@nextui-org/react'

import { FaTrash, FaUserCircle } from 'react-icons/fa'
import SlideToConfirmButton from '../UI/slideToConfirm'
import { useOrdersStore } from '@/store/orders/orderSlice'
import {
  OrderItem,
  CreateOrderDto,
  ClientData,
  PaymentInfo
} from '@/types/order'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { toastAlert } from '@/services/alerts'
import OrderRegistrationModal from './modals/ClientData'
import PaymentModal from './modals/Payment'
import { currencyFormat } from '@/helpers/formatCurrency'

interface CheckoutProps {
  onItemClick?: (item: OrderItem) => void
  items?: OrderItem[]
  handleItemClick?: (item: OrderItem) => void
  onRemoveItem?: (id: number) => void
}
const createDynamicOrderSchema = (totalAmount: number) =>
  Yup.object().shape({
    client_name: Yup.string(),
    client_phone: Yup.string(),
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
  const [slideProgress, setSlideProgress] = useState(0)
  const [isValidationPending, setIsValidationPending] = useState(false)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [payLater, setPayLater] = useState(false)

  const {
    registerOrder,
    items: storeItems,
    removeItem: storeRemoveItem,
    clearCart,
    getOrders,
    setClientInfo,
    setPaymentInfo,
    clientInfo,
    isOrderReadyToRegister,
    loading,
    getLastOrderNumber,
    lastNumber
  } = useOrdersStore()
  const items = propItems || storeItems

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const total = subtotal
  const {
    formState: { errors },
    reset,
    trigger
  } = useForm<CreateOrderDto>({
    resolver: yupResolver(createDynamicOrderSchema(total)),
    defaultValues: {
      items: [],
      payments: [{ payment_method: '', amount_given: 0 }]
    }
  })

  useEffect(() => {
    void getOrders()
    void getLastOrderNumber()
  }, [getOrders, getLastOrderNumber])

  useEffect(() => {
    if (isOrderModalOpen) {
      reset({
        client_name: clientInfo?.name || '',
        client_phone: clientInfo?.phone || ''
      })
    }
  }, [isOrderModalOpen, clientInfo, reset])

  const handleSlideStart = () => {
    if (!isOrderReadyToRegister) {
      setIsOrderModalOpen(true)
    }
  }

  const handleSlideProgress = (progress: number) => {
    setSlideProgress(progress)
    if (progress > 10 && !isOrderReadyToRegister) {
      setIsOrderModalOpen(true)
    }
  }

  const handleOrderRegistration = async (data: CreateOrderDto) => {
    // Check if there are items in the order
    if (items.length === 0) {
      toastAlert({
        title: 'Agrega al menos un producto al carrito',
        icon: 'warning'
      })
      return
    }

    const clientInfo: ClientData = {
      name: data.client_name || '',
      phone: data.client_phone || ''
    }
    setClientInfo(clientInfo)
    // Don't close modal if validation fails
    const isValid = await trigger()
    if (isValid) {
      setIsOrderModalOpen(false)
    }
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
      // ! If paying later no need for client validation NOW
      // const clientValid = await trigger(['client_name', 'client_phone'])
      // if (!clientValid) {
      //   setIsOrderModalOpen(true)
      //   return
      // }

      const registered = await registerOrder()
      if (registered) {
        router.push('orders')
      }
      return
    }

    //! If paying now, validate client data before proceeding
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
      payment_method: data?.payments?.[0]?.payment_method || '',
      amount_given: data?.payments?.[0]?.amount_given || 0
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
            <h2 className="font-medium">Orden. #{lastNumber}</h2>
            {!isOrderReadyToRegister && (
              <span className="text-xs text-yellow-600">
                (Información incompleta)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* ✅ Only show client info button if payment is required */}
            {!payLater && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary text-sm"
                startContent={<FaUserCircle />}
                onClick={() => setIsOrderModalOpen(true)}>
                {clientInfo
                  ? isOrderReadyToRegister()
                    ? 'Cliente verificado ✓'
                    : 'Agregar'
                  : 'Añadir datos'}
              </Button>
            )}
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
                      {`${currencyFormat(item?.price)} x ${item.quantity}`}
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
              trigger() // ! Update validation when changed
            }}>
            Pagar después
          </Checkbox>

          <SlideToConfirmButton
            onConfirm={handleQuickAction}
            resetTrigger={isOrderModalOpen || isPaymentModalOpen}
            text={`Registrar $${total.toFixed(2)}`}
            fillColor="#f54180"
            loading={loading || isValidationPending}
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

      {/* //! Only require client info if paying now */}
      {!payLater && (
        <OrderRegistrationModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          onSubmit={handleOrderRegistration}
          clientInfo={clientInfo}
          isDismissable={true}
          errors={errors}
        />
      )}

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handlePayment}
        errors={errors}
        total={total}
      />
    </Card>
  )
}
