// InfrastructureComponent.tsx
import React, { FC } from 'react';
import { Line } from '@react-three/drei';

interface InfrastructureProps {
  efficiency: number;
}

const InfrastructureComponent: FC<InfrastructureProps> = ({ efficiency }) => {
  // インフラストラクチャの視覚化を行うコード
  // 例として、電力網をラインで表現
  const points: [number, number, number][] = [
    [-10, 0, 0],
    [0, efficiency * 5, 0],
    [10, 0, 0],
  ];

  return (
    <Line
      points={points}
      color="#FFD700"
      lineWidth={2}
    />
  );
};

export default InfrastructureComponent;
