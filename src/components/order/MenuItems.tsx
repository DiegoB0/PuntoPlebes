'use client'

import { Button, Card, Tooltip } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useMealsStore } from '@/store/meals/mealSlice'
import { useCategoriesStore } from '@/store/categories/categorySlice'
import { useOrdersStore } from '@/store/orders/orderSlice'

export default function MenuItems () {
  const { meals, getMeals } = useMealsStore()
  const { categories, getCategories } = useCategoriesStore()
  const addItem = useOrdersStore((state) => state.addItem)

  const [menuOptions, setMenuOptions] = useState<string[]>([])
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  useEffect(() => {
    getMeals()
    getCategories()
  }, [getMeals, getCategories])

  useEffect(() => {
    const uniqueMenuTypes = Array.from(
      new Set(categories.map((category) => category.menuType && category.menuType.toUpperCase()))
    )
    setMenuOptions(uniqueMenuTypes)
    if (uniqueMenuTypes.length > 0) {
      setSelectedMenu(uniqueMenuTypes[0])
    }
  }, [categories])

  const filteredCategories = categories.filter(
    (category) => category.menuType && category.menuType.toUpperCase() === selectedMenu
  )

  useEffect(() => {
    if (filteredCategories.length > 0 && selectedCategory === null) {
      setSelectedCategory(filteredCategories[0].id)
    }
  }, [filteredCategories, selectedCategory])

  const filteredMeals = meals.filter(
    (meal) => meal.category_id === selectedCategory
  )

  return (
    <Card className="p-4 w-full">
      {/* Menús Dinámicos */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Menús</h2>
        <div className="flex flex-wrap gap-2">
          {menuOptions.map((menu) => (
            <Button
              key={menu}
              variant={selectedMenu === menu ? 'solid' : 'bordered'}
              color="warning"
              onClick={() => {
                setSelectedMenu(menu)
                setSelectedCategory(null)
              }}
              className="flex-grow font-bold text-sm">
              {menu}
            </Button>
          ))}
        </div>
      </div>

      {/* Categorías Filtradas */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Categorías</h2>
        <div className="flex flex-wrap gap-2">
          {filteredCategories.map((category) => (
            <Button
              key={category.id}
              color="danger"
              variant={selectedCategory === category.id ? 'solid' : 'bordered'}
              onClick={() => setSelectedCategory(category.id)}
              className="px-4 text-sm">
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
              {meal.description.length > 60 ? (
                <Tooltip content={meal.description} closeDelay={100} color='default'>
                  <p className="text-sm line-clamp-2">{meal.description}</p>
                </Tooltip>
              ) : (
                <p className="text-sm">{meal.description}</p>
              )}
              <p className="font-bold mt-2">${meal.price}</p>
              <Button
                onClick={() =>
                  addItem({
                    ...meal,
                    quantity: 1
                  })
                }
                color="warning"
                className="mt-2 w-full">
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
