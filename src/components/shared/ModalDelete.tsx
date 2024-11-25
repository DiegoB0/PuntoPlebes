import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter
} from '@nextui-org/react'
import { IoIosWarning } from 'react-icons/io'

const ModalDelete = ({
  isOpen,
  destroyFunction,
  onClose,
  count
}: {
  isOpen: boolean
  destroyFunction: () => void
  onClose: () => void
  count: number
}): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md" backdrop="blur">
      <ModalContent>
        {(close) => (
          <>
            <ModalBody>
              <div className="flex flex-col justify-center items-center py-6">
                <p className="text-2xl text-center">
                  ¿Deseas eliminar {count} registro(s)?
                </p>
                <IoIosWarning className="text-red-500 text-4xl text-center" />
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex justify-center items-center w-full gap-3">
                <Button variant="bordered" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    destroyFunction() // Confirm deletion
                    onClose() // Close modal
                  }}>
                  Eliminar
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalDelete
