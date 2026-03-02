import { ButtonHTMLAttributes, ReactNode } from 'react'

const variantStyles: Record<string, string> = {
  primary:
    'bg-primary-red text-white border-2 border-foreground shadow-bauhaus hover:bg-primary-red/90',
  secondary:
    'bg-primary-blue text-white border-2 border-foreground shadow-bauhaus hover:bg-primary-blue/90',
  yellow:
    'bg-primary-yellow text-foreground border-2 border-foreground shadow-bauhaus hover:bg-primary-yellow/90',
  outline:
    'bg-white text-foreground border-2 border-foreground shadow-bauhaus hover:bg-muted',
  ghost: 'border-none text-foreground hover:bg-muted',
  danger:
    'bg-primary-red text-white border-2 border-foreground shadow-bauhaus hover:bg-primary-red/90',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

const shapeStyles: Record<string, string> = {
  square: 'rounded-none',
  pill: 'rounded-full',
}

const baseStyles =
  'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:pointer-events-none disabled:active:translate-0'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
  shape?: keyof typeof shapeStyles
  children: ReactNode
  className?: string
}
export const Button = ({
  variant = 'primary',
  size = 'md',
  shape = 'square',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${shapeStyles[shape]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
