import { currencyFormat } from '@/helpers/formatCurrency'
import { CreateOrderDto, Order } from '@/types/order'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Input,
  Button,
  Select,
  SelectItem
} from '@nextui-org/react'
import { Controller, useForm } from 'react-hook-form'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateOrderDto) => void
  errors: any
  total: number
  order?: Order // ✅ Optional order prop for payments on existing orders
  isDismissable?: boolean
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSubmit,
  errors,
  total,
  order, // ✅ Now supports an existing order
  isDismissable = false
}: PaymentModalProps) {
  const { control, handleSubmit, setValue } = useForm<CreateOrderDto>({
    defaultValues: {
      payments: [
        {
          payment_method: order?.payments?.[0]?.payment_method || '',
          amount_given: order?.payments?.[0]?.amount_given || 0
        }
      ]
    }
  })

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={isDismissable}>
      <ModalContent className="flex justify-center items-center p-1">
        <ModalBody className="gap-2 w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-3 py-3 px-2">
            <Controller
              name="payments.0.payment_method"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  variant="bordered"
                  label="Método de pago"
                  placeholder="Seleccione el método de pago"
                  errorMessage={errors.payments?.[0]?.payment_method?.message}
                  isInvalid={errors.payments?.[0]?.payment_method}>
                  <SelectItem key="efectivo" value="efectivo">
                    Efectivo
                  </SelectItem>
                  <SelectItem key="tarjeta" value="tarjeta">
                    Tarjeta
                  </SelectItem>
                  <SelectItem key="transferencia" value="transferencia">
                    Transferencia
                  </SelectItem>
                </Select>
              )}
            />

            <Controller
              name="payments.0.amount_given"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  variant="bordered"
                  label="Cantidad recibida"
                  isInvalid={errors.payments?.[0]?.amount_given}
                  placeholder="Ingrese la cantidad recibida"
                  errorMessage={errors.payments?.[0]?.amount_given?.message}
                  value={String(field.value)}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />

            <div className="text-small text-default-500">
              Total a pagar: {currencyFormat(total)}
            </div>

            <ModalFooter>
              <Button variant="ghost" onPress={onClose}>
                Cancelar
              </Button>
              <Button type="submit" color="success">
                Confirmar Pago
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
