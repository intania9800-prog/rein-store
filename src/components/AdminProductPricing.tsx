import React, { useState, useEffect } from 'react';
import {
  Tag,
  Coins,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  RotateCcw,
  Save,
  Percent,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpDown,
  Sliders,
  DollarSign,
  AlertCircle,
  X,
  Layers,
  Gamepad2,
  Smartphone,
  Zap,
  Globe,
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import {
  getStoredProducts,
  saveStoredProducts,
  updateVariantPrice,
  updateVariant,
  addVariant,
  deleteVariant,
  bulkAdjustPrices,
  resetStoredProducts,
  EVENT_PRODUCTS_UPDATED,
} from '../utils/productStorage';
import { ProductBrandIcon } from './icons/BrandLogos';

export const AdminProductPricing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    const list = getStoredProducts();
    return list[0]?.id || 'mlbb';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'game' | 'pulsa' | 'pln' | 'digital'>('all');
  const [successToast, setSuccessToast] = useState('');

  // Bulk Adjust State
  const [bulkAmount, setBulkAmount] = useState<number>(1000);
  const [bulkType, setBulkType] = useState<'fixed' | 'percent'>('fixed');

  // Add Variant Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVarName, setNewVarName] = useState('');
  const [newVarPrice, setNewVarPrice] = useState<number>(10000);
  const [newVarBonus, setNewVarBonus] = useState('');
  const [newVarDesc, setNewVarDesc] = useState('');

  // Edit Variant Modal State
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [editVarName, setEditVarName] = useState('');
  const [editVarPrice, setEditVarPrice] = useState<number>(0);
  const [editVarBonus, setEditVarBonus] = useState('');
  const [editVarDesc, setEditVarDesc] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getStoredProducts());
    };
    window.addEventListener(EVENT_PRODUCTS_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_PRODUCTS_UPDATED, handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Filter products for sidebar/selector
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variants.some((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handlePriceChange = (variantId: string, newPrice: number) => {
    if (!selectedProduct) return;
    const updated = updateVariantPrice(selectedProduct.id, variantId, newPrice);
    setProducts(updated);
    showToast(`✅ Harga nominal berhasil diperbarui jadi Rp ${new Intl.NumberFormat('id-ID').format(newPrice)}`);
  };

  const handleQuickAdjust = (variantId: string, currentPrice: number, delta: number) => {
    const targetPrice = Math.max(500, currentPrice + delta);
    handlePriceChange(variantId, targetPrice);
  };

  const handleApplyBulkAdjust = (isAdd: boolean) => {
    if (!selectedProduct) return;
    const sign = isAdd ? 1 : -1;
    const amount = bulkAmount * sign;

    const updated = bulkAdjustPrices(selectedProduct.id, bulkType, amount);
    setProducts(updated);
    showToast(
      `⚡ Berhasil ${isAdd ? 'menaikkan' : 'menurunkan'} seluruh harga ${selectedProduct.name} sebesar ${
        bulkType === 'percent' ? `${bulkAmount}%` : `Rp ${new Intl.NumberFormat('id-ID').format(bulkAmount)}`
      }`
    );
  };

  const handleSaveNewVariant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarName.trim() || !newVarPrice) {
      alert('Nama Nominal dan Harga Jual wajib diisi!');
      return;
    }
    const updated = addVariant(selectedProduct.id, {
      name: newVarName.trim(),
      price: Number(newVarPrice),
      bonus: newVarBonus.trim() || undefined,
      description: newVarDesc.trim() || undefined,
    });
    setProducts(updated);
    setIsAddModalOpen(false);
    setNewVarName('');
    setNewVarPrice(10000);
    setNewVarBonus('');
    setNewVarDesc('');
    showToast(`🎉 Nominal "${newVarName}" berhasil ditambahkan!`);
  };

  const handleOpenEdit = (v: ProductVariant) => {
    setEditingVariant(v);
    setEditVarName(v.name);
    setEditVarPrice(v.price);
    setEditVarBonus(v.bonus || '');
    setEditVarDesc(v.description || '');
  };

  const handleSaveEditVariant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariant) return;
    const updated = updateVariant(selectedProduct.id, editingVariant.id, {
      name: editVarName.trim(),
      price: Number(editVarPrice),
      bonus: editVarBonus.trim() || undefined,
      description: editVarDesc.trim() || undefined,
    });
    setProducts(updated);
    setEditingVariant(null);
    showToast(`✅ Detail nominal "${editVarName}" berhasil diperbarui!`);
  };

  const handleDeleteVariant = (variantId: string, varName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pilihan nominal "${varName}"?`)) {
      const updated = deleteVariant(selectedProduct.id, variantId);
      setProducts(updated);
      showToast(`🗑️ Nominal "${varName}" berhasil dihapus`);
    }
  };

  const handleReset = () => {
    if (confirm('Kembalikan seluruh harga nominal produk ke harga standar default toko?')) {
      const updated = resetStoredProducts();
      setProducts(updated);
      showToast('🔄 Seluruh harga nominal produk berhasil di-reset ke standar');
    }
  };

  const totalVariantsCount = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-slate-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-[#091024] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-black text-white">
                  Kelola & Atur Harga Nominal Produk
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Live Sinkron Kasir
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Sesuaikan nominal rupiah tiap pilihan paket diamond game, pulsa, token listrik, dan layanan digital. Harga yang Anda ubah langsung tampil otomatis di katalog toko dan modal checkout pesanan pembeli.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Nominal Baru</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset ke harga standar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
          </div>
        </div>

        {/* Counter Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Produk Aktif</span>
            <div className="text-xl font-black text-white mt-0.5">{products.length} Produk</div>
          </div>
          <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Pilihan Nominal</span>
            <div className="text-xl font-black text-amber-300 mt-0.5">{totalVariantsCount} Pilihan</div>
          </div>
          <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Produk Terpilih</span>
            <div className="text-xs font-bold text-cyan-300 mt-1 truncate">
              {selectedProduct ? selectedProduct.name : '-'}
            </div>
          </div>
          <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Rentang Harga</span>
            <div className="text-xs font-mono font-bold text-emerald-400 mt-1 truncate">
              {selectedProduct ? selectedProduct.priceRange : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Product Selector & Category Filter (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#091024] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Pilih Produk Toko</span>
              </span>
              <span className="text-[10px] text-slate-400">{filteredProducts.length} Ditemukan</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk / nominal..."
                className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl pl-8.5 pr-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'game', label: 'Game' },
                { id: 'pulsa', label: 'Pulsa' },
                { id: 'pln', label: 'PLN' },
                { id: 'digital', label: 'Digital' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    categoryFilter === c.id
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Product List */}
            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const isSelected = p.id === selectedProductId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500/70 bg-amber-500/10 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'border-slate-800/80 bg-[#070c1a] text-slate-300 hover:border-slate-700 hover:bg-[#0c152e]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                        <ProductBrandIcon type={p.iconType} className="w-5 h-5 object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {p.badge && (
                            <span className="text-[8px] font-black px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 uppercase">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {p.variants.length} Pilihan Nominal
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-amber-400 font-mono font-bold block">
                        Rp {new Intl.NumberFormat('id-ID').format(p.minPrice)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Variants Pricing Table & Bulk Tools (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedProduct ? (
            <>
              {/* Product Info & Quick Bulk Adjustment Box */}
              <div className="bg-[#091024] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                      <ProductBrandIcon type={selectedProduct.iconType} className="w-7 h-7 object-contain" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <span>{selectedProduct.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                          {selectedProduct.category}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Rentang: <strong className="text-emerald-400 font-mono">{selectedProduct.priceRange}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Nominal Baru</span>
                  </button>
                </div>

                {/* Bulk Price Modifier Tool */}
                <div className="bg-[#060c1c] border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-300 font-bold flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>Alat Markup / Diskon Massal Seluruh Nominal {selectedProduct.name}:</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Otomatis Dibulatkan ke Ratusan</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <div className="flex items-center bg-[#0c152e] border border-slate-700 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setBulkType('fixed')}
                        className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                          bulkType === 'fixed' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Rp (Rupiah)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBulkType('percent')}
                        className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                          bulkType === 'percent' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        % (Persen)
                      </button>
                    </div>

                    <input
                      type="number"
                      value={bulkAmount}
                      onChange={(e) => setBulkAmount(Number(e.target.value))}
                      placeholder="Contoh: 1000 atau 5"
                      className="w-32 bg-[#0c152e] border border-slate-700 text-white font-mono font-bold rounded-xl px-3 py-1.5 text-xs focus:border-amber-400 focus:outline-none"
                    />

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleApplyBulkAdjust(true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                        title="Naikkan harga seluruh nominal produk ini"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Naikkan (+{bulkType === 'percent' ? `${bulkAmount}%` : `Rp ${bulkAmount}`})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyBulkAdjust(false)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                        title="Turunkan harga seluruh nominal produk ini"
                      >
                        <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                        <span>Turunkan (-{bulkType === 'percent' ? `${bulkAmount}%` : `Rp ${bulkAmount}`})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Variants List / Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-bold uppercase tracking-wider text-white">
                    Daftar Pilihan Nominal ({selectedProduct.variants.length} Item)
                  </span>
                  <span>Ketik nominal baru langsung di kolom harga</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {selectedProduct.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="bg-[#091024] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Variant Name & Badges */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate">{variant.name}</h4>
                          {variant.bonus && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                              {variant.bonus}
                            </span>
                          )}
                        </div>
                        {variant.description && (
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{variant.description}</p>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono mt-1 block">ID: {variant.id}</span>
                      </div>

                      {/* Middle & Right: Price Input & Quick Adjusters */}
                      <div className="flex items-center gap-3 flex-wrap shrink-0">
                        {/* Quick +/- Rp 500 / 1000 buttons */}
                        <div className="flex items-center gap-1 bg-[#060a16] border border-slate-800 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(variant.id, variant.price, -1000)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer"
                            title="-1.000"
                          >
                            -1k
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(variant.id, variant.price, -500)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer"
                            title="-500"
                          >
                            -500
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(variant.id, variant.price, +500)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer"
                            title="+500"
                          >
                            +500
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(variant.id, variant.price, +1000)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer"
                            title="+1.000"
                          >
                            +1k
                          </button>
                        </div>

                        {/* Interactive Price Input */}
                        <div className="flex items-center bg-[#070c1c] border border-amber-500/50 rounded-xl px-2.5 py-1.5 shadow-[0_0_12px_rgba(245,158,11,0.1)]">
                          <span className="text-xs font-bold text-amber-400 mr-1.5">Rp</span>
                          <input
                            type="number"
                            defaultValue={variant.price}
                            key={variant.id + variant.price}
                            onBlur={(e) => {
                              const val = Number(e.target.value);
                              if (val && val !== variant.price) {
                                handlePriceChange(variant.id, val);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const target = e.currentTarget;
                                const val = Number(target.value);
                                if (val && val !== variant.price) {
                                  handlePriceChange(variant.id, val);
                                }
                                target.blur();
                              }
                            }}
                            className="w-28 bg-transparent text-white font-mono font-black text-sm text-right focus:outline-none"
                          />
                        </div>

                        {/* Edit & Delete Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(variant)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Ubah detail nominal & bonus"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVariant(variant.id, variant.name)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Hapus nominal ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#091024] border border-slate-800 rounded-3xl p-10 text-center text-slate-400">
              <Tag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold">Pilih produk di sebelah kiri untuk mengatur harga nominal.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Tambah Nominal Baru */}
      {isAddModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#091024] border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden my-auto animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0c152e]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Tambah Pilihan Nominal Baru</h3>
                  <p className="text-[11px] text-slate-400">Untuk produk: {selectedProduct.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewVariant} className="p-5 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Nama Nominal / Paket <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newVarName}
                  onChange={(e) => setNewVarName(e.target.value)}
                  placeholder="Contoh: 100 Diamonds atau Paket Harian"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Harga Jual Nominal (Rp) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={newVarPrice}
                  onChange={(e) => setNewVarPrice(Number(e.target.value))}
                  placeholder="25000"
                  className="w-full bg-[#0c152e] border border-amber-500/50 text-amber-300 font-mono font-bold text-sm rounded-xl px-3.5 py-2.5 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Badge / Tagline Promo (Opsional)
                </label>
                <input
                  type="text"
                  value={newVarBonus}
                  onChange={(e) => setNewVarBonus(e.target.value)}
                  placeholder="Contoh: Best Seller / Promo 10%"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Deskripsi / Keterangan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={newVarDesc}
                  onChange={(e) => setNewVarDesc(e.target.value)}
                  placeholder="Contoh: Masuk instan via Player ID"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Tambahkan Nominal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ubah Detail Nominal */}
      {editingVariant && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#091024] border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden my-auto animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0c152e]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Ubah Detail Nominal</h3>
                  <p className="text-[11px] text-slate-400">{selectedProduct.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingVariant(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditVariant} className="p-5 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Nama Nominal / Paket <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editVarName}
                  onChange={(e) => setEditVarName(e.target.value)}
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Harga Jual Nominal (Rp) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={editVarPrice}
                  onChange={(e) => setEditVarPrice(Number(e.target.value))}
                  className="w-full bg-[#0c152e] border border-amber-500/50 text-amber-300 font-mono font-bold text-sm rounded-xl px-3.5 py-2.5 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Badge / Tagline Promo
                </label>
                <input
                  type="text"
                  value={editVarBonus}
                  onChange={(e) => setEditVarBonus(e.target.value)}
                  placeholder="Contoh: Best Seller / Promo"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Deskripsi Tambahan
                </label>
                <input
                  type="text"
                  value={editVarDesc}
                  onChange={(e) => setEditVarDesc(e.target.value)}
                  placeholder="Keterangan singkat produk"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingVariant(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
