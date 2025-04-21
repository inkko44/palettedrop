import React from 'react';
import { X } from 'lucide-react';
import { Palette } from '../types';
import { getTextColor } from '../utils/colorUtils';

interface HistoryProps {
  palettes: Palette[];
  onSelectPalette: (id: string) => void;
  onClose: () => void;
}

const History: React.FC<HistoryProps> = ({ palettes, onSelectPalette, onClose }) => {
  if (palettes.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Palette History</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-8 text-center text-gray-500">
            <p>No palette history yet.</p>
            <p className="mt-2 text-sm">Generated palettes will appear here.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Palette History</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(80vh - 60px)' }}>
          <div className="grid gap-4">
            {palettes.map((palette) => (
              <button
                key={palette.id}
                className="block bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                onClick={() => {
                  onSelectPalette(palette.id);
                  onClose();
                }}
              >
                <div className="flex h-16">
                  {palette.colors.map((color) => (
                    <div
                      key={color.id}
                      className="flex-1 flex items-center justify-center"
                      style={{ 
                        backgroundColor: color.hex,
                        color: getTextColor(color.hex)
                      }}
                    >
                      <span className="text-xs font-mono">{color.hex}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-xs text-gray-500 text-left">
                  {new Date(palette.createdAt).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;