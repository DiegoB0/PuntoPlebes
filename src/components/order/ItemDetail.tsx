'use client'

import { useState } from 'react'
import {
  Card,
  CardBody,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  Input,
  DropdownMenu
} from '@nextui-org/react'
import { BsDash, BsPlus, BsInfoCircle, BsTrash, BsCheck } from 'react-icons/bs'
import { FaCopy } from 'react-icons/fa'
import type { OrderItem } from '@/types/order'

export default function ItemDetail({
  item,
  onBack,
  onClose,
  onQuantityChange,
  onRemove
}: {
  item: OrderItem
  onBack?: () => void
  onClose?: () => void
  onQuantityChange?: (quantity: number) => void
  onRemove?: () => void
}) {
  const [quantity, setQuantity] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([])

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta)
    setQuantity(newQuantity)
    onQuantityChange?.(newQuantity)
  }

  return (
    <Card className="w-full  mx-auto">
      <CardBody>
        {/* Header with quantity controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button
                size="sm"
                variant="bordered"
                isIconOnly
                onClick={() => handleQuantityChange(-1)}>
                <BsDash className="h-5 w-5" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                size="sm"
                variant="bordered"
                isIconOnly
                onClick={() => handleQuantityChange(1)}>
                <BsPlus className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="bordered"
              startContent={<BsInfoCircle className="h-4 w-4" />}>
              Details
            </Button>
            <Button
              size="sm"
              variant="bordered"
              startContent={<FaCopy className="h-4 w-4" />}>
              Repeat
            </Button>
            <Button
              size="sm"
              variant="bordered"
              startContent={<BsTrash className="h-4 w-4" />}
              onClick={onRemove}>
              Remove
            </Button>
            <Button
              size="sm"
              startContent={<BsCheck className="h-4 w-4" />}
              onClick={onBack}>
              Done
            </Button>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">{item.name}</h2>

        {/* Options Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {['Side Choice', 'Dining Option', 'Course', 'Split'].map((label) => (
            <div key={label} className="space-y-2">
              <label className="font-medium">{label}</label>
              <Dropdown>
                <Button className="w-full">Select {label.toLowerCase()}</Button>
                <DropdownMenu>
                  <DropdownItem key="option1">Option 1</DropdownItem>
                  <DropdownItem key="option2">Option 2</DropdownItem>
                  <DropdownItem key="option3">Option 3</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button variant="bordered" className="w-full justify-start">
            Special Request
          </Button>
          <Button variant="bordered" className="w-full justify-start">
            Discount Item
          </Button>
        </div>

        <Divider className="my-6" />

        {/* Modifiers */}
        <div className="space-y-4">
          <h3 className="font-medium">Modifiers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Bacon',
              'Side Salad',
              'Mexican Slaw',
              'Elote',
              'Seasoned Rice'
            ].map((modifier) => (
              <Button
                key={modifier}
                variant="bordered"
                className={`justify-start ${
                  selectedModifiers.includes(modifier) ? 'border-primary' : ''
                }`}
                onClick={() =>
                  setSelectedModifiers((prev) =>
                    prev.includes(modifier)
                      ? prev.filter((m) => m !== modifier)
                      : [...prev, modifier]
                  )
                }>
                {modifier}
              </Button>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
