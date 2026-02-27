'use client'

import { useEffect } from 'react'

export const themes = {
  emerald: {
    primary: '#059669',
    light: '#10b981',
    bg: '#ecfdf5',
    dark_primary: '#10b981',
    dark_light: '#34d399',
    dark_bg: 'rgba(16, 185, 129, 0.1)'
  },
  blue: {
    primary: '#2563eb',
    light: '#3b82f6',
    bg: '#eff6ff',
    dark_primary: '#3b82f6',
    dark_light: '#60a5fa',
    dark_bg: 'rgba(59, 130, 246, 0.1)'
  },
  violet: {
    primary: '#7c3aed',
    light: '#8b5cf6',
    bg: '#f5f3ff',
    dark_primary: '#8b5cf6',
    dark_light: '#a78bfa',
    dark_bg: 'rgba(139, 92, 246, 0.1)'
  },
  amber: {
    primary: '#d97706',
    light: '#f59e0b',
    bg: '#fffbeb',
    dark_primary: '#f59e0b',
    dark_light: '#fbbf24',
    dark_bg: 'rgba(245, 158, 11, 0.1)'
  },
  rose: {
    primary: '#e11d48',
    light: '#f43f5e',
    bg: '#fff1f2',
    dark_primary: '#f43f5e',
    dark_light: '#fb7185',
    dark_bg: 'rgba(244, 63, 94, 0.1)'
  }
}

export default function ThemeColorManager() {
  const applyTheme = () => {
    // Forzamos la lectura fresca del localStorage
    const savedTheme = localStorage.getItem('finmapp-theme-color') || 'emerald'
    const theme = themes[savedTheme as keyof typeof themes] || themes.emerald
    const root = document.documentElement
    
    const isDark = root.classList.contains('dark')

    if (isDark) {
      root.style.setProperty('--primary-color', theme.dark_primary, 'important')
      root.style.setProperty('--primary-color-light', theme.dark_light, 'important')
      root.style.setProperty('--primary-color-bg', theme.dark_bg, 'important')
    } else {
      root.style.setProperty('--primary-color', theme.primary, 'important')
      root.style.setProperty('--primary-color-light', theme.light, 'important')
      root.style.setProperty('--primary-color-bg', theme.bg, 'important')
    }

    console.log('PWA: Tema aplicado:', savedTheme)
  }

  useEffect(() => {
    applyTheme()

    // Escuchar cambios de otros componentes (ColorThemePicker)
    window.addEventListener('theme-color-changed', applyTheme)
    
    // Observar cambios en el modo oscuro (clase .dark)
    const observer = new MutationObserver(applyTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      window.removeEventListener('theme-color-changed', applyTheme)
      observer.disconnect()
    }
  }, [])

  return null
}
