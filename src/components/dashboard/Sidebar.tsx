'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, Input, Button } from '@nextui-org/react'
import { RiSearchLine } from 'react-icons/ri'
import {
  FiChevronLeft,
  FiChevronRight,
  FiHelpCircle,
  FiLogOut
} from 'react-icons/fi'
import Cookies from 'js-cookie'
import routes from '@/routes/routes'

interface SidebarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
}

export default function SidebarComponent({
  isCollapsed,
  toggleSidebar
}: SidebarProps) {
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
    <div className="relative">
      <button
        onClick={toggleSidebar}
        className={`absolute top-4 z-50 p-2 bg-gray-300 rounded-full shadow-lg hover:bg-gray-400 transition-all 
          ${isCollapsed ? 'left-[6rem]' : 'left-60'}`}>
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
          {!isCollapsed && (
            <div className="flex items-center space-x-3 pb-4">
              <Avatar
                src="/placeholder.svg?height=40&width=40"
                size="lg"
                isBordered
                color="default"
              />
              <div>
                <p className="font-medium text-slate-800 text-xl">John Doe</p>
                <p className="text-lg text-slate-700">Cajero</p>
              </div>
            </div>
          )}
          {/* {!isCollapsed && (
            <Input
              type="text"
              variant="bordered"
              placeholder="Search..."
              className="w-full text-lg"
              startContent={<RiSearchLine />}
            />
          )} */}
        </div>

        <div
          className={`flex-grow overflow-y-auto ${
            isCollapsed ? 'mt-4' : 'mt-0'
          }`}>
          {routes.map((route, index) => (
            <div key={index} className="p-1">
              <Button
                variant="light"
                onClick={() => handleRouteClick(route.title, route.route)}
                startContent={
                  route.icon && (
                    <route.icon
                      className={`mr-2 text-2xl text-center font-bold ${
                        activeRoute === route.title
                          ? 'text-red-500'
                          : 'text-slate-400'
                      }`}
                    />
                  )
                }
                className={`w-full justify-start text-center text-lg font-medium hover:bg-gray-300 ${
                  activeRoute === route.title
                    ? 'text-red-500 bg-red-50'
                    : 'text-slate-800'
                } ${isCollapsed ? 'justify-center' : ''}`}>
                {!isCollapsed && route.title}
              </Button>
            </div>
          ))}
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
                Salir
              </Button>
            </>
          )}
          {isCollapsed && (
            <div className="flex flex-col items-center space-y-2 gap-2">
              <Button
                startContent={<FiHelpCircle size={24} />}
                variant="light"></Button>
              <Button
                onClick={logout}
                startContent={<FiLogOut size={24} />}
                variant="light"></Button>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
