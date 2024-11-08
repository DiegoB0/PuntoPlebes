export enum roles {
  user = 'user'
}

export interface UserSlice {
  users: User[]
  user: null | User | UserFormImputs
  message: string
  getUsers: () => Promise<void>
  saveUser: (user: UserFormImputs) => Promise<boolean>
  setUser: (user: UserFormImputs | null) => void
  updateUser: (user: UserFormImputs, id: string | undefined) => Promise<boolean>
  deleteManager: (id: string | undefined) => void
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  password: string
}

export interface UserFormImputs {
  id: string
  name: string
  email: string
  role: string
  password: string
}

export interface UsersTableProps {
  id: string
  email: string
  role: string
  actions?: React.ReactNode
}
