'use client'

import { X, Mail, FileText, CalendarDays, Code2, Target, ShieldQuestion, Bug, User, Clock, Heart, Coffee, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { translations, Language } from '@/lib/utils/translations'

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
  language?: Language
}

const SupportModal = ({ isOpen, onClose, language = 'es' }: SupportModalProps) => {
  const [copiedType, setCopiedType] = useState<string | null>(null)

  if (!isOpen) return null

  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "finmappsoporte@gmail.com"
  const paypalUrl = process.env.NEXT_PUBLIC_PAYPAL_URL || "#"
  const brebKey = process.env.NEXT_PUBLIC_BREB_KEY || "@KFP595"
  const joinFormUrl = process.env.NEXT_PUBLIC_JOIN_FORM_URL || "#"

  const t = translations[language].support

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-xl rounded-[2.5rem] p-0 shadow-2xl animate-in zoom-in duration-300 text-gray-900 dark:text-white max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-500">
            <ShieldQuestion size={28} />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">{t.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-8 space-y-12 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30 dark:bg-transparent">
          <section className="space-y-6 bg-amber-50/30 dark:bg-amber-500/5 p-8 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/20 text-center">
            <div className="bg-white dark:bg-amber-900/20 w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-amber-600">
              <Bug size={24} />
            </div>
            <h3 className="text-lg font-black text-amber-900 dark:text-amber-500 uppercase tracking-tighter mb-2">{t.bug_title}</h3>
            <p className="text-xs text-amber-900/70 dark:text-amber-400/70 leading-relaxed mb-8 max-w-xs mx-auto font-medium">{t.bug_desc}</p>
            <div className="flex gap-2">
              <a href={`mailto:${supportEmail}?subject=Reporte de Error - Finmapp`} className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-amber-600/20">
                <Mail size={18} /> {t.contact_btn}
              </a>
              <button onClick={() => copyToClipboard(supportEmail, 'email')} className="p-4 bg-white dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-600 hover:bg-amber-100 transition-colors relative" title="Copiar Correo">
                {copiedType === 'email' ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </section>

          <section className="space-y-6 bg-white dark:bg-gray-800/40 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-emerald-600" />
              <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">{t.credits}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                <div className="p-2 bg-emerald-600 rounded-xl h-fit text-white"><User size={20} /></div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.developer}</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white uppercase leading-tight">Kaleb Fuentes Puello</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-xl h-fit"><CalendarDays size={20} className="text-gray-500" /></div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.launch}</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Febrero 2026</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-3 text-gray-400">
                <Code2 size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.tech}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                {language === 'es' ? 'Construido con un stack de alto rendimiento: Next.js 14, Tailwind CSS v4 y Supabase para una gestión de datos segura y escalable.' : 'Built with a high-performance stack: Next.js 14, Tailwind CSS v4 and Supabase for secure and scalable data management.'}
              </p>
            </div>
          </section>

          <section className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden text-center">
            <Heart size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2 relative z-10">{language === 'es' ? 'Apoyar el Proyecto' : 'Support the Project'}</h3>
            <div className="grid grid-cols-1 gap-4 relative z-10">
              <a href={paypalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 py-4 bg-white text-emerald-600 rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform shadow-lg">
                <Coffee size={20} /> {language === 'es' ? 'DONAR CON PAYPAL' : 'DONATE WITH PAYPAL'}
              </a>
              <div className="flex flex-col gap-2 text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{language === 'es' ? 'Transferencia Directa (Colombia)' : 'Direct Transfer (Colombia)'}</p>
                <div className="flex items-center justify-between bg-emerald-700/50 backdrop-blur-sm p-2 pl-6 rounded-2xl border border-white/20">
                  <span className="text-xs font-black uppercase tracking-widest opacity-60">Bre-B:</span>
                  <span className="text-sm font-black tracking-tight">{brebKey}</span>
                  <button onClick={() => copyToClipboard(brebKey, 'breb')} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                    {copiedType === 'breb' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-emerald-100/70 font-medium italic mt-1">
                  {language === 'es' ? '* Puedes usar esta llave en Bancolombia, Nequi, Daviplata o tu banco de preferencia.' : '* Use this key in Bancolombia, Nequi, Daviplata, or your preferred bank.'}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-100 dark:bg-gray-800/40 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 text-center">
            <div className="bg-white dark:bg-gray-800 w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Code2 size={24} />
            </div>
            <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">{language === 'es' ? '🚀 Únete a la Causa' : '🚀 Join the Cause'}</h4>
            <div className="flex gap-2">
              <a href={joinFormUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-900 dark:bg-emerald-600 hover:bg-black dark:hover:bg-emerald-500 text-white rounded-2xl font-black text-sm transition-all active:scale-95 shadow-xl shadow-black/10">
                <ExternalLink size={18} /> {language === 'es' ? 'ENVIAR INTERÉS' : 'SEND INTEREST'}
              </a>
              <button onClick={() => copyToClipboard(joinFormUrl, 'form')} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500 hover:text-emerald-600 transition-colors" title="Copiar Enlace del Formulario">
                {copiedType === 'form' ? <Check size={20} className="text-emerald-600" /> : <Copy size={20} />}
              </button>
            </div>
          </section>

          <div className="pt-4 pb-8 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">© 2026 Finmapp - Software Propietario</p>
          </div>
        </div>
      </div>
    </div>
  )
}

SupportModal.displayName = 'SupportModal'
export default SupportModal
