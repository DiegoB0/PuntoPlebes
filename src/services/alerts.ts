import Swal, { SweetAlertResult, type SweetAlertIcon } from 'sweetalert2'

interface ToastAlertInfo {
  title: string
  icon?: SweetAlertIcon
  timer?: number
  text?: string
  showConfirmButton?: boolean
  showCancelButton?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
}

export const toastAlert = ({
  title,
  icon = 'success',
  timer = 1500
}: {
  title: string
  icon?: SweetAlertIcon
  timer?: number
}): Promise<SweetAlertResult> => {
  return Swal.fire({
    position: 'top-end',
    title,
    icon,
    toast: true,
    showConfirmButton: false,
    timer
  })
}

interface ConfirmationAlertProps {
  title?: string
  text?: string
  onConfirm: () => void
  confirmationButtonText?: string
  cancelButtonText?: string
  confirmButtonColor?: string
}

export const confirmationAlert = async ({
  title = '¿Estás seguro de eliminar?',
  text = '¡Esta acción no se podrá revertir!',
  onConfirm,
  onCancel,
  confirmButtonText = 'Sí, eliminar',
  cancelButtonText = 'Cancelar',
  confirmButtonColor = '#d33'
}: {
  title?: string
  text?: string
  onConfirm: () => void
  onCancel?: () => void
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonColor?: string
}): Promise<void> => {
  const confirmResult = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonText,
    confirmButtonText
  })

  if (confirmResult.isConfirmed) {
    onConfirm()
  } else if (confirmResult.dismiss === Swal.DismissReason.cancel && onCancel) {
    onCancel()
  }
}
