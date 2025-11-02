import React, { useRef } from 'react';
import { QRCode } from 'react-qr-code';
import { Download } from 'lucide-react';
import { Button } from './ui/button';

interface QRCodeDownloadProps {
  url: string;
  title: string;
  filename: string;
}

export const QRCodeDownload: React.FC<QRCodeDownloadProps> = ({ url, title, filename }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 1024;
    canvas.height = 1024;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 1024, 1024);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <div ref={qrRef} className="p-4 bg-white rounded-xl">
        <QRCode value={url} size={200} />
      </div>
      <Button onClick={downloadQRCode} className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Download QR Code
      </Button>
    </div>
  );
};
