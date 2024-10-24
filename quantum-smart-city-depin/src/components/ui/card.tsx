// src/components/ui/card.tsx

import React, { FC, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export const Card: FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-gray-800 rounded-lg shadow p-4 ${className}`}>
    {children}
  </div>
)

export const CardHeader: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
)

export const CardTitle: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`text-xl font-semibold ${className}`}>
    {children}
  </h2>
)

export const CardDescription: FC<{ children: ReactNode }> = ({ children }) => (
  <p className="text-sm text-gray-400">
    {children}
  </p>
)

export const CardContent: FC<{ children: ReactNode }> = ({ children }) => (
  <div>
    {children}
  </div>
)
