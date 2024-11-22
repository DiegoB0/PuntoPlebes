'use client'

import { useState, type ReactNode } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import MobileBottomNavbar from '@/components/dashboard/MobileBottomNavbar'

export default function AdminLayout({
  children
}: {
  children: ReactNode
}): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <>
      <title>Punto Plebes</title>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - hidden on mobile, visible on md and larger screens */}
        <div className="hidden md:block">
          <Sidebar
            isCollapsed={!isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div
              className={`transition-all duration-300 p-6 ${
                isSidebarOpen ? 'md:ml-64' : 'md:ml-[6.25rem]'
              }`}>
              {children}
            </div>
          </main>

          {/* Mobile Bottom Navbar - visible only on mobile */}
          <div className="md:hidden">
            <MobileBottomNavbar />
          </div>
        </div>
      </div>
    </>
  )
}
