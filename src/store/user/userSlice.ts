import { create, type StateCreator } from 'zustand'

import { toastAlert } from '@/services/alerts'
import axiosInstance from '@/services/axiosInstance'

import { type UserSlice, type UserFormImputs } from '@/types/users'

export const useUsers: StateCreator<UserSlice> = (set, get) => ({
  users: [],
  message: '',
  user: null,
  activeUser: null,
  setActiveUser(userId) {
    set({
      activeUser: userId
    })
    console.log('El id del usuario activo es: ', get().activeUser)
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
          title: data.message,
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
  setUser(user: UserFormImputs | null) {
    set({
      user
    })
  },
  async updateUser(user: UserFormImputs, id: string | undefined) {
    return await axiosInstance
      .put(`/user/${id}`, user)
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
  deleteManager(id) {
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
