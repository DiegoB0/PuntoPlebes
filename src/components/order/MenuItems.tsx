'use client'

import { Button, Card } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useMealsStore } from '@/store/meals/mealSlice'
import { useCategoriesStore } from '@/store/categories/categorySlice'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

export default function MenuItems({
  onAddItem
}: {
  onAddItem: (item: OrderItem) => void
}) {
  const { meals, getMeals } = useMealsStore()
  const { categories, getCategories } = useCategoriesStore()

  const [menuOptions, setMenuOptions] = useState<string[]>([])
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  useEffect(() => {
    getMeals()
    getCategories()
  }, [getMeals, getCategories])

  // Obtener menús únicos de las categorías
  useEffect(() => {
    const uniqueMenuTypes = Array.from(
      new Set(categories.map((category) => category.menuType.toUpperCase()))
    )
    setMenuOptions(uniqueMenuTypes)
    if (uniqueMenuTypes.length > 0) {
      setSelectedMenu(uniqueMenuTypes[0])
    }
  }, [categories])

  // Filtrar categorías dinámicamente según el `menuType` seleccionado
  const filteredCategories = categories.filter(
    (category) => category.menuType.toUpperCase() === selectedMenu
  )

  // Establecer la primera categoría como predeterminada solo si no se seleccionó ninguna
  useEffect(() => {
    if (filteredCategories.length > 0 && selectedCategory === null) {
      setSelectedCategory(filteredCategories[0].id)
    }
  }, [filteredCategories, selectedCategory])

  // Filtrar platillos según la categoría seleccionada
  const filteredMeals = meals.filter(
    (meal) => meal.category_id === selectedCategory
  )

  const handleAddItem = (meal: (typeof meals)[number]) => {
    const orderItem: OrderItem = {
      id: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: 1
    }
    onAddItem(orderItem)
  }

  return (
    <Card className="p-6 w-full max-w-screen-xl">
      {/* Menús Dinámicos */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Menús</h2>
        <div className="flex gap-2 overflow-auto">
          {menuOptions.map((menu) => (
            <Button
              key={menu}
              variant={selectedMenu === menu ? 'solid' : 'bordered'}
              color="warning"
              onClick={() => {
                setSelectedMenu(menu)
                setSelectedCategory(null) // Reiniciar categoría seleccionada
              }}
              className="flex-1 font-bold">
              {menu}
            </Button>
          ))}
        </div>
      </div>

      {/* Categorías Filtradas */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Categorías</h2>
        <div className="flex gap-2 overflow-auto">
          {filteredCategories.map((category) => (
            <Button
              key={category.id}
              color="danger"
              variant={selectedCategory === category.id ? 'solid' : 'bordered'}
              onClick={() => setSelectedCategory(category.id)}
              className="px-6">
              {category.category_name}
            </Button>
          ))}
        </div>
      </div>

      {/* Items del Menú */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Platillos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeals.map((meal) => (
            <Card key={meal.id} className="p-4">
              <h3 className="font-semibold">{meal.name}</h3>
              <p>{meal.description}</p>
              <p className="font-bold">${meal.price}</p>
              <Button onClick={() => handleAddItem(meal)} color="warning">
                Agregar
              </Button>
            </Card>
          ))}
        </div>
        {filteredMeals.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No hay platillos disponibles para esta categoría.
          </p>
        )}
      </div>
    </Card>
  )
}
