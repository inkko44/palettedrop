import React from 'react';
import { Color } from '../types';
import ColorCard from './ColorCard';

interface PaletteGridProps {
  colors: Color[];
  onLockToggle: (id: string) => void;
  onColorChange: (id: string, hex: string) => void;
}

const PaletteGrid: React.FC<PaletteGridProps> = ({ 
  colors, 
  onLockToggle,
  onColorChange
}) => {
  return (
    <div 
      className="flex flex-col sm:flex-row flex-1 min-h-0"
      onClick={(e) => e.stopPropagation()}
    >
      {colors.map((color) => (
        <ColorCard
          key={color.id}
          color={color}
          onLockToggle={onLockToggle}
          onColorChange={onColorChange}
        />
      ))}
    </div>
  );
};

export default PaletteGrid;