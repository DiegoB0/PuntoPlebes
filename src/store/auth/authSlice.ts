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
    set({ loading: true }) // Set loading to true initially
    try {
      const response = await axiosInstance.post('/auth/register', { data })
      const responseData = response.data

      // Validate the response to ensure success
      if (responseData && responseData.response) {
        toastAlert({
          title: responseData.response ?? 'Registro exitoso',
          icon: 'success'
        })
        return true // Registration was successful
      } else {
        // Handle unexpected responses
        throw new Error('Unexpected response from the server.')
      }
    } catch (err: any) {
      // Attempt to get the detailed error message
      let message = ''

      if (err.response?.data?.error) {
        // Backend returned a specific error message
        message = err.response.data.error
      } else if (err.response?.data?.message) {
        // Use generic message if specific "error" field is not available
        message = err.response.data.message
      } else if (err.response) {
        // Fallback to a generic server error message
        message = 'Error desconocido del servidor.'
      } else {
        // No response from the server (network or other issue)
        message = 'Error de red o problema desconocido.'
      }

      // Display error alert with the extracted message
      toastAlert({ title: message, icon: 'error' })
      return false // Registration failed
    } finally {
      set({ loading: false }) // Reset loading state
    }
  }
})

export const useAuthStore = create<AuthSlice>()((...a) => ({
  ...useAuth(...a)
}))
