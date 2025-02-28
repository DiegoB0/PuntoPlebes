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
  offlineLogin: (email: string, password: string) => Promise<boolean>
}

export interface session {
  user: string

  role: roles
}
interface User {
  id: string
  name: string
  email: string
  role?: roles
}
export interface UserRegisterInputs {
  email: string
  password: string
  name: string
  role?: string
}
