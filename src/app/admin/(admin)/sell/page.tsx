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
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-2/3">
        {!selectedItem ? (
          <MenuItems />
        ) : (
          <ItemDetail item={selectedItem} onBack={goBackToMenu} />
        )}
      </div>
      <div className="w-full md:w-1/3 mt-4 md:mt-0 pb-12">
        <Checkout
          items={items}
          onItemClick={selectItem}
          onRemoveItem={removeItem}
        />
      </div>
    </div>
  )
}
