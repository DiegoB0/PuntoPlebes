'use client'

import { useForm } from 'react-hook-form'
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
    register,
    handleSubmit,
    formState: { errors },
    setValue
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
  const { user, updateUser } = useUsersStore()

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
  }

  useEffect(() => {
    if (user != null) {
      setValue('name', user.name)
      setValue('email', user.email)
      setValue('password', user.password)
    }
  }, [user, setValue])

  return (
    <AdminCard backBtn title={`${user != null ? 'Editar' : 'Crear'} Usuario`}>
      <form onSubmit={handleSubmit(sendData)}>
        <Input
          label="Nombre"
          placeholder="Ingresa el nombre"
          variant="bordered"
          defaultValue={user?.name}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          {...register('name')}
          className="w-full"
        />

        <Input
          type="email"
          variant="bordered"
          label="Correo Electrónico"
          placeholder="Ingresa el correo"
          defaultValue={user?.email}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('email')}
          className="w-full mt-4"
        />

        <Input
          type="password"
          label="Contraseña"
          variant="bordered"
          defaultValue={user?.password}
          placeholder="Ingresa la contraseña"
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          {...register('password')}
          className="w-full mt-4"
        />

        <Button type="submit" color="danger" className="mt-6 w-full font-bold">
          {user != null ? 'Editar' : 'Crear'} Usuario
        </Button>
      </form>
    </AdminCard>
  )
}
