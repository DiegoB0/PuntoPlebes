'use client'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Input } from '@nextui-org/react'
import { useEffect } from 'react'
import AdminCard from '@/components/shared/FormCard'
import { useUsersStore } from '@/store/user/userSlice'
import { useAuthStore } from '@/store/auth/authSlice'
import { useRouter } from 'next/navigation'

interface IFormInput {
  name: string
  email: string
  password: string
}

const schema = yup.object().shape({
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(3, 'Debe tener al menos 3 caracteres'),
  email: yup
    .string()
    .email('Correo electrónico inválido')
    .required('El correo es requerido'),
  password: yup
    .string()
    .required('"password" is required')
    .min(8, '"password" must have at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    )
})

export default function UserRegistrationForm() {
  const router = useRouter()
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    },
    mode: 'onChange'
  })

  const { registerUser } = useAuthStore()
  const { user, updateUser, clearActiveUser } = useUsersStore()

  const sendData = async (data: IFormInput) => {
    if (data != null && user == null) {
      const success = await registerUser({ ...data })
      if (success) {
        router.back()
      }
    }
    if (user != null && data != null) {
      await updateUser({ ...data }, user.id).then(() => {
        router.back()
      })
    }
    clearActiveUser()
  }

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: user.password
      })
    } else {
      reset({
        name: '',
        email: '',
        password: ''
      })
    }
  }, [user, reset])

  return (
    <AdminCard backBtn title={`${user != null ? 'Editar' : 'Crear'} Usuario`}>
      <form onSubmit={handleSubmit(sendData)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              label="Nombre"
              placeholder="Ingresa el nombre"
              variant="bordered"
              {...field}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              className="w-full"
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              type="email"
              label="Correo Electrónico"
              placeholder="Ingresa el correo"
              variant="bordered"
              {...field}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              className="w-full mt-4"
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              type="password"
              label="Contraseña"
              placeholder="Ingresa la contraseña"
              variant="bordered"
              {...field}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              className="w-full mt-4"
            />
          )}
        />

        <Button type="submit" color="danger" className="mt-6 w-full font-bold">
          {user != null ? 'Editar' : 'Crear'} Usuario
        </Button>
      </form>
    </AdminCard>
  )
}
