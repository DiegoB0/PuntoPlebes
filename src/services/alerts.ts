import Swal, { type SweetAlertIcon } from 'sweetalert2'

interface ToastAlertInfo {
  title: string
  icon?: SweetAlertIcon
  timer?: number
}

export const toastAlert = ({
  title,
  icon = 'success',
  timer = 1500
}: ToastAlertInfo): void => {
  void Swal.fire({
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
}

export const confirmationAlert = async ({
  title = '¿Estás seguro de eliminar?',
  text = '¡Esta acción no se podrá revertir!',
  onConfirm
}: ConfirmationAlertProps): Promise<void> => {
  const confirmResult = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sí, eliminar'
  })

  if (confirmResult.isConfirmed) {
    onConfirm()
  }
}
