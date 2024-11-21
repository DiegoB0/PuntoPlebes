'use client'
import { useState } from 'react'
import Checkout from '@/components/order/Checkout'
import MenuItems from '@/components/order/MenuItems'
import ItemDetail from '@/components/order/ItemDetail'
import { useOrdersStore } from '@/store/orders/orderSlice'
import { OrderItem } from '@/types/order'

export default function Sell() {
  const { items, selectItem, removeItem, selectedItem } = useOrdersStore()

  const goBackToMenu = () => {
    selectItem(null)
  }

  return (
    <div className="flex gap-2">
      {!selectedItem ? (
        <>
          <MenuItems />
          <Checkout
            items={items}
            onItemClick={selectItem}
            onRemoveItem={removeItem}
          />
        </>
      ) : (
        <>
          <ItemDetail item={selectedItem} onBack={goBackToMenu} />
          <Checkout
            items={items}
            onItemClick={selectItem}
            onRemoveItem={removeItem}
          />
        </>
      )}
    </div>
  )
}
