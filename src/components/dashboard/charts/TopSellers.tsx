'use client'

import React from 'react'
import Chart, { type Props } from 'react-apexcharts'
import { Card } from '@nextui-org/react'

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

// Formatear datos para el gráfico
const categories = topSellers.map((item) => item.meal_id)
const revenueData = topSellers.map((item) => item.total_revenue)

// Opciones del gráfico
const options: Props['options'] = {
  chart: {
    type: 'bar',
    height: 380
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '100%',
      distributed: true,
      dataLabels: {
        position: 'bottom'
      }
    }
  },
  colors: ['#ffcc00', '#3366cc', '#99cc33', '#cc3333'], // Colores legibles
  dataLabels: {
    enabled: true,
    textAnchor: 'start',
    offsetX: 20,
    style: {
      fontFamily: 'Inter, sans-serif',
      colors: ['#000'] // Color legible
    },
    formatter: function (val: number, opt: any) {
      return `${categories[opt.dataPointIndex]}: $${val}`
    },

    dropShadow: {
      enabled: true
    }
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  xaxis: {
    categories,
    labels: {
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    }
  },
  yaxis: {
    labels: {
      show: false
    }
  },
  tooltip: {
    theme: 'dark',
    x: {
      show: false
    },
    y: {
      title: {
        formatter: () => ''
      }
    }
  },
  title: {
    text: 'Más vendidos con ingreso total',
    align: 'center',
    floating: true,
    style: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '20px'
    }
  }
}

const series = [
  {
    data: revenueData
  }
]

const TopSellersChart: React.FC = () => {
  return (
    <Card className="w-full p-5 flex justify-center items-center">
      <Chart
        className="w-full"
        options={options}
        series={series}
        type="bar"
        height={400}
      />
    </Card>
  )
}

export default TopSellersChart
