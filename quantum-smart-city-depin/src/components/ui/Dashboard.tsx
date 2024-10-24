// src/components/ui/Dashboard.tsx
import React, { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line as ReLine, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import TransactionGraph from './TransactionGraph';

interface SimulationData {
  step: number;
  '平均エネルギー効率': number;
  'DePIN取引量': number;
  '最適化スコア': number;
}

interface DashboardProps {
  performanceData: SimulationData[];
  transactions: Transaction[];
}

const COLORS = {
  energy: '#32CD32',
  depin: '#FF4500',
  quantum: '#1E90FF',
  text: '#E2E8F0',
  tooltipBg: '#4A5568',
  tooltipText: '#E2E8F0',
  pieColors: ['#1E90FF', '#FF4500', '#32CD32', '#FFD700', '#8A2BE2'],
};

const Dashboard: FC<DashboardProps> = ({ performanceData, transactions }) => {
  const latestData = performanceData[performanceData.length - 1] || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 fade-in">
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

      {/* DePIN取引ネットワークグラフ */}
      <Card className="p-6 bg-cardBackground shadow-xl rounded-lg fade-in col-span-1 md:col-span-3">
        <CardTitle className="mb-4 text-2xl font-semibold text-center">DePIN取引ネットワーク</CardTitle>
        <TransactionGraph transactions={transactions} />
      </Card>
    </div>
  );
};

export default Dashboard;
