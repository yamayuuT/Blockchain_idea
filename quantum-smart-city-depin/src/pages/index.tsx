// src/pages/index.tsx

import React from 'react'
import dynamic from 'next/dynamic'

// QuantumSmartCityDePIN コンポーネントを動的にインポートし、SSRを無効にする
const QuantumSmartCityDePIN = dynamic(
  () => import('@/components/ui/QuantumSmartCityDePIN'),
  { ssr: false }
)

const Home: React.FC = () => {
  return (
    <QuantumSmartCityDePIN />
  )
}

export default Home
