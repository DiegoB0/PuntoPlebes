import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react'
import { FaTrash } from 'react-icons/fa'
import { IoIosWarning } from 'react-icons/io'

const ModalDelete = ({
  destroyFunction
}: {
  destroyFunction: () => unknown
}): JSX.Element => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  return (
    <>
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
                    ¿Deseas eliminar este registro?
                  </p>
                  <IoIosWarning className="text-red-500 text-[250px] text-center" />
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-center items-center w-full gap-3">
                  <Button color="primary" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    color="danger"
                    onPress={() => {
                      onClose()
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
      <button onClick={onOpen}>
        <span className="text-danger text-xl">
          <FaTrash />
        </span>
      </button>
    </>
  )
}

export default ModalDelete
