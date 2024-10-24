// src/components/ui/button.tsx

import React, { FC, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline'
}

export const Button: FC<ButtonProps> = ({ children, variant = 'default', className = '', ...props }) => {
  let variantClasses = ''

  switch (variant) {
    case 'destructive':
      variantClasses = 'bg-red-600 hover:bg-red-700 text-white'
      break
    case 'outline':
      variantClasses = 'border border-gray-500 text-gray-500 hover:bg-gray-700 hover:text-white'
      break
    default:
      variantClasses = 'bg-blue-600 hover:bg-blue-700 text-white'
  }

  return (
    <button
      className={`px-4 py-2 rounded ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
