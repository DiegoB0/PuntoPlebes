'use client'

import dynamic from 'next/dynamic'
import React from 'react'
import { Card } from '@nextui-org/react'
import { FaArrowUp } from 'react-icons/fa'
import { BsGraphUpArrow } from 'react-icons/bs'

// Carga dinámica de los componentes que usan ApexCharts
const AreaChart = dynamic(() => import('@/components/dashboard/AreaChart'), {
  ssr: false
})
const BarChart = dynamic(() => import('@/components/dashboard/BarChart'), {
  ssr: false
})
const TopSellers = dynamic(
  () => import('@/components/dashboard/charts/TopSellers'),
  { ssr: false }
)
const TotalSales = dynamic(
  () => import('@/components/dashboard/charts/TotalSales'),
  { ssr: false }
)
const RevenueDist = dynamic(
  () => import('@/components/dashboard/charts/RevenueDist'),
  { ssr: false }
)

const Page = (): JSX.Element => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-6">
        <span className="text-4xl font-bold">34 </span>
        <p className="text-gray-500 text-md text-justify mt-2">
          <span className="inline-block mr-2">
            <FaArrowUp className="text-green-500" />
          </span>
          órdenes
        </p>
      </Card>
      <Card className="p-6">
        <span className="text-4xl font-bold">$7,831 </span>
        <p className="text-gray-500 text-md text-justify mt-2">
          <span className="inline-block mr-2">
            <BsGraphUpArrow className="text-green-500" />
          </span>
          Ventas
        </p>
      </Card>
      <Card className="p-6">
        <span className="text-4xl font-bold">$214.4 </span>
        <p className="text-gray-500 text-md text-justify mt-2">
          <span className="inline-block mr-2">
            <BsGraphUpArrow className="text-green-500" />
          </span>
          Promedio p/venta
        </p>
      </Card>

      <div className="flex gap-4 col-span-3">
        <TotalSales />
      </div>
      <RevenueDist />
      <div className="col-span-2">
        {' '}
        <TopSellers />{' '}
      </div>
    </div>
  )
}

export default Page
