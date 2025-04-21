import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Lock, Unlock, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { Color } from '../types';
import { getTextColor, generateShades, hslToRgb, rgbToHex, hexToRgb, rgbToHsl } from '../utils/colorUtils';

interface ColorCardProps {
  color: Color;
  onLockToggle: (id: string) => void;
  onColorChange: (id: string, hex: string) => void;
}

const ColorCard: React.FC<ColorCardProps> = ({ color, onLockToggle, onColorChange }) => {
  const [showCopied, setShowCopied] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [isDragging, setIsDragging] = useState(false);
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({ hue: 0, sat: 0, light: 0 });
  const controlsRef = useRef<HTMLDivElement>(null);
  
  const displayColor = previewColor || color.hex;
  const textColor = getTextColor(displayColor);
  const shades = generateShades(displayColor, 7);
  
  // Get current HSL values
  const { r, g, b } = hexToRgb(displayColor);
  const { h: currentHue, s: currentSat, l: currentLight } = rgbToHsl(r, g, b);
  
  // Update drag state ref when color changes
  useEffect(() => {
    if (!isDragging) {
      dragStateRef.current = {
        hue: currentHue,
        sat: currentSat,
        light: currentLight
      };
    }
  }, [currentHue, currentSat, currentLight, isDragging]);
  
  const copyToClipboard = (text: string, format: 'hex' | 'rgb' | 'hsl') => {
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(format);
      setTimeout(() => setShowCopied(null), 1500);
    });
  };

  const updateHue = useCallback((clientX: number, commit = false) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const hue = Math.round(percentage * 360);
    
    // Use values from ref to ensure consistency during drag
    const { sat, light } = dragStateRef.current;
    const rgb = hslToRgb(hue, sat, light);
    const newHex = rgbToHex(rgb.r, rgb.g, rgb.b);
    
    // Update the ref immediately
    dragStateRef.current.hue = hue;
    
    if (commit) {
      setPreviewColor(null);
      onColorChange(color.id, newHex);
    } else {
      setPreviewColor(newHex);
    }
  }, [color.id, onColorChange]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      requestAnimationFrame(() => updateHue(e.clientX));
    };

    const handleMouseUp = (e: MouseEvent) => {
      updateHue(e.clientX, true);
      setIsDragging(false);
      setPreviewColor(null);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updateHue]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateHue(e.clientX);
  };
  
  return (
    <div 
      className="flex-1 flex flex-col min-w-0"
      style={{ backgroundColor: displayColor }}
    >
      <div className="flex-grow flex flex-col p-4" style={{ color: textColor }}>
        <div className="flex justify-between items-start mb-4">
          <div className="font-medium text-lg truncate">{color.name}</div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onLockToggle(color.id);
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label={color.locked ? "Unlock color" : "Lock color"}
          >
            {color.locked ? <Lock size={18} /> : <Unlock size={18} />}
          </button>
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={() => setShowControls(!showControls)}
          className="w-full py-2 px-4 flex items-center justify-center hover:bg-black/5 transition-colors"
          style={{ color: textColor }}
        >
          <span className="mr-1 text-sm">{showControls ? 'Less' : 'More'}</span>
          {showControls ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <div
          ref={controlsRef}
          className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
          style={{ 
            maxHeight: showControls ? controlsRef.current?.scrollHeight : 0,
            backgroundColor: `${textColor}10`
          }}
        >
          <div className="p-4 backdrop-blur-sm" style={{ color: textColor }}>
            <div className="flex items-center space-x-1 mb-4">
              <div className="flex-grow relative min-w-0">
                <div className="flex space-x-2 items-center">
                  <div className="relative flex-grow min-w-0">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        copyToClipboard(
                          activeFormat === 'hex' ? displayColor : 
                          activeFormat === 'rgb' ? `rgb(${r}, ${g}, ${b})` : 
                          `hsl(${currentHue}, ${currentSat}%, ${currentLight}%)`, 
                          activeFormat
                        );
                      }}
                      className="flex items-center space-x-2 py-1 pr-2 hover:bg-white/10 rounded transition-colors w-full"
                      style={{ color: textColor }}
                    >
                      <span className="font-mono text-sm truncate">
                        {activeFormat === 'hex' ? displayColor : 
                         activeFormat === 'rgb' ? `rgb(${r}, ${g}, ${b})` : 
                         `hsl(${currentHue}, ${currentSat}%, ${currentLight}%)`}
                      </span>
                      <Copy size={14} className="flex-shrink-0" />
                    </button>
                    
                    {showCopied && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/70 rounded text-white text-xs font-medium"
                        style={{ animationName: 'fadeIn', animationDuration: '0.2s' }}
                      >
                        Copied!
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-1 flex-shrink-0">
                    {(['hex', 'rgb', 'hsl'] as const).map(format => (
                      <button
                        key={format}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveFormat(format);
                        }}
                        className={`text-xs px-1 rounded ${
                          activeFormat === format 
                            ? 'bg-white/20 font-medium' 
                            : 'hover:bg-white/10'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-xs uppercase tracking-wider mb-2 opacity-80">Shades</h4>
              <div className="flex overflow-x-auto py-1 space-x-1">
                {shades.map((shade) => (
                  <button
                    key={shade.tint}
                    className="w-7 h-7 rounded flex-shrink-0 hover:scale-110 transition-transform"
                    style={{ backgroundColor: shade.hex }}
                    onClick={(e) => {
                      e.preventDefault();
                      onColorChange(color.id, shade.hex);
                    }}
                    aria-label={`Select shade: ${Math.round(shade.tint)}%`}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-2 opacity-80">Adjust</h4>
              <label className="block text-xs mb-1 opacity-80">
                Hue
              </label>
              <div 
                className="relative w-full h-8 rounded-lg overflow-hidden cursor-pointer"
                onMouseDown={handleMouseDown}
                ref={sliderRef}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(to right, 
                      hsl(0, ${currentSat}%, ${currentLight}%),
                      hsl(60, ${currentSat}%, ${currentLight}%),
                      hsl(120, ${currentSat}%, ${currentLight}%),
                      hsl(180, ${currentSat}%, ${currentLight}%),
                      hsl(240, ${currentSat}%, ${currentLight}%),
                      hsl(300, ${currentSat}%, ${currentLight}%),
                      hsl(360, ${currentSat}%, ${currentLight}%)
                    )`
                  }}
                />
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-md transform -translate-x-1/2 pointer-events-none"
                  style={{ 
                    left: `${(currentHue / 360) * 100}%`,
                    mixBlendMode: 'difference'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorCard;