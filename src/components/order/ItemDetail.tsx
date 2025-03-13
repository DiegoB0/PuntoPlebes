'use client'

import { useState } from 'react'

import { toastAlert } from '@/services/alerts'
import { useOrdersStore } from '@/store/orders/orderSlice'
import type { OrderItem } from '@/types/order'
import { Card, CardBody, Button, Divider, Input, Chip } from '@nextui-org/react'
import { BsDash, BsPlus, BsTrash, BsCheck, BsArrowLeft } from 'react-icons/bs'

export default function ItemDetail({
  item,
  onBack,
  onQuantityChange
}: {
  item: OrderItem
  onBack?: () => void
  onQuantityChange?: (quantity: number) => void
}) {
  const [quantity, setQuantity] = useState(item.quantity || 1)
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>(
    item.details || []
  )
  const [customModifier, setCustomModifier] = useState('')

  const addItemDetail = useOrdersStore((state) => state.addItemDetail)
  const removeItem = useOrdersStore((state) => state.removeItem)

  const handleSaveDetails = () => {
    if (selectedModifiers.length > 0) {
      try {
        addItemDetail(item.id, selectedModifiers)
        toastAlert({
          icon: 'info',
          title: 'Instrucciones registradas'
        })
        onBack?.()
      } catch (error) {
        toastAlert({
          icon: 'error',
          title: 'Error al guardar los detalles'
        })
      }
    } else {
      onBack?.()
    }
  }

  const handleAddCustomModifier = () => {
    if (
      customModifier.trim() !== '' &&
      !selectedModifiers.includes(customModifier.trim())
    ) {
      setSelectedModifiers([...selectedModifiers, customModifier.trim()])
      setCustomModifier('')
    }
  }

  const handleRemoveModifier = (modifier: string) => {
    setSelectedModifiers(selectedModifiers.filter((m) => m !== modifier))
  }

  const predefinedModifiers = [
    'Sin queso',
    'Sin tomate',
    'Sin lechuga',
    'Sin jalapeños',
    'Extra queso',
    'Extra salsa'
  ]

  return (
    <Card className="w-full mx-auto">
      <CardBody>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md gap-2">
              <Button
                startContent={<BsArrowLeft />}
                isIconOnly
                size="sm"
                onClick={onBack}></Button>
              <Button
                size="sm"
                variant="bordered"
                isIconOnly
                onClick={() => {
                  const newQuantity = Math.max(1, quantity - 1)
                  setQuantity(newQuantity)
                  onQuantityChange?.(newQuantity)
                }}>
                <BsDash className="h-5 w-5" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                size="sm"
                variant="bordered"
                isIconOnly
                onClick={() => {
                  const newQuantity = quantity + 1
                  setQuantity(newQuantity)
                  onQuantityChange?.(newQuantity)
                }}>
                <BsPlus className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              color="danger"
              variant="solid"
              startContent={<BsTrash className="h-4 w-4" />}
              onClick={() => {
                removeItem(item.id)
              }}>
              Quitar
            </Button>
            <Button
              size="sm"
              variant="bordered"
              color="success"
              startContent={<BsCheck className="h-4 w-4" />}
              onClick={handleSaveDetails}>
              Guardar
            </Button>
          </div>
        </div>
        {/* Order Summary */}
        <h3 className="font-medium mb-2">Resumen de orden</h3>
        <span className="font-bold text-lg ">
          {quantity}x {item.name}
        </span>
        <p>{item.description}</p>
        {selectedModifiers.length > 0 && (
          <ul className="list-disc list-inside grid grid-cols-2">
            {selectedModifiers.map((modifier) => (
              <li key={modifier}>{modifier}</li>
            ))}
          </ul>
        )}
        <Divider className="my-4" />
        {/* Selected Modifiers Preview */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Selecciona tus modificadores</h3>
          <div className="flex flex-wrap gap-2">
            {selectedModifiers.map((modifier) => (
              <Chip
                key={modifier}
                color="warning"
                onClose={() => handleRemoveModifier(modifier)}
                variant="flat">
                {modifier}
              </Chip>
            ))}
          </div>
        </div>

        {/* Modifiers */}
        <h3 className="font-medium mb-2">Instrucciones</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {predefinedModifiers.map((modifier) => (
            <Button
              key={modifier}
              variant="bordered"
              className={`justify-start ${
                selectedModifiers.includes(modifier) ? 'border-danger' : ''
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

        {/* Custom Modifier Input */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Otro..."
            variant="faded"
            value={customModifier}
            onChange={(e) => setCustomModifier(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddCustomModifier()
              }
            }}
          />
          <Button onClick={handleAddCustomModifier}>Agregar</Button>
        </div>
      </CardBody>
    </Card>
  )
}
