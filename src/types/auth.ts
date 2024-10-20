import { type roles } from './users'

export interface AuthSlice {
  message: string | null
  session: session | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => boolean
  renew: () => Promise<boolean>
  resetPassword: (password: string, token: string) => Promise<boolean>
}

export interface session {
  name: string
  email: string
  role: roles
}
