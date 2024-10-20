'use client'
import React, { useState } from 'react'
import { Avatar, Input, Button } from '@nextui-org/react'
import { RiSearchLine } from 'react-icons/ri'
import { FiHelpCircle, FiLogOut } from 'react-icons/fi'
import routes, { extraRoutes } from '@/routes/routes'

export default function SidebarComponent() {
  const [activeRoute, setActiveRoute] = useState<string>('')
  return (
    <aside className="fixed dashboard-sidebar top-0 left-0 z-40 w-64 h-screen  transition-transform bg-background border-r border-gray-200 flex flex-col">
      <div className="p-4 ">
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

        <Input
          type="text"
          variant="bordered"
          placeholder="Search..."
          className="w-full text-lg"
          startContent={<RiSearchLine />}
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        {routes.map((route, index) => (
          <div key={index} className="p-1">
            <Button
              variant="light"
              onClick={() => setActiveRoute(route.title)}
              startContent={
                route.icon && (
                  <route.icon
                    className={`mr-2 text-2xl ${activeRoute === route.title ? 'text-red-500' : 'text-slate-400'}`}
                  />
                )
              }
              className={`w-full justify-start text-left text-lg hover:bg-gray-300 
                ${activeRoute === route.title ? 'text-red-500' : 'text-slate-800'}`} // Active class
            >
              {route.title}
            </Button>
          </div>
        ))}
      </div>
      <div className="p-4">
        <Button
          variant="light"
          startContent={<FiHelpCircle />}
          className="w-full justify-start text-left mb-1 text-lg">
          Help & Information
        </Button>
        <Button
          variant="light"
          startContent={<FiLogOut />}
          className="w-full justify-start text-left text-lg">
          Log Out
        </Button>
      </div>
    </aside>
  )
}
