import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure
} from '@nextui-org/react'
import { type IconType } from 'react-icons'
import { FaEdit, FaEye, FaFilePdf, FaTrash } from 'react-icons/fa'
import ModalDelete from './ModalDelete'
import { FiEdit, FiTrash } from 'react-icons/fi'

interface ActionButtonsProps {
  edit?: boolean
  pdf?: boolean
  destroy?: boolean
  eye?: boolean
  custom?: CustomTooltip
  editFunction?: () => unknown
  pdfFunction?: () => unknown
  destroyFunction?: () => unknown
  eyeFunction?: () => unknown
  deleteModal?: boolean
  modal?: ModalInterface
}

interface ModalInterface {
  title: string
  body: React.ReactNode
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | 'full'
  closeButton?: boolean
  actionButton?: boolean
  actionButtonText?: string
  functionActionbutton?: () => void
}

interface CustomTooltip {
  title: string
  color:
    | 'default'
    | 'foreground'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
  icon: IconType
  function?: () => unknown
  size?: number
}

const ActionsButtons = ({
  edit = true,
  pdf = false,
  destroy = true,
  eye = false,
  custom,
  editFunction = () => {},
  pdfFunction = () => {},
  destroyFunction = () => {},
  eyeFunction,
  deleteModal = false,
  modal
}: ActionButtonsProps): JSX.Element => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  return (
    <div className="relative flex content-center justify-center items-center gap-2">
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={modal?.size ?? 'md'}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modal?.title}
              </ModalHeader>
              <ModalBody>{modal?.body}</ModalBody>
              <ModalFooter>
                {(modal?.closeButton ?? false) && (
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                )}
                {(modal?.actionButton ?? false) && (
                  <Button color="primary" onPress={modal?.functionActionbutton}>
                    {modal?.actionButtonText}
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {eye && (
        <Tooltip
          content="Detalles"
          className="text-white"
          color="primary"
          closeDelay={20}
          delay={200}>
          <button
            onClick={() => {
              eyeFunction != null ? eyeFunction() : onOpen()
            }}>
            <span className="text-primary text-xl">
              <FaEye />
            </span>
          </button>
        </Tooltip>
      )}

      {pdf && (
        <Tooltip
          content="Generar PDF"
          className="text-white"
          color="primary"
          closeDelay={20}
          delay={200}>
          <button className="bg-transparent" onClick={pdfFunction}>
            <span className="text-primary text-xl">
              <FaFilePdf />
            </span>
          </button>
        </Tooltip>
      )}

      {edit && (
        <Tooltip
          content="Editar"
          className="text-green-500"
          closeDelay={20}
          delay={200}>
          <button className="bg-transparent" onClick={editFunction}>
            <span className="text-success text-xl">
              <FiEdit />
            </span>
          </button>
        </Tooltip>
      )}

      {custom != null && (
        <Tooltip
          content={custom.title}
          className="text-white"
          color={custom.color}
          closeDelay={20}
          delay={200}>
          <button
            onClick={() => {
              custom.function != null ? custom.function() : onOpen()
            }}>
            <span className={`text-${custom.color} text-xl`}>
              <custom.icon size={custom.size ?? 20} />
            </span>
          </button>
        </Tooltip>
      )}

      {destroy && (
        <Tooltip
          content="Eliminar"
          className="text-white"
          color="danger"
          closeDelay={20}
          delay={200}>
          {deleteModal ? (
            <ModalDelete destroyFunction={destroyFunction} />
          ) : (
            <button onClick={destroyFunction}>
              <span className="text-danger text-xl">
                <FiTrash />
              </span>
            </button>
          )}
        </Tooltip>
      )}
    </div>
  )
}

export default ActionsButtons
