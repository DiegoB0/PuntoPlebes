'use client'

import { useEffect, useState } from 'react'

import { currencyFormat } from '@/helpers/formatCurrency'
import { toastAlert } from '@/services/alerts'
import { useOrdersStore } from '@/store/orders/orderSlice'
import {
  OrderItem,
  type CreateOrderDto,
  PaymentInfo,
  ClientData
} from '@/types/order'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardBody, Checkbox } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FaTrash, FaUserCircle } from 'react-icons/fa'
import * as Yup from 'yup'

import SlideToConfirmButton from '../UI/slideToConfirm'
import ClientDataModal from './modals/ClientData'
import PaymentModal from './modals/Payment'

interface CheckoutProps {
  onItemClick?: (item: OrderItem) => void
  items?: OrderItem[]
  handleItemClick?: (item: OrderItem) => void
  onRemoveItem?: (id: number) => void
}

const createDynamicOrderSchema = (totalAmount: number) =>
  Yup.object().shape({
    client_name: Yup.string().required('El nombre del cliente es obligatorio'),
    client_phone: Yup.string().nullable(),
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
            `El monto debe ser al menos ${currencyFormat(totalAmount)}`
          )
      })
    )
  })

export default function Checkout ({
  onItemClick,
  items: propItems,
  onRemoveItem
}: CheckoutProps) {
  const router = useRouter()
  const [isClientDataModalOpen, setIsClientDataModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isClientDataFilled, setIsClientDataFilled] = useState(false)
  const [isPaymentDataFilled, setIsPaymentDataFilled] = useState(false)
  const [payLater, setPayLater] = useState(false)

  const {
    registerOrder,
    items: storeItems,
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
    if (isClientDataModalOpen) {
      reset({
        client_name: clientInfo?.client_name || '',
        client_phone: clientInfo?.client_phone || ''
      })
    }
  }, [isClientDataModalOpen, clientInfo, reset])

  // ✅ Open Client Data Modal if client name is missing
  const validateClientData = async () => {
    const isValid = await trigger(['client_name'])
    if (!isValid) {
      setIsClientDataModalOpen(true)
      return false
    }
    return true
  }
  const handleClientDataSubmit = (data: ClientData) => {
    if (!data.client_name) return // ❌ Prevent empty submission

    setClientInfo(data)
    setIsClientDataFilled(true)
    setIsClientDataModalOpen(false) // ✅ Close modal after submission
  }

  const handleQuickAction = async () => {
    // ✅ Ensure there are items in the order
    if (!isOrderReadyToRegister) {
      return toastAlert({
        title: 'Agrega al menos un producto al carrito',
        icon: 'warning'
      })
    }

    // ✅ Ensure client data is filled before proceeding
    const isClientValid = await validateClientData()
    if (!isClientValid) return

    // ✅ If not paying now, register order immediately
    if (payLater) {
      const registered = await registerOrder()
      if (registered) {
        router.push('orders')
      }
      return
    }

    // ✅ Otherwise, proceed to payment modal
    setIsPaymentModalOpen(true)
  }

  const handlePayment = async (data: CreateOrderDto) => {
    const paymentInfo: PaymentInfo = {
      payment_method: data?.payments?.[0]?.payment_method || '',
      amount_given: data?.payments?.[0]?.amount_given || 0
    }
    setPaymentInfo(paymentInfo)
    setIsPaymentDataFilled(true)
    // ✅ Register order after payment is entered
    const registered = await registerOrder()
    if (registered) {
      setIsPaymentModalOpen(false)
      router.push('orders')
    }
  }

  const handleHalfwayPoint = () => {
    if (!isClientDataFilled) {
      setIsClientDataModalOpen(true) // ✅ Trigger Client Data Modal if missing
    } else if (!payLater && !isPaymentDataFilled) {
      setIsPaymentModalOpen(true) // ✅ Trigger Payment Modal if needed
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
            {/* ✅ Always require client data */}
            <Button
              variant="ghost"
              size="sm"
              className="text-primary text-sm"
              startContent={<FaUserCircle />}
              onPress={() => setIsClientDataModalOpen(true)}>
              {clientInfo?.client_name || 'Añadir'}
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
                  onClick={() => onItemClick?.(item)}>
                  <span className="text-muted-foreground">{item.quantity}</span>
                  <div>
                    <span className="font-bold hover:underline">
                      {item.name}
                    </span>
                    <div className="text-sm text-muted-foreground">{`${currencyFormat(item?.price)} x ${item.quantity}`}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="solid"
                  color="danger"
                  isIconOnly
                  onClick={() => onRemoveItem?.(item.id)}
                  startContent={<FaTrash />}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>


        {/* Actions */}
        <div className="p-4 space-y-2">
          <Checkbox
            isSelected={payLater}
            size="lg"
            color="danger"
            onValueChange={setPayLater}>
            Pagar después
          </Checkbox>

          <SlideToConfirmButton
            onConfirm={handleQuickAction}
            text={`Registrar $${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            fillColor="#f54180"
            loading={loading}
            onHalfway={handleHalfwayPoint} // ✅ Trigger halfway point action
            canComplete={payLater || isPaymentDataFilled} // ✅ Cannot complete unless payment is filled (if required)
            disabled={total === 0}
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

      <ClientDataModal
        isOpen={isClientDataModalOpen}
        onClose={() => { }} // ❌ Prevent closing unless valid
        onSubmit={handleClientDataSubmit}
        clientInfo={clientInfo}
        isDismissable={false}
        errors={errors}
      />

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
