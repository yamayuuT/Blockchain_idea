// src/components/ui/Car.tsx
import React, { FC, useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

interface CarProps {
  initialPosition: [number, number, number];
  direction: [number, number, number];
  speed: number;
  trafficLightState: 'red' | 'green';
}

const Car: FC<CarProps> = ({ initialPosition, direction, speed, trafficLightState }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [position, setPosition] = useState<THREE.Vector3>(new THREE.Vector3(...initialPosition));
  const velocity = useMemo(
    () => new THREE.Vector3(...direction).normalize().multiplyScalar(speed),
    [direction, speed]
  );

  useEffect(() => {
    if (mesh.current) {
      mesh.current.position.copy(position);
    }
  }, [position]);

  useFrame((state, delta) => {
    if (trafficLightState === 'red') {
      // 停止
      return;
    }

    const newPos = position.clone().add(velocity.clone().multiplyScalar(delta));
    
    // 道路の範囲内でループ
    if (newPos.x > 50) newPos.x = -50;
    if (newPos.z > 50) newPos.z = -50;
    if (newPos.x < -50) newPos.x = 50;
    if (newPos.z < -50) newPos.z = 50;

    setPosition(newPos);

    if (mesh.current) {
      mesh.current.position.copy(newPos);
      // 進行方向に応じて車の向きを調整
      const angle = Math.atan2(velocity.z, velocity.x);
      mesh.current.rotation.y = -angle;
    }
  });

  return (
    <Box ref={mesh} position={[position.x, 0.25, position.z]} args={[1, 0.5, 2]}>
      <meshStandardMaterial color="#FF6347" />
    </Box>
  );
};

export default Car;
