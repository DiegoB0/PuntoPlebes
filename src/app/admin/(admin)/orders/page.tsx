'use client'

import { useState } from 'react'
import {
  Chip,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@nextui-org/react'
import { FaClock, FaDollarSign, FaBox, FaUser } from 'react-icons/fa'

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import DashboardHeader from '@/components/shared/DashboardHeader'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customerName: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'completed'
  timestamp: Date
}

export default function OrdersComponent() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'John Doe',
      items: [
        { id: '1', name: 'Burger', quantity: 2, price: 10 },
        { id: '2', name: 'Fries', quantity: 1, price: 3 }
      ],
      total: 23,
      status: 'pending',
      timestamp: new Date()
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      items: [
        { id: '3', name: 'Pizza', quantity: 1, price: 15 },
        { id: '4', name: 'Salad', quantity: 1, price: 7 }
      ],
      total: 22,
      status: 'preparing',
      timestamp: new Date(Date.now() - 15 * 60000) // 15 minutos atrás
    }
  ])

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'preparing':
        return 'primary'
      case 'ready':
        return 'success'
      case 'completed':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="container gap-2">
      <div className="border-round w-xs">
        <DashboardHeader title="Ordenes activas" />
        <div className="h-[calc(100vh-8rem)] overflow-auto">
          {orders.map((order) => (
            <Card
              isHoverable
              key={order.id}
              isPressable
              className="mb-4 w-full max-w-xs"
              onClick={() => setSelectedOrder(order)}>
              <CardHeader className="gap-2">
                <span>Order #{order.id}</span>
                <Chip color={getStatusColor(order.status)}>{order.status}</Chip>
              </CardHeader>
              <CardBody>
                <div className="flex items-center mb-2">
                  <FaUser className="mr-2" />
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaBox className="mr-2" />
                  <span>{order.items.length} items</span>
                </div>
                <div className="flex items-center">
                  <FaDollarSign className="mr-2" />
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-2" />
                  <span>{new Date(order.timestamp).toLocaleTimeString()}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="xs:ml-4 xs:w-3/5">
        {selectedOrder ? (
          <div>
            <h2 className="mb-4">Order Details</h2>
            <Card>
              <CardHeader className="flex justify-between items-center">
                <span>Order #{selectedOrder.id}</span>
                <Chip color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </Chip>
              </CardHeader>
              <CardBody>
                <div className="flex items-center mb-4">
                  <FaUser className="mr-2" />
                  <span>{selectedOrder.customerName}</span>
                </div>
                <Table aria-label="Order Details Table">
                  <TableHeader>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          ${(item.quantity * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <span className="mt-4 text-right font-bold">
                  Total: ${selectedOrder.total.toFixed(2)}
                </span>
              </CardBody>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-2" />
                  <span>
                    {new Date(selectedOrder.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="space-x-2">
                  {selectedOrder.status === 'pending' && (
                    <Button
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, 'preparing')
                      }>
                      Start Preparing
                    </Button>
                  )}
                  {selectedOrder.status === 'preparing' && (
                    <Button
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, 'ready')
                      }>
                      Mark as Ready
                    </Button>
                  )}
                  {selectedOrder.status === 'ready' && (
                    <Button
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, 'completed')
                      }>
                      Complete Order
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select an order to view details
          </div>
        )}
      </div>
    </div>
  )
}
