'use client'
import React, { useState } from 'react'

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input
} from '@nextui-org/react'

import { FaEnvelope, FaLock } from 'react-icons/fa'
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
  const router = useRouter()
  const {
    formState: { errors },
    handleSubmit,
    reset,
    register
  } = useForm({
    resolver: yupResolver(schema)
  })

  const { login } = useAuthStore()

  const [errorLogin, setErrorLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  const sendData = async (data: {
    email: string
    password: string
  }): Promise<void> => {
    setLoading(true)
    const response = await login(data.email, data.password)
    if (response) {
      reset()
      router.push('/admin')
    } else {
      setErrorLogin(true)
    }
    setLoading(false)
  }
  return (
    <>
      <div className="w-full p-5 flex justify-center items-center flex-col gap-5">
        <form
          onSubmit={(event) => {
            const theReturnedFunction = handleSubmit(sendData)
            void theReturnedFunction(event)
          }}
          className="w-1/4 ">
          <Card className="p-5">
            <CardHeader className="text-center flex justify-center items-center text-2xl uppercase font-bold">
              Iniciar sesión
            </CardHeader>
            <CardBody className="gap-2">
              <Input
                variant="bordered"
                errorMessage={errors.email?.message}
                isInvalid={!(errors.email == null)}
                label="Correo Eléctronico"
                {...register('email')}
                placeholder="Correo"
                type="text"
                startContent={
                  <FaEnvelope className="text-red-500 font-bold" />
                }></Input>
              <Input
                variant="bordered"
                errorMessage={errors.password?.message}
                isInvalid={!(errors.password == null)}
                {...register('password')}
                label="Contraseña"
                placeholder="Contraseña"
                type="password"
                startContent={
                  <FaLock className="text-red-500 font-bold" />
                }></Input>
            </CardBody>
            <CardFooter className="flex justify-center items-center">
              <Button
                variant="solid"
                color="danger"
                className="w-full font-bold"
                type="submit">
                Ingresar
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  )
}

export default Login
