export const currencyFormat = (amount = 0): string => {
  const amountFormat = parseFloat(amount.toString().replace(/,/g, ''))

  const formatMXN = amountFormat.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return formatMXN
}
