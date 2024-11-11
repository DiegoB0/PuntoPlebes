// components/UserRegistrationForm.tsx

'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { useState } from 'react'
import AdminCard from '@/components/shared/FormCard'

interface IFormInput {
  name: string
  email: string
  password: string
  role: 'admin' | 'user' | 'editor'
}

// Esquema de validación con Yup
const schema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(3, 'Debe tener al menos 3 caracteres'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo es requerido'),
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: Yup.string()
    .oneOf(['admin', 'user', 'editor'], 'Elige un rol válido')
    .required('El rol es requerido')
})

export default function UserRegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<IFormInput>({
    resolver: yupResolver(schema)
  })

  const sendData = (data: IFormInput) => {
    console.log(data)
  }

  return (
    <AdminCard backBtn title="Registrar usuario">
      <form
        onSubmit={(event) => {
          const theReturnedFunction = handleSubmit(sendData)
          void theReturnedFunction(event)
        }}>
        {/* Campo de Nombre */}
        <Input
          label="Nombre"
          placeholder="Ingresa el nombre"
          variant="bordered"
          {...register('name')}
          errorMessage={errors.name?.message}
          fullWidth
        />

        {/* Campo de Email */}
        <Input
          type="email"
          variant="bordered"
          label="Correo Electrónico"
          placeholder="Ingresa el correo"
          {...register('email')}
          errorMessage={errors.email?.message}
          fullWidth
          className="mt-4"
        />

        {/* Campo de Contraseña */}
        <Input
          type="password"
          label="Contraseña"
          variant="bordered"
          placeholder="Ingresa la contraseña"
          {...register('password')}
          errorMessage={errors.password?.message}
          fullWidth
          className="mt-4"
        />

        {/* Campo de Rol */}
        <Select
          label="Rol"
          placeholder="Selecciona un rol"
          variant="bordered"
          onSelectionChange={(key) =>
            setValue('role', key as unknown as IFormInput['role'], {
              shouldValidate: true
            })
          }
          errorMessage={errors.role?.message || 'Selecciona el rol del usuario'}
          fullWidth
          className="mt-4">
          <SelectItem key="Admin">Admin</SelectItem>
          <SelectItem key="User">User</SelectItem>
          <SelectItem key="Editor">Editor</SelectItem>
        </Select>
        {/* Botón de Enviar */}
        <Button type="submit" color="danger" className="mt-6 w-full font-bold">
          Registrar
        </Button>
      </form>
    </AdminCard>
  )
}
