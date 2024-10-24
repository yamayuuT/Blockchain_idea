// src/components/ui/Footer.tsx
import React, { FC } from 'react';

const Footer: FC = () => (
  <footer className="bg-cardBackground text-white py-4 mt-auto">
    <div className="max-w-7xl mx-auto text-center">
      &copy; {new Date().getFullYear()} Quantum Smart City DePIN. All rights reserved.
    </div>
  </footer>
);

export default Footer;
