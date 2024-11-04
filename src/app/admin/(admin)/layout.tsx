'use client'

import { useState, type ReactNode } from 'react'

import Sidebar from '@/components/dashboard/Sidebar'

export default function AdminLayout({
  children
}: {
  children: ReactNode
}): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <title>Punto Plebes</title>
      <Sidebar />
      <div
        className="lg:ml-64 md:ml-64 sm:ml-64 h-full  overflow-x-hidden"
        style={{ minHeight: '94vh' }}>
        <div className="py-6 px-5 mt-14 w-full h-screen">{children}</div>
      </div>
    </>
  )
}
