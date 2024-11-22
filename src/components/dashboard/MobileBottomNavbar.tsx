'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/react'
import { FiHelpCircle, FiLogOut } from 'react-icons/fi'
import Cookies from 'js-cookie'
import routes from '@/routes/routes'

export default function MobileBottomNavbar() {
  const [activeRoute, setActiveRoute] = React.useState<string>('')
  const router = useRouter()

  const handleRouteClick = (route: string, path: string) => {
    setActiveRoute(route)
    router.push(`/admin/${path}`)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('session')
    Cookies.remove('token')
    Cookies.remove('session')
    router.push('/login')
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-2 h-20 z-50">
      {routes.map((route, index) => (
        <Button
          key={index}
          variant="light"
          isIconOnly
          onClick={() => handleRouteClick(route.title, route.route)}
          className={`flex flex-col items-center justify-center p-1 ${
            activeRoute === route.title ? 'text-red-500' : 'text-slate-400'
          }`}>
          {route.icon && <route.icon className="text-2xl" />}
          {/* <span className="text-xs mt-1">{route.title}</span> */}
        </Button>
      ))}

      {/* <Button
                variant="light"
                isIconOnly
                onClick={logout}
                className="flex flex-col items-center justify-center p-1"
            >
                <FiLogOut className="text-2xl text-slate-400" />
                <span className="text-xs mt-1">Salir</span>
            </Button> */}
    </nav>
  )
}
