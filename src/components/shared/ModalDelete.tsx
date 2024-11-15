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
  onOpenChange,
  destroyFunction
}: {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  destroyFunction: () => unknown
}): JSX.Element => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <div className="flex flex-col justify-center items-center py-6">
                <p className="text-2xl text-center">
                  ¿Está seguro de eliminar?
                </p>
                <IoIosWarning className="text-red-500 text-center text-6xl" />
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex justify-center items-center w-full gap-3">
                <Button variant="light" onPress={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onOpenChange(false)
                    destroyFunction()
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
