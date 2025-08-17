'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon: Icon,
  iconPosition = 'right',
  className = '',
  ...props
}, ref) => {
  const hasError = !!error
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
        )}
        
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${hasError 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-secondary-300'
            }
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
        
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input