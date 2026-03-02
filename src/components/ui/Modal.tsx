import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/60"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full max-w-md bg-white border-2 sm:border-4 border-foreground shadow-bauhaus-lg max-h-[90vh] overflow-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="flex items-center justify-between p-4 sm:p-5 border-b-4 border-foreground bg-white">
          <h2
            id="modal-title"
            className="font-bold text-lg sm:text-xl uppercase tracking-wider text-foreground"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 border-2 border-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </header>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  )
}
