// components/UserRegistrationForm.tsx

'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { useState } from 'react'
import AdminCard from '@/components/shared/FormCard'
import { useUsersStore } from '@/store/user/userSlice'
import { useAuthStore } from '@/store/auth/authSlice'
import { useRouter } from 'next/navigation'
interface IFormInput {
  name: string
  email: string
  password: string
  role: string
}

// Esquema de validación con Yup
const schema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(3, 'Debe tener al menos 3 caracteres'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
  role: Yup.string().required('El rol es requerido')
})

export default function UserRegistrationForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<IFormInput>({
    resolver: yupResolver(schema)
  })

  const { registerUser } = useAuthStore()
  const sendData = async (data: IFormInput) => {
    if (data != null) {
      await registerUser({ ...data }).then(() => {
        router.back()
      })
    }
  }

  return (
    <AdminCard backBtn title="Registrar usuario">
      <form
        onSubmit={(event) => {
          const theReturnedFunction = handleSubmit(sendData)
          void theReturnedFunction(event)
        }}>
        <Input
          label="Nombre"
          placeholder="Ingresa el nombre"
          variant="bordered"
          {...register('name')}
          errorMessage={errors.name?.message}
          fullWidth
        />

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

        <Select
          label="Rol"
          placeholder="Selecciona un rol"
          variant="bordered"
          disabled
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

        <Button type="submit" color="danger" className="mt-6 w-full font-bold">
          Registrar
        </Button>
      </form>
    </AdminCard>
  )
}
