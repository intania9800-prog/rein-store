import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  Eye,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import {
  QRISConfig,
  DEFAULT_QRIS_CONFIG,
  getQRISConfigSync,
  saveQRISConfig,
  saveQRISImageToStorage,
  getQRISImageFromStorage,
  clearQRISImageFromStorage,
} from '../utils/qrisStorage';
import { QRISDisplay } from './QRISDisplay';

export const AdminQRISSettings: React.FC = () => {
  const [config, setConfig] = useState<QRISConfig>(getQRISConfigSync());
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'settings' | 'preview'>('settings');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadCustomImage = async () => {
      const img = await getQRISImageFromStorage();
      if (img) {
        setPreviewImage(img);
        setConfig((prev) => ({ ...prev, customImageUrl: img }));
      }
    };
    loadCustomImage();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        setPreviewImage(dataUrl);
        setConfig((prev) => ({ ...prev, customImageUrl: dataUrl, mode: 'custom_image' }));
        await saveQRISImageToStorage(dataUrl);
        setSuccessNotice('Foto Barcode QRIS Asli berhasil diunggah dengan kualitas HD!');
        setTimeout(() => setSuccessNotice(''), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Ctrl+V paste image directly
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = async (evt) => {
            const dataUrl = evt.target?.result as string;
            if (dataUrl) {
              setPreviewImage(dataUrl);
              setConfig((prev) => ({ ...prev, customImageUrl: dataUrl, mode: 'custom_image' }));
              await saveQRISImageToStorage(dataUrl);
              setSuccessNotice('Gambar QRIS berhasil di-paste dari clipboard!');
              setTimeout(() => setSuccessNotice(''), 4000);
            }
          };
          reader.readAsDataURL(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  const handleClearImage = async () => {
    setPreviewImage(null);
    setConfig((prev) => ({ ...prev, customImageUrl: null, mode: 'standard_national' }));
    await clearQRISImageFromStorage();
    setSuccessNotice('Gambar QRIS kustom dihapus. Menggunakan tampilan Standar Nasional.');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleSave = () => {
    saveQRISConfig(config);
    setSuccessNotice('✅ Pengaturan QRIS berhasil disimpan dan langsung aktif di checkout pembeli!');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleReset = () => {
    setConfig(DEFAULT_QRIS_CONFIG);
    setPreviewImage(null);
    clearQRISImageFromStorage();
    saveQRISConfig(DEFAULT_QRIS_CONFIG);
    setSuccessNotice('🔄 Pengaturan QRIS berhasil di-reset ke standar awal!');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  return (
    <div className="space-y-6" onPaste={handlePaste} tabIndex={0}>
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-red-950/40 via-blue-950/40 to-[#091024] border border-red-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-[#ED1C24] shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              Pengaturan QRIS Toko (Asli & Standar Nasional)
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Sinkron
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Anda dapat memilih menggunakan <strong>Tampilan Standar QRIS Nasional</strong> (barcode EMVCo scannable otomatis) atau mengunggah <strong>Foto Barcode QRIS Asli</strong> milik toko Anda (BCA, DANA Bisnis, GoPay Usaha, ShopeePay, dll) agar dana langsung masuk ke rekening Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveSubTab(activeSubTab === 'settings' ? 'preview' : 'settings')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            {activeSubTab === 'settings' ? (
              <>
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Lihat Pratinjau Pembeli</span>
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Kembali ke Pengaturan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {activeSubTab === 'preview' ? (
        /* Preview Tab */
        <div className="bg-[#091024] border border-blue-900/40 rounded-2xl p-6 text-center">
          <h4 className="text-sm font-bold text-slate-300 mb-1 flex items-center justify-center gap-2">
            <Eye className="w-4 h-4 text-[#00A3FF]" />
            Pratinjau Tampilan QRIS yang Dilihat Pembeli Saat Checkout:
          </h4>
          <p className="text-xs text-slate-400 mb-6">
            (Simulasi nominal: Rp 50.000, Order: INV-SAMPLE-888)
          </p>

          <div className="flex justify-center">
            <QRISDisplay amount={50000} invoiceId="INV-SAMPLE-888" />
          </div>
        </div>
      ) : (
        /* Settings Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Image Upload */}
          <div className="lg:col-span-7 space-y-6">
            {/* Mode Selection */}
            <div className="bg-[#091024] border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                1. Mode Tampilan QRIS
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setConfig({ ...config, mode: 'custom_image' })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    config.mode === 'custom_image'
                      ? 'border-blue-500 bg-blue-950/30 text-white shadow-lg shadow-blue-500/10'
                      : 'border-slate-800 bg-[#0c152e]/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        config.mode === 'custom_image'
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-600'
                      }`}
                    >
                      {config.mode === 'custom_image' && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-white">
                      Foto Barcode QRIS Asli Toko
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Tampilkan foto / stiker QRIS resmi milik toko Anda (BCA, DANA, GoPay, Nobu, ShopeePay). Pembeli langsung transfer ke rekening Anda.
                  </p>
                </div>

                <div
                  onClick={() => setConfig({ ...config, mode: 'standard_national' })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    config.mode === 'standard_national'
                      ? 'border-red-500 bg-red-950/20 text-white shadow-lg shadow-red-500/10'
                      : 'border-slate-800 bg-[#0c152e]/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        config.mode === 'standard_national'
                          ? 'border-red-500 bg-red-500'
                          : 'border-slate-600'
                      }`}
                    >
                      {config.mode === 'standard_national' && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-white">
                      Standar QRIS Nasional (ASPI / GPN)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Menghasilkan QR digital EMVCo scannable otomatis dengan frame resmi Bank Indonesia, NMID, dan logo m-Banking lengkap.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Image Upload Area */}
            <div className="bg-[#091024] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#00A3FF]" />
                  2. Upload / Copy-Paste Foto Barcode QRIS Asli
                </h4>
                {previewImage && (
                  <button
                    onClick={handleClearImage}
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus Gambar
                  </button>
                )}
              </div>

              {/* Upload Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                  previewImage
                    ? 'border-emerald-500/40 bg-emerald-950/10 hover:border-emerald-500'
                    : 'border-slate-700 hover:border-blue-500 bg-[#0c152e]/40 hover:bg-[#0c152e]/80'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />

                {previewImage ? (
                  <div className="space-y-3">
                    <img
                      src={previewImage}
                      alt="Pratinjau QRIS Asli"
                      className="max-h-48 mx-auto rounded-xl border border-slate-700 shadow-md object-contain"
                    />
                    <div className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Gambar QRIS Aktif (Klik untuk mengganti)
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-[#00A3FF]">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-white">
                      Klik untuk Unggah atau Tarik Gambar QRIS ke sini
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-sm">
                      Mendukung format PNG, JPG, WebP. Bisa juga langsung tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]">Ctrl + V</kbd> untuk paste gambar tangkapan layar barcode QRIS Anda!
                    </p>
                  </>
                )}
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Tips gambar jernih & tidak blur:</strong> Gunakan foto barcode QRIS asli beresolusi minimal 500x500 pixel. Sistem menyimpannya dalam format Full HD tanpa kompresi yang mengaburkan barcode.
                </span>
              </div>
            </div>

            {/* Merchant Details Form */}
            <div className="bg-[#091024] border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                3. Identitas & Informasi Merchant QRIS
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Nama Toko / Merchant:
                  </label>
                  <input
                    type="text"
                    value={config.merchantName}
                    onChange={(e) => setConfig({ ...config, merchantName: e.target.value })}
                    placeholder="Contoh: REINSTORE, ELEKTRONIK"
                    className="w-full bg-[#0c152e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Nama yang muncul di struk & layar m-Banking pembeli
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    NMID (National Merchant ID):
                  </label>
                  <input
                    type="text"
                    value={config.nmid}
                    onChange={(e) => setConfig({ ...config, nmid: e.target.value })}
                    placeholder="Contoh: ID1026614748022"
                    className="w-full bg-[#0c152e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Kode NMID resmi toko Anda dari BI / Penyedia QRIS
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Kode Acquirer / Cetak:
                  </label>
                  <input
                    type="text"
                    value={config.acquirer}
                    onChange={(e) => setConfig({ ...config, acquirer: e.target.value })}
                    placeholder="A01"
                    className="w-full bg-[#0c152e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Kota Merchant:
                  </label>
                  <input
                    type="text"
                    value={config.city}
                    onChange={(e) => setConfig({ ...config, city: e.target.value })}
                    placeholder="JAKARTA"
                    className="w-full bg-[#0c152e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Nomor WhatsApp Konfirmasi Bukti Pembayaran:
                  </label>
                  <input
                    type="text"
                    value={config.whatsappConfirmationNumber}
                    onChange={(e) =>
                      setConfig({ ...config, whatsappConfirmationNumber: e.target.value })
                    }
                    placeholder="+62 895-3655-44896"
                    className="w-full bg-[#0c152e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan QRIS</span>
              </button>

              <button
                onClick={handleReset}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Standar</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Card Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#091024] border border-slate-800 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Pratinjau Live:</span>
                <span className="text-[10px] text-[#00A3FF] font-semibold">Tampilan Pembeli</span>
              </h4>

              <div className="scale-95 origin-top">
                <QRISDisplay amount={25000} invoiceId="INV-DEMO-001" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
