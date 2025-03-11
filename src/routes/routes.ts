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
import { HiOutlineHome } from 'react-icons/hi'
import { HiOutlineSquare3Stack3D } from 'react-icons/hi2'
import {
  IoFastFoodOutline,
  IoGridOutline,
  IoRestaurantOutline
} from 'react-icons/io5'
import { LuUsers } from 'react-icons/lu'
import { MdOutlineCategory } from 'react-icons/md'
import { PiCashRegisterLight } from 'react-icons/pi'
import { RiBillLine } from 'react-icons/ri'

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
    roles: [roles.admin],
    childRoutes: [
      {
        icon: IoRestaurantOutline,
        title: 'Menú',
        route: 'meals',
        roles: [roles.admin]
      },
      {
        icon: MdOutlineCategory,
        title: 'Categorias',
        route: 'categories',
        roles: [roles.admin]
      },
      {
        icon: IoFastFoodOutline,
        title: 'Modificadores',
        route: 'modifiers',
        roles: [roles.admin]
      }
    ]
  },

  {
    icon: PiCashRegisterLight,
    title: 'Venta',
    route: 'sell',
    roles: [roles.admin, roles.cashier]
  },
  // Ordenes
  {
    icon: RiBillLine,
    title: 'Pedidos',
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
