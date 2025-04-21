import { useState, useEffect } from 'react';
import { Color, Palette } from '../types';
import { createColorObject, generatePalette } from '../utils/colorUtils';

// Generate a unique ID for each palette
const generatePaletteId = (): string => {
  return crypto.randomUUID();
};

// Create a new palette from color hex values
const createPalette = (colorHexes: string[], lockedColors: Color[] = []): Palette => {
  const colors = colorHexes.map((hex, index) => {
    // Check if this position had a locked color
    const lockedColor = lockedColors[index];
    if (lockedColor && lockedColor.locked) {
      return lockedColor;
    }
    return createColorObject(hex);
  });

  return {
    id: generatePaletteId(),
    colors,
    createdAt: Date.now(),
  };
};

// Custom hook for palette management
export const usePalette = (initialColorCount = 5) => {
  const [colorCount, setColorCount] = useState<number>(initialColorCount);
  const [currentPalette, setCurrentPalette] = useState<Palette | null>(null);
  const [paletteHistory, setPaletteHistory] = useState<Palette[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize with a random palette
  useEffect(() => {
    generateRandomPalette();
  }, []);

  // Generate a random palette
  const generateRandomPalette = () => {
    setLoading(true);
    
    // Preserve locked colors
    const lockedColors = currentPalette?.colors || [];
    
    const colorHexes = generatePalette('random', undefined, colorCount);
    const newPalette = createPalette(colorHexes, lockedColors);
    
    setCurrentPalette(newPalette);
    addPaletteToHistory(newPalette);
    
    setLoading(false);
  };

  // Toggle lock status for a color
  const toggleColorLock = (colorId: string) => {
    if (!currentPalette) return;
    
    const updatedColors = currentPalette.colors.map((color) => {
      if (color.id === colorId) {
        return { ...color, locked: !color.locked };
      }
      return color;
    });
    
    setCurrentPalette({
      ...currentPalette,
      colors: updatedColors,
    });
  };

  // Update a specific color in the palette
  const updateColor = (colorId: string, hex: string) => {
    if (!currentPalette) return;
    
    const updatedColors = currentPalette.colors.map((color) => {
      if (color.id === colorId) {
        return createColorObject(hex, color.locked);
      }
      return color;
    });
    
    const updatedPalette = {
      ...currentPalette,
      colors: updatedColors,
    };
    
    setCurrentPalette(updatedPalette);
    addPaletteToHistory(updatedPalette);
  };

  // Add a palette to history
  const addPaletteToHistory = (palette: Palette) => {
    setPaletteHistory((prev) => {
      // Limit history to 20 items
      const newHistory = [palette, ...prev].slice(0, 20);
      return newHistory;
    });
  };

  // Load a palette from history
  const loadPaletteFromHistory = (paletteId: string) => {
    const palette = paletteHistory.find((p) => p.id === paletteId);
    if (palette) {
      setCurrentPalette(palette);
      setColorCount(palette.colors.length);
    }
  };

  // Update the number of colors in the palette
  const updateColorCount = (count: number) => {
    setColorCount(count);
    
    if (!currentPalette) return;
    
    if (count > currentPalette.colors.length) {
      // Add new colors
      const additionalColors = Array.from(
        { length: count - currentPalette.colors.length },
        () => createColorObject(generatePalette('random', undefined, 1)[0])
      );
      
      setCurrentPalette({
        ...currentPalette,
        colors: [...currentPalette.colors, ...additionalColors],
      });
    } else if (count < currentPalette.colors.length) {
      // Remove colors (prioritize unlocked colors for removal)
      const unlocked = currentPalette.colors.filter((c) => !c.locked);
      const locked = currentPalette.colors.filter((c) => c.locked);
      
      if (unlocked.length >= currentPalette.colors.length - count) {
        // We can remove only unlocked colors
        const updatedUnlocked = unlocked.slice(0, count - locked.length);
        setCurrentPalette({
          ...currentPalette,
          colors: [...locked, ...updatedUnlocked].sort((a, b) => 
            currentPalette.colors.findIndex(c => c.id === a.id) - 
            currentPalette.colors.findIndex(c => c.id === b.id)
          ),
        });
      } else {
        // Need to remove some locked colors too
        const updatedColors = currentPalette.colors.slice(0, count);
        setCurrentPalette({
          ...currentPalette,
          colors: updatedColors,
        });
      }
    }
  };

  // Get a shareable URL for the palette
  const getShareableUrl = (): string => {
    if (!currentPalette) return window.location.href;
    
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    
    params.set('colors', currentPalette.colors.map(c => c.hex).join(','));
    params.set('locked', currentPalette.colors.map(c => c.locked ? '1' : '0').join(','));
    
    url.search = params.toString();
    return url.toString();
  };

  // Load a palette from URL parameters
  const loadPaletteFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      const colorParams = params.get('colors');
      const lockedParams = params.get('locked');
      
      if (!colorParams) return;
      
      const hexColors = colorParams.split(',');
      const locked = lockedParams ? lockedParams.split(',').map(l => l === '1') : [];
      
      const colors = hexColors.map((hex, index) => {
        return createColorObject(hex, locked[index] || false);
      });
      
      const newPalette: Palette = {
        id: generatePaletteId(),
        colors,
        createdAt: Date.now(),
      };
      
      setCurrentPalette(newPalette);
      addPaletteToHistory(newPalette);
      setColorCount(colors.length);
      
    } catch (error) {
      console.error('Error loading palette from URL:', error);
    }
  };

  return {
    currentPalette,
    paletteHistory,
    loading,
    colorCount,
    generateRandomPalette,
    toggleColorLock,
    updateColor,
    loadPaletteFromHistory,
    updateColorCount,
    getShareableUrl,
    loadPaletteFromUrl,
  };
};