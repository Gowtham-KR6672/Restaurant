'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeComponent({ token, tableNumber }: { token: string, tableNumber: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Generate URL based on origin
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const tableUrl = `${origin}/menu/${token}`;
    setUrl(tableUrl);

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, tableUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#ff6b6b', // matching primary color
          light: '#ffffff'
        }
      }, function (error) {
        if (error) console.error(error);
      });
    }
  }, [token]);

  const downloadQR = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Table_${tableNumber}_QR.png`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <canvas ref={canvasRef}></canvas>
      <button onClick={downloadQR} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
        Download QR
      </button>
    </div>
  );
}
