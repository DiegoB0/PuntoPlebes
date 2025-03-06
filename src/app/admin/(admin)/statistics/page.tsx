'use client'

import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { Card } from '@nextui-org/react'
import { FaArrowUp } from 'react-icons/fa'
import { BsGraphUpArrow } from 'react-icons/bs'

import { useOrdersStore } from '@/store/orders/orderSlice'
import { currencyFormat } from '@/helpers/formatCurrency'
import { Loader } from '@/components/shared/Loader'

const RevenueDist = dynamic(
  () =>
    import('@/components/dashboard/charts/RevenueDist').then(
      (mod) => mod.default
    ),
  {
    ssr: false,
    loading: () => <Loader /> // Añade un componente de carga opcional
  }
)
const TotalSales = dynamic(
  () => import('@/components/dashboard/charts/TotalSales'),
  { ssr: false }
)
const TopSellers = dynamic(
  () => import('@/components/dashboard/charts/TopSell'),
  { ssr: false }
)

const StatisticsPage = (): JSX.Element => {
  const { getOrders, orders } = useOrdersStore()

  useEffect(() => {
    void getOrders()
  }, [getOrders])

  console.log(orders, 'Ordenes')
  const orderNumbers = orders
    ? orders.slice(-1)[0]?.order_number + 1
    : undefined

  const totalSales = orders
    ? orders.reduce((total, order) => total + order.total_price, 0)
    : 0

  const saleAverage = orders
    ? orders.reduce((total, order) => total + order.total_price, 0) /
      orders.length
    : 0

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-6">
        <span className="text-4xl font-bold">{orderNumbers} </span>
        <p className="text-gray-500 text-md text-justify mt-2">
          <span className="inline-block mr-2">
            <FaArrowUp className="text-green-500" />
          </span>
          órdenes totales
        </p>
      </Card>
      <Card className="p-6">
        <span className="text-4xl font-bold">{currencyFormat(totalSales)}</span>
        <p className="text-gray-500 text-md text-justify mt-2">
          <span className="inline-block mr-2">
            <BsGraphUpArrow className="text-green-500" />
          </span>
          Ventas totales
        </p>
      </Card>
      <Card className="p-6">
        <span className="text-4xl font-bold">
          {currencyFormat(saleAverage)}{' '}
        </span>
        <p className="text-gray-500 text-md text-justify mt-2">
          <span className="inline-block mr-2">
            <BsGraphUpArrow className="text-green-500" />
          </span>
          Promedio p/venta total
        </p>
      </Card>

      <div className="flex gap-4 col-span-3">
        <TotalSales />
      </div>

      <div className="col-span-2">
        <RevenueDist />
        {/* <TopSellers /> */}
      </div>
    </div>
  )
}

export default StatisticsPage
