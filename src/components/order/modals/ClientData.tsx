import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Input,
  Button
} from '@nextui-org/react'
import { Controller, useForm } from 'react-hook-form'
import { ClientData } from '@/types/order'

interface ClientDataModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (clientData: ClientData) => void
  clientInfo: Partial<ClientData>
  errors: any
  isDismissable?: boolean
}

export default function ClientDataModal({
  isOpen,
  onClose,
  onSubmit,
  clientInfo,
  errors,
  isDismissable = false // ❌ Prevents closing without valid client name
}: ClientDataModalProps) {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { isValid }
  } = useForm<ClientData>({
    defaultValues: {
      client_name: clientInfo?.client_name ?? '',
      client_phone: clientInfo?.client_phone ?? ''
    },
    mode: 'onChange' // ✅ Validate on every change
  })

  const handleFormSubmit = async (data: ClientData) => {
    // ✅ Ensure the client name is valid before closing
    const isValid = await trigger('client_name')
    if (!isValid) return

    onSubmit(data)
    onClose() // ✅ Close only if client name is valid
  }

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={isDismissable ? onClose : undefined}
      isDismissable={isDismissable}>
      <ModalContent className="flex justify-center items-center p-1">
        <ModalBody className="gap-2 w-full">
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
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
                  isRequired
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
                />
              )}
            />
            <ModalFooter>
              {isDismissable && (
                <Button variant="ghost" onPress={onClose}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" color="success" isDisabled={!isValid}>
                Confirmar
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
