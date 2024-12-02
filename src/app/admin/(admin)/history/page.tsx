'use client'

import HistoricOrders from '@/components/order/HistoricOrders'
import HistoricPayments from '@/components/payment/HistoricPayments'
import DashboardHeader from '@/components/shared/DashboardHeader'
import { Tabs, Tab } from '@nextui-org/react'
import React from 'react'

const HistoricRecords = (): JSX.Element => {
  return (
    <div className="p-1 md:p-8">
      <DashboardHeader
        title="Gestiona los registros hístoricos de ordenes y ventas"
        subtitle="Aqui puedes ver las ordenes y pagos realizados anteriormente"
      />
      <Tabs fullWidth color="danger" variant="bordered">
        <Tab key="order" title="Ordenes">
          <HistoricOrders />
        </Tab>
        <Tab key="payment" title="Pagos">
          <HistoricPayments />
        </Tab>
      </Tabs>
    </div>
  )
}

export default HistoricRecords
