'use client'
import { useState } from 'react'
import Checkout from '@/components/order/Checkout'
import MenuItems from '@/components/order/MenuItems'
import ItemDetail from '@/components/order/ItemDetail'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  notes?: string
}

export default function Sell() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null)

  const addItemToOrder = (item: OrderItem) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prevItems, { ...item, quantity: 1 }]
    })
  }

  const handleItemClick = (item: OrderItem) => {
    setSelectedItem(item)
  }

  const goBackToMenu = () => {
    setSelectedItem(null)
  }

  return (
    <div className="flex gap-2">
      {!selectedItem ? (
        <>
          <MenuItems onAddItem={addItemToOrder} />
          <Checkout items={orderItems} onItemClick={handleItemClick} />
        </>
      ) : (
        <>
          <ItemDetail item={selectedItem} onBack={goBackToMenu} />
          <Checkout items={orderItems} onItemClick={handleItemClick} />
        </>
      )}
    </div>
  )
}
