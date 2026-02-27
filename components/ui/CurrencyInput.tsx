'use client'

import React from 'react'

interface CurrencyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export default function CurrencyInput({ 
  value, 
  onChange, 
  placeholder = "0", 
  className = "",
  autoFocus = false
}: CurrencyInputProps) {
  
  // Función para formatear mientras el usuario escribe
  const formatDisplay = (val: string) => {
    if (!val) return ''
    // Eliminar todo lo que no sea número
    const number = val.replace(/\D/g, '')
    if (!number) return ''
    // Formatear con puntos de miles
    return new Intl.NumberFormat('es-CO').format(parseInt(number))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir números en el valor real
    const rawValue = e.target.value.replace(/\D/g, '')
    onChange(rawValue)
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      value={formatDisplay(value)}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      autoFocus={autoFocus}
      required
    />
  )
}
