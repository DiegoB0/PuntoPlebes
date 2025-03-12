'use client'
import React, { useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  user
} from '@nextui-org/react'
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth/authSlice'

const schema = yup.object().shape({
  email: yup.string().email().required('Email es requerido'),
  password: yup.string().required('Password es requerido')
})

const Login = (): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const {
    formState: { errors },
    handleSubmit,
    reset,
    register
  } = useForm({
    resolver: yupResolver(schema)
  })

  const { login, message } = useAuthStore()

  const [errorLogin, setErrorLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  const sendData = async (data: {
    email: string
    password: string
  }): Promise<void> => {
    setLoading(true)
    setErrorLogin(false)
    const response = await login(data.email, data.password)
    if (response) {
      reset()
      router.push('/admin/statistics')
    } else {
      setErrorLogin(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 md:p-8 flex justify-center items-center">
      <form
        onSubmit={(event) => {
          const theReturnedFunction = handleSubmit(sendData)
          void theReturnedFunction(event)
        }}
        className="w-full max-w-md">
        <Card className="p-4 sm:p-6">
          <CardHeader className="pb-6 pt-2 px-4 flex-col items-center">
            <h1 className="text-2xl sm:text-3xl font-bold uppercase text-center">
              Iniciar sesión
            </h1>
            {errorLogin && (
              <div className="mt-2 text-center text-red-500 bg-red-200 p-2 rounded-lg">
                {message}
              </div>
            )}
          </CardHeader>
          <CardBody className="gap-4 px-4">
            <Input
              variant="bordered"
              errorMessage={errors.email?.message}
              isInvalid={!(errors.email == null)}
              label="Correo Eléctronico"
              {...register('email')}
              placeholder="Correo"
              type="text"
              startContent={
                <FaEnvelope className="text-red-500 font-bold text-xl" />
              }
            />

            <Input
              variant="bordered"
              errorMessage={errors.password?.message}
              isInvalid={!(errors.password == null)}
              {...register('password')}
              label="Contraseña"
              placeholder="Contraseña"
              type={showPassword ? 'text' : 'password'}
              startContent={
                <FaLock className="text-red-500 font-bold text-xl" />
              }
              endContent={
                <Button
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-500"
                  size="sm"
                  isIconOnly
                  variant="ghost">
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </Button>
              }
            />
          </CardBody>
          <CardFooter className="pt-2 px-4">
            <Button
              variant="solid"
              color="danger"
              className="w-full font-bold text-lg py-6"
              type="submit"
              isLoading={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </CardFooter>
        </Card>
      </form>
      {/* {errorLogin && (
        <div className="mt-4 text-center text-red-500">
          Error en el inicio de sesión. Por favor, intente de nuevo.
        </div>
      )} */}
    </div>
  )
}

export default Login
