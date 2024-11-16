'use client'

import { Button, Card } from '@nextui-org/react'
import { useState } from 'react'

interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  menuType: 'COMIDA' | 'BEBIDAS'
  category: string
}

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  notes?: string
}

export default function MenuItems({
  onAddItem
}: {
  onAddItem: (item: OrderItem) => void
}) {
  const handleAddItem = (item: MenuItem) => {
    const orderItem: OrderItem = {
      id: Number(item.id),
      name: item.name,
      price: item.price,
      quantity: 1 // Cantidad inicial
    }
    onAddItem(orderItem)
  }

  const [selectedMenu, setSelectedMenu] = useState<'COMIDA' | 'BEBIDAS'>(
    'COMIDA'
  )
  const [selectedCategory, setSelectedCategory] =
    useState<string>('Hamburguesas')

  // Static menu types
  const menuTypes: ('COMIDA' | 'BEBIDAS')[] = ['COMIDA', 'BEBIDAS']

  // Static categories
  const categories: Record<'COMIDA' | 'BEBIDAS', string[]> = {
    COMIDA: [
      'Hamburguesas',
      'Acompañamientos',
      'Hot Dogs',
      'Quesadillas',
      'Postres'
    ],
    BEBIDAS: ['Bebidas Calientes', 'Bebidas Frias', 'Smoothies']
  }

  // Static menu items
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Classic Burger',
      price: 12.99,
      description: 'Beef patty with lettuce, tomato, and cheese',
      menuType: 'COMIDA',
      category: 'Hamburguesas'
    },
    {
      id: '2',
      name: 'French Fries',
      price: 4.99,
      description: 'Crispy golden fries',
      menuType: 'COMIDA',
      category: 'Acompañamientos'
    },
    {
      id: '3',
      name: 'Chocolate Cake',
      price: 6.99,
      description: 'Rich chocolate layer cake',
      menuType: 'COMIDA',
      category: 'Postres'
    },
    {
      id: '4',
      name: 'Coca Cola',
      price: 2.99,
      description: 'Classic soda',
      menuType: 'BEBIDAS',
      category: 'Bebidas Frias'
    }
  ]

  // Filter items based on selected menu and category
  const filteredItems = menuItems.filter(
    (item) =>
      item.menuType === selectedMenu && item.category === selectedCategory
  )

  return (
    <Card className="p-6 w-full max-w-screen-lg">
      {/* Menu Types */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Menus</h2>
        <div className="flex gap-2">
          {menuTypes.map((menu) => (
            <Button
              key={menu}
              variant={selectedMenu === menu ? 'solid' : 'bordered'}
              onClick={() => {
                setSelectedMenu(menu)
                setSelectedCategory(categories[menu][0])
              }}
              className="flex-1">
              {menu}
            </Button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Categories</h2>
        <div className="flex gap-2 overflow-auto">
          {categories[selectedMenu].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'flat' : 'bordered'}
              onClick={() => setSelectedCategory(category)}
              className="px-6">
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Items</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Card
              onClick={() => {
                handleAddItem(item)
              }}
              isPressable
              key={item.id}
              className="h-auto flex flex-col items-start p-4 text-left">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-muted-foreground">
                {item.description}
              </div>
              <div className="mt-2 font-medium">${item.price.toFixed(2)}</div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  )
}
