'use client'

import { useEffect, useState } from 'react'
import { confirmationAlert, toastAlert } from '@/services/alerts'
import { useOrdersStore } from '@/store/orders/orderSlice'
import { useModifierStore } from '@/store/modifiers/modifierSlice'
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
  const [selectedModifiers, setSelectedModifiers] = useState<number[]>(
    item.details || []
  )

  const removeItem = useOrdersStore((state) => state.removeItem)
  const { getModifiers, modifiers } = useModifierStore()

  useEffect(() => {
    void getModifiers()
  }, [getModifiers])
  useEffect(() => {
    setSelectedModifiers(item.details || [])
  }, [item]) // Runs every time `item` changes
  const handleSaveDetails = async () => {
    const currentItems = useOrdersStore.getState().items

    // ✅ Find the stack of the current item (same id and details)
    const stackedItem = currentItems.find(
      (i) =>
        i.id === item.id &&
        JSON.stringify(i.details || []) === JSON.stringify(item.details || [])
    )

    if (stackedItem && stackedItem.quantity > 1) {
      confirmationAlert({
        title: 'Confirmación',
        text: '¿Aplicar estas modificaciones a todas las instancias de este ítem?',
        confirmButtonText: 'Sí, aplicar a todos',
        cancelButtonText: 'No, solo a esta',
        confirmButtonColor: '#a5dc86',
        onConfirm: () => {
          // ✅ Apply changes to all stacked items
          useOrdersStore
            .getState()
            .addItemDetail(stackedItem.cartItemId, selectedModifiers)
          toastAlert({ icon: 'info', title: 'Instrucciones registradas' })
          onBack?.()
        },
        onCancel: () => {
          // ✅ If user chooses "No, solo a esta":
          // 1️⃣ Reduce quantity of the existing stack
          useOrdersStore.getState().removeItem(stackedItem.cartItemId)

          // 2️⃣ Create a new separate instance with modified details
          useOrdersStore.getState().addItem({
            ...item,
            quantity: 1,
            details: selectedModifiers,
            cartItemId: Math.random() // Generate a unique cartItemId
          })

          toastAlert({
            icon: 'info',
            title: 'Instrucciones aplicadas solo a este ítem'
          })
          onBack?.()
        }
      })

      return // ✅ Prevent duplicate execution
    }

    // ✅ If it's a unique item, just apply the modifications
    useOrdersStore.getState().addItemDetail(item.cartItemId, selectedModifiers)
    toastAlert({ icon: 'info', title: 'Instrucciones registradas' })
    onBack?.()
  }

  const handleRemoveModifier = (modifier: number) => {
    setSelectedModifiers(selectedModifiers.filter((m) => m !== modifier))
  }

  return (
    <Card className="w-full mx-auto">
      <CardBody className="p-6">
        <div className="flex items-left justify-between mb-6">
          <Button size="sm" isIconOnly onPress={onBack}>
            <BsArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <Button
              size="sm"
              color="danger"
              startContent={<BsTrash className="h-4 w-4"></BsTrash>}
              onClick={() => removeItem(item.cartItemId)}>
              Quitar
            </Button>
            <Button
              size="sm"
              variant="bordered"
              color="success"
              startContent={<BsCheck className="h-4 w-4"></BsCheck>}
              onClick={handleSaveDetails}>
              Guardar
            </Button>
          </div>
        </div>

        <span className="font-extrabold text-xl">
          {quantity}x {item.name}
        </span>
        <p className="text-gray-500 text-md text-justify ">
          {item.description}
        </p>

        {selectedModifiers.map((modifierId) => (
          <li key={modifierId} className="text-gray-500 text-tiny">
            {modifiers.find((m) => m.id === modifierId)?.name}
          </li>
        ))}

        <Divider className="my-4" />
        <h3 className="font-semibold text-xl">Instrucciones</h3>

        <div className="flex justify-left items-center gap-2 py-2">
          {selectedModifiers.map((modifierId) => (
            <Chip
              key={modifierId}
              color="warning"
              onClose={() => handleRemoveModifier(modifierId)}
              variant="flat">
              {modifiers.find((m) => m.id === modifierId)?.name}
            </Chip>
          ))}
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
          {modifiers.map((modifier) => {
            const isActive = selectedModifiers.includes(modifier.id)
            return (
              <Button
                key={modifier.id}
                variant="bordered"
                className={`rounded-md justify-start ${isActive ? 'border-danger' : ''}`}
                onPress={() =>
                  setSelectedModifiers((prev) =>
                    prev.includes(modifier.id)
                      ? prev.filter((m) => m !== modifier.id)
                      : [...prev, modifier.id]
                  )
                }>
                {modifier.name}
              </Button>
            )
          })}
        </div>

        {/* <div className="grid grid-cols-3 gap-2 mb-2">
          {selectedModifiers.map((modifierId) => {
            const isActive = item.details?.includes(modifierId)
            return (
              <Button
                key={modifierId}
                color="warning"
                variant={isActive ? 'bordered' : 'flat'}
                onPress={() =>
                  setSelectedModifiers((prev) =>
                    prev.includes(modifierId)
                      ? prev.filter((m) => m !== modifierId)
                      : [...prev, modifierId]
                  )
                }>
                {modifiers.find((m) => m.id === modifierId)?.name}
              </Button>
            )
          })}
        </div> */}
      </CardBody>
    </Card>
  )
}
