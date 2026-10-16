import React, { useState, useEffect } from 'react';
import {
  Headphones,
  MessageCircle,
  PhoneCall,
  Mail,
  Send,
  Instagram,
  Video,
  Clock,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Info,
  Copy,
  Check,
  Activity,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  ContactCSConfig,
  getCSConfig,
  saveCSConfig,
  resetCSConfig,
  getWhatsAppUrl,
  formatPhoneNumberForWhatsApp,
  EVENT_CS_CONTACTS_UPDATED,
} from '../utils/contactStorage';

export const AdminContactSettings: React.FC = () => {
  const [config, setConfig] = useState<ContactCSConfig>(() => getCSConfig());
  const [successToast, setSuccessToast] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setConfig(e.detail);
      } else {
        setConfig(getCSConfig());
      }
    };
    window.addEventListener(EVENT_CS_CONTACTS_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_CS_CONTACTS_UPDATED, handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.whatsappPrimary.trim()) {
      alert('Nomor WhatsApp Customer Service Utama wajib diisi!');
      return;
    }
    saveCSConfig(config);
    showToast('✅ Pengaturan Kontak Customer Service berhasil disimpan!');
  };

  const handleReset = () => {
    if (confirm('Kembalikan seluruh nomor kontak Customer Service ke setelan standar toko?')) {
      const reset = resetCSConfig();
      setConfig(reset);
      showToast('🔄 Kontak CS berhasil dikembalikan ke standar');
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const primaryCleanNumber = formatPhoneNumberForWhatsApp(config.whatsappPrimary);
  const testWhatsAppUrl = getWhatsAppUrl(config.whatsappPrimary, config.defaultGreetingText);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast('')}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Card */}
      <div className="bg-[#091024] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-black text-white">
                  Kelola Kontak Customer Service (CS)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Live Sinkron Seluruh Toko
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Ubah nomor WhatsApp admin, WhatsApp konfirmasi pembayaran, akun media sosial resmi, jam operasional, dan status layanan bantuan pelanggan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleSave}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset ke kontak standar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
          </div>
        </div>

        {/* Status Indicators Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status CS Toko</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    config.csStatus === 'online'
                      ? 'bg-emerald-400 animate-pulse'
                      : config.csStatus === 'busy'
                      ? 'bg-amber-400'
                      : 'bg-slate-500'
                  }`}
                />
                <span className="text-xs font-bold text-white capitalize">{config.csStatus}</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
              {config.csStatusText}
            </span>
          </div>

          <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Jam Kerja Support</span>
              <span className="text-xs font-bold text-slate-200 mt-1 block truncate">
                {config.operatingHours}
              </span>
            </div>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Nomor WhatsApp Aktif</span>
              <span className="text-xs font-mono font-bold text-emerald-400 mt-1 block">
                {config.whatsappPrimary}
              </span>
            </div>
            <a
              href={testWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white transition-all text-[11px] font-bold flex items-center gap-1"
              title="Uji coba link WhatsApp"
            >
              <span>Tes</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: WhatsApp Channels */}
          <div className="bg-[#091024] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-slate-800/80 pb-3">
              <MessageCircle className="w-4 h-4" />
              <span>Kanal WhatsApp Resmi Toko</span>
            </div>

            {/* WhatsApp Utama */}
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Nomor WhatsApp CS Utama <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.whatsappPrimary}
                  onChange={(e) => setConfig({ ...config, whatsappPrimary: e.target.value })}
                  placeholder="Contoh: +62 895-3655-44896 atau 0895365544896"
                  className="w-full bg-[#0c152e] border border-emerald-500/40 text-emerald-300 font-mono font-bold text-sm rounded-xl pl-3.5 pr-20 py-2.5 focus:border-emerald-400 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleCopy(config.whatsappPrimary, 'primary')}
                  className="absolute right-2 top-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1"
                >
                  {copiedField === 'primary' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'primary' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Nomor ini yang langsung terbuka saat pembeli mengklik tombol Kontak di Navbar, Hero, dan Footer.
              </p>
            </div>

            {/* WhatsApp Admin Khusus DNS */}
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Nomor WhatsApp Admin Khusus DNS AdGuard
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.whatsappDnsAdmin}
                  onChange={(e) => setConfig({ ...config, whatsappDnsAdmin: e.target.value })}
                  placeholder="Contoh: +62 896-5445-4210"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white font-mono rounded-xl pl-3.5 pr-20 py-2.5 text-xs focus:border-emerald-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(config.whatsappDnsAdmin, 'dns')}
                  className="absolute right-2 top-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1"
                >
                  {copiedField === 'dns' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'dns' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Diberikan kepada pembeli layanan DNS AdGuard di halaman invoice untuk aktivasi token IP.
              </p>
            </div>

            {/* WhatsApp Konfirmasi Pembayaran QRIS */}
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Nomor WhatsApp Konfirmasi Bukti Pembayaran / Mutasi
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.whatsappPaymentConfirm}
                  onChange={(e) => setConfig({ ...config, whatsappPaymentConfirm: e.target.value })}
                  placeholder="Contoh: +62 895-3655-44896"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white font-mono rounded-xl pl-3.5 pr-20 py-2.5 text-xs focus:border-emerald-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(config.whatsappPaymentConfirm, 'pay')}
                  className="absolute right-2 top-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1"
                >
                  {copiedField === 'pay' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'pay' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Tujuan pengiriman struk/bukti saat pembeli menekan tombol konfirmasi bayar di modal QRIS.
              </p>
            </div>

            {/* Template Salam Pembuka Otomatis */}
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Template Teks Salam Otomatis WhatsApp
              </label>
              <textarea
                rows={2}
                value={config.defaultGreetingText}
                onChange={(e) => setConfig({ ...config, defaultGreetingText: e.target.value })}
                placeholder="Teks otomatis yang muncul di kotak pesan WhatsApp pembeli..."
                className="w-full bg-[#0c152e] border border-slate-700 text-slate-200 rounded-xl p-3 text-xs focus:border-emerald-400 focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Jam Operasional & Status Layanan */}
          <div className="bg-[#091024] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm border-b border-slate-800/80 pb-3">
              <Clock className="w-4 h-4" />
              <span>Jam Operasional & Status CS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  Keterangan Jam Kerja
                </label>
                <input
                  type="text"
                  value={config.operatingHours}
                  onChange={(e) => setConfig({ ...config, operatingHours: e.target.value })}
                  placeholder="Contoh: 24 Jam Nonstop (Senin - Minggu)"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  Status Operasional CS
                </label>
                <select
                  value={config.csStatus}
                  onChange={(e) => {
                    const status = e.target.value as any;
                    let text = config.csStatusText;
                    if (status === 'online') text = 'Online 24/7 - Siap Melayani';
                    if (status === 'busy') text = 'Sedang Sibuk - Respon Mungkin Agak Lambat';
                    if (status === 'offline') text = 'Tutup Sementara / Istirahat';
                    setConfig({ ...config, csStatus: status, csStatusText: text });
                  }}
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                >
                  <option value="online">🟢 Online (Siap Melayani)</option>
                  <option value="busy">🟡 Sibuk / Antrian Padat</option>
                  <option value="offline">⚪ Offline / Tutup</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Badge / Teks Status Tambahan
              </label>
              <input
                type="text"
                value={config.csStatusText}
                onChange={(e) => setConfig({ ...config, csStatusText: e.target.value })}
                placeholder="Contoh: Online 24/7 - Siap Melayani"
                className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Kanal Sosial Media & Email */}
          <div className="bg-[#091024] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm border-b border-slate-800/80 pb-3">
              <Send className="w-4 h-4" />
              <span>Media Sosial & Email Resmi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  <span>Username Telegram CS</span>
                </label>
                <div className="flex items-center">
                  <span className="bg-slate-800 border border-r-0 border-slate-700 text-slate-400 px-2.5 py-2 rounded-l-xl text-xs font-mono">
                    t.me/
                  </span>
                  <input
                    type="text"
                    value={config.telegramUsername}
                    onChange={(e) => setConfig({ ...config, telegramUsername: e.target.value })}
                    placeholder="reinstore_cs"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-r-xl px-3 py-2 text-xs focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Akun Instagram Toko</span>
                </label>
                <div className="flex items-center">
                  <span className="bg-slate-800 border border-r-0 border-slate-700 text-slate-400 px-2.5 py-2 rounded-l-xl text-xs font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    value={config.instagramUsername}
                    onChange={(e) => setConfig({ ...config, instagramUsername: e.target.value })}
                    placeholder="reinstore.official"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-r-xl px-3 py-2 text-xs focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-slate-300" />
                  <span>Akun TikTok Toko</span>
                </label>
                <div className="flex items-center">
                  <span className="bg-slate-800 border border-r-0 border-slate-700 text-slate-400 px-2.5 py-2 rounded-l-xl text-xs font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    value={config.tiktokUsername}
                    onChange={(e) => setConfig({ ...config, tiktokUsername: e.target.value })}
                    placeholder="reinstore.id"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-r-xl px-3 py-2 text-xs focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Alamat Email Bantuan Resmi</span>
                </label>
                <input
                  type="email"
                  value={config.emailSupport}
                  onChange={(e) => setConfig({ ...config, emailSupport: e.target.value })}
                  placeholder="support@reinstore.com"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#091024] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl sticky top-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Preview Widget Kontak CS
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">Tampilan Pengunjung</span>
            </div>

            {/* Widget Card Simulation */}
            <div className="bg-gradient-to-br from-[#0b142e] to-[#070c1a] border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Reinstore Help Center</h4>
                    <span className="text-[10px] text-slate-400 block">{config.operatingHours}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      config.csStatus === 'online'
                        ? 'bg-emerald-400 animate-pulse'
                        : config.csStatus === 'busy'
                        ? 'bg-amber-400'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span className="text-[10px] font-bold text-slate-300 capitalize">
                    {config.csStatus}
                  </span>
                </div>
              </div>

              {/* Number and Actions */}
              <div className="bg-[#060a16] border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">
                  WhatsApp Customer Service:
                </div>
                <div className="text-base font-mono font-black text-emerald-400 tracking-wider">
                  {config.whatsappPrimary}
                </div>
                <div className="text-[10px] text-slate-400 italic">
                  "{config.defaultGreetingText.slice(0, 50)}..."
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <a
                  href={testWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hubungi WhatsApp CS Sekarang</span>
                </a>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <a
                    href={`https://t.me/${config.telegramUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-slate-700 flex flex-col items-center justify-center text-[10px] font-semibold gap-1 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Telegram</span>
                  </a>
                  <a
                    href={`https://instagram.com/${config.instagramUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-pink-500/20 text-slate-300 hover:text-pink-300 border border-slate-700 flex flex-col items-center justify-center text-[10px] font-semibold gap-1 transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={`mailto:${config.emailSupport}`}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 flex flex-col items-center justify-center text-[10px] font-semibold gap-1 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Information Tips */}
            <div className="mt-4 p-3 bg-blue-950/30 border border-blue-500/20 rounded-xl space-y-1 text-xs text-blue-200">
              <div className="flex items-center gap-1.5 font-bold text-blue-300 text-[11px]">
                <Info className="w-3.5 h-3.5 text-[#00A3FF]" />
                <span>Tips Format Nomor WhatsApp</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Anda dapat menuliskan nomor dengan format <code>+62 895-xxxx</code> atau <code>0895xxxx</code>. Sistem secara otomatis mengonversinya menjadi format internasional yang valid untuk tautan langsung <code>wa.me</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
