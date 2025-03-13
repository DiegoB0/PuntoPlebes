'use client'
import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, Input, Button } from '@nextui-org/react'
import { RiSearchLine } from 'react-icons/ri'
import {
  FiChevronLeft,
  FiChevronRight,
  FiHelpCircle,
  FiLogOut,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi'
import Cookies from 'js-cookie'
import routes from '@/routes/routes'
import { type session } from '@/types/auth'
import { cookies } from '@/constants/constants'
import { FaCircleUser } from 'react-icons/fa6'

interface SidebarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
}

export default function SidebarComponent ({
  isCollapsed,
  toggleSidebar
}: SidebarProps) {
  const [activeRoute, setActiveRoute] = useState<string>('')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const router = useRouter()
  const session: session = JSON.parse(Cookies.get(cookies.SESSION) || '{}')

  const handleRouteClick = useCallback((route: string, path: string) => {
    setActiveRoute(route)
    router.push(`/admin/${path}`)
  }, [router])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('session')
    Cookies.remove('token')
    Cookies.remove('session')
    router.push('/login')
  }, [router])

  const shouldShowRoute = (routeRoles: string[]): boolean => {
    return routeRoles.includes(session.role)
  }

  const toggleDropdown = (route: string) => {
    setOpenDropdown(openDropdown === route ? null : route)
  }

  return (
    <div className="relative">
      <button
        onClick={toggleSidebar}
        className={`absolute top-4 z-50 p-2 bg-gray-300 rounded-full shadow-lg hover:bg-gray-400 transition-all 
          ${isCollapsed ? 'left-[6.25rem]' : 'left-60'}`}>
        {isCollapsed ? (
          <FiChevronRight size={20} />
        ) : (
          <FiChevronLeft size={20} />
        )}
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all border-r border-gray-200 flex flex-col 
          bg-white ${isCollapsed ? 'w-25' : 'w-64'} bg-background`}>
        <div className="p-4">
          {!isCollapsed && session && (
            <div className="flex items-center space-x-3 pb-4">
              <div className="flex flex-row gap-2 items-center">
                <FaCircleUser className="text-red-500 text-3xl" />
                <p className="font-medium text-slate-800 text-medium">
                  {session.user ? session.user.split('@')[0].trim() : 'user'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          className={`flex-grow overflow-y-auto ${isCollapsed ? 'mt-4' : 'mt-0'}`}>
          {routes.map(
            (route, index) =>
              shouldShowRoute(route.roles) && (
                <div key={index} className="p-1">
                  <Button
                    variant="light"
                    onClick={() =>
                      route.childRoutes
                        ? toggleDropdown(route.title)
                        : handleRouteClick(route.title, route.route)
                    }
                    startContent={
                      route.icon && (
                        <route.icon
                          className={`mr-2 text-2xl text-center font-bold ${activeRoute === route.title
                            ? 'text-red-500'
                            : 'text-slate-400'
                            }`}
                        />
                      )
                    }
                    endContent={
                      route.childRoutes &&
                      (openDropdown === route.title ? (
                        <FiChevronRight />
                      ) : (
                        <FiChevronDown />
                      ))
                    }
                    className={`w-full justify-start text-center text-lg font-medium hover:bg-gray-300 ${activeRoute === route.title
                        ? 'text-red-500 bg-red-50'
                        : 'text-slate-800'
                      } ${isCollapsed ? 'justify-center' : ''}`}>
                    {!isCollapsed && route.title}
                  </Button>
                  {route.childRoutes && openDropdown === route.title && (
                    <div className="ml-4">
                      {route.childRoutes.map(
                        (childRoute, childIndex) =>
                          shouldShowRoute(childRoute.roles) && (
                            <Button
                              key={childIndex}
                              variant="light"
                              onPress={() =>
                                handleRouteClick(
                                  childRoute.title,
                                  childRoute.route
                                )
                              }
                              startContent={
                                childRoute.icon && (
                                  <childRoute.icon
                                    className={`mr-2 text-2xl text-center font-bold ${activeRoute === childRoute.title
                                        ? 'text-red-500'
                                        : 'text-slate-400'
                                      }`}
                                  />
                                )
                              }
                              className={`w-full justify-start text-center text-lg font-medium hover:bg-gray-300 ${activeRoute === childRoute.title
                                  ? 'text-red-500 bg-red-50'
                                  : 'text-slate-800'
                                } ${isCollapsed ? 'justify-center' : ''}`}>
                              {!isCollapsed && childRoute.title}
                            </Button>
                          )
                      )}
                    </div>
                  )}
                </div>
              )
          )}
        </div>

        <div className="p-4">
          {!isCollapsed && (
            <>
              <Button
                variant="light"
                startContent={<FiHelpCircle />}
                className="w-full justify-start text-left mb-1 text-lg">
                Ayuda
              </Button>
              <Button
                variant="light"
                startContent={<FiLogOut />}
                onClick={logout}
                className="w-full justify-start text-left text-lg">
                Logout
              </Button>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
