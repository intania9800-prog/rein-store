import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Power,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Radio,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  ServiceStatusConfig,
  ServiceItem,
  ServiceItemStatus,
  ServiceHealthStatus,
  getServiceStatusConfig,
  saveServiceStatusConfig,
  resetServiceStatusConfig,
} from '../utils/serviceStatusStorage';

export const AdminServiceStatus: React.FC = () => {
  const [config, setConfig] = useState<ServiceStatusConfig>(() => getServiceStatusConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceStatus, setNewServiceStatus] = useState<ServiceItemStatus>('Aktif');

  // Reload if external changes occur
  useEffect(() => {
    setConfig(getServiceStatusConfig());
  }, []);

  const handleSave = (newConfig?: ServiceStatusConfig) => {
    const toSave = newConfig || config;
    const ok = saveServiceStatusConfig(toSave);
    if (ok) {
      setConfig({ ...toSave });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  // Toggle Master Card Visibility
  const toggleShowCard = () => {
    const updated: ServiceStatusConfig = {
      ...config,
      showCard: !config.showCard,
    };
    setConfig(updated);
    handleSave(updated);
  };

  // Set Overall System Status
  const setOverallStatus = (status: ServiceHealthStatus) => {
    let title = 'Online';
    let subtext = 'Semua layanan berjalan normal.';

    if (status === 'maintenance') {
      title = 'Pemeliharaan';
      subtext = 'Sedang berlangsung pemeliharaan server rutin.';
    } else if (status === 'issue') {
      title = 'Gangguan Provider';
      subtext = 'Sebagian transaksi mengalami antrean sistem.';
    } else if (status === 'offline') {
      title = 'Toko Offline';
      subtext = 'Layanan pemesanan sementara ditutup.';
    }

    const updated: ServiceStatusConfig = {
      ...config,
      overallStatus: status,
      overallTitle: title,
      overallSubtext: subtext,
    };
    setConfig(updated);
    handleSave(updated);
  };

  // Toggle individual service enabled state (ON/OFF)
  const toggleServiceEnabled = (id: string) => {
    const updatedServices = config.services.map((s) => {
      if (s.id === id) {
        const nextEnabled = !s.enabled;
        return {
          ...s,
          enabled: nextEnabled,
          // When turning ON from nonaktif, default to 'Aktif'
          status: nextEnabled && s.status === 'Nonaktif' ? ('Aktif' as ServiceItemStatus) : s.status,
        };
      }
      return s;
    });

    const updated: ServiceStatusConfig = {
      ...config,
      services: updatedServices,
    };
    setConfig(updated);
    handleSave(updated);
  };

  // Change individual service status badge
  const updateServiceStatus = (id: string, status: ServiceItemStatus) => {
    const updatedServices = config.services.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status,
          enabled: status !== 'Nonaktif',
        };
      }
      return s;
    });

    const updated: ServiceStatusConfig = {
      ...config,
      services: updatedServices,
    };
    setConfig(updated);
    handleSave(updated);
  };

  // Update service name
  const updateServiceName = (id: string, name: string) => {
    const updatedServices = config.services.map((s) => (s.id === id ? { ...s, name } : s));
    setConfig({ ...config, services: updatedServices });
  };

  // Move service up/down in order
  const moveService = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= config.services.length) return;

    const list = [...config.services];
    const item = list[index];
    list.splice(index, 1);
    list.splice(newIdx, 0, item);

    const updated: ServiceStatusConfig = {
      ...config,
      services: list,
    };
    setConfig(updated);
    handleSave(updated);
  };

  // Delete service
  const deleteService = (id: string) => {
    const updatedServices = config.services.filter((s) => s.id !== id);
    const updated: ServiceStatusConfig = {
      ...config,
      services: updatedServices,
    };
    setConfig(updated);
    handleSave(updated);
  };

  // Add new service
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      status: newServiceStatus,
      enabled: newServiceStatus !== 'Nonaktif',
    };

    const updated: ServiceStatusConfig = {
      ...config,
      services: [...config.services, newService],
    };
    setConfig(updated);
    handleSave(updated);
    setNewServiceName('');
    setNewServiceStatus('Aktif');
  };

  // Quick Action: All Online / All Off / All Maintenance
  const handleBulkAction = (action: 'all_online' | 'all_off' | 'all_maintenance') => {
    let updatedServices: ServiceItem[] = [];

    if (action === 'all_online') {
      updatedServices = config.services.map((s) => ({
        ...s,
        enabled: true,
        status: 'Aktif' as ServiceItemStatus,
      }));
    } else if (action === 'all_off') {
      updatedServices = config.services.map((s) => ({
        ...s,
        enabled: false,
        status: 'Nonaktif' as ServiceItemStatus,
      }));
    } else if (action === 'all_maintenance') {
      updatedServices = config.services.map((s) => ({
        ...s,
        enabled: true,
        status: 'Maintenance' as ServiceItemStatus,
      }));
    }

    const updated: ServiceStatusConfig = {
      ...config,
      services: updatedServices,
    };
    setConfig(updated);
    handleSave(updated);
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Kembalikan pengaturan status layanan ke bawaan standar?')) {
      const reset = resetServiceStatusConfig();
      setConfig(reset);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0c1a36] border border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#0070F3]" />
            Kontrol Status Layanan (On / Off)
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Atur status operasional toko dan hidup/matikan status tiap layanan (Web Monitor Treasury, DNS AdGuard, Gestun, dsb.) secara langsung.
            Perubahan yang Anda simpan akan langsung aktif seketika di halaman utama pembeli.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700/80 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white text-xs font-bold shadow-[0_0_15px_rgba(0,112,243,0.4)] transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2 text-emerald-400 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Pengaturan status layanan berhasil diperbarui dan aktif di tampilan web!</span>
        </div>
      )}

      {/* Grid: Settings Left (Col 1-7) & Live Preview Right (Col 8-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Master Switch (Show/Hide Widget) */}
          <div className="bg-[#091024]/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
                  Kontrol Master Card
                </span>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Tampilkan Card "Status Layanan" di Halaman Depan
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {config.showCard
                    ? 'Card status layanan saat ini AKTIF dan tampil di bilah kanan beranda.'
                    : 'Card status layanan saat ini DINONAKTIFKAN (disembunyikan dari pembeli).'}
                </p>
              </div>

              {/* Master Toggle Switch */}
              <button
                type="button"
                onClick={toggleShowCard}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  config.showCard ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
                role="switch"
                aria-checked={config.showCard}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    config.showCard ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Card 2: Status Utama Sistem */}
          <div className="bg-[#091024]/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
                Status Operasional Toko
              </span>
              <h4 className="text-sm font-bold text-white">
                Pilih Kondisi Sistem Utama (Header Card)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Mengubah warna lampu indikator dan teks kondisi operasional secara menyeluruh.
              </p>
            </div>

            {/* 4 Status Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setOverallStatus('online')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                  config.overallStatus === 'online'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e]" />
                <span className="text-xs font-bold">Online</span>
                <span className="text-[10px] text-slate-400">Normal 24 Jam</span>
              </button>

              <button
                type="button"
                onClick={() => setOverallStatus('maintenance')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                  config.overallStatus === 'maintenance'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                <span className="text-xs font-bold">Maintenance</span>
                <span className="text-[10px] text-slate-400">Perawatan</span>
              </button>

              <button
                type="button"
                onClick={() => setOverallStatus('issue')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                  config.overallStatus === 'issue'
                    ? 'bg-rose-500/15 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                <span className="text-xs font-bold">Gangguan</span>
                <span className="text-[10px] text-slate-400">Jaringan Lambat</span>
              </button>

              <button
                type="button"
                onClick={() => setOverallStatus('offline')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                  config.overallStatus === 'offline'
                    ? 'bg-slate-700/40 border-slate-600 text-slate-200 ring-2 ring-slate-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-slate-500" />
                <span className="text-xs font-bold">Offline</span>
                <span className="text-[10px] text-slate-400">Toko Tutup</span>
              </button>
            </div>

            {/* Custom Headline & Subtext Editor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Judul Status (Teks Tebal):
                </label>
                <input
                  type="text"
                  value={config.overallTitle}
                  onChange={(e) => {
                    const updated = { ...config, overallTitle: e.target.value };
                    setConfig(updated);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  placeholder="Contoh: Online / Maintenance"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Keterangan Singkat:
                </label>
                <input
                  type="text"
                  value={config.overallSubtext}
                  onChange={(e) => {
                    const updated = { ...config, overallSubtext: e.target.value };
                    setConfig(updated);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  placeholder="Contoh: Semua layanan berjalan normal."
                />
              </div>
            </div>
          </div>

          {/* Card 3: Daftar Layanan & Kontrol On/Off Masing-Masing */}
          <div className="bg-[#091024]/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
                  Daftar Layanan
                </span>
                <h4 className="text-sm font-bold text-white">
                  Kontrol ON / OFF Setiap Layanan
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klik saklar ON/OFF atau pilih status badge untuk setiap layanan.
                </p>
              </div>

              {/* Quick Bulk Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleBulkAction('all_online')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 transition cursor-pointer"
                >
                  Semua ON
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAction('all_off')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-bold border border-slate-700 transition cursor-pointer"
                >
                  Semua OFF
                </button>
              </div>
            </div>

            {/* Service Items List */}
            <div className="space-y-2.5">
              {config.services.map((service, idx) => (
                <div
                  key={service.id}
                  className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    service.enabled
                      ? 'bg-slate-900/80 border-slate-800'
                      : 'bg-slate-950/60 border-slate-900 opacity-60'
                  }`}
                >
                  {/* Left: ON/OFF Switch + Name */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleServiceEnabled(service.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        service.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                      title={service.enabled ? 'Klik untuk Matikan (OFF)' : 'Klik untuk Nyalakan (ON)'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          service.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    {/* Service Name Input */}
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateServiceName(service.id, e.target.value)}
                        onBlur={() => handleSave()}
                        className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 text-xs font-bold text-white w-full py-1 focus:outline-none transition"
                        placeholder="Nama Layanan"
                      />
                      <span className="text-[10px] text-slate-500 block">
                        Status saat ini:{' '}
                        <span
                          className={
                            service.enabled
                              ? 'text-emerald-400 font-semibold'
                              : 'text-slate-400 font-semibold'
                          }
                        >
                          {service.enabled ? service.status : 'Nonaktif (OFF)'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Right: Status Selector + Reorder + Delete */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Status Badge Dropdown */}
                    <select
                      value={service.enabled ? service.status : 'Nonaktif'}
                      onChange={(e) =>
                        updateServiceStatus(service.id, e.target.value as ServiceItemStatus)
                      }
                      className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                        !service.enabled || service.status === 'Nonaktif'
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : service.status === 'Aktif'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : service.status === 'Maintenance'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : service.status === 'Gangguan'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                      }`}
                    >
                      <option value="Aktif" className="bg-slate-900 text-emerald-400">
                        ● Aktif (Hijau)
                      </option>
                      <option value="Maintenance" className="bg-slate-900 text-amber-400">
                        ▲ Maintenance (Kuning)
                      </option>
                      <option value="Gangguan" className="bg-slate-900 text-rose-400">
                        ■ Gangguan (Merah)
                      </option>
                      <option value="Segera Hadir" className="bg-slate-900 text-cyan-400">
                        ★ Segera Hadir (Biru)
                      </option>
                      <option value="Nonaktif" className="bg-slate-900 text-slate-400">
                        ○ Nonaktif (OFF)
                      </option>
                    </select>

                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveService(idx, 'up')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                      title="Geser ke Atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === config.services.length - 1}
                      onClick={() => moveService(idx, 'down')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                      title="Geser ke Bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => deleteService(service.id)}
                      className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                      title="Hapus Layanan Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Service Form */}
            <form
              onSubmit={handleAddService}
              className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-dashed border-slate-800 flex flex-col sm:flex-row items-center gap-2.5"
            >
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Tambah layanan baru (contoh: Jasa Joki MLBB, Pulsa All-Op)..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={newServiceStatus}
                onChange={(e) => setNewServiceStatus(e.target.value as ServiceItemStatus)}
                className="w-full sm:w-auto px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
              >
                <option value="Aktif">Aktif</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Gangguan">Gangguan</option>
                <option value="Segera Hadir">Segera Hadir</option>
                <option value="Nonaktif">Nonaktif (OFF)</option>
              </select>

              <button
                type="submit"
                disabled={!newServiceName.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Card Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0c1a36]/80 border border-slate-800 rounded-2xl p-4 shadow-lg sticky top-6">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                Live Preview (Tampilan di Web)
              </span>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {config.showCard ? '🟢 Aktif Tayang' : '⚪ Disembunyikan'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Beginilah card status ini akan terlihat oleh pengunjung website di bilah samping kanan:
            </p>

            {/* PREVIEW CONTAINER */}
            {config.showCard ? (
              <div className="bg-[#091024]/90 border border-slate-800/90 rounded-2xl p-4.5 shadow-xl transition-all">
                {/* Header: Dot + Online / Status */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      config.overallStatus === 'online'
                        ? 'bg-emerald-500 shadow-[0_0_8px_#22c55e] animate-pulse'
                        : config.overallStatus === 'maintenance'
                        ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse'
                        : config.overallStatus === 'issue'
                        ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse'
                        : 'bg-slate-500'
                    }`}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {config.overallTitle || 'Online'}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {config.overallSubtext || 'Semua layanan berjalan normal.'}
                    </p>
                  </div>
                </div>

                {/* Service Items List */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
                  {config.services.map((srv) => {
                    const isServiceActive = srv.enabled && srv.status !== 'Nonaktif';
                    const badgeStatus = !srv.enabled ? 'Nonaktif' : srv.status;

                    let badgeClasses = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                    if (badgeStatus === 'Maintenance') {
                      badgeClasses = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                    } else if (badgeStatus === 'Gangguan') {
                      badgeClasses = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                    } else if (badgeStatus === 'Segera Hadir') {
                      badgeClasses = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
                    } else if (badgeStatus === 'Nonaktif') {
                      badgeClasses = 'text-slate-400 bg-slate-800/90 border-slate-700/60';
                    }

                    return (
                      <div
                        key={srv.id}
                        className={`flex items-center justify-between text-xs py-1 transition ${
                          !isServiceActive ? 'opacity-55' : ''
                        }`}
                      >
                        <span className="text-slate-300 font-medium text-[11px] flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              badgeStatus === 'Aktif'
                                ? 'bg-emerald-400'
                                : badgeStatus === 'Maintenance'
                                ? 'bg-amber-400'
                                : badgeStatus === 'Gangguan'
                                ? 'bg-rose-400'
                                : badgeStatus === 'Segera Hadir'
                                ? 'bg-cyan-400'
                                : 'bg-slate-600'
                            }`}
                          />
                          {srv.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeClasses}`}
                        >
                          {badgeStatus}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                <EyeOff className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                <p className="font-semibold text-slate-400">Card Status Layanan Disembunyikan</p>
                <p className="text-[11px] mt-1">
                  Card ini tidak akan tampil di beranda toko sampai Anda mengaktifkan kembali saklar master di atas.
                </p>
              </div>
            )}

            <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Tips Admin:</strong> Matikan saklar (OFF) pada layanan yang sedang gangguan atau belum tersedia agar pembeli tidak komplain jika terjadi keterlambatan proses.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
