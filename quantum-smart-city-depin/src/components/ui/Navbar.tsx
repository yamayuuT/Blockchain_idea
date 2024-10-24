// src/components/ui/Navbar.tsx
import React, { FC } from 'react';

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

export default Navbar;
