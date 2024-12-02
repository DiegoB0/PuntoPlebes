'use client'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import FileInput from '@/components/UI/FileInput'
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
  const { saveMeal, updateMeal, meal, clearActiveMeal } = useMealsStore()
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<MealInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category_id: undefined
    }
  })

  useEffect(() => {
    if (meal) {
      reset({
        name: meal.name,
        description: meal.description,
        price: meal.price,
        category_id: meal.category_id
      })
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        category_id: undefined
      })
    }
  }, [meal, reset])

  useEffect(() => {
    getCategories()
  }, [getCategories])

  const onSubmit = async (data: MealInputs) => {
    if (meal) {
      await updateMeal(meal.id, data)
    } else {
      await saveMeal(data)
    }
    clearActiveMeal()
    router.back()
  }

  return (
    <AdminCard
      backBtn
      title={meal != null ? 'Editar comida' : 'Agregar comida'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                label="Nombre"
                {...field}
                errorMessage={errors.name?.message}
                variant="bordered"
                className="sm:col-span-1"
              />
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input
                label="Precio"
                type="number"
                {...field}
                value={field.value?.toString()}
                onChange={(e) => field.onChange(Number(e.target.value))}
                errorMessage={errors.price?.message}
                className="sm:col-span-1"
                variant="bordered"
              />
            )}
          />
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Categoría"
                selectedKeys={field.value ? [field.value.toString()] : []}
                onSelectionChange={(keys) =>
                  field.onChange(Number(Array.from(keys)[0]))
                }
                errorMessage={errors.category_id?.message}
                className="sm:col-span-1"
                variant="bordered">
                {categories.map((category) => (
                  <SelectItem
                    key={category.id.toString()}
                    value={category.id.toString()}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <FileInput
            label="Imagen"
            onChange={(image) => {
              if (image) {
                setValue('image', image, { shouldValidate: true })
              }
            }}
            errorMessage={errors.image?.message}
            className="mt-4 sm:col-span-3"
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Descripción"
                {...field}
                errorMessage={errors.description?.message}
                className="mt-4 sm:col-span-3"
                variant="bordered"
              />
            )}
          />
        </div>

        <Button type="submit" color="danger" className="mt-6" fullWidth>
          {meal != null ? 'Actualizar' : 'Registrar'}
        </Button>
      </form>
    </AdminCard>
  )
}
