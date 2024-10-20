import { type IconType } from 'react-icons'
import { type roles } from './users'

export interface route {
  icon?: IconType
  title: string
  route: string | null
  childRoutes?: route[]
  role: roles[]
  show?: boolean
}
