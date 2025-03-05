'use client'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Checkbox
} from '@nextui-org/react'
import FileInput from '@/components/UI/FileInput'
import { useRouter } from 'next/navigation'
import AdminCard from '@/components/shared/FormCard'
import { useMealsStore } from '@/store/meals/mealSlice'
import { useCategoriesStore } from '@/store/categories/categorySlice'
import { type MealInputs } from '@/types/meals'
import { useCallback, useEffect, useState } from 'react'
import { toastAlert } from '@/services/alerts'
import Image from 'next/image'

export const mealSchema = Yup.object().shape({
  name: Yup.string().required('Nombre es requerido'),
  description: Yup.string().required('Descripción es requerida'),
  price: Yup.number()
    .positive('El precio debe ser positivo')
    .required('Precio es requerido'),
  categoryId: Yup.number().required('Categoría es requerida'),
  isClaveApplied: Yup.boolean(),
  palabra: Yup.string().when('isClaveApplied', {
    is: true,
    then: (schema) => schema.required('Palabra es requerida')
  }),
  clave: Yup.string().when('isClaveApplied', {
    is: true,
    then: (schema) => schema.required('Clave es requerida')
  })
})

export default function MealForm() {
  const router = useRouter()
  const { categories, getCategories } = useCategoriesStore()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const {
    saveMeal,
    updateMeal,
    activeMeal: meal,
    clearActiveMeal
  } = useMealsStore()
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<MealInputs>({
    resolver: yupResolver(mealSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: undefined,
      isClaveApplied: false,
      palabra: '',
      clave: '',
      image_url: undefined
    }
  })

  const isClaveApplied = watch('isClaveApplied')

  useEffect(() => {
    if (meal) {
      reset({
        name: meal.name,
        description: meal.description,
        price: meal.price,
        categoryId: meal.category.id,
        isClaveApplied: meal.isClaveApplied || false,
        palabra: meal.clave?.palabra || '',
        clave: meal.clave?.clave || '',
        image_url: meal.image_url || undefined
      })
    }
    setImagePreview(meal?.image_url || null)
  }, [meal, reset])

  useEffect(() => {
    getCategories()
  }, [getCategories])

  const handleImageChange = useCallback(
    (image: File | null) => {
      if (image) {
        setValue('image_url', image, { shouldValidate: true })
        const reader = new FileReader()
        reader.onload = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(image)
      } else {
        setValue('image_url', undefined, { shouldValidate: true })
        setImagePreview(null)
      }
    },
    [setValue]
  )

  const onSubmit = async (data: MealInputs) => {
    try {
      // Create a FormData object since the controller expects multipart/form-data
      const formData = new FormData()

      // Add basic meal data - using values from react-hook-form's data
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('price', data.price.toString())
      formData.append('categoryId', data.categoryId?.toString() || '')
      formData.append('isClaveApplied', data.isClaveApplied ? 'true' : 'false')

      if (data.isClaveApplied) {
        formData.append('palabra', data.palabra || '')
        formData.append('clave', data.clave || '')
      }

      if (data.image_url instanceof File) {
        formData.append('image', data.image_url)
      }

      if (meal) {
        await updateMeal(meal.id, formData)
      } else {
        await saveMeal(formData)
      }

      clearActiveMeal()
      router.back()
    } catch (error) {
      toastAlert({
        title: 'Error al enviar formulario',
        icon: 'warning'
      })
    }
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
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                label="Categoría"
                selectedKeys={field.value ? [field.value.toString()] : []}
                onSelectionChange={(keys) =>
                  field.onChange(Number(Array.from(keys)[0]))
                }
                errorMessage={errors.categoryId?.message}
                className="sm:col-span-1"
                variant="bordered">
                {(Array.isArray(categories) ? categories : []).map(
                  (category) => (
                    <SelectItem
                      key={category.id.toString()}
                      value={category.id.toString()}>
                      {category.category_name}
                    </SelectItem>
                  )
                )}
              </Select>
            )}
          />

          <div className="sm:col-span-3">
            <FileInput
              label="Imagen"
              onChange={handleImageChange}
              errorMessage={errors.image_url?.message}
            />
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Vista previa:</p>
                <Image
                  src={imagePreview}
                  width={32}
                  height={32}
                  alt="Preview"
                  className="h-16 w-16 object-fit rounded-lg border"
                />
              </div>
            )}
          </div>
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

          <Controller
            name="isClaveApplied"
            control={control}
            render={({ field }) => (
              <Checkbox
                isSelected={field.value}
                onChange={(checked) => field.onChange(checked)}
                className="mt-4 sm:col-span-3">
                Aplicar Clave
              </Checkbox>
            )}
          />

          <Controller
            name="palabra"
            control={control}
            render={({ field }) => (
              <Input
                label="Palabra"
                {...field}
                value={field.value || ''}
                errorMessage={errors.palabra?.message}
                variant="bordered"
                className="mt-4 sm:col-span-3"
                disabled={!isClaveApplied}
              />
            )}
          />

          <Controller
            name="clave"
            control={control}
            render={({ field }) => (
              <Input
                label="Clave"
                {...field}
                value={field.value || ''}
                errorMessage={errors.clave?.message}
                variant="bordered"
                className="mt-4 sm:col-span-3"
                disabled={!isClaveApplied}
              />
            )}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" color="primary">
            {meal ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </AdminCard>
  )
}
