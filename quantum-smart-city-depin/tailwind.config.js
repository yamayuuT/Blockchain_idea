// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: '#1E90FF',
        depin: '#FF4500',
        energy: '#32CD32',
        traffic: '#FFD700',
        safety: '#8A2BE2',
        background: '#1F2937', // 明るめのダークグレー
        cardBackground: '#2D3748', // 少し明るめのグレー
        text: '#E2E8F0', // 明るめのテキスト色
        tooltipBg: '#4A5568',
        tooltipText: '#E2E8F0',
        blockchain: '#00BFFF',
        transaction: '#FFD700',
        success: '#48BB78',
        warning: '#F6AD55',
        info: '#4299E1',
        pieColors: ['#1E90FF', '#FF4500', '#32CD32', '#FFD700', '#8A2BE2'],
      },
    },
  },
  plugins: [],
};
