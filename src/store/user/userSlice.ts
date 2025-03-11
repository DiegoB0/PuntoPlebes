
import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'
import { type UserSlice, type UserFormImputs, type User } from '@/types/users'
import { create, type StateCreator } from 'zustand'

export const useUsers: StateCreator<UserSlice> = (set, get) => ({
  users: [],
  message: '',
  user: null,
  activeUser: null,
  setActiveUser: async (userId) => {
    set({ activeUser: userId })
    try {
      const { data } = await axiosInstance.get(`/user/${userId}`)
      set({
        user: data
      })
      console.log('Usuario activo cargado:', data)
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error)
      toastAlert({
        title: 'Error al cargar los datos del usuario',
        icon: 'error'
      })
    }
  },
  getUsers: async () => {
    await axiosInstance.get('/user').then(({ data }) => {
      set({
        users: data
      })
    })
  },
  saveUser: async (user) => {
    return await axiosInstance
      .post('/user', user)
      .then(({ data }) => {
        set({ users: [...get().users, data.data] })
        toastAlert({
          title: data.message ?? 'Usuario creado',
          icon: 'success'
        })
        return true
      })
      .catch((data) => {
        toastAlert({
          title: data
            ? data.message
            : 'Error, ocurrio un problema en el servidor.',
          icon: 'error'
        })
        return false
      })
  },
  setUser(user: User) {
    set({
      user
    })
  },
  async updateUser(data: UserFormImputs, id) {
    return await axiosInstance
      .put(`/user/${id}`, data)
      .then(({ data }) => {
        toastAlert({
          title: 'Usuario actualizado',
          icon: 'success'
        })
        return true
      })
      .catch(({ data }) => {
        toastAlert({
          title: data ? data.message : 'Error, llame al administrador.',
          icon: 'error'
        })
        return false
      })
  },
  deleteUser(id) {
    axiosInstance
      .delete(`/user/${id}`)
      .then((data) => {
        toastAlert({
          title: 'Usuario eliminado',
          icon: 'success'
        })
        set({ users: get().users.filter((user) => user.id !== id) })
      })
      .catch((data) => {
        toastAlert({
          title: data.message ? data.message : 'Error, llame al administrador.',
          icon: 'error'
        })
      })
  }
})

export const useUsersStore = create<UserSlice>()((...a) => ({
  ...useUsers(...a)
}))
