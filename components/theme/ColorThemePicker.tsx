'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { themes } from '@/components/theme/ThemeColorManager'
import { Check, Palette } from 'lucide-react'

export interface ColorThemePickerRef {
  save: () => void
}

const ColorThemePicker = forwardRef<ColorThemePickerRef>((_, ref) => {
  const [activeTheme, setActiveTheme] = useState('emerald')

  useEffect(() => {
    const saved = localStorage.getItem('finmapp-theme-color') || 'emerald'
    setActiveTheme(saved)

    // Al salir de la página, nos aseguramos de que el tema sea el guardado
    return () => {
      window.dispatchEvent(new Event('theme-color-changed'))
    }
  }, [])

  // Esta función solo cambia la PREVISUALIZACIÓN, no guarda en localStorage
  const previewTheme = (themeName: string) => {
    setActiveTheme(themeName)
    
    // Aplicar cambios temporales al DOM para que el usuario vea cómo queda
    const theme = themes[themeName as keyof typeof themes]
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
  }

  // Esta función es la que realmente persiste el cambio
  useImperativeHandle(ref, () => ({
    save: () => {
      localStorage.setItem('finmapp-theme-color', activeTheme)
      window.dispatchEvent(new Event('theme-color-changed'))
      console.log('PWA: Tema guardado permanentemente:', activeTheme)
    }
  }))

  const themeOptions = [
    { id: 'emerald', name: 'Esmeralda', color: '#10b981' },
    { id: 'blue', name: 'Océano', color: '#3b82f6' },
    { id: 'violet', name: 'Amatista', color: '#8b5cf6' },
    { id: 'amber', name: 'Sol', color: '#f59e0b' },
    { id: 'rose', name: 'Cereza', color: '#f43f5e' },
  ]

  return (
    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Palette size={16} className="text-gray-400" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personalización de App</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {themeOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => previewTheme(option.id)}
            className={`group relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${
              activeTheme === option.id 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
                : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            <div 
              className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: option.color }}
            >
              {activeTheme === option.id && <Check size={16} className="text-white" strokeWidth={4} />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${
              activeTheme === option.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'
            }`}>
              {option.name}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-gray-400 italic">
        * Selecciona un color para previsualizar. Haz clic en "Guardar todos los cambios" para confirmar.
      </p>
    </div>
  )
})

ColorThemePicker.displayName = 'ColorThemePicker'

export default ColorThemePicker
