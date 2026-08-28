import React, { useState } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const Scanner = ({ onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);

  const startScan = async () => {
    try {
      // 1. Verificar si el dispositivo soporta el módulo de escaneo de Google
      const isSupported = await BarcodeScanner.isSupported();
      if (!isSupported.supported) {
        alert('El módulo de escaneo no está soportado en este dispositivo.');
        return;
      }

      // 2. Solicitar permisos de cámara nativos
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted' && camera !== 'limited') {
        alert('Se requiere acceso a la cámara para escanear.');
        return;
      }

      // 3. Hacer transparente el fondo web para ver el preview nativo detrás
      document.body.classList.add('scanner-active');
      setIsScanning(true);

      // 4. Iniciar la escucha del escáner
      const listener = await BarcodeScanner.addListener(
        'barcodeScanned',
        async (event) => {
          await stopScan(listener);
          if (event.barcode && event.barcode.rawValue) {
            onScanSuccess(event.barcode.rawValue);
          }
        }
      );

      // 5. Encender la cámara
      await BarcodeScanner.startScan();
    /* } catch (error) {
      console.error('Error al iniciar el escáner:', error);
      stopScan();
    } */

    } catch (error) {
      console.error('Error al iniciar el escáner:', error);
      stopScan();
    
      // Fallback para pruebas en navegador Web (npm run dev)
      if (!window.Capacitor?.isNativePlatform()) {
        const mockUrl = prompt('Modo Web: Ingresa una URL para simular el escaneo', 'https://github.com');
        if (mockUrl) onScanSuccess(mockUrl);
      }
    }
  };

  const stopScan = async (listener) => {
    try {
      if (listener) {
        await listener.remove();
      }
      await BarcodeScanner.stopScan();
    } catch (e) {
      console.log('Error deteniendo escáner', e);
    } finally {
      document.body.classList.remove('scanner-active');
      setIsScanning(false);
    }
  };

  return (
    <div className="scanner-container">
      {!isScanning ? (
        <button className="scan-btn" onClick={startScan}>
          Escanear Código QR
        </button>
      ) : (
        <button className="cancel-btn" onClick={() => stopScan()}>
          Cancelar Escaneo
        </button>
      )}
    </div>
  );
};