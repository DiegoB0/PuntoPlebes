import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Input,
  Button
} from '@nextui-org/react'
import { Controller, useForm } from 'react-hook-form'
import { ClientData, CreateOrderDto } from '@/types/order'

interface OrderRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateOrderDto) => void
  clientInfo: Partial<ClientData>
  errors: any
  isDismissable?: boolean
}

export default function OrderRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  clientInfo,
  errors,
  isDismissable = true
}: OrderRegistrationModalProps) {
  const { control, handleSubmit } = useForm<CreateOrderDto>({
    defaultValues: {
      client_name: clientInfo?.name ?? '',
      client_phone: clientInfo?.phone ?? ''
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
              name="client_name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  variant="bordered"
                  label="Nombre del cliente"
                  placeholder="Ingrese el nombre del cliente"
                  errorMessage={errors.client_name?.message}
                />
              )}
            />
            <Controller
              name="client_phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  variant="bordered"
                  label="Teléfono"
                  placeholder="Ingrese el número de teléfono"
                  errorMessage={errors.client_phone?.message}
                />
              )}
            />
            <ModalFooter>
              <Button variant="ghost" onPress={onClose}>
                Cancelar
              </Button>
              <Button type="submit" color="success">
                Confirmar
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
