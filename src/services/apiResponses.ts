import { toastAlert } from './alerts'

export const handleApiError = (err: any, defaultMessage: string) => {
  const messager = err.response?.data.message || err.message || defaultMessage
  toastAlert({
    title: ` ${messager}`,
    icon: 'error',
    timer: 3300
  })
  console.error('Error:', err.response?.data)
}
