/**
 * Route example:
 *  {
 *   icon: IconReactIcons, (it has to be imported from react-icons)
 *   title: 'title', (is the text that is expose in the sidebar)
 *   route: 'route', (without / because it added in the sidebar)
 *   role: [], (here you have to put the roles that can access to the route SUPERADMIN is default),
 *   childRoutes: [] (here is the same structure for the route if you want to this rout has clid routes)
 *   show: true|false (it is to display it in the sidebar)
 *  }
 */

import { type route } from '@/types/routes'
import { roles } from '@/types/users'
import { BsDatabase } from 'react-icons/bs'

import { IoGridOutline } from 'react-icons/io5'

import { RiBillLine } from 'react-icons/ri'
import { HiOutlineHome } from 'react-icons/hi'
import { HiOutlinePencil } from 'react-icons/hi'
import { LuUsers } from 'react-icons/lu'

const routes: route[] = [
  {
    /** Base de datos */
    icon: HiOutlineHome,
    title: 'Inicio',
    route: 'statistics',
    roles: [roles.user, roles.cashier, roles.admin],
    show: false
  },
  {
    icon: BsDatabase,
    title: 'Historial',
    route: 'history',
    roles: [roles.admin]
  },

  // Catalogo
  {
    icon: IoGridOutline,
    title: 'Catálogo',
    route: 'meals',
    roles: [roles.admin]
  },

  {
    icon: IoGridOutline,
    title: 'Categorias',
    route: 'categories',
    roles: [roles.admin]
  },

  {
    icon: RiBillLine,
    title: 'Venta',
    route: 'sell',
    roles: [roles.admin, roles.cashier]
  },
  // Ordenes
  {
    icon: HiOutlinePencil,
    title: 'Ordenes',
    route: 'orders',
    roles: [roles.admin]
  },

  {
    icon: LuUsers,
    title: 'Usuarios',
    route: 'users',
    roles: [roles.admin, roles.user]
  }
]

export const extraRoutes: route[] = [
  {
    title: 'Usuarios',
    route: 'users',
    roles: [roles.admin]
  }
]

export default routes
