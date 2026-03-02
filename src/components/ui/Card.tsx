import { HTMLAttributes, ReactNode } from 'react'

type Decoration = 'circle' | 'square' | 'triangle' | 'none'
const decorationColors = {
  red: 'bg-primary-red',
  blue: 'bg-primary-blue',
  yellow: 'bg-primary-yellow',
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  decoration?: Decoration
  decorationColor?: keyof typeof decorationColors
  className?: string
}

export const Card = ({
  children,
  decoration = 'none',
  decorationColor = 'red',
  className = '',
  ...props
}: CardProps) => {
  return (
    <div
      className={`relative bg-white border-2 sm:border-4 border-foreground shadow-bauhaus-lg transition-transform duration-200 ease-out hover:-translate-y-1 ${className}`}
      {...props}
    >
      {decoration !== 'none' && (
        <div className="absolute top-2 right-2 w-2 h-2 sm:w-3 sm:h-3">
          {decoration === 'circle' && (
            <div
              className={`rounded-full ${decorationColors[decorationColor]} border border-foreground`}
              style={{ width: '100%', height: '100%' }}
            />
          )}
          {decoration === 'square' && (
            <div
              className={`rounded-none ${decorationColors[decorationColor]} border border-foreground`}
              style={{ width: '100%', height: '100%' }}
            />
          )}
          {decoration === 'triangle' && (
            <div
              className={`w-full h-full ${decorationColors[decorationColor]} border border-foreground`}
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            />
          )}
        </div>
      )}
      {children}
    </div>
  )
}
