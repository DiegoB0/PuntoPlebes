export enum roles {
  user = 'user'
}

export interface UserSlice {
  users: User[]
  user: null | User
  message: string
  activeUser: number | null
  getUsers: () => Promise<void>
  saveUser: (user: UserFormImputs) => Promise<boolean>
  setUser: (user: User) => void
  updateUser: (user: UserFormImputs, id: number) => Promise<boolean>
  deleteUser: (id: number | undefined) => void
  setActiveUser: (userId: number) => void
  clearActiveUser: () => void
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  password: string
}

export interface UserFormImputs {
  name: string
  email: string
  // role: string
  password: string
}

export interface UsersTableProps {
  id: number
  email: string
  name: string
  role: string
  actions?: React.ReactNode
}
