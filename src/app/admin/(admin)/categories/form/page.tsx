'use client'
import React, { useEffect } from 'react'

import AdminCard from '@/components/shared/FormCard'
import { useCategoriesStore } from '@/store/categories/categorySlice'
import { CategoryInputs } from '@/types/categories'
import { Input, Button, Select, SelectItem } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'

const schema = Yup.object().shape({
  category_name: Yup.string().required('Category name is required'),
  menu_type: Yup.string().required('Menu type is required')
})

const CategoryForm = (): JSX.Element => {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<CategoryInputs>()
  const { saveCategory, updateCategory, activeCategory, getCategories } =
    useCategoriesStore()
  useEffect(() => {
    if (activeCategory) {
      const { category_name, menu_type } = activeCategory
      setValue('category_name', category_name)
      setValue('menu_type', menu_type)
    }
  }, [setValue, activeCategory])
  const onSubmit = async (data: CategoryInputs) => {
    if (activeCategory) {
      await updateCategory(data, activeCategory.id).then(() => getCategories())
      router.back()
    } else {
      await saveCategory(data).then(() => getCategories())
      router.back()
    }
  }
  return (
    <AdminCard
      backBtn
      title={activeCategory != null ? 'Editar categoria' : 'Agregar categoria'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
          <Controller
            name="category_name"
            control={control}
            render={({ field }) => (
              <Input
                label="Nombre de la categoria"
                {...field}
                errorMessage={errors.category_name?.message}
                className="sm:col-span-1"
                variant="bordered"
              />
            )}
          />
          <Controller
            name="menu_type"
            control={control}
            render={({ field }) => (
              <Select
                label="Tipo de menu"
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) =>
                  field.onChange(Array.from(keys)[0])
                }
                errorMessage={errors.menu_type?.message}
                className="sm:col-span-1"
                variant="bordered">
                <SelectItem key="comida" value="comida">
                  Comida
                </SelectItem>
                <SelectItem key="bebida" value="bebida">
                  Bebida
                </SelectItem>
              </Select>
            )}
          />
        </div>
        <div className="mt-6 flex justify-center">
          <Button type="submit" color="primary">
            {activeCategory ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </AdminCard>
  )
}

export default CategoryForm
