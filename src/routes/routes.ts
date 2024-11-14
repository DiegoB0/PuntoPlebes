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
import { BsGraphUpArrow } from 'react-icons/bs'
import { FaHome, FaUserClock } from 'react-icons/fa'
import { FaPenClip, FaTicket, FaUserGroup } from 'react-icons/fa6'
import { LuHome } from 'react-icons/lu'
import { IoGridOutline } from 'react-icons/io5'

import { RiBillLine } from 'react-icons/ri'
import { LuPenSquare } from 'react-icons/lu'
import { LuUsers } from 'react-icons/lu'

const routes: route[] = [
  {
    /** Base de datos */
    icon: LuHome,
    title: 'Inicio',
    route: '/',
    role: [roles.user, roles.user],
    show: false
  },
  // Catalogo
  {
    icon: IoGridOutline,
    title: 'Catálogo',
    route: '/',
    role: [roles.user]
  },
  {
    icon: RiBillLine,
    title: 'Venta',
    route: '/',
    role: [roles.user]
  },
  // Ordenes
  {
    icon: LuPenSquare,
    title: 'Ordenes',
    route: 'orders',
    role: [roles.user]
  },
  {
    icon: FaUserGroup,
    title: 'Usuarios',
    route: 'users',
    role: [roles.user]
  },
  {
    icon: LuUsers,
    title: 'Clientes',
    route: '/',
    role: [roles.user]
  }
]

export const extraRoutes: route[] = [
  {
    title: 'Ususarios',
    route: 'users',
    role: [roles.user, roles.user]
  }
]

export default routes
