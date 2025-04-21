import React, { useState } from 'react';
import { RefreshCw, Share2, Save, Clock, ChevronDown } from 'lucide-react';
import { PaletteType } from '../types';

interface ControlsProps {
  onGeneratePalette: (type: PaletteType, baseColor?: string) => void;
  onColorCountChange: (count: number) => void;
  colorCount: number;
  onShare: () => string;
  onShowHistory: () => void;
  isLoading: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onGeneratePalette,
  onColorCountChange,
  colorCount,
  onShare,
  onShowHistory,
  isLoading
}) => {
  const [paletteType, setPaletteType] = useState<PaletteType>('random');
  const [showPaletteTypes, setShowPaletteTypes] = useState(false);
  const [baseColor, setBaseColor] = useState<string>('#ffffff');
  const [shareTooltip, setShareTooltip] = useState(false);
  
  const paletteTypes: { value: PaletteType; label: string }[] = [
    { value: 'random', label: 'Random' },
    { value: 'analogous', label: 'Analogous' },
    { value: 'monochromatic', label: 'Monochromatic' },
    { value: 'complementary', label: 'Complementary' },
    { value: 'triadic', label: 'Triadic' },
    { value: 'tetradic', label: 'Tetradic' },
    { value: 'split-complementary', label: 'Split Complementary' },
  ];
  
  const handleGeneratePalette = () => {
    onGeneratePalette(paletteType, baseColor);
  };
  
  const handleShare = () => {
    const url = onShare();
    navigator.clipboard.writeText(url).then(() => {
      setShareTooltip(true);
      setTimeout(() => setShareTooltip(false), 2000);
    });
  };
  
  return (
    <div className="bg-white shadow-md p-3">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative">
            <button
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2 min-w-40"
              onClick={() => setShowPaletteTypes(!showPaletteTypes)}
            >
              <span>{paletteTypes.find(pt => pt.value === paletteType)?.label}</span>
              <ChevronDown size={16} />
            </button>
            
            {showPaletteTypes && (
              <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                {paletteTypes.map((type) => (
                  <button
                    key={type.value}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                      paletteType === type.value ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => {
                      setPaletteType(type.value);
                      setShowPaletteTypes(false);
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {paletteType !== 'random' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Base Color:</span>
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-gray-300"
              />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Colors:</span>
            <select
              value={colorCount}
              onChange={(e) => onColorCountChange(parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
            >
              {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleGeneratePalette}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw 
              size={16}
              className={isLoading ? 'animate-spin' : ''}
            />
            <span>Generate</span>
          </button>
          
          <div className="relative">
            <button
              onClick={handleShare}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Share palette"
            >
              <Share2 size={18} />
            </button>
            
            {shareTooltip && (
              <div className="absolute right-0 top-full mt-2 bg-black text-white text-xs py-1 px-2 rounded">
                Copied URL to clipboard!
              </div>
            )}
          </div>
          
          <button
            onClick={onShowHistory}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="View history"
          >
            <Clock size={18} />
          </button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        <p>
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">spacebar</kbd> to generate a new random palette. 
          Lock colors to keep them in the next generation.
        </p>
      </div>
    </div>
  );
};

export default Controls;