import React, { useEffect, useMemo, useState } from 'react'
import { Spacer, Button, Card } from '@nextui-org/react'
import { DateRangePicker } from '@nextui-org/react'
import { parseDate } from '@internationalized/date'
import { useStatisticsStore } from '@/store/statistics/statisticsSlice'
import dayjs from 'dayjs'
import Chart, { type Props } from 'react-apexcharts'

import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

import type { RangeValue } from '@react-types/shared'
import type { DateValue } from '@react-types/datepicker'
import { currencyFormat } from '@/helpers/formatCurrency'

type FilteredData = {
  period: string
  totalSales: number
  totalQuantity: number
}

const AreaChartWithFilters = () => {
  const { salesByPeriod, loading, getStatistics } = useStatisticsStore()
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null)

  useEffect(() => {
    if (!salesByPeriod || salesByPeriod.length === 0) {
      const firstDate = salesByPeriod?.[0]?.created_at
      const lastDate = salesByPeriod?.[salesByPeriod.length - 1]?.created_at
      if (firstDate && lastDate) {
        getStatistics(lastDate, firstDate)
        setDateRange({
          start: parseDate(lastDate),
          end: parseDate(firstDate)
        })
      }
    }
  }, [salesByPeriod, getStatistics])

  const filteredData: FilteredData[] = useMemo(() => {
    if (!salesByPeriod) return []

    let filtered = salesByPeriod

    if (dateRange?.start) {
      filtered = filtered.filter((entry) =>
        dayjs(entry.created_at).isSameOrAfter(dayjs(dateRange.start.toString()))
      )
    }
    if (dateRange?.end) {
      filtered = filtered.filter((entry) =>
        dayjs(entry.created_at).isSameOrBefore(dayjs(dateRange.end.toString()))
      )
    }

    const grouped = filtered.map((entry) => {
      return {
        period: dayjs(entry.created_at).format('YYYY-MM-DD'),
        totalSales: entry.total_sales,
        totalQuantity: entry.total_quantity
      }
    })

    return grouped
  }, [salesByPeriod, dateRange])

  const options: Props['options'] = useMemo(
    () => ({
      chart: {
        type: 'area',
        height: 350,

        toolbar: {
          show: true
        }
      },
      fill: {
        type: 'gradient',
        colors: ['#22e55c']
      },
      xaxis: {
        categories: filteredData.map((entry) =>
          dayjs(entry.period).format('MMMM DD')
        )
      },
      yaxis: {
        title: {
          text: 'Ventas Totales',
          formatter: (val: number) => currencyFormat(val)
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => currencyFormat(val)
      },
      stroke: {
        curve: 'smooth',
        colors: ['#22e55c']
      }
    }),
    [filteredData]
  )

  const series = useMemo(
    () => [
      {
        name: 'Ventas Totales',
        data: filteredData.map((entry) => entry.totalSales)
      }
    ],
    [filteredData]
  )

  return (
    <Card className="w-full p-6">
      <h1 className="text-2xl font-bold px-4">Ventas Totales</h1>
      <div className="flex items-center gap-5 px-3">
        <DateRangePicker
          variant="bordered"
          color="danger"
          label="Rango de Fechas"
          value={dateRange}
          onChange={setDateRange}
          description="Seleccione un rango de fechas"
        />

        <Button
          variant="ghost"
          size="sm"
          color="warning"
          onClick={() => {
            if (dateRange?.start && dateRange?.end) {
              getStatistics(
                dayjs(dateRange.start.toString()).format('DD-MM-YYYY'),
                dayjs(dateRange.end.toString()).format('DD-MM-YYYY')
              )
            }
          }}
          disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </Button>
      </div>

      <Spacer y={1} />

      {filteredData.length > 0 ? (
        <Chart
          options={options}
          series={series}
          type="area"
          height={350}
          className="w-full"
        />
      ) : (
        <p className="text-center text-gray-500 text-sm">
          No hay datos disponibles para el rango seleccionado.
        </p>
      )}
    </Card>
  )
}

export default AreaChartWithFilters
