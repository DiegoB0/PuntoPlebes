'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
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
  category: Yup.number().required('La categoría es requerida')
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
  if (meal) {
    setValue('name', meal.name)
    setValue('description', meal.description)
    setValue('price', meal.price)
    setValue('category', meal.category_id)
  }

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
        <Input
          label="Nombre"
          {...register('name')}
          errorMessage={errors.name?.message}
          fullWidth
        />
        <Input
          label="Descripción"
          {...register('description')}
          errorMessage={errors.description?.message}
          fullWidth
          className="mt-4"
        />
        <Input
          label="Precio"
          type="number"
          {...register('price')}
          errorMessage={errors.price?.message}
          fullWidth
          className="mt-4"
        />
        <Select
          label="Categoría"
          {...register('category')}
          errorMessage={errors.category?.message}
          fullWidth
          className="mt-4">
          <SelectItem key="Comida rápida">Comida rápida</SelectItem>
          <SelectItem key="Bebidas">Bebidas</SelectItem>
          <SelectItem key="Postres">Postres</SelectItem>
        </Select>
        <Button type="submit" color="primary" className="mt-6" fullWidth>
          {meal != null ? 'Actualizar' : 'Registrar'}
        </Button>
      </form>
    </AdminCard>
  )
}
