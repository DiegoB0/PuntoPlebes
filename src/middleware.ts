import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import routes, { extraRoutes } from './routes/routes'
import { roles } from './types/users'

interface Route {
  route: string | null
  role: roles[]
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const sessionCookie = request.cookies.get('session')

  // Si no existe el token, redirige al login
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const session = sessionCookie ? JSON.parse(sessionCookie.value) : null
  const path = request.nextUrl.pathname

  // Función para validar roles
  function isAuthorized(roles: roles[]) {
    if (!roles.includes(session.role)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return null
  }

  // Redirige usuarios no autorizados a `/admin` si no tienen el rol adecuado
  if (session && path !== '/admin') {
    let routesArr: Route[] = extraRoutes

    routes.forEach((parentroute) => {
      if (parentroute.route) routesArr.push(parentroute)
      parentroute.childRoutes?.forEach((childRoute) => {
        if (childRoute.route) routesArr.push(childRoute)
        childRoute.childRoutes?.forEach((route) => {
          if (route.route) routesArr.push(route)
        })
      })
    })

    const route = routesArr.find((route) => `/admin/${route.route}` === path)
    if (route && route.role.length > 0 && !route.role.includes(session.role)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // Redirige al usuario autenticado en `/login` a `/admin`
  if (token && path === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
}

export const config = {
  matcher: ['/admin(.*)', '/login', '/admin', '/admin/:path*']
}
