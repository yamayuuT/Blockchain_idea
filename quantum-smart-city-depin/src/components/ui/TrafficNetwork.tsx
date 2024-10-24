// TrafficNetwork.tsx
import React, { FC, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

interface VehicleProps {
  position: [number, number, number];
  speed: number;
}

const Vehicle: FC<VehicleProps> = ({ position, speed }) => {
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
      <meshStandardMaterial color="#FF0000" />
    </Box>
  );
};

const TrafficNetwork: FC = () => {
  // 複数の車両を配置
  const vehicles = [
    { position: [-5, 0, 0], speed: 0.05 },
    { position: [0, 0, 0], speed: 0.03 },
    { position: [5, 0, 0], speed: 0.04 },
  ];

  return (
    <>
      {vehicles.map((vehicle, idx) => (
        <Vehicle key={idx} position={vehicle.position} speed={vehicle.speed} />
      ))}
    </>
  );
};

export default TrafficNetwork;
