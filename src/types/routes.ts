import { type IconType } from 'react-icons'
import { type roles } from './users'

export interface route {
  icon?: IconType
  title: string
  route: string
  childRoutes?: route[]
  roles: roles[]
  show?: boolean
}
