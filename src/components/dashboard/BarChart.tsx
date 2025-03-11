'use client'

import { useState } from 'react'

import { Card } from '@nextui-org/react'
import Chart, { type Props } from 'react-apexcharts'

// Datos estáticos de tu tabla
const staticData = {
  categories: ['Jueves', 'Viernes', 'Sábado', 'Domingo', 'Lunes'],
  posData: [15, 18, 17, 15, 12], // Promedio de Pedidos por Hora (POS)
  notebookData: [10, 12, 11, 10, 8] // Promedio de Pedidos por Hora (Libreta)
}

// Configuración de opciones para ApexCharts
const options: Props['options'] = {
  chart: {
    type: 'bar',
    animations: {
      speed: 300
    },
    toolbar: {
      show: false
    }
  },
  title: {
    text: 'Promedio de Pedidos por Hora',
    align: 'left'
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center'
  },
  dataLabels: {
    enabled: true
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '45%'
    }
  },
  xaxis: {
    categories: staticData.categories,
    labels: {
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    }
  },
  colors: ['#f7b750', '#f54180']
}

const BarChart: React.FC = () => {
  const [chartData] = useState({
    series: [
      {
        name: 'POS',
        data: staticData.posData
      },
      {
        name: 'Libreta',
        data: staticData.notebookData
      }
    ],
    categories: staticData.categories
  })

  return (
    <Card className="w-full p-5 flex justify-center items-center">
      <Chart
        className="w-full"
        options={options}
        series={chartData.series}
        type="bar"
        height={500}
      />
    </Card>
  )
}

export default BarChart
