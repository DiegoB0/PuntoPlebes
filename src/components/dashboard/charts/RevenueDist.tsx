'use client'
import React, { useEffect, useState, useMemo } from 'react'
import Chart, { Props } from 'react-apexcharts'
import { Card } from '@nextui-org/react'
import { useStatisticsStore } from '@/store/statistics/statisticsSlice'
import { Loader } from '@/components/shared/Loader'
import { get } from 'http'
import { currencyFormat } from '@/helpers/formatCurrency'

export default function RevenueDistributionChart() {
  // Accede al store de estadísticas
  const { revenueDistribution, loading, getRevenueDistribution } =
    useStatisticsStore()

  // Estado para almacenar datos del gráfico
  const [chartData, setChartData] = useState<{
    labels: string[]
    series: number[]
  }>({
    labels: [],
    series: []
  })

  // Efecto para cargar datos de distribución de ingresos
  useEffect(() => {
    // Llamar a getRevenueDistribution solo una vez al montar el componente
    getRevenueDistribution()
  }, [getRevenueDistribution])

  // Efecto separado para procesar los datos cuando estén disponibles
  useEffect(() => {
    console.log(revenueDistribution)
    if (revenueDistribution && revenueDistribution.length > 0) {
      // Extraer etiquetas y valores de la respuesta
      const labels = revenueDistribution.map(
        (distribution) => distribution.meal_name
      )
      const series = revenueDistribution.map((distribution) =>
        parseFloat((distribution.revenue_percentage * 100).toFixed(2))
      )

      setChartData({ labels, series })
    }
  }, [revenueDistribution])

  // Resto del código permanece igual...
  const options: Props['options'] = useMemo(
    () => ({
      chart: {
        type: 'donut'
      },
      labels: chartData.labels,
      legend: {
        position: 'bottom'
      },
      tooltip: {
        theme: 'light',
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        },
        y: {
          formatter: (val: number) => currencyFormat(val)
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
      colors: ['#e53935', '#8e44ad', '#2196f3', '#43a047']
    }),
    [chartData]
  )

  return (
    <Card className="w-full p-5 flex flex-col justify-center items-center">
      {loading ? (
        <Loader />
      ) : chartData.series.length > 0 ? (
        <>
          <h1 className="text-2xl font-bold">Distribución de Ingresos</h1>
          <Chart
            className="w-full"
            options={options}
            series={chartData.series}
            type="donut"
            height={400}
          />
        </>
      ) : (
        <p>No hay datos disponibles</p>
      )}
    </Card>
  )
}
