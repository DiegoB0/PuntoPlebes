import { type roles } from './users'

export interface AuthSlice {
  message: string | null
  session: session | null
  loading: boolean
  user: User[]
  login: (email: string, password: string) => Promise<boolean>
  logout: () => boolean
  renew: () => Promise<boolean>
  registerUser: (data: UserRegisterInputs) => Promise<boolean>
  resetPassword: (password: string, token: string) => Promise<boolean>
}

export interface session {
  uid: string
  name: string
  email: string
  role: roles
}
interface User {
  id: string
  name: string
  email: string
  role?: roles
}
export interface UserRegisterInputs {
  password: string
  name: string
  email: string
  role?: string
}
