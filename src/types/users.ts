export enum roles {
  ADMIN = 'ADMIN',
  HR = 'HR',
  SUPERADMIN = 'SUPERADMIN',
  SUPPORT = 'SUPPORT',
  OWNER = 'OWNER',
  EMPLOYEE = 'EMPLOYEE'
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
  _id?: string
  name: string
  email: string
  role: roles
  residentials?: string[]
  password: string
}

export interface UserFormImputs {
  _id?: string
  name: string
  email: string
  role: string
  password: string
  residentials?: string | string[]
}

export interface UsersTableProps {
  id: string
  email: string
  role: roles
  actions: React.ReactNode
}
