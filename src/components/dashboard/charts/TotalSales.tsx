'use client'
import { useEffect, useState } from 'react'
import Chart, { type Props } from 'react-apexcharts'
import { Card, Spinner } from '@nextui-org/react'
import { useStatisticsStore } from '@/store/statistics/statisticsSlice'
import { SalesByPeriod } from '@/types/statistics'
import dayjs from 'dayjs'
import { Loader } from '@/components/shared/Loader'

const transformSalesData = (salesByPeriod: SalesByPeriod[]) => {
  const categories = salesByPeriod.map(({ created_at }) =>
    dayjs(created_at).format('DD MMM')
  )

  const seriesData = salesByPeriod.map((item) => item.total_sales)

  return {
    categories,
    series: [
      {
        name: 'Ventas Totales',
        data: seriesData
      }
    ]
  }
}

const AreaChart: React.FC = () => {
  const { data, getStatistics, loading } = useStatisticsStore()
  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[]
    categories: string[]
  }>({
    series: [],
    categories: []
  })

  // Fetch statistics if not already loaded
  useEffect(() => {
    if (!data) {
      void getStatistics()
    }
  }, [data, getStatistics])

  // Transform sales data when available
  useEffect(() => {
    if (data?.salesByPeriod) {
      const transformedData = transformSalesData(data.salesByPeriod)
      setChartData(transformedData)
    }
  }, [data])

  // Chart configuration
  const options: Props['options'] = {
    chart: {
      type: 'area',
      animations: {
        enabled: true,
        speed: 300
      },
      toolbar: { show: false }
    },
    title: {
      text: 'Ventas Totales',
      align: 'left',
      style: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '20px'
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: 'Días',
        style: {
          fontFamily: 'Inter, sans-serif'
        }
      },
      labels: {
        style: { fontFamily: 'Inter, sans-serif' },
        rotate: -45,
        rotateAlways: true,
        trim: true
      },
      tickPlacement: 'on'
    },
    yaxis: {
      labels: {
        style: { fontFamily: 'Inter, sans-serif' },
        formatter: (value) => `$${value.toLocaleString()}` // Format y-axis values as currency
      },
      title: {
        text: 'Monto de Ventas ($)',
        style: {
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value) => `$${value.toLocaleString()}` // Format tooltip values as currency
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
    colors: ['#f7b750']
  }

  // Render loading state
  if (loading || !data?.salesByPeriod) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader />
      </div>
    )
  }

  // Render chart
  return (
    <Card className="w-full p-5 flex justify-center items-center">
      <Chart
        className="w-full"
        options={{
          ...options,
          xaxis: {
            ...options.xaxis,
            categories: chartData.categories
          }
        }}
        series={chartData.series}
        type="area"
        height={500}
      />
    </Card>
  )
}

export default AreaChart
