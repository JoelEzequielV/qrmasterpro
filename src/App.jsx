import React, { useState, useEffect } from 'react';
import { Scanner } from './components/Scanner';
import { HistoryList } from './components/HistoryList';
import { getHistory, saveScanResult, toggleFavoriteStorage, clearHistoryStorage } from './utils/storage';
import './App.css';
import { AdMob } from '@capacitor-community/admob';

export default function App() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());

    // Initialize AdMob
    async function initAdMob() {
      await AdMob.initialize({ requestTrackingAuthorization: true });
      // Mostrar Banner en la parte inferior
      await AdMob.showBanner({
        adId: 'ca-app-pub-3940256099942544/6300978111', // ID de Banner de Prueba
        // adId: 'ca-app-pub-1021257020916080/7773649390', // ID real
        adSize: 'BANNER',
        position: 'BOTTOM_CENTER',
        margin: 0
      });
    }
    initAdMob();

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