'use client'

import SimpleTableComponent from '@/components/table/SImpleTable'
import { toastAlert } from '@/services/alerts'
import { useOrdersStore } from '@/store/orders/orderSlice'
import { ActiveOrderTableProps, DetailedOrder } from '@/types/order'
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial'
import { AndroidPermissions } from '@ionic-native/android-permissions'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import {
  FaBox,
  FaDollarSign,
  FaPhone,
  FaPrint,
  FaSearch,
  FaUser
} from 'react-icons/fa'

interface BTPrinter {
  name: string
  address: string
}

const OrdersComponent = () => {
  const { detailedOrder, getOrders } = useOrdersStore()
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null)
  const [rows, setRows] = useState<ActiveOrderTableProps[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const [connectionStatus, setConnectionStatus] = useState('Not Connected')
  const [availableDevices, setAvailableDevices] = useState<BTPrinter[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState<BTPrinter | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [permissionsGranted, setPermissionsGranted] = useState(false)

  useEffect(() => {
    getOrders()
  }, [getOrders])

  const PERMISSIONS = [
    'android.permission.BLUETOOTH',
    'android.permission.BLUETOOTH_SCAN',
    'android.permission.BLUETOOTH_CONNECT',
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.ACCESS_COARSE_LOCATION'
  ] as const

  const checkAndRequestPermissions = async () => {
    try {
      // Primero verificamos si ya tenemos los permisos
      for (const permission of PERMISSIONS) {
        const hasPermission =
          await AndroidPermissions.checkPermission(permission)

        if (!hasPermission.hasPermission) {
          // Si no tenemos el permiso, mostramos el diálogo nativo
          const result = await AndroidPermissions.requestPermissions([
            permission
          ])

          // Verificamos el resultado del diálogo
          if (!result.hasPermission) {
            // Si el usuario denegó el permiso
            toastAlert({
              title: `Se requiere el permiso de ${permission.split('.').pop()}`,
              icon: 'warning'
            })

            return false
          }
        }
      }

      return true
    } catch (error) {
      console.error('Error al verificar/solicitar permisos:', error)
      toastAlert({
        title: 'Error al verificar permisos',
        icon: 'error'
      })
      return false
    }
  }

  const columns = [
    { key: 'meal_name', label: 'Item' },
    { key: 'quantity', label: 'Cantidad' },
    { key: 'price', label: 'Precio' },
    { key: 'total', label: 'Subtotal' }
  ]

  useEffect(() => {
    if (selectedOrder) {
      const mappedRows = selectedOrder.items.map((item, index) => ({
        id: index,
        meal_name: item.meal_name,
        quantity: item.quantity,
        price: item.meal_price,
        total: item.subtotal,
        meal_id: item.meal_id,
        order_id: 0,
        order_status: '',
        total_price: item.total_price,
        client_phone: '',
        client_name: '',
        order_number: 0,
        payments: []
      }))
      setRows(mappedRows)
    } else {
      setRows([])
    }
  }, [selectedOrder])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en proceso':
        return 'bg-yellow-500 text-white'
      case 'preparando':
        return 'bg-blue-500 text-white'
      case 'lista':
        return 'bg-green-500 text-white'
      case 'terminada':
        return 'bg-violet-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
    // Implement the logic to update order status
  }

  const searchDevices = async () => {
    const permissionsGranted = await checkAndRequestPermissions()
    if (!permissionsGranted) {
      return
    }

    try {
      const isEnabled = await BluetoothSerial.isEnabled()
      if (!isEnabled) {
        toastAlert({
          title: 'Bluetooth deshabilitado',
          icon: 'warning'
        })
        return
      }

      setAvailableDevices([])
      onOpen() // Open the modal

      const devices = await BluetoothSerial.list()
      setAvailableDevices(devices)
    } catch (error) {
      console.error('Error searching for devices:', error)
      toastAlert({
        title: 'Error al buscar dispositivos',
        icon: 'error'
      })
    }
  }

  const connectToPrinter = async (printer: BTPrinter) => {
    try {
      if (!printer.address || !printer.name) {
        toastAlert({
          title: 'Invalid printer details',
          icon: 'error'
        })
        return
      }

      console.log('Attempting to connect to printer:', printer.name)

      const subscription = BluetoothSerial.connect(printer.address).subscribe({
        next: async () => {
          console.log('Successfully connected to', printer.address)

          // Send a minimal print command to trigger Bluetooth activation
          try {
            const minimalData = [0x1b, 0x40] // Example: ESC @ (reset command for many printers)
            const dataSent = await BluetoothSerial.write(
              new Uint8Array(minimalData)
            )
            if (dataSent) {
              console.log('Minimal print command sent successfully')
            } else {
              console.log('Failed to send the minimal print command')
            }
          } catch (writeError) {
            console.error('Error sending print command:', writeError)
          }

          // Update UI and state after successful connection
          setSelectedPrinter(printer)
          setIsConnected(true)
          setConnectionStatus(`Connected to ${printer.name}`)
          onClose()
          toastAlert({
            title: `Connected to ${printer.name}`,
            icon: 'success'
          })
        },
        error: (err) => {
          console.error('Error connecting to printer:', err)
          toastAlert({
            title: 'Error connecting to printer',
            icon: 'error'
          })
        }
      })

      // Clean up subscription when component unmounts
      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toastAlert({
        title: 'Unexpected error occurred',
        icon: 'error'
      })
    }
  }

  const printTest = async () => {
    if (!selectedPrinter) {
      toastAlert({
        title: 'No hay impresora seleccionada',
        icon: 'warning'
      })
      return
    }

    try {
      let targetPrinterName = 'JK-80PL'
      console.log('Verificando conexión...')

      const devices: BTPrinter[] = await BluetoothSerial.list()
      const isPrinterConnected = devices.some(
        (device: BTPrinter) => device.address === selectedPrinter.address
      )

      if (!isPrinterConnected) {
        console.log('Impresora no conectada, intentando conectar...')
        BluetoothSerial.connect(selectedPrinter.address)
        console.log('Conexión exitosa')
      } else {
        console.log('Impresora ya conectada')
      }

      const targetPrinter = devices.find(
        (device) => device.name === targetPrinterName
      )

      if (!targetPrinter) {
        console.log('La impresora conectada no es la correcta')
        BluetoothSerial.connect(selectedPrinter.address)
        console.log('Conexión exitosa')
      } else {
        console.log('Impresora ya conectada')
      }

      console.log('Preparando datos para imprimir...')
      const testData = 'Test print\n'
      const printDataArray = [
        0x1b,
        0x40, // Initialize printer
        ...Array.from(Buffer.from(testData, 'ascii')),
        0x0a // Line feed
      ]

      const printData = new Uint8Array(printDataArray)

      console.log('Intentando escribir en la impresora...')
      const writeResult = await BluetoothSerial.write(printData)

      if (writeResult) {
        console.log('Datos enviados correctamente a la impresora')
        toastAlert({
          title: 'Impresión de prueba realizada correctamente',
          icon: 'success'
        })
      } else {
        throw new Error('Failed to write to printer')
      }
    } catch (error) {
      console.error('Error de impresión:', error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        toastAlert({
          title: `Ha ocurrido un error al imprimir: ${error.message}`,
          icon: 'error'
        })
      } else {
        console.error('Unexpected error during print process:', error)
        toastAlert({
          title: 'Ha ocurrido un error desconocido',
          icon: 'error'
        })
      }
    }
  }

  const printOrder = async () => {
    if (!selectedPrinter) {
      toastAlert({
        title: 'No hay impresora seleccionada',
        icon: 'warning'
      })
      return
    }

    if (!selectedOrder) {
      toastAlert({
        title: 'La orden no contiene información válida',
        icon: 'error'
      })
      return
    }

    try {
      const targetPrinterName = 'JK-80PL'
      console.log('Verificando conexión...')

      const devices: BTPrinter[] = await BluetoothSerial.list()
      const isPrinterConnected = devices.some(
        (device: BTPrinter) => device.address === selectedPrinter.address
      )

      if (!isPrinterConnected) {
        console.log('Impresora no conectada, intentando conectar...')
        const connectResult = await BluetoothSerial.connect(
          selectedPrinter.address
        )
        console.log('Conexión exitosa:', connectResult)
      } else {
        console.log('Impresora ya conectada')
      }

      const targetPrinter = devices.find(
        (device) => device.name === targetPrinterName
      )

      if (!targetPrinter) {
        console.log('La impresora conectada no es la correcta')
        const connectResult = await BluetoothSerial.connect(
          selectedPrinter.address
        )
        console.log('Conexión exitosa:', connectResult)
      } else {
        console.log('Impresora ya conectada y correcta')
      }

      console.log('Preparando datos para imprimir...')
      const printDataString = formatOrderForPrinting(selectedOrder)

      const printDataArray = [
        ...Array.from(Buffer.from(printDataString, 'ascii')),
        0x0a // Line feed
      ]
      const printData = new Uint8Array(printDataArray)

      console.log('Intentando escribir en la impresora...')
      const writeResult = await BluetoothSerial.write(printData)

      if (writeResult) {
        console.log('Datos enviados correctamente a la impresora')
        toastAlert({
          title: 'Impresión realizada correctamente',
          icon: 'success'
        })
      } else {
        throw new Error('No se pudo enviar los datos a la impresora')
      }
    } catch (error) {
      console.error('Error de impresión:', error)
      toastAlert({
        title: `Ha ocurrido un error al imprimir: ${error instanceof Error ? error.message : error}`,
        icon: 'error'
      })
    }
  }

  const formatOrderForPrinting = (order: DetailedOrder): string => {
    if (!order || !order.items || order.items.length === 0) {
      return 'Error: La orden no tiene información válida para imprimir.'
    }

    let printData = '\x1B\x40' // Initialize printer
    printData += '\x1B\x61\x01' // Center align
    printData += '\x1B\x21\x30' // Bold text
    printData += `Orden #: ${order.order_number}\n`
    printData += `Estado: ${order.order_status}\n`
    printData += `Cliente: ${order.client_name}\n`
    printData += `Teléfono: ${order.client_phone}\n\n`

    printData += '\x1B\x21\x00' // Normal text
    printData += '\x1B\x61\x00' // Left align
    printData += 'Productos:\n'

    order.items.forEach((item) => {
      printData += `${item.meal_name}\n`
      printData += `  ${item.quantity} x $${item.meal_price.toFixed(2)} = $${item.subtotal.toFixed(2)}\n`
    })

    printData += '\x1B\x21\x30' // Bold text
    printData += `\nTotal: $${order.total_price.toFixed(2)}\n`

    printData += '\x1B\x21\x00' // Normal text
    printData += '\n\n\n\n' // Feed lines
    printData += '\x1D\x56\x41\x10' // Cut paper (partial cut)

    return printData
  }

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      <div className="w-2/5 p-4">
        <h2 className="text-2xl font-bold mb-4 ">Órdenes Activas</h2>
        <div className="grid grid-cols-2 gap-4">
          {detailedOrder.map((order) => (
            <Card
              key={order.id}
              isPressable
              className="cursor-pointer hover:bg-gray-100 h-full p-2"
              onClick={() => setSelectedOrder(order)}>
              <CardHeader className="flex items-center justify-between">
                <span>Orden #{order.order_number}</span>
                <div className="flex flex-row gap-2">
                  <Chip className={getStatusColor(order.order_status)}>
                    {order.order_status}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex items-center mb-2">
                  <FaUser className="mr-2 h-4 w-4" />
                  <span>{order.client_name || 'Sin nombre'}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaBox className="mr-2 h-4 w-4" />
                  <span>{order.items.length || 0} items</span>
                </div>
                <div className="flex items-center">
                  <FaDollarSign className="mr-2 h-4 w-4" />
                  <span>${order.total_price.toFixed(2) || 0}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto w-3/5">
        {selectedOrder ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Detalles de la Orden</h2>
            <Card className="p-5">
              <CardHeader className="flex justify-between items-center">
                <span className="font-bold text-xl ">
                  Orden #{selectedOrder.order_number}
                </span>
              </CardHeader>
              <div className="flex flex-row gap-2">
                <Chip className={getStatusColor(selectedOrder.order_status)}>
                  {selectedOrder.order_status}
                </Chip>
                {isConnected ? (
                  <Button
                    color="success"
                    variant="solid"
                    startContent={<FaPrint />}
                    onClick={printOrder}>
                    Imprimir orden
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="solid"
                    startContent={<FaSearch />}
                    onClick={searchDevices}>
                    Buscar impresora
                  </Button>
                )}
              </div>
              <CardBody>
                <div className="flex items-center mb-2">
                  <FaUser className="mr-2 h-4 w-4" />
                  <span>{selectedOrder.client_name}</span>
                </div>
                <div className="flex items-center mb-4">
                  <FaPhone className="mr-2 h-4 w-4" />
                  <span>{selectedOrder.client_phone}</span>
                </div>
                <SimpleTableComponent columns={columns} rows={rows} />
                <div className="mt-4 text-right">
                  <span className="font-bold">
                    Total: ${selectedOrder.total_price.toFixed(2)}
                  </span>
                </div>
              </CardBody>
              <CardFooter className="flex justify-between">
                <div className="space-x-2">
                  {selectedOrder.order_status.toLowerCase() === 'pendiente' && (
                    <Button
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, 'preparando')
                      }>
                      Iniciar Preparación
                    </Button>
                  )}
                  {selectedOrder.order_status.toLowerCase() ===
                    'preparando' && (
                    <Button
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, 'lista')
                      }>
                      Marcar como Lista
                    </Button>
                  )}
                  {selectedOrder.order_status.toLowerCase() === 'lista' && (
                    <Button
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, 'terminada')
                      }>
                      Completar Orden
                    </Button>
                  )}
                </div>
                <div>
                  <span className="font-bold mr-2">Método de Pago:</span>
                  <span>{selectedOrder.payments[0]?.payment_method}</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Selecciona una orden para ver los detalles
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Dispositivos Bluetooth disponibles</ModalHeader>
          <ModalBody>
            {availableDevices.length > 0 ? (
              availableDevices.map((device) => (
                <Button
                  key={device.address}
                  onClick={() => connectToPrinter(device)}
                  className="w-full mb-2 h-[60px] flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      {device.name}
                    </span>{' '}
                    <span className="text-sm text-gray-500">
                      {device.address}
                    </span>{' '}
                  </div>
                </Button>
              ))
            ) : (
              <p>Buscando dispositivos...</p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default OrdersComponent
