// src/components/ui/QuantumSmartCityDePIN.tsx

import React, { useRef, useState, useEffect, useCallback, FC, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  LineChart,
  Line as ReLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

// カラーパレットの定義
const COLORS = {
  quantum: '#1E90FF',
  depin: '#FF4500',
  energy: '#32CD32',
  traffic: '#FFD700',
  safety: '#8A2BE2',
  background: '#1F2937',
  cardBackground: '#2D3748',
  text: '#E2E8F0',
  tooltipBg: '#4A5568',
  tooltipText: '#E2E8F0',
  blockchain: '#00BFFF',
  transaction: '#FFD700',
  success: '#48BB78',
  warning: '#F6AD55',
  info: '#4299E1',
  pieColors: ['#1E90FF', '#FF4500', '#32CD32', '#FFD700', '#8A2BE2'],
};

// TypeScriptインターフェースの定義
interface SimulationData {
  step: number;
  '平均エネルギー効率': number;
  'DePIN取引量': number;
  '最適化スコア': number;
  '交通効率': number;
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

interface BlockchainNodeProps {
  position: [number, number, number];
  label: string;
}

interface TransactionProps {
  from: [number, number, number];
  to: [number, number, number];
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

interface InfrastructureProps {
  efficiency: number;
}

interface VehicleProps {
  position: [number, number, number];
  speed: number;
}

interface CityProps {
  quantumState: boolean[];
  depinState: boolean[];
  energyFlow: number;
  optimizationScore: number;
  buildingEfficiencies: number[];
  depinTransactions: number[];
  depinConnections: { start: [number, number, number]; end: [number, number, number] }[];
  blockchainNodes: BlockchainNodeProps[];
  transactions: TransactionProps[];
  infrastructureEfficiency: number;
  trafficEfficiency: number;
}

// 量子ビットを表現するコンポーネント
const QuantumBit: FC<QuantumBitProps> = React.memo(({ position, state }) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
      mesh.current.scale.setScalar(state ? 1.2 : 1);
    }
  });

  return (
    <Sphere
      ref={mesh}
      position={position}
      args={[0.5, 32, 32]}
    >
      <meshStandardMaterial
        color={state ? COLORS.quantum : 'gray'}
        emissive={state ? COLORS.quantum : 'black'}
        emissiveIntensity={state ? 1 : 0.2}
      />
    </Sphere>
  );
});

// DePINノードを表現するコンポーネント
const DePINNode: FC<DePINNodeProps> = React.memo(({ position, active, transactionVolume }) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      mesh.current.scale.setScalar(1 + transactionVolume * 0.5);
    }
  });

  return (
    <Sphere
      ref={mesh}
      position={position}
      args={[0.5, 32, 32]}
    >
      <meshStandardMaterial
        color={active ? COLORS.depin : 'gray'}
        emissive={active ? COLORS.depin : 'black'}
        emissiveIntensity={active ? transactionVolume : 0.2}
      />
    </Sphere>
  );
});

// ブロックチェーンノードを表現するコンポーネント
const BlockchainNode: FC<BlockchainNodeProps> = React.memo(({ position, label }) => {
  return (
    <Sphere position={position} args={[0.4, 32, 32]}>
      <meshStandardMaterial color={COLORS.blockchain} emissive={COLORS.blockchain} emissiveIntensity={0.8} />
      <Html distanceFactor={10} position={[0, 1.2, 0]}>
        <div className="bg-tooltipBg p-2 rounded text-tooltipText text-sm">
          {label}
        </div>
      </Html>
    </Sphere>
  );
});

// トランザクションを表現するコンポーネント
const TransactionLine: FC<TransactionProps> = React.memo(({ from, to }) => {
  return (
    <Line
      points={[from, to]}
      color={COLORS.transaction}
      lineWidth={2}
      dashed={true}
      dashScale={1}
      dashSize={0.1}
      dashOffset={0}
    >
      <meshBasicMaterial attach="material" color={COLORS.transaction} />
      <Html distanceFactor={10} position={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + 1, (from[2] + to[2]) / 2]}>
        <div className="bg-tooltipBg p-2 rounded text-tooltipText text-sm animate-pulse">
          トランザクション
        </div>
      </Html>
    </Line>
  );
});

// 建物を表現するコンポーネント
const Building: FC<BuildingProps> = React.memo(({ position, height, color, energyEfficiency }) => (
  <Box position={[position[0], height / 2, position[2]]} args={[2, height, 2]}>
    <meshStandardMaterial color={color} opacity={0.6 + energyEfficiency * 0.4} transparent />
  </Box>
));

// エネルギーフローを表現するコンポーネント
const EnergyFlow: FC<EnergyFlowProps> = React.memo(({ start, end, progress }) => {
  const points: [number, number, number][] = [start, end];

  // ポイント配列の検証
  if (!points || points.length < 2) {
    console.error('EnergyFlow: Invalid points array', points);
    return null;
  }

  return (
    <Line
      points={points}
      color={COLORS.energy}
      lineWidth={3}
      dashed={true}
      dashScale={50}
      dashSize={0.5}
      dashOffset={-progress}
    />
  );
});

// 最適化フィールドを表現するコンポーネント
const OptimizationField: FC<OptimizationFieldProps> = React.memo(({ position, scale, optimizationScore }) => {
  const segments = 30;

  const points: [number, number, number][] = useMemo(() => {
    const newPoints: [number, number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments - 0.5) * scale;
        const z = (j / segments - 0.5) * scale;
        const y = Math.sin(x * Math.PI * 2 + z * Math.PI * 2 + optimizationScore * Math.PI * 2) * 0.5;
        newPoints.push([x, y, z]);
      }
    }
    return newPoints;
  }, [scale, optimizationScore, segments]);

  // ポイント配列の検証
  if (!points || points.length < 2) {
    console.error('OptimizationField: Invalid points array', points);
    return null;
  }

  return (
    <group position={position}>
      <Line
        points={points}
        color={COLORS.quantum}
        lineWidth={1}
      />
      <Text position={[0, 1.5, 0]} color={COLORS.text} fontSize={0.7}>
        量子アニーリング最適化フィールド
      </Text>
    </group>
  );
});

// インフラ効率を表現するコンポーネント
const InfrastructureComponent: FC<InfrastructureProps> = React.memo(({ efficiency }) => {
  // インフラストラクチャの視覚化（例：電力網）
  const points: [number, number, number][] = [
    [-10, 0, 0],
    [0, efficiency * 5, 0],
    [10, 0, 0],
  ];

  return (
    <Line
      points={points}
      color={COLORS.energy}
      lineWidth={2}
    />
  );
});

// 車両を表現するコンポーネント
const Vehicle: FC<VehicleProps> = React.memo(({ position, speed }) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.position.x += speed;
      if (mesh.current.position.x > 10) {
        mesh.current.position.x = -10;
      }
    }
  });

  return (
    <Box ref={mesh} position={position} args={[0.5, 0.5, 1]}>
      <meshStandardMaterial color={COLORS.traffic} />
    </Box>
  );
});

// 交通ネットワークを表現するコンポーネント
const TrafficNetwork: FC<{ trafficEfficiency: number }> = React.memo(({ trafficEfficiency }) => {
  // 複数の車両を配置
  const vehicles = [
    { position: [-5, 0, 0], speed: 0.05 * trafficEfficiency },
    { position: [0, 0, 0], speed: 0.03 * trafficEfficiency },
    { position: [5, 0, 0], speed: 0.04 * trafficEfficiency },
  ];

  return (
    <>
      {vehicles.map((vehicle, idx) => (
        <Vehicle key={idx} position={vehicle.position} speed={vehicle.speed} />
      ))}
    </>
  );
});

// 3Dシティコンポーネント
const City: FC<CityProps> = React.memo(
  ({
    quantumState,
    depinState,
    energyFlow,
    optimizationScore,
    buildingEfficiencies,
    depinTransactions,
    depinConnections,
    blockchainNodes,
    transactions,
    infrastructureEfficiency,
    trafficEfficiency,
  }) => {
    const { camera } = useThree();

    useEffect(() => {
      camera.position.set(0, 50, 80);
      camera.lookAt(0, 0, 0);
    }, [camera]);

    return (
      <>
        {/* ライティングの設定 */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 100, 0]} intensity={1} />
        <pointLight position={[50, 50, 50]} intensity={0.5} />
        <pointLight position={[-50, 50, -50]} intensity={0.5} />

        {/* OrbitControls の追加設定 */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={20}
          maxDistance={150}
        />

        {/* 量子コンピューター */}
        <group position={[-35, 0, -35]}>
          {quantumState.map((state, i) => (
            <QuantumBit key={i} position={[i * 4, 0, 0]} state={state} />
          ))}
          <Text position={[-4, 6, 0]} color={COLORS.text} fontSize={1}>
            量子コンピューター
          </Text>
        </group>

        {/* DePINネットワーク */}
        <group position={[35, 0, -35]}>
          {depinState.map((active, i) => (
            <DePINNode
              key={i}
              position={[(i % 3) * 5, 0, Math.floor(i / 3) * 5]}
              active={active}
              transactionVolume={depinTransactions[i] || 0}
            />
          ))}
          {/* ノード間のラインを追加 */}
          {depinConnections.map((conn, i) => {
            const isValid = conn.start.length === 3 && conn.end.length === 3 &&
              conn.start.every(coord => typeof coord === 'number' && !isNaN(coord)) &&
              conn.end.every(coord => typeof coord === 'number' && !isNaN(coord));
            if (!isValid) {
              console.error(`depinConnections[${i}]: Invalid connection points`, conn);
              return null;
            }
            return (
              <Line
                key={i}
                points={[conn.start, conn.end]}
                color={COLORS.depin}
                lineWidth={2}
                dashed={false}
              />
            );
          })}
          <Text position={[7.5, 10, 0]} color={COLORS.text} fontSize={1}>
            DePINネットワーク
          </Text>
        </group>

        {/* ブロックチェーンネットワーク */}
        <group position={[0, 0, 30]}>
          {blockchainNodes.map((node, i) => (
            <BlockchainNode key={i} position={node.position} label={node.label} />
          ))}
          <Text position={[0, 5, 0]} color={COLORS.text} fontSize={1}>
            ブロックチェーンネットワーク
          </Text>
        </group>

        {/* トランザクション */}
        {transactions.map((tx, i) => (
          <TransactionLine key={i} from={tx.from} to={tx.to} />
        ))}

        {/* スマートシティ */}
        <group position={[0, 0, 50]}>
          {buildingEfficiencies.map((efficiency, i) => (
            <Building
              key={i}
              position={[(i % 3 - 1) * 6, 0, Math.floor(i / 3) * 6 - 6]}
              height={3 + efficiency * 10}
              color={i % 3 === 0 ? COLORS.energy : i % 3 === 1 ? COLORS.traffic : COLORS.safety}
              energyEfficiency={efficiency}
            />
          ))}
          <Text position={[0, 10, -8]} color={COLORS.text} fontSize={1}>
            スマートシティ
          </Text>
        </group>

        {/* エネルギーフロー */}
        <EnergyFlow start={[-30, 0, -30]} end={[0, 10, 50]} progress={energyFlow} />
        <EnergyFlow start={[30, 0, -30]} end={[0, 10, 50]} progress={energyFlow} />

        {/* 最適化フィールド */}
        <OptimizationField position={[0, -6, 0]} scale={60} optimizationScore={optimizationScore} />

        {/* インフラ効率 */}
        <group position={[0, 0, 20]}>
          <InfrastructureComponent efficiency={infrastructureEfficiency} />
          <Text position={[0, 6, 0]} color={COLORS.text} fontSize={1}>
            インフラ効率
          </Text>
        </group>

        {/* 交通ネットワーク */}
        <group position={[0, 0, -20]}>
          <TrafficNetwork trafficEfficiency={trafficEfficiency} />
          <Text position={[0, 6, 0]} color={COLORS.text} fontSize={1}>
            交通ネットワーク
          </Text>
        </group>
      </>
    );
  }
);

// 2Dグラフコンポーネント
const PerformanceChart: FC<{ data: SimulationData[] }> = React.memo(({ data }) => (
  <Card className="p-6 mb-6 bg-cardBackground shadow-xl rounded-lg fade-in">
    <CardTitle className="mb-4 text-2xl font-semibold text-center">システムパフォーマンス</CardTitle>
    <ResponsiveContainer width="100%" height={500}>
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
        <ReLine type="monotone" dataKey="交通効率" stroke={COLORS.traffic} name="交通効率" />
      </LineChart>
    </ResponsiveContainer>
  </Card>
));

// TrafficEfficiencyChartコンポーネント
const TrafficEfficiencyChart: FC<{ data: SimulationData[] }> = React.memo(({ data }) => (
  <Card className="p-6 mb-6 bg-cardBackground shadow-xl rounded-lg fade-in">
    <CardTitle className="mb-4 text-2xl font-semibold text-center">交通効率の推移</CardTitle>
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
        <ReLine type="monotone" dataKey="交通効率" stroke={COLORS.traffic} name="交通効率" />
      </LineChart>
    </ResponsiveContainer>
  </Card>
));

// DePIN取引リストコンポーネント
interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  status: '成功' | '失敗' | '保留中';
}

const TransactionList: FC<{ transactions: Transaction[] }> = ({ transactions }) => (
  <Card className="p-6 mb-6 bg-cardBackground shadow-xl rounded-lg fade-in">
    <CardTitle className="mb-4 text-2xl font-semibold text-center">DePIN取引リスト</CardTitle>
    <CardContent>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="px-2 py-1">ハッシュ</th>
            <th className="px-2 py-1">送信者</th>
            <th className="px-2 py-1">受信者</th>
            <th className="px-2 py-1">金額</th>
            <th className="px-2 py-1">ステータス</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, idx) => (
            <tr key={idx} className="border-t border-gray-700">
              <td className="px-2 py-1">{tx.hash}</td>
              <td className="px-2 py-1">{tx.from}</td>
              <td className="px-2 py-1">{tx.to}</td>
              <td className="px-2 py-1">{tx.amount}</td>
              <td className="px-2 py-1">{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

// ダッシュボードコンポーネント
const Dashboard: FC<{ performanceData: SimulationData[] }> = React.memo(({ performanceData }) => {
  const latestData = performanceData[performanceData.length - 1] || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 fade-in">
      {/* 平均エネルギー効率 */}
      <Card className="p-6 bg-gradient-to-br from-gray-700 to-gray-600 shadow-md rounded-lg flex flex-col items-center justify-center">
        <div className="text-4xl font-semibold text-green-400">
          {latestData['平均エネルギー効率']?.toFixed(2) || '0.00'}%
        </div>
        <div className="mt-2 text-lg font-medium">平均エネルギー効率</div>
      </Card>
      {/* DePIN取引量 */}
      <Card className="p-6 bg-gradient-to-br from-gray-700 to-gray-600 shadow-md rounded-lg flex flex-col items-center justify-center">
        <div className="text-4xl font-semibold text-orange-500">
          {latestData['DePIN取引量']?.toFixed(2) || '0.00'}
        </div>
        <div className="mt-2 text-lg font-medium">DePIN取引量</div>
      </Card>
      {/* 最適化スコア */}
      <Card className="p-6 bg-gradient-to-br from-gray-700 to-gray-600 shadow-md rounded-lg flex flex-col items-center justify-center">
        <div className="text-4xl font-semibold text-blue-400">
          {latestData['最適化スコア']?.toFixed(2) || '0.00'}%
        </div>
        <div className="mt-2 text-lg font-medium">最適化スコア</div>
      </Card>
      {/* 交通効率 */}
      <Card className="p-6 bg-gradient-to-br from-gray-700 to-gray-600 shadow-md rounded-lg flex flex-col items-center justify-center">
        <div className="text-4xl font-semibold text-yellow-400">
          {latestData['交通効率']?.toFixed(2) || '0.00'}%
        </div>
        <div className="mt-2 text-lg font-medium">交通効率</div>
      </Card>
    </div>
  );
});

// ナビゲーションバーコンポーネント
const Navbar: FC = () => (
  <nav className="bg-cardBackground shadow-lg">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-white">
        Quantum Smart City DePIN
      </div>
      <div className="space-x-6">
        <a href="#" className="text-white hover:text-gray-400 transition-colors duration-200">ホーム</a>
        <a href="#" className="text-white hover:text-gray-400 transition-colors duration-200">機能</a>
        <a href="#" className="text-white hover:text-gray-400 transition-colors duration-200">ビジネスユースケース</a>
        <a href="#" className="text-white hover:text-gray-400 transition-colors duration-200">お問い合わせ</a>
      </div>
    </div>
  </nav>
);

// フッターコンポーネント
const Footer: FC = () => (
  <footer className="bg-cardBackground text-white py-4 mt-auto">
    <div className="max-w-7xl mx-auto text-center">
      &copy; {new Date().getFullYear()} Quantum Smart City DePIN. All rights reserved.
    </div>
  </footer>
);

// Quantum Smart City DePIN コンポーネント
const QuantumSmartCityDePIN: FC = () => {
  const [quantumState, setQuantumState] = useState<boolean[]>(Array(5).fill(false));
  const [depinState, setDepinState] = useState<boolean[]>(Array(9).fill(false));
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [performanceData, setPerformanceData] = useState<SimulationData[]>([]);
  const [energyFlow, setEnergyFlow] = useState<number>(0);
  const [optimizationScore, setOptimizationScore] = useState<number>(0);
  const [buildingEfficiencies, setBuildingEfficiencies] = useState<number[]>(Array(9).fill(0.5));
  const [depinTransactions, setDepinTransactions] = useState<number[]>(Array(9).fill(0));
  const [depinConnections, setDepinConnections] = useState<{ start: [number, number, number]; end: [number, number, number] }[]>([]);
  const [blockchainNodes, setBlockchainNodes] = useState<BlockchainNodeProps[]>([
    { position: [0, 0, 30], label: 'Block A' },
    { position: [5, 0, 30], label: 'Block B' },
    { position: [-5, 0, 30], label: 'Block C' },
  ]);
  const [transactions, setTransactions] = useState<TransactionProps[]>([
    { from: [0, 0, 30], to: [5, 0, 30] },
    { from: [5, 0, 30], to: [-5, 0, 30] },
    { from: [-5, 0, 30], to: [0, 0, 30] },
  ]);
  const [infrastructureEfficiency, setInfrastructureEfficiency] = useState<number>(0.5);
  const [trafficEfficiency, setTrafficEfficiency] = useState<number>(0.5);
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);

  // DePINノード間の接続情報を定義
  useEffect(() => {
    const positions = depinState.map((_, i) => [
      35 + (i % 3) * 5,
      0,
      -35 + Math.floor(i / 3) * 5,
    ]);

    const connections = [];

    for (let i = 0; i < depinState.length; i++) {
      // 右隣のノードとの接続
      if (i % 3 < 2) {
        connections.push({
          start: positions[i],
          end: positions[i + 1],
        });
      }
      // 下のノードとの接続
      if (i < 6) {
        connections.push({
          start: positions[i],
          end: positions[i + 3],
        });
      }
    }

    setDepinConnections(connections);
  }, [depinState]);

  // シミュレーションの状態を更新
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      // 量子ビットの状態更新
      setQuantumState(prev => prev.map(() => Math.random() > 0.5));

      // DePINノードの状態更新（量子ビットの状態に影響される）
      setDepinState(prev =>
        prev.map((_, i) => quantumState[i % quantumState.length] && Math.random() > 0.3)
      );

      // エネルギーフローと最適化スコアの更新
      setEnergyFlow(prev => (prev + 0.02 * simulationSpeed) % 1);
      setOptimizationScore(prev => Math.min(1, prev + Math.random() * 0.05));

      // 建物のエネルギー効率更新（最適化スコアに影響される）
      setBuildingEfficiencies(prev =>
        prev.map(e => Math.min(1, e + (Math.random() - 0.5) * 0.05 + optimizationScore * 0.02))
      );

      // DePIN取引量の更新（DePINノードの活動度に影響される）
      setDepinTransactions(prev =>
        prev.map((t, i) => Math.max(0, t + (depinState[i] ? 0.1 : -0.05)))
      );

      // インフラ効率の更新（最適化スコアに影響される）
      setInfrastructureEfficiency(prev => Math.min(1, prev + (Math.random() - 0.5) * 0.02 + optimizationScore * 0.01));

      // 交通効率の更新（量子アニーリングによる最適化をシミュレート）
      setTrafficEfficiency(prev => Math.min(1, prev + (Math.random() - 0.5) * 0.02 + optimizationScore * 0.01));

      // ブロックチェーントランザクションのシミュレーション
      setTransactions(prev => {
        const newTransactions = [...prev];
        // ランダムに新しいトランザクションを追加
        if (Math.random() > 0.7) {
          const fromIndex = Math.floor(Math.random() * blockchainNodes.length);
          const toIndex = Math.floor(Math.random() * blockchainNodes.length);
          if (fromIndex !== toIndex) {
            newTransactions.push({
              from: blockchainNodes[fromIndex].position,
              to: blockchainNodes[toIndex].position,
            });
          }
        }
        // 一定数を超えたら古いトランザクションを削除
        if (newTransactions.length > 20) newTransactions.shift();
        return newTransactions;
      });

      // DePIN取引リストの更新
      if (Math.random() > 0.5) {
        const newTransaction: Transaction = {
          hash: Math.random().toString(36).substring(2, 15),
          from: `Node_${Math.floor(Math.random() * 10)}`,
          to: `Node_${Math.floor(Math.random() * 10)}`,
          amount: parseFloat((Math.random() * 10).toFixed(2)),
          status: '成功',
        };
        setTransactionList(prev => [newTransaction, ...prev].slice(0, 20)); // 最新の20件のみを保持
      }
    }, 1000 / simulationSpeed);
    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed, quantumState, optimizationScore, depinState, blockchainNodes]);

  // パフォーマンスデータを更新
  useEffect(() => {
    if (!isRunning) return;
    const newData: SimulationData = {
      step: performanceData.length + 1,
      '平均エネルギー効率': (buildingEfficiencies.reduce((sum, e) => sum + e, 0) / buildingEfficiencies.length) * 100,
      'DePIN取引量': depinTransactions.reduce((sum, t) => sum + t, 0),
      '最適化スコア': optimizationScore * 100,
      '交通効率': trafficEfficiency * 100,
    };
    setPerformanceData(prev => [...prev, newData].slice(-20)); // 最新の20ポイントのみを保持
  }, [buildingEfficiencies, depinTransactions, optimizationScore, trafficEfficiency, isRunning]);

  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setQuantumState(Array(5).fill(false));
    setDepinState(Array(9).fill(false));
    setEnergyFlow(0);
    setOptimizationScore(0);
    setBuildingEfficiencies(Array(9).fill(0.5));
    setDepinTransactions(Array(9).fill(0));
    setPerformanceData([]);
    setTransactions([
      { from: [0, 0, 30], to: [5, 0, 30] },
      { from: [5, 0, 30], to: [-5, 0, 30] },
      { from: [-5, 0, 30], to: [0, 0, 30] },
    ]);
    setInfrastructureEfficiency(0.5);
    setTrafficEfficiency(0.5);
    setTransactionList([]);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
      {/* ナビゲーションバー */}
      <Navbar />

      {/* ヘッダーカード */}
      <Card className="m-6">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 fade-in">
            量子スマートシティ DePIN シミュレーション
          </CardTitle>
          <CardDescription className="text-center mt-2 text-lg">
            量子コンピューティング、DePIN、およびスマートシティの相互作用をシミュレート
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Button onClick={toggleSimulation} variant={isRunning ? "destructive" : "default"} className="px-6 py-3 text-lg">
              {isRunning ? '停止' : '開始'}
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-lg">シミュレーション速度:</span>
              <Slider
                min={0.1}
                max={5}
                step={0.1}
                value={[simulationSpeed]}
                onValueChange={([value]) => setSimulationSpeed(value)}
                className="w-48"
              />
              <span className="text-lg">{simulationSpeed.toFixed(1)}x</span>
            </div>
            <Button onClick={resetSimulation} variant="outline" className="px-6 py-3 text-lg">
              リセット
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ダッシュボード */}
      <Dashboard performanceData={performanceData} />

      {/* 追加のグラフ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 交通効率のグラフ */}
        <TrafficEfficiencyChart data={performanceData} />
        {/* DePIN取引リスト */}
        <TransactionList transactions={transactionList} />
      </div>

      {/* 3Dシーンと2Dグラフのレイアウト */}
      <div className="flex flex-col lg:flex-row flex-grow p-6 gap-6">
        {/* 3Dシーン */}
        <div className="flex-grow h-[800px] lg:h-auto rounded-xl shadow-2xl overflow-hidden fade-in">
          <Canvas>
            <City
              quantumState={quantumState}
              depinState={depinState}
              energyFlow={energyFlow}
              optimizationScore={optimizationScore}
              buildingEfficiencies={buildingEfficiencies}
              depinTransactions={depinTransactions}
              depinConnections={depinConnections}
              blockchainNodes={blockchainNodes}
              transactions={transactions}
              infrastructureEfficiency={infrastructureEfficiency}
              trafficEfficiency={trafficEfficiency}
            />
          </Canvas>
        </div>
        {/* 2Dグラフ */}
        <div className="flex-grow bg-cardBackground rounded-xl shadow-2xl p-6 fade-in">
          <PerformanceChart data={performanceData} />
        </div>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default QuantumSmartCityDePIN;
