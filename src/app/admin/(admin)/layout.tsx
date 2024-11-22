'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import MobileBottomNavbar from '@/components/dashboard/MobileBottomNavbar'
useEffect

export default function AdminLayout({
  children
}: {
  children: ReactNode
}): JSX.Element {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration)
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error)
          })
      })
    }
  }, [])
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
