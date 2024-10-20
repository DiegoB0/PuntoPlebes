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
        className="lg:ml-72 md:ml-64 sm:ml-64 bg-default-100 h-full overflow-x-hidden"
        style={{ minHeight: '94vh' }}>
        <div className="py-12 px-5 mt-14 w-full h-full">{children}</div>
      </div>
    </>
  )
}
