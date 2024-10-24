// src/components/ui/TrafficLight.tsx
import React, { FC, useEffect, useState } from 'react';
import { Box } from '@react-three/drei';

interface TrafficLightProps {
  position: [number, number, number];
  state: 'red' | 'green';
}

const TrafficLight: FC<TrafficLightProps> = ({ position, state }) => {
  const color = state === 'green' ? '#32CD32' : '#FF4500';

  return (
    <Box position={position} args={[0.5, 2, 0.5]}>
      <meshStandardMaterial color={color} />
    </Box>
  );
};

export default TrafficLight;
