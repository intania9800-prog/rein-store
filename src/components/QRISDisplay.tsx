import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, ExternalLink, Image as ImageIcon, ShieldCheck, Sparkles } from 'lucide-react';
import {
  QRISConfig,
  getQRISConfigSync,
  getQRISImageFromStorage,
  generateQRISPayload,
} from '../utils/qrisStorage';
import { BCALogo, DanaLogo, GoPayLogo, OvoLogo, ShopeePayLogo, SeaBankLogo } from './icons/BrandLogos';

interface QRISDisplayProps {
  amount: number;
  invoiceId: string;
}

export const QRISDisplay: React.FC<QRISDisplayProps> = ({ amount, invoiceId }) => {
  const [config, setConfig] = useState<QRISConfig>(getQRISConfigSync());
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [copiedNmid, setCopiedNmid] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Load config & custom image from storage
  useEffect(() => {
    const activeConfig = getQRISConfigSync();
    setConfig(activeConfig);

    const loadCustomImage = async () => {
      const storedImage = await getQRISImageFromStorage();
      if (storedImage) {
        setConfig((prev) => ({ ...prev, customImageUrl: storedImage }));
      }
    };
    loadCustomImage();

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setConfig(e.detail);
      }
    };
    window.addEventListener('reinstore_qris_updated', handleUpdate);
    return () => window.removeEventListener('reinstore_qris_updated', handleUpdate);
  }, []);

  // Generate genuine EMVCo QRIS code if standard mode
  useEffect(() => {
    let isMounted = true;
    const generate = async () => {
      try {
        const payload = generateQRISPayload(config, amount, invoiceId);
        const dataUrl = await QRCode.toDataURL(payload, {
          width: 500,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });
        if (isMounted) {
          setQrDataUrl(dataUrl);
        }
      } catch (err) {
        console.error('Failed to generate real QRIS:', err);
      }
    };

    generate();
    return () => {
      isMounted = false;
    };
  }, [config, amount, invoiceId]);

  const handleCopyNominal = () => {
    navigator.clipboard.writeText(amount.toString());
    setCopiedNominal(true);
    setTimeout(() => setCopiedNominal(false), 2000);
  };

  const handleCopyNmid = () => {
    navigator.clipboard.writeText(config.nmid || 'ID1026614748022');
    setCopiedNmid(true);
    setTimeout(() => setCopiedNmid(false), 2000);
  };

  const handleDownloadQR = () => {
    setDownloading(true);
    try {
      const link = document.createElement('a');
      link.download = `QRIS-REINSTORE-${invoiceId}.png`;
      link.href = config.mode === 'custom_image' && config.customImageUrl ? config.customImageUrl : qrDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  const isUsingCustomImage = config.mode === 'custom_image' && Boolean(config.customImageUrl);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Real QRIS Standar Nasional Card */}
      <div
        id="qris-printable-card"
        className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden border-2 border-slate-200 select-none"
      >
        {/* Decorative corner indicators matching Bank Indonesia official QRIS stand */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#ED1C24] rotate-45 transform pointer-events-none opacity-90" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#ED1C24] rotate-45 transform pointer-events-none opacity-90" />

        {/* 1. Official Header: QRIS & GPN Logos */}
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2.5 mb-2.5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-[#ED1C24] text-white px-2.5 py-1 rounded-md text-xs font-black tracking-wider flex items-center shadow-sm">
              QRIS
            </div>
            <div className="text-[9px] font-bold text-slate-700 leading-tight">
              <div>QR Code Standar</div>
              <div className="text-[#ED1C24]">Pembayaran Nasional</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="#ED1C24" className="w-full h-full drop-shadow-sm">
                <path d="M12 2L15 8H9L12 2ZM3 11L9 9L6 15L3 11ZM21 11L15 9L18 15L21 11ZM8 17L12 14L16 17L12 22L8 17Z" />
              </svg>
            </div>
            <span className="text-xs font-black text-[#002D62] tracking-tighter">GPN</span>
          </div>
        </div>

        {/* 2. Merchant Information */}
        <div className="text-center my-1.5 relative z-10">
          <h3 className="text-sm font-black tracking-wide text-slate-900 uppercase">
            {config.merchantName || 'REINSTORE, ELEKTRONIK'}
          </h3>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <p className="text-[10px] font-mono text-slate-600 font-bold">
              NMID: {config.nmid || 'ID1026614748022'}
            </p>
            <button
              onClick={handleCopyNmid}
              title="Salin NMID"
              className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
            >
              {copiedNmid ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {config.acquirer || 'A01'} • Real-Time Standar Nasional
            </span>
            {isUsingCustomImage && (
              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 text-blue-600" /> Barcode Toko Asli
              </span>
            )}
          </div>
        </div>

        {/* 3. The QR Code Display Area */}
        <div className="my-2.5 p-2 bg-white rounded-xl border-2 border-slate-200 flex justify-center items-center relative z-10 shadow-inner overflow-hidden min-h-[220px]">
          {isUsingCustomImage && config.customImageUrl ? (
            <div className="relative w-full flex flex-col items-center">
              <img
                src={config.customImageUrl}
                alt="QRIS Barcode Resmi Toko Reinstore"
                className="max-h-56 w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
          ) : qrDataUrl ? (
            <div className="relative w-52 h-52 flex items-center justify-center">
              <img
                src={qrDataUrl}
                alt="QRIS Standar Nasional"
                className="w-full h-full object-contain"
              />
              {/* Official Center QRIS Badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-9 h-9 rounded-md bg-white border border-slate-300 shadow-md flex items-center justify-center p-0.5">
                  <div className="w-full h-full bg-[#ED1C24] rounded-sm flex flex-col items-center justify-center text-white">
                    <span className="text-[7px] font-black tracking-tighter leading-none">QRIS</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              Memuat kode QRIS...
            </div>
          )}
        </div>

        {/* 4. Official Slogan Banner: "SATU QRIS UNTUK SEMUA" */}
        <div className="bg-[#ED1C24] text-white py-1 px-2 rounded-lg text-center relative z-10 mb-2.5 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider">
            SATU QRIS UNTUK SEMUA
          </div>
          <div className="text-[8px] text-red-100 font-medium">
            Scan & Bayar via Seluruh Aplikasi m-Banking & Dompet Digital
          </div>
        </div>

        {/* 5. Supported Payment Apps Logos Grid */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 relative z-10 mb-2.5">
          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider text-center mb-1.5">
            Mendukung Pembayaran Dari:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <BCALogo className="h-4 px-1" />
            <SeaBankLogo className="h-4 px-1" />
            <DanaLogo className="h-4 px-1" />
            <GoPayLogo className="h-4 px-1" />
            <OvoLogo className="h-4 px-1" />
            <ShopeePayLogo className="h-4 px-1" />
            <div className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[8px] font-bold text-slate-700">
              Mandiri
            </div>
            <div className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[8px] font-bold text-slate-700">
              BRImo
            </div>
            <div className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[8px] font-bold text-slate-700">
              BNI
            </div>
            <div className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[8px] font-bold text-slate-700">
              LinkAja
            </div>
          </div>
        </div>

        {/* 6. Total Amount Pill */}
        <div className="bg-slate-100 border border-slate-300 rounded-xl p-2.5 text-center relative z-10 mb-2">
          <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">
            Total Pembayaran
          </div>
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <span className="text-xl font-black text-slate-900">
              Rp {new Intl.NumberFormat('id-ID').format(amount)}
            </span>
            <button
              onClick={handleCopyNominal}
              className="text-xs bg-white hover:bg-slate-200 border border-slate-300 px-2 py-0.5 rounded-md font-bold text-slate-700 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
              title="Salin Nominal Pas"
            >
              {copiedNominal ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 text-[10px]">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="text-[10px]">Salin</span>
                </>
              )}
            </button>
          </div>
          <div className="text-[9px] text-emerald-700 font-bold mt-0.5 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Bebas Biaya Admin (Gratis Rp 0)
          </div>
        </div>

        {/* 7. Footer Info */}
        <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono relative z-10">
          <span>Dicetak oleh: 93600914</span>
          <span>{invoiceId}</span>
        </div>
      </div>

      {/* Action Tools below Card */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleDownloadQR}
          disabled={downloading}
          className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloading ? 'Mengunduh...' : 'Unduh Gambar QRIS'}</span>
        </button>

        <button
          onClick={handleCopyNominal}
          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Salin Rp</span>
        </button>
      </div>

      <div className="mt-2 text-center text-[10px] text-slate-400">
        💡 <strong className="text-slate-300">Tips scan HP:</strong> Unduh QRIS lalu buka menu scan di m-Banking dan pilih &apos;Upload dari Galeri&apos;.
      </div>
    </div>
  );
};
