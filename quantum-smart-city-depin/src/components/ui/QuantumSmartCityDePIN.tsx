// src/components/ui/QuantumSmartCityDePIN.tsx
import React, { useRef, useState, useEffect, useCallback, FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  LineChart,
  Line as ReLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Line as DreiLine } from '@react-three/drei';
import * as THREE from 'three'
import { BatchedMesh } from 'three';


// カラーパレットの定義
const COLORS = {
  quantum: '#1E90FF',
  depin: '#FF4500',
  energy: '#32CD32',
  traffic: '#FFD700',
  safety: '#8A2BE2',
  background: '#121212',
  cardBackground: '#1E1E1E',
  text: '#FFFFFF',
  tooltipBg: '#333333',
  tooltipText: '#FFFFFF',
}

// TypeScriptインターフェースの定義
interface SimulationData {
  step: number;
  '平均エネルギー効率': number;
  'DePIN取引量': number;
  '最適化スコア': number;
}

interface QuantumBitProps {
  position: [number, number, number];
  state: boolean;
}

interface DePINNodeProps {
  position: [number, number, number];
  active: boolean;
  transactionVolume: number;
}

interface BuildingProps {
  position: [number, number, number];
  height: number;
  color: string;
  energyEfficiency: number;
}

interface EnergyFlowProps {
  start: [number, number, number];
  end: [number, number, number];
  progress: number;
}

interface OptimizationFieldProps {
  position: [number, number, number];
  scale: number;
  optimizationScore: number;
}

interface CityProps {
  quantumState: boolean[];
  depinState: boolean[];
  energyFlow: number;
  optimizationScore: number;
  buildingEfficiencies: number[];
  depinTransactions: number[];
}

// 量子ビットを表現するコンポーネント
const QuantumBit: FC<QuantumBitProps> = React.memo(({ position, state }) => {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01
      mesh.current.rotation.y += 0.01
    }
  })

  return (
    <Sphere ref={mesh} position={position} args={[0.5, 32, 32]}>
      <meshStandardMaterial color={state ? COLORS.quantum : 'gray'} />
    </Sphere>
  )
})

// DePINノードを表現するコンポーネント
const DePINNode: FC<DePINNodeProps> = React.memo(({ position, active, transactionVolume }) => (
  <Box position={position} args={[0.5, 0.5 + transactionVolume * 0.5, 0.5]}>
    <meshStandardMaterial color={active ? COLORS.depin : 'gray'} />
  </Box>
))

// 建物を表現するコンポーネント
const Building: FC<BuildingProps> = React.memo(({ position, height, color, energyEfficiency }) => (
  <Box position={[position[0], height / 2, position[2]]} args={[1, height, 1]}>
    <meshStandardMaterial color={color} opacity={0.5 + energyEfficiency * 0.5} transparent />
  </Box>
))

// エネルギーフローを表現するコンポーネント
const EnergyFlow: FC<EnergyFlowProps> = React.memo(({ start, end, progress }) => {
  const points = [start, end]  // 配列の配列として定義
  return (
    <DreiLine
      points={points}
      color={COLORS.energy}
      lineWidth={3}
      dashed={true}
      dashScale={50}
      dashSize={0.5}
      dashOffset={-progress}
    />
  )
})


// 最適化フィールドを表現するコンポーネント
const OptimizationField: FC<OptimizationFieldProps> = React.memo(({ position, scale, optimizationScore }) => {
  const points: [number, number, number][] = []
  const segments = 20
  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= segments; j++) {
      const x = (i / segments - 0.5) * scale
      const z = (j / segments - 0.5) * scale
      const y = Math.sin(x * Math.PI * 2 + z * Math.PI * 2 + optimizationScore * Math.PI * 2) * 0.5
      points.push([x, y, z])  // 配列として追加
    }
  }
  return (
    <group position={position}>
      <DreiLine
        points={points}
        color={COLORS.quantum}
        lineWidth={1}
      />
      <Text position={[0, 1, 0]} color={COLORS.text} fontSize={0.5}>
        量子アニーリング最適化フィールド
      </Text>
    </group>
  )
})


// 3Dシティコンポーネント
const City: FC<CityProps> = React.memo(
  ({ quantumState, depinState, energyFlow, optimizationScore, buildingEfficiencies, depinTransactions }) => {
    const { camera } = useThree()
    useEffect(() => {
      camera.position.set(15, 15, 15)
      camera.lookAt(0, 0, 0)
    }, [camera])

    return (
      <>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />

        {/* 量子コンピューター */}
        <group position={[-5, 0, -5]}>
          {quantumState?.map((state, i) => (
            <QuantumBit key={i} position={[i * 1.5, 0, 0]} state={state} />
          ))}
          <Text position={[-1, 2, 0]} color={COLORS.text} fontSize={0.5}>
            量子コンピューター
          </Text>
        </group>

        {/* DePINネットワーク */}
        <group position={[5, 0, -5]}>
          {depinState?.map((active, i) => (
            <DePINNode
              key={i}
              position={[(i % 3) * 1.5, Math.floor(i / 3) * 1.5, 0]}
              active={active}
              transactionVolume={depinTransactions[i] || 0}
            />
          ))}
          <Text position={[2.25, 5, 0]} color={COLORS.text} fontSize={0.5}>
            DePINネットワーク
          </Text>
        </group>

        {/* スマートシティ */}
        <group position={[0, 0, 5]}>
          {buildingEfficiencies?.map((efficiency, i) => (
            <Building
              key={i}
              position={[(i % 3 - 1) * 2, 0, Math.floor(i / 3) * 2 - 2]}
              height={2 + efficiency * 4}
              color={i % 3 === 0 ? COLORS.energy : i % 3 === 1 ? COLORS.traffic : COLORS.safety}
              energyEfficiency={efficiency}
            />
          ))}
          <Text position={[0, 4, -3]} color={COLORS.text} fontSize={0.5}>
            スマートシティ
          </Text>
        </group>

        {/* エネルギーフロー */}
        <EnergyFlow start={[-5, 0, -5]} end={[0, 3, 5]} progress={energyFlow} />
        <EnergyFlow start={[5, 0, -5]} end={[0, 3, 5]} progress={energyFlow} />

        {/* 最適化フィールド */}
        <OptimizationField position={[0, -1, 0]} scale={10} optimizationScore={optimizationScore} />
      </>
    )
  }
)

// 2Dグラフコンポーネント
const PerformanceChart: FC<{ data: SimulationData[] }> = React.memo(({ data }) => (
  <Card className="p-4 mb-6" style={{ backgroundColor: COLORS.cardBackground }}>
    <CardTitle className="mb-4">システムパフォーマンス</CardTitle>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
        <XAxis dataKey="step" stroke={COLORS.text} />
        <YAxis stroke={COLORS.text} />
        <Tooltip
          contentStyle={{ backgroundColor: COLORS.tooltipBg, border: 'none' }}
          itemStyle={{ color: COLORS.tooltipText }}
        />
        <Legend />
        <ReLine type="monotone" dataKey="平均エネルギー効率" stroke={COLORS.energy} name="平均エネルギー効率" />
        <ReLine type="monotone" dataKey="DePIN取引量" stroke={COLORS.depin} name="DePIN取引量" />
        <ReLine type="monotone" dataKey="最適化スコア" stroke={COLORS.quantum} name="最適化スコア" />
      </LineChart>
    </ResponsiveContainer>
  </Card>
))

// Quantum Smart City DePIN コンポーネント
const QuantumSmartCityDePIN: FC = () => {
  const [quantumState, setQuantumState] = useState<boolean[]>(Array(5).fill(false))
  const [depinState, setDepinState] = useState<boolean[]>(Array(9).fill(false))
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [performanceData, setPerformanceData] = useState<SimulationData[]>([])
  const [energyFlow, setEnergyFlow] = useState<number>(0)
  const [optimizationScore, setOptimizationScore] = useState<number>(0)
  const [buildingEfficiencies, setBuildingEfficiencies] = useState<number[]>(Array(9).fill(0.5))
  const [depinTransactions, setDepinTransactions] = useState<number[]>(Array(9).fill(0))

  // シミュレーションの状態を更新
  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setQuantumState(prev => prev.map(() => Math.random() > 0.5))
      setDepinState(prev => prev.map(() => Math.random() > 0.3))
      setEnergyFlow(prev => (prev + 0.01 * simulationSpeed) % 1)
      setOptimizationScore(prev => Math.min(1, prev + Math.random() * 0.1))
      setBuildingEfficiencies(prev => prev.map(e => Math.min(1, e + (Math.random() - 0.5) * 0.1)))
      setDepinTransactions(prev => prev.map(t => Math.max(0, t + (Math.random() - 0.5) * 0.2)))
    }, 1000 / simulationSpeed)
    return () => clearInterval(interval)
  }, [isRunning, simulationSpeed])

  // パフォーマンスデータを更新
  useEffect(() => {
    if (!isRunning) return
    const newData: SimulationData = {
      step: performanceData.length + 1,
      '平均エネルギー効率': (buildingEfficiencies.reduce((sum, e) => sum + e, 0) / buildingEfficiencies.length) * 100,
      'DePIN取引量': depinTransactions.reduce((sum, t) => sum + t, 0),
      '最適化スコア': optimizationScore * 100
    }
    setPerformanceData(prev => [...prev, newData].slice(-20))  // 最新の20ポイントのみを保持
  }, [buildingEfficiencies, depinTransactions, optimizationScore, isRunning])

  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => !prev)
  }, [])

  const resetSimulation = useCallback(() => {
    setIsRunning(false)
    setQuantumState(Array(5).fill(false))
    setDepinState(Array(9).fill(false))
    setEnergyFlow(0)
    setOptimizationScore(0)
    setBuildingEfficiencies(Array(9).fill(0.5))
    setDepinTransactions(Array(9).fill(0))
    setPerformanceData([])
  }, [])

  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-text">
      {/* ヘッダーカード */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            量子スマートシティDePINシミュレーション
          </CardTitle>
          <CardDescription className="text-center">
            量子コンピューティング、DePIN、およびスマートシティの相互作用をシミュレート
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <Button onClick={toggleSimulation} variant={isRunning ? "destructive" : "default"}>
              {isRunning ? '停止' : '開始'}
            </Button>
            <div className="flex items-center gap-2">
              <span>シミュレーション速度:</span>
              <Slider
                min={0.1}
                max={5}
                step={0.1}
                value={[simulationSpeed]}
                onValueChange={([value]) => setSimulationSpeed(value)}
                className="w-32"
              />
              <span>{simulationSpeed.toFixed(1)}x</span>
            </div>
            <Button onClick={resetSimulation} variant="outline">
              リセット
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3Dシーンと2Dグラフのレイアウト */}
      <div className="flex flex-col md:flex-row flex-grow">
        {/* 3Dシーン */}
        <div className="flex-grow h-96 md:h-auto">
          <Canvas>
            <City
              quantumState={quantumState}
              depinState={depinState}
              energyFlow={energyFlow}
              optimizationScore={optimizationScore}
              buildingEfficiencies={buildingEfficiencies}
              depinTransactions={depinTransactions}
            />
          </Canvas>
        </div>
        {/* 2Dグラフ */}
        <div className="flex-grow p-4">
          <PerformanceChart data={performanceData} />
        </div>
      </div>
    </div>
  )
}

export default QuantumSmartCityDePIN
