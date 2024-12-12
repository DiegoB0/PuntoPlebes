import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'
import { type AuthSlice } from '@/types/auth'
import { create, type StateCreator } from 'zustand'

import Cookies from 'js-cookie'

export const useAuth: StateCreator<AuthSlice> = (set, get) => ({
  message: null,
  session: null,
  loading: false,
  user: [],
  login: async (email, password) => {
    const response = await axiosInstance
      .post('/auth/login', {
        email,
        password
      })
      .then((res) => {
        const { token, session = { role: 'user', user: email } } = res.data
        Cookies.set('token', token as string, {
          expires: 0.1,
          secure: true
        })
        Cookies.set('session', JSON.stringify(session), {
          expires: 0.1,
          secure: true
        })
        toastAlert({ title: 'Sesión iniciada', icon: 'success' })
        return true
      })
      .catch((err) => {
        const message =
          err.response?.data.message || 'Error, llame al administrador'
        toastAlert({ title: message, icon: 'error' })
        set({ message })
        return false
      })
    return response
  },
  logout: () => {
    Cookies.remove('token')
    Cookies.remove('session')
    toastAlert({ title: 'Sesión cerrada', icon: 'success' })
    return true
  },
  renew: async () => {
    const token = Cookies.get('token')
    await axiosInstance
      .post('/auth/renew', { token })
      .then(({ data }) => {
        set({
          session: data.data
        })
      })
      .catch((value) => {
        Cookies.remove('token')
      })
    return true
  },
  resetPassword: async (password: string, token: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        password,
        token
      })

      if (response.status === 200) {
        toastAlert({
          title: 'Contraseña restablecida',
          icon: 'success'
        })
        return true
      } else {
        toastAlert({
          title: response.data.message ?? 'Error al restablecer contraseña',
          icon: 'error'
        })
        return false
      }
    } catch (error: any) {
      if (error.response) {
        const statusCode = error.response.status
        const message =
          error.response.data.message || 'Error al restablecer contraseña'

        switch (statusCode) {
          case 400:
            toastAlert({
              title: message,
              icon: 'error'
            })
            break
          case 401:
            toastAlert({
              title: 'Token expirado o inválido',
              icon: 'error'
            })
            break
          case 404:
            toastAlert({
              title: 'Usuario no encontrado',
              icon: 'error'
            })
            break
          default:
            toastAlert({
              title: message,
              icon: 'error'
            })
            break
        }
      } else {
        toastAlert({
          title: 'Error al restablecer contraseña',
          icon: 'error'
        })
      }
      return false
    }
  },
  async registerUser(data) {
    set({ loading: true })
    try {
      const response = await axiosInstance.post('/auth/register', data)
      const responseData = response.data

      if (responseData && responseData.token) {
        toastAlert({
          title: 'Registro exitoso',
          icon: 'success'
        })
        return true
      } else {
        throw new Error('Respuesta inesperada del servidor.')
      }
    } catch (err: any) {
      let message = 'Error desconocido.'

      if (err.response?.data?.message) {
        message = err.response.data.message
      } else if (err.message) {
        message = err.message
      }

      toastAlert({ title: message, icon: 'error' })
      return false
    } finally {
      set({ loading: false })
    }
  }
})

export const useAuthStore = create<AuthSlice>()((...a) => ({
  ...useAuth(...a)
}))
