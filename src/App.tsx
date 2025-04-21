import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PaletteGrid from './components/PaletteGrid';
import History from './components/History';
import { usePalette } from './hooks/usePalette';

function App() {
  const {
    currentPalette,
    paletteHistory,
    loading,
    colorCount,
    generateRandomPalette,
    toggleColorLock,
    updateColor,
    loadPaletteFromHistory,
    updateColorCount,
    loadPaletteFromUrl,
  } = usePalette(5);

  const [showHistory, setShowHistory] = useState(false);

  // Check URL for shared palette on load
  useEffect(() => {
    const url = window.location.href;
    if (url.includes('?colors=')) {
      loadPaletteFromUrl(url);
    }
  }, []);

  // Handle spacebar for generating new palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        generateRandomPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generateRandomPalette]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onGenerate={generateRandomPalette}
        onHistory={() => setShowHistory(true)}
        colorCount={colorCount}
        onColorCountChange={updateColorCount}
      />
      
      <main className="flex-1 flex">
        {currentPalette ? (
          <PaletteGrid
            colors={currentPalette.colors}
            onLockToggle={toggleColorLock}
            onColorChange={updateColor}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading palette...</p>
          </div>
        )}
      </main>
      
      {showHistory && (
        <History
          palettes={paletteHistory}
          onSelectPalette={loadPaletteFromHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default App;