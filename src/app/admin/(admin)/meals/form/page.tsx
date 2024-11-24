'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import AdminCard from '@/components/shared/FormCard'
import { useMealsStore } from '@/store/meals/mealSlice'
import { useCategoriesStore } from '@/store/categories/categorySlice'
import { type MealInputs } from '@/types/meals'
import { useEffect } from 'react'

const schema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido'),
  description: Yup.string().required('La descripción es requerida'),
  price: Yup.number()
    .positive('El precio debe ser positivo')
    .required('El precio es requerido'),
  category_id: Yup.number().required('La categoría es requerida')
})

export default function MealForm() {
  const router = useRouter()
  const { categories, getCategories } = useCategoriesStore()
  const { saveMeal, updateMeal, meals, meal } = useMealsStore()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<MealInputs>({
    resolver: yupResolver(schema)
  })

  // Prellena los valores si es edición
  useEffect(() => {
    if (meal) {
      setValue('name', meal.name)
      setValue('description', meal.description)
      setValue('price', meal.price)
      setValue('category_id', meal.category_id)
    }
  }, [meal, setValue])

  useEffect(() => {
    getCategories()
  }, [getCategories])

  const onSubmit = async (data: MealInputs) => {
    if (meal) {
      await updateMeal(meal.id, data)
    } else {
      await saveMeal(data)
    }
    router.back()
  }

  return (
    <AdminCard
      backBtn
      title={meal != null ? 'Editar comida' : 'Agregar comida'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Input
            label="Nombre"
            {...register('name')}
            errorMessage={errors.name?.message}
            variant="bordered"
            className="sm:col-span-1"
          />
          <Input
            label="Precio"
            type="number"
            {...register('price')}
            errorMessage={errors.price?.message}
            className="sm:col-span-1"
            variant="bordered"
          />
          <Select
            label="Categoría"
            onChange={(e) =>
              setValue('category_id', Number(e.target.value), {
                shouldValidate: true
              })
            }
            errorMessage={errors.category_id?.message}
            className="sm:col-span-1"
            variant="bordered">
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.category_name}
              </SelectItem>
            ))}
          </Select>

          <Textarea
            label="Descripción"
            {...register('description')}
            errorMessage={errors.description?.message}
            className="mt-4 sm:col-span-3"
            variant="bordered"
          />
        </div>

        <Button type="submit" color="danger" className="mt-6" fullWidth>
          {meal != null ? 'Actualizar' : 'Registrar'}
        </Button>
      </form>
    </AdminCard>
  )
}
