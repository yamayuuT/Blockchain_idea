// src/components/ui/Road.tsx
import React, { FC } from 'react';
import { Box } from '@react-three/drei';

interface RoadProps {
  position: [number, number, number];
  rotation: [number, number, number];
  length: number;
  width: number;
}

const Road: FC<RoadProps> = ({ position, rotation, length, width }) => {
  return (
    <Box
      position={position}
      rotation={rotation}
      args={[length, 0.1, width]}
    >
      <meshStandardMaterial color="#444" />
    </Box>
  );
};

export default Road;
