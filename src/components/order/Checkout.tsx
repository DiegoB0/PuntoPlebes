'use client'

import Link from 'next/link'

import { Button, Card, CardBody, Divider } from '@nextui-org/react'
import { BsArrowLeft } from 'react-icons/bs'
import { CgMoreVertical } from 'react-icons/cg'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  notes?: string
}

export default function Checkout({
  items = [],
  onItemClick
}: {
  items?: OrderItem[]
  onItemClick?: (item: OrderItem) => void
}) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const tax = subtotal * 0.07 // 7% tax rate
  const total = subtotal + tax

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardBody className="p-0">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <h2 className="font-medium">Orden. #1</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-primary">
              Nombre de cuenta
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8"
              startContent={<CgMoreVertical className="h-4 w-4" />}></Button>
          </div>
        </div>

        {/* Order Items */}
        <div className=" border-y">
          <div className="p-4 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemClick && onItemClick(item)}
                className="space-y-1 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                <div className="flex items-start justify-between py-1">
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
          <Button variant="bordered" className="w-full" size="sm">
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

        {/* Payment Actions */}
        <div className="p-4 space-y-2">
          <div className="flex gap-2">
            <Button variant="bordered" className="flex-1">
              Completar sin pagar
            </Button>
            <Button variant="bordered" className="flex-1">
              Descuento
            </Button>
          </div>
          <Button color="danger" fullWidth size="lg">
            Pagar ${total.toFixed(2)}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
