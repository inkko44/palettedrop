import React from 'react';
import { Droplets, History, Wand2 } from 'lucide-react';

interface HeaderProps {
  onGenerate?: () => void;
  onHistory?: () => void;
  colorCount?: number;
  onColorCountChange?: (count: number) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onGenerate, 
  onHistory,
  colorCount = 5,
  onColorCountChange 
}) => {
  return (
    <header className="bg-white shadow-sm py-2 w-full">
      <div className="px-4 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center">
        <div className="flex items-center gap-2">
          <Droplets className="text-indigo-600" size={24} />
          <h1 className="text-lg font-medium">
            <span className="text-indigo-600">Palette</span>
            <span className="text-gray-700">Drop</span>
          </h1>
        </div>

        <div className="hidden sm:block text-sm text-gray-500">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200">spacebar</kbd> to generate
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <select
            value={colorCount}
            onChange={(e) => onColorCountChange?.(parseInt(e.target.value))}
            className="px-2 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {[2, 3, 4, 5].map((count) => (
              <option key={count} value={count}>
                {count} colors
              </option>
            ))}
          </select>
          
          <button 
            onClick={onGenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            <Wand2 size={16} />
            <span>Generate</span>
          </button>
          
          <button 
            onClick={onHistory}
            className="p-1.5 text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="View history"
          >
            <History size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;