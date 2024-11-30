'use client'

import { useState } from 'react'
import Chart, { type Props } from 'react-apexcharts'
import { Card } from '@nextui-org/react'

// Datos estáticos de tu tabla
const staticData = {
  categories: ['Jueves', 'Viernes', 'Sábado', 'Domingo', 'Lunes'],
  posData: [15, 18, 17, 15, 12], // Promedio de Pedidos por Hora (POS)
  notebookData: [10, 12, 11, 10, 8] // Promedio de Pedidos por Hora (Libreta)
}

// Configuración de opciones para ApexCharts
const options: Props['options'] = {
  chart: {
    type: 'area',
    animations: {
      speed: 300
    },
    toolbar: {
      show: false
    }
  },
  title: {
    text: 'Promedio de Pedidos por Día y Método',
    align: 'left'
  },
  legend: {
    tooltipHoverFormatter: function (val, opts) {
      return (
        val +
        ' - <strong>' +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        '</strong>'
      )
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: [3, 3],
    curve: 'smooth'
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

const AreaChart: React.FC = () => {
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
        type="area"
        height={500}
      />
    </Card>
  )
}

export default AreaChart
