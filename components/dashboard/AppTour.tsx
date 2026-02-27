'use client'

import { useEffect, useState } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { HelpCircle } from 'lucide-react'

export default function AppTour() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const hasSeenTour = localStorage.getItem('finmapp_tour_seen')
    if (!hasSeenTour) {
      setTimeout(() => startTour(), 1000)
    }
  }, [])

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      stagePadding: 10,
      stageRadius: 20,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Entendido',
      steps: [
        { 
          element: '#tour-balance', 
          popover: { 
            title: '💰 Tu Saldo Total', 
            description: 'Aquí verás cuánto dinero tienes disponible en total. ¡Este saldo te acompaña mes a mes!',
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-add-btn', 
          popover: { 
            title: '➕ Registrar Movimiento', 
            description: 'Este es el botón más importante. Úsalo para registrar cada ingreso o gasto que realices en el día.',
            side: "bottom", 
            align: 'center' 
          } 
        },
        { 
          element: '#tour-stats', 
          popover: { 
            title: '📊 Flujo del Mes', 
            description: 'Aquí ves cuánto ha entrado y salido de tu bolsillo específicamente en este mes actual.',
            side: "top", 
            align: 'center' 
          } 
        },
        { 
          element: '#tour-recent', 
          popover: { 
            title: '🕒 Actividad Reciente', 
            description: 'Tus últimos 5 movimientos aparecen aquí. Puedes ver el historial completo dándole clic al enlace azul.',
            side: "top", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-budgets', 
          popover: { 
            title: '🎯 Presupuestos', 
            description: 'En esta sección puedes planear cuánto quieres gastar en comida, transporte, etc., y ver si te estás pasando.',
            side: "left", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-goals', 
          popover: { 
            title: '🏆 Metas de Ahorro', 
            description: '¡No olvides tus sueños! Aquí verás el progreso de tus ahorros para viajes, compras o fondos de emergencia.',
            side: "left", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-theme', 
          popover: { 
            title: '🌓 Personalización', 
            description: 'Cambia entre modo claro y oscuro según tu preferencia para mayor comodidad visual.',
            side: "bottom", 
            align: 'end' 
          } 
        },
        { 
          element: '#tour-profile', 
          popover: { 
            title: '👤 Tu Perfil', 
            description: 'Configura tu nombre, contraseña y preferencias internacionales como moneda e idioma desde aquí.',
            side: "bottom", 
            align: 'end' 
          } 
        }
      ]
    })

    driverObj.drive()
    localStorage.setItem('finmapp_tour_seen', 'true')
  }

  if (!mounted) return null

  return (
    <button
      onClick={startTour}
      className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-emerald-600 dark:text-emerald-500"
      title="Guía de uso"
    >
      <HelpCircle size={20} />
    </button>
  )
}
