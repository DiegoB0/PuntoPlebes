'use client'
import React, { useEffect } from 'react'
import AdminCard from '@/components/shared/FormCard'
import { useModifierStore } from '@/store/modifiers/modifierSlice'
import { ModifierInputs } from '@/types/modifiers'
import { Input, Button, Switch, Select, SelectItem } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCategoriesStore } from '@/store/categories/categorySlice'

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  hasPrice: Yup.boolean().required('Has price is required'),
  categoryIds: Yup.array().required('Category is required'),
  price: Yup.number(),
  claveData: Yup.object().shape({
    palabra: Yup.string().required('Palabra is required'),
    clave: Yup.string().required('Clave is required')
  })
})

const ModifierForm = (): JSX.Element => {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ModifierInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      hasPrice: false,
      price: 0,
      claveData: {
        palabra: '',
        clave: ''
      }
    }
  })
  const { saveModifier, updateModifier, activeModifier, getModifiers } =
    useModifierStore()
  const { getCategories, categories } = useCategoriesStore()

  useEffect(() => {
    void getCategories()
  }, [getCategories])

  useEffect(() => {
    if (activeModifier) {
      const { name, description, hasPrice, price, clave } = activeModifier
      setValue('name', name)
      setValue('description', description)
      setValue('hasPrice', hasPrice)
      // Aqui iria el setValue('categoryIds', categoryIds)
      setValue('price', price)
      setValue('claveData.palabra', clave.palabra)
      setValue('claveData.clave', clave.clave)
    }
  }, [setValue, activeModifier])

  const onSubmit = async (data: ModifierInputs) => {
    if (activeModifier) {
      await updateModifier(data, activeModifier.id).then(() => getModifiers())
      router.back()
    } else {
      await saveModifier(data).then(() => getModifiers())
      router.back()
    }
  }

  const hasPrice = watch('hasPrice')

  return (
    <AdminCard
      backBtn
      title={activeModifier != null ? 'Edit Modifier' : 'Add Modifier'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                label="Nombre"
                {...field}
                errorMessage={errors.name?.message}
                className="sm:col-span-1"
                variant="bordered"
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                label="Descripción"
                {...field}
                errorMessage={errors.description?.message}
                className="sm:col-span-1"
                variant="bordered"
              />
            )}
          />
          <Controller
            name="categoryIds"
            control={control}
            render={({ field }) => (
              <Select
                label="Categorias asignadas"
                multiple
                selectedKeys={field.value}
                onSelectionChange={(keys) =>
                  field.onChange(Array.from(keys).map(Number))
                }
                errorMessage={errors.categoryIds?.message}
                className="sm:col-span-1"
                variant="bordered">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <Controller
            name="hasPrice"
            control={control}
            render={({ field }) => (
              <Switch
                isSelected={field.value}
                color="primary"
                onChange={(e) => {
                  field.onChange(e.target.checked)
                }}
                className="sm:col-span-1">
                Tiene precio
              </Switch>
            )}
          />
          {hasPrice && (
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  label="Precio"
                  type="number"
                  errorMessage={errors.price?.message}
                  className="sm:col-span-1"
                  variant="bordered"
                />
              )}
            />
          )}
          <Controller
            name="claveData.palabra"
            control={control}
            render={({ field }) => (
              <Input
                label="Palabra"
                {...field}
                errorMessage={errors.claveData?.palabra?.message}
                className="sm:col-span-1"
                variant="bordered"
              />
            )}
          />
          <Controller
            name="claveData.clave"
            control={control}
            render={({ field }) => (
              <Input
                label="Clave"
                {...field}
                errorMessage={errors.claveData?.clave?.message}
                className="sm:col-span-1"
                variant="bordered"
              />
            )}
          />
        </div>
        <div className="mt-6 flex justify-center">
          <Button type="submit" color="primary">
            {activeModifier ? 'Actualizar modificador' : 'Guardar modificador'}
          </Button>
        </div>
      </form>
    </AdminCard>
  )
}

export default ModifierForm
