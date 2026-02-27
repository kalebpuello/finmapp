export const formatCurrency = (amount: number, currency: string = 'COP') => {
  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  if (currency === 'USD') {
    return `$${formatted}USD`
  }

  return `$${formatted}`
}
