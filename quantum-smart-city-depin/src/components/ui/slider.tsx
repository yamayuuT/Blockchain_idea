// src/components/ui/slider.tsx

import React, { FC } from 'react'

interface SliderProps {
  min: number
  max: number
  step: number
  value: number[]
  onValueChange: (value: number[]) => void
  className?: string
}

export const Slider: FC<SliderProps> = ({ min, max, step, value, onValueChange, className = '' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = [parseFloat(e.target.value)]
    onValueChange(newValue)
  }

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={handleChange}
      className={`slider ${className}`}
    />
  )
}
