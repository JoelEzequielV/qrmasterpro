import React, { useState, useEffect } from 'react';
import { Scanner } from './components/Scanner';
import { HistoryList } from './components/HistoryList';
import { getHistory, saveScanResult, toggleFavoriteStorage, clearHistoryStorage } from './utils/storage';
import './App.css';

export default function App() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleScanSuccess = (scannedUrl) => {
    const updated = saveScanResult(scannedUrl);
    setHistory(updated);
  };

  const handleToggleFavorite = (id) => {
    const updated = toggleFavoriteStorage(id);
    setHistory(updated);
  };

  const handleClear = () => {
    if (window.confirm('¿Deseas borrar el historial no guardado?')) {
      const updated = clearHistoryStorage();
      setHistory(updated);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h2>Lector QR</h2>
      </header>

      <main className="app-content">
        <Scanner onScanSuccess={handleScanSuccess} />
        <HistoryList 
          items={history} 
          onToggleFavorite={handleToggleFavorite} 
          onClear={handleClear} 
        />
      </main>
    </div>
  );
}