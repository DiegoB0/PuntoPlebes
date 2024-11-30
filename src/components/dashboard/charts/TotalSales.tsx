'use client'

import React from 'react'
import Chart, { type Props } from 'react-apexcharts'
import { Card } from '@nextui-org/react'
import dayjs from 'dayjs'

// Datos proporcionados
const salesByPeriod = [
  {
    created_at: '2024-11-27',
    total_sales: 1200
  },
  {
    created_at: '2024-11-20',
    total_sales: 1100
  },
  {
    created_at: '2024-11-13',
    total_sales: 1000
  },
  {
    created_at: '2024-11-06',
    total_sales: 1050
  },
  {
    created_at: '2024-10-30',
    total_sales: 980
  },
  {
    created_at: '2024-10-23',
    total_sales: 1010
  },
  {
    created_at: '2024-10-16',
    total_sales: 1030
  },
  {
    created_at: '2024-10-09',
    total_sales: 1005
  },
  {
    created_at: '2024-10-02',
    total_sales: 1020
  }
]

// Formatear datos para el gráfico
const categories = salesByPeriod.map((item) =>
  dayjs(item.created_at).format('MMMM DD')
)
const salesData = salesByPeriod.map((item) => item.total_sales)

// Props predeterminadas para el gráfico
const defaultOptions: Props['options'] = {
  chart: {
    type: 'area'
  },
  title: {
    text: 'Ventas totales en el més',
    align: 'left',
    style: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '20px'
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  xaxis: {
    categories,
    title: {
      text: 'Fecha'
    },
    labels: {
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    }
  },
  yaxis: {
    title: {
      text: 'Ventas Totales'
    },
    labels: {
      formatter: (val: number) => `$${val.toFixed(2)}`
    }
  },
  tooltip: {
    shared: true,
    intersect: false
  },
  colors: ['#f7b750', '#f54180'],
  legend: {
    position: 'bottom'
  }
}

const defaultSeries = [
  {
    name: 'Ventas Totales',
    data: salesData
  }
]

interface SalesAreaChartProps {
  options?: Props['options']
  series?: Props['series']
}

const SalesAreaChart: React.FC<SalesAreaChartProps> = ({
  options = defaultOptions,
  series = defaultSeries
}) => {
  return (
    <Card className="w-full p-5 flex justify-center items-center">
      <Chart
        className="w-full"
        options={options}
        series={series}
        type="area"
        height={400}
      />
    </Card>
  )
}

export default SalesAreaChart
