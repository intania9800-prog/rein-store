import React, { useState, useEffect } from 'react';
import {
  FileText,
  Building2,
  LayoutGrid,
  CreditCard,
  HelpCircle,
  Lock,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle,
  Eye,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  getReinstoreContent,
  saveReinstoreContent,
  resetReinstoreContent,
  ReinstoreContent,
  FAQItem,
} from '../utils/contentStorage';

interface AdminContentEditorProps {
  onPreviewModal?: (tab: string) => void;
}

export const AdminContentEditor: React.FC<AdminContentEditorProps> = ({ onPreviewModal }) => {
  const [content, setContent] = useState<ReinstoreContent>(getReinstoreContent());
  const [activeSubTab, setActiveSubTab] = useState<
    'tentang' | 'caraOrder' | 'pembayaran' | 'faq' | 'terms' | 'privacy'
  >('tentang');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState('');

  useEffect(() => {
    setContent(getReinstoreContent());
  }, []);

  const handleSave = () => {
    saveReinstoreContent(content);
    setSaveSuccessNotice('✅ Perubahan konten berhasil disimpan dan langsung aktif di seluruh website!');
    setTimeout(() => setSaveSuccessNotice(''), 4500);
  };

  const handleReset = () => {
    const reset = resetReinstoreContent();
    setContent(reset);
    setSaveSuccessNotice('🔄 Konten berhasil di-reset ke standar bawaan pabrik Reinstore!');
    setTimeout(() => setSaveSuccessNotice(''), 4500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-[#0b1836] border border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-[0_0_20px_rgba(37,99,235,0.15)]">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00A3FF]" />
            Sesuaikan Isi Halaman Bantuan & Tentang Kami
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Ubah teks, informasi rekening, langkah panduan, atau FAQ sesuai kebutuhan toko Anda.
            Perubahan otomatis tersimpan dan sinkron seketika ke pengunjung.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset ke Bawaan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {saveSuccessNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* Sub Tabs Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800/80">
        {[
          { id: 'tentang', label: 'Tentang Kami', icon: Building2 },
          { id: 'caraOrder', label: 'Cara Order', icon: LayoutGrid },
          { id: 'pembayaran', label: 'Pembayaran & Rekening', icon: CreditCard },
          { id: 'faq', label: 'FAQ (Tanya Jawab)', icon: HelpCircle },
          { id: 'terms', label: 'Syarat & Ketentuan', icon: FileText },
          { id: 'privacy', label: 'Kebijakan Privasi', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                  : 'bg-[#081024] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: TENTANG KAMI */}
      {activeSubTab === 'tentang' && (
        <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            Pengaturan Konten: Tentang Kami
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Judul Utama:
              </label>
              <input
                type="text"
                value={content.tentang.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    tentang: { ...prev.tentang, title: e.target.value },
                  }))
                }
                className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Slogan / Tagline:
              </label>
              <input
                type="text"
                value={content.tentang.tagline}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    tentang: { ...prev.tentang, tagline: e.target.value },
                  }))
                }
                className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Deskripsi Profil Reinstore:
            </label>
            <textarea
              rows={4}
              value={content.tentang.description}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  tentang: { ...prev.tentang, description: e.target.value },
                }))
              }
              className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl p-3 text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Visi Perusahaan:
            </label>
            <textarea
              rows={2}
              value={content.tentang.vision}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  tentang: { ...prev.tentang, vision: e.target.value },
                }))
              }
              className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl p-3 text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Poin-Poin Misi Kami:
              </label>
              <button
                type="button"
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    tentang: {
                      ...prev.tentang,
                      mission: [...prev.tentang.mission, 'Poin misi baru'],
                    },
                  }))
                }
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Misi
              </button>
            </div>
            <div className="space-y-2">
              {content.tentang.mission.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={m}
                    onChange={(e) => {
                      const updated = [...content.tentang.mission];
                      updated[idx] = e.target.value;
                      setContent((prev) => ({
                        ...prev,
                        tentang: { ...prev.tentang, mission: updated },
                      }));
                    }}
                    className="flex-1 bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = content.tentang.mission.filter((_, i) => i !== idx);
                      setContent((prev) => ({
                        ...prev,
                        tentang: { ...prev.tentang, mission: updated },
                      }));
                    }}
                    className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CARA ORDER */}
      {activeSubTab === 'caraOrder' && (
        <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            Pengaturan Konten: Cara Order
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Judul Panduan:
              </label>
              <input
                type="text"
                value={content.caraOrder.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    caraOrder: { ...prev.caraOrder, title: e.target.value },
                  }))
                }
                className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Sub Judul:
              </label>
              <input
                type="text"
                value={content.caraOrder.tagline}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    caraOrder: { ...prev.caraOrder, tagline: e.target.value },
                  }))
                }
                className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-300 block">
              Daftar Langkah Order (Langkah 1 - 6):
            </span>
            {content.caraOrder.steps.map((st, idx) => (
              <div
                key={st.number}
                className="bg-[#081024] border border-slate-800 rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {st.number}
                  </span>
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => {
                      const updated = [...content.caraOrder.steps];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setContent((prev) => ({
                        ...prev,
                        caraOrder: { ...prev.caraOrder, steps: updated },
                      }));
                    }}
                    placeholder="Judul langkah"
                    className="flex-1 bg-[#0c152e] border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <textarea
                  rows={2}
                  value={st.description}
                  onChange={(e) => {
                    const updated = [...content.caraOrder.steps];
                    updated[idx] = { ...updated[idx], description: e.target.value };
                    setContent((prev) => ({
                      ...prev,
                      caraOrder: { ...prev.caraOrder, steps: updated },
                    }));
                  }}
                  placeholder="Keterangan langkah"
                  className="w-full bg-[#0c152e] border border-slate-700 text-slate-300 rounded-lg p-2 text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: PEMBAYARAN */}
      {activeSubTab === 'pembayaran' && (
        <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            Pengaturan Konten: Pembayaran & Rekening Bank
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Judul Halaman:
              </label>
              <input
                type="text"
                value={content.pembayaran.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    pembayaran: { ...prev.pembayaran, title: e.target.value },
                  }))
                }
                className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Slogan / Tagline:
              </label>
              <input
                type="text"
                value={content.pembayaran.tagline}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    pembayaran: { ...prev.pembayaran, tagline: e.target.value },
                  }))
                }
                className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Bank Accounts Edit */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 block">
                Nomor Rekening Bank Penampung Resmi:
              </span>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                Atur Lengkap di Tab "Atur Data Bank"
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {content.pembayaran.bankInfo.accounts.map((acc, idx) => (
                <div
                  key={idx}
                  className="bg-[#081024] border border-slate-800 rounded-xl p-3 space-y-2"
                >
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                      Nama Bank:
                    </label>
                    <input
                      type="text"
                      value={acc.bank}
                      onChange={(e) => {
                        const updated = [...content.pembayaran.bankInfo.accounts];
                        updated[idx] = { ...updated[idx], bank: e.target.value };
                        setContent((prev) => ({
                          ...prev,
                          pembayaran: {
                            ...prev.pembayaran,
                            bankInfo: { ...prev.pembayaran.bankInfo, accounts: updated },
                          },
                        }));
                      }}
                      className="w-full bg-[#0c152e] border border-slate-700 text-white rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                      Nomor Rekening:
                    </label>
                    <input
                      type="text"
                      value={acc.accountNo}
                      onChange={(e) => {
                        const updated = [...content.pembayaran.bankInfo.accounts];
                        updated[idx] = { ...updated[idx], accountNo: e.target.value };
                        setContent((prev) => ({
                          ...prev,
                          pembayaran: {
                            ...prev.pembayaran,
                            bankInfo: { ...prev.pembayaran.bankInfo, accounts: updated },
                          },
                        }));
                      }}
                      className="w-full bg-[#0c152e] border border-slate-700 text-cyan-400 font-mono font-bold rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                      Atas Nama:
                    </label>
                    <input
                      type="text"
                      value={acc.holder}
                      onChange={(e) => {
                        const updated = [...content.pembayaran.bankInfo.accounts];
                        updated[idx] = { ...updated[idx], holder: e.target.value };
                        setContent((prev) => ({
                          ...prev,
                          pembayaran: {
                            ...prev.pembayaran,
                            bankInfo: { ...prev.pembayaran.bankInfo, accounts: updated },
                          },
                        }));
                      }}
                      className="w-full bg-[#0c152e] border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: FAQ */}
      {activeSubTab === 'faq' && (
        <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Kelola Tanya Jawab (FAQ)
            </h4>
            <button
              type="button"
              onClick={() => {
                const newItem: FAQItem = {
                  id: `faq-${Date.now()}`,
                  question: 'Pertanyaan baru?',
                  answer: 'Jawaban penjelasan untuk pertanyaan ini.',
                  category: 'Umum',
                };
                setContent((prev) => ({
                  ...prev,
                  faq: { ...prev.faq, items: [...prev.faq.items, newItem] },
                }));
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah FAQ
            </button>
          </div>

          <div className="space-y-3">
            {content.faq.items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-[#081024] border border-slate-800 rounded-xl p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded">
                    FAQ #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = content.faq.items.filter((f) => f.id !== item.id);
                      setContent((prev) => ({
                        ...prev,
                        faq: { ...prev.faq, items: updated },
                      }));
                    }}
                    className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors cursor-pointer"
                    title="Hapus FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                    Pertanyaan:
                  </label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const updated = [...content.faq.items];
                      updated[idx] = { ...updated[idx], question: e.target.value };
                      setContent((prev) => ({
                        ...prev,
                        faq: { ...prev.faq, items: updated },
                      }));
                    }}
                    className="w-full bg-[#0c152e] border border-slate-700 text-white font-bold rounded-lg px-3 py-1.5 text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                    Jawaban:
                  </label>
                  <textarea
                    rows={3}
                    value={item.answer}
                    onChange={(e) => {
                      const updated = [...content.faq.items];
                      updated[idx] = { ...updated[idx], answer: e.target.value };
                      setContent((prev) => ({
                        ...prev,
                        faq: { ...prev.faq, items: updated },
                      }));
                    }}
                    className="w-full bg-[#0c152e] border border-slate-700 text-slate-300 rounded-lg p-2.5 text-xs focus:border-amber-400 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: SYARAT & KETENTUAN */}
      {activeSubTab === 'terms' && (
        <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Pengaturan Syarat & Ketentuan
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Judul Dokumen:
              </label>
              <input
                type="text"
                value={content.terms.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    terms: { ...prev.terms, title: e.target.value },
                  }))
                }
                className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Tanggal Terakhir Diperbarui:
              </label>
              <input
                type="text"
                value={content.terms.lastUpdated}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    terms: { ...prev.terms, lastUpdated: e.target.value },
                  }))
                }
                className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {content.terms.sections.map((sec, idx) => (
              <div
                key={idx}
                className="bg-[#081024] border border-slate-800 rounded-xl p-3.5 space-y-2"
              >
                <label className="text-[11px] text-slate-400 font-bold block mb-1">
                  Pasal #{idx + 1} Judul:
                </label>
                <input
                  type="text"
                  value={sec.heading}
                  onChange={(e) => {
                    const updated = [...content.terms.sections];
                    updated[idx] = { ...updated[idx], heading: e.target.value };
                    setContent((prev) => ({
                      ...prev,
                      terms: { ...prev.terms, sections: updated },
                    }));
                  }}
                  className="w-full bg-[#0c152e] border border-slate-700 text-white font-bold rounded-lg px-3 py-1.5 text-xs"
                />
                <textarea
                  rows={3}
                  value={sec.paragraphs.join('\n\n')}
                  onChange={(e) => {
                    const updated = [...content.terms.sections];
                    updated[idx] = {
                      ...updated[idx],
                      paragraphs: e.target.value.split('\n\n').filter(Boolean),
                    };
                    setContent((prev) => ({
                      ...prev,
                      terms: { ...prev.terms, sections: updated },
                    }));
                  }}
                  className="w-full bg-[#0c152e] border border-slate-700 text-slate-300 rounded-lg p-2.5 text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: KEBIJAKAN PRIVASI */}
      {activeSubTab === 'privacy' && (
        <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Pengaturan Kebijakan Privasi
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Judul Dokumen:
              </label>
              <input
                type="text"
                value={content.privacy.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, title: e.target.value },
                  }))
                }
                className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Tanggal Terakhir Diperbarui:
              </label>
              <input
                type="text"
                value={content.privacy.lastUpdated}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, lastUpdated: e.target.value },
                  }))
                }
                className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {content.privacy.sections.map((sec, idx) => (
              <div
                key={idx}
                className="bg-[#081024] border border-slate-800 rounded-xl p-3.5 space-y-2"
              >
                <label className="text-[11px] text-slate-400 font-bold block mb-1">
                  Bagian #{idx + 1} Judul:
                </label>
                <input
                  type="text"
                  value={sec.heading}
                  onChange={(e) => {
                    const updated = [...content.privacy.sections];
                    updated[idx] = { ...updated[idx], heading: e.target.value };
                    setContent((prev) => ({
                      ...prev,
                      privacy: { ...prev.privacy, sections: updated },
                    }));
                  }}
                  className="w-full bg-[#0c152e] border border-slate-700 text-white font-bold rounded-lg px-3 py-1.5 text-xs"
                />
                <textarea
                  rows={3}
                  value={sec.paragraphs.join('\n\n')}
                  onChange={(e) => {
                    const updated = [...content.privacy.sections];
                    updated[idx] = {
                      ...updated[idx],
                      paragraphs: e.target.value.split('\n\n').filter(Boolean),
                    };
                    setContent((prev) => ({
                      ...prev,
                      privacy: { ...prev.privacy, sections: updated },
                    }));
                  }}
                  className="w-full bg-[#0c152e] border border-slate-700 text-slate-300 rounded-lg p-2.5 text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-[11px] text-slate-400">
          💡 Tips: Klik <strong>"Simpan Perubahan"</strong> setelah selesai mengedit agar tersimpan di sistem.
        </p>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Perubahan</span>
        </button>
      </div>
    </div>
  );
};
