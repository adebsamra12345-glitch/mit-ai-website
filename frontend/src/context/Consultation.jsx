import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import ConsultationModal from '../components/ConsultationModal.jsx'

const ConsultationContext = createContext({ open: () => {} })

/** Provides `useConsultation().open()` to any CTA button and renders the modal once. */
export function ConsultationProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const value = useMemo(() => ({ open }), [open])

  return (
    <ConsultationContext.Provider value={value}>
      {children}
      <ConsultationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </ConsultationContext.Provider>
  )
}

export const useConsultation = () => useContext(ConsultationContext)
