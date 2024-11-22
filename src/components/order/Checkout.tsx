'use client'

import Link from 'next/link'
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
  Slider
} from '@nextui-org/react'
import { BsArrowLeft } from 'react-icons/bs'
import { CgMoreVertical } from 'react-icons/cg'
import SlideToConfirmButton from '../UI/slideToConfirm'
import { FaTrash } from 'react-icons/fa'
import { useOrdersStore } from '@/store/orders/orderSlice'
import { OrderItem, CreateOrderDto } from '@/types/order'
import { useEffect, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { FaCircleUser } from 'react-icons/fa6'
import { yupResolver } from '@hookform/resolvers/yup'
import { orderSchema } from '@/schemas/orderSchema'

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
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateOrderDto>({
    resolver: yupResolver(orderSchema) as Resolver<CreateOrderDto>,
    defaultValues: {
      client_name: '',
      client_phone: ''
    }
  })
  const {
    saveOrder,
    orders,
    items: storeItems,
    removeItem: storeRemoveItem,
    clearCart,
    getOrders
  } = useOrdersStore()
  useEffect(() => {
    getOrders()
  }, [getOrders])
  const orderNumbers = orders ? orders.slice(-1)[0]?.order_number : undefined

  const items = propItems || storeItems

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const tax = subtotal * 0.07
  const total = subtotal + tax

  const handlePayment = async (clientData?: CreateOrderDto) => {
    const result = await saveOrder({ ...clientData })
    if (result) {
      setIsClientModalOpen(false)
    }
  }

  const onSubmitClientInfo = (data: CreateOrderDto) => {
    handlePayment(data)
  }
  const handleQuickPayment = () => {
    handlePayment()
  }
  const handlePaymentWithClientInfo = () => {
    setIsClientModalOpen(true)
  }
  // Determine which remove function to use
  const handleRemoveItem = (id: number) => {
    if (onRemoveItem) {
      onRemoveItem(id)
    } else {
      storeRemoveItem(id)
    }
  }

  // Determine which item click handler to use
  const handleItemClickInternal = (item: OrderItem) => {
    if (onItemClick) {
      onItemClick(item)
    } else if (handleItemClick) {
      handleItemClick(item)
    }
  }

  return (
    <Card className="w-full max-w-xs mx-auto h-full">
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
              className="text-primary"
              startContent={<FaCircleUser />}
              onClick={handlePaymentWithClientInfo}>
              Añadir datos de cliente
            </Button>
            {/* <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8"
              startContent={<CgMoreVertical className="h-4 w-4" />}></Button> */}
          </div>
        </div>

        {/* Order Items */}
        <div className=" border-y">
          <div className="p-4 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="space-y-1 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                <div
                  onClick={() => handleItemClickInternal(item)}
                  className="flex items-start justify-between py-1">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">
                      {item.quantity}
                    </span>
                    <div>
                      <div>{item.name}</div>
                      {item.notes && (
                        <div className="text-sm text-muted-foreground">
                          {item.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                {/* Remove item button */}
                <div className="text-right">
                  <Button
                    size="sm"
                    variant="solid"
                    color="danger"
                    onClick={() => handleRemoveItem(item.id)}
                    startContent={<FaTrash />}
                  />
                </div>
                <Divider />
              </div>
            ))}
          </div>
        </div>

        {/* Order Actions */}
        <div className="p-4 grid grid-cols-2 gap-2">
          <Button variant="bordered" className="w-full" size="sm">
            En espera
          </Button>
          <Button
            variant="bordered"
            className="w-full"
            size="sm"
            onClick={handleQuickPayment}>
            Completado
          </Button>
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
        </div>

        {/* Clear Cart */}
        <div className="p-4">
          <SlideToConfirmButton
            onConfirm={handlePayment}
            text={`Pagar $${total.toFixed(2)}`}
            fillColor="#f54180"
          />
          <Button
            className="mt-2"
            variant="solid"
            color="danger"
            fullWidth
            onClick={() => clearCart()}>
            Vaciar orden
          </Button>
        </div>
      </CardBody>
      <Modal
        backdrop="blur"
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}>
        <ModalContent className="flex justify-center items-center p-1">
          <ModalBody className="gap-2 w-full">
            <form
              onSubmit={handleSubmit(onSubmitClientInfo)}
              className=" grid grid-cols-1 gap-3 py-3 px-2  ">
              <Input
                {...register('client_name')}
                variant="bordered"
                label="Client Name"
                placeholder="Enter client name"
                errorMessage={errors.client_name?.message}
              />
              <Input
                {...register('client_phone')}
                variant="bordered"
                label="Phone Number"
                placeholder="Enter phone number"
                errorMessage={errors.client_phone?.message}
              />
              <ModalFooter>
                <Button
                  variant="ghost"
                  onPress={() => setIsClientModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Confirm Payment
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  )
}
