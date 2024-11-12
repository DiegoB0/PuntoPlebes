'use client'

import { useState, type ReactNode } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'

export default function AdminLayout({
  children
}: {
  children: ReactNode
}): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Cambiar el estado inicial según tu preferencia

  return (
    <>
      <title>Punto Plebes</title>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isCollapsed={!isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div
          className={`transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-20'
          } flex-1 h-full overflow-x-hidden`}
          style={{ minHeight: '94vh' }}>
          <div className="py-6 px-5 mt-14 w-full h-screen">{children}</div>
        </div>
      </div>
    </>
  )
}
