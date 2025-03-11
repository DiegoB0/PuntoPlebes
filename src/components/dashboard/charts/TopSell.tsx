'use client'

import React from 'react'

import { Card } from '@nextui-org/react'
import Chart, { type Props } from 'react-apexcharts'

// Datos proporcionados
const topSellers = [
  {
    meal_id: 'La misteriosa',
    total_quantity: 8,
    total_revenue: 400
  },
  {
    meal_id: 'La consentida',
    total_quantity: 5,
    total_revenue: 325
  },
  {
    meal_id: 'La chikeona',
    total_quantity: 4,
    total_revenue: 320
  },
  {
    meal_id: 'La tremenda',
    total_quantity: 3,
    total_revenue: 210
  }
]

// Preparar datos para la gráfica
const labels = topSellers.map((item) => item.meal_id)
const series = topSellers.map((item) => item.total_revenue)

const options: Props['options'] = {
  chart: {
    type: 'donut'
  },
  labels,
  legend: {
    position: 'bottom'
  },
  tooltip: {
    theme: 'light',
    style: {
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif'
    },
    marker: {
      fillColors: ['#000']
    },
    y: {
      formatter: (val: number) => `$${val.toFixed(2)}`
    }
  },
  title: {
    text: 'Distribución de Ingresos',
    align: 'center',
    style: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '20px'
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`,
    style: {
      fontFamily: 'Inter, sans-serif',
      colors: ['#222']
    }
  },
  colors: ['#ffc5c5', '#c5ffc5', '#c5c5ff', '#ffffc5'] // Colores pastel
}

const RevenueDistributionChart: React.FC = () => {
  return (
    <Card className="w-full p-5 flex justify-center items-center">
      <Chart
        className="w-full"
        options={options}
        series={series}
        type="donut"
        height={400}
      />
    </Card>
  )
}

export default RevenueDistributionChart
