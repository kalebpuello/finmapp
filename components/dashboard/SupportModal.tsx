'use client'

import { X, Mail, FileText, CalendarDays, Code2, Target, ShieldQuestion, Bug, User, Clock } from 'lucide-react'
import { translations, Language } from '@/lib/utils/translations'

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
  language?: Language
}

export default function SupportModal({ isOpen, onClose, language = 'es' }: SupportModalProps) {
  if (!isOpen) return null

  const supportEmail = "finmappsoporte@gmail.com"
  const t = translations[language].support

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col mx-auto my-auto">
        
        {/* Header sticky */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-white dark:bg-gray-900 z-20 pb-4 border-b border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-500">
            <ShieldQuestion size={24} />
            <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">{t.title}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-10 flex-1">
          {/* Reporte de Errores - DISEÑO LLAMATIVO AMARILLO */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-amber-100 dark:bg-amber-500/20 p-2 rounded-xl text-amber-600">
                <Bug size={18} />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-amber-600 dark:text-amber-500">{t.bug_title}</h3>
            </div>
            <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl text-center">
              <p className="text-sm text-amber-900 dark:text-amber-400 font-bold mb-6 leading-relaxed">
                {t.bug_desc}
              </p>
              <div className="space-y-4">
                <a 
                  href={`mailto:${supportEmail}?subject=Reporte de Error - Finmapp`} 
                  className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  <Mail size={18} /> {t.contact_btn}
                </a>
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white/50 dark:bg-black/20 py-2 px-4 rounded-xl inline-block border border-amber-100 dark:border-amber-900/30">
                    <p className="text-[11px] font-black text-amber-700 dark:text-amber-300 uppercase tracking-widest">
                      {supportEmail}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                    <Clock size={12} strokeWidth={3} />
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      {t.response_time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Información del Creador y Software */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-100 dark:bg-emerald-500/10 p-2 rounded-xl text-emerald-600">
                <FileText size={18} />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">{t.credits}</h3>
            </div>

            {/* CREADOR */}
            <div className="flex gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
              <div className="p-3 bg-emerald-600 rounded-xl h-fit flex-shrink-0 text-white shadow-lg shadow-emerald-500/30">
                <User size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{t.developer}</p>
                <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">Kaleb Fuentes Puello</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 font-black uppercase tracking-widest mt-0.5">Software Developer</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg h-fit flex-shrink-0"><CalendarDays size={18} className="text-gray-400" /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{t.launch}</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {language === 'es' ? 'Febrero de 2026' : 'February 2026'}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg h-fit flex-shrink-0"><Code2 size={18} className="text-gray-400" /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{t.tech}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {language === 'es' 
                    ? 'Construido con Next.js 14, Tailwind CSS v4 y Supabase para una experiencia premium.' 
                    : 'Built with Next.js 14, Tailwind CSS v4 and Supabase for a premium experience.'}
                </p>
              </div>
            </div>

            {/* PROPÓSITO */}
            <div className="flex gap-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg h-fit flex-shrink-0 text-emerald-600"><Target size={18} /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{t.purpose}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {t.purpose_desc}
                </p>
              </div>
            </div>
          </section>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
              © 2026 Finmapp - Software Propietario
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
