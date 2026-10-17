import React, { useState, useEffect, useRef } from 'react';
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
  Upload,
  Image as ImageIcon,
  ExternalLink,
  ShieldAlert,
  PackagePlus,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { Product, ProductVariant, CategoryType } from '../types';
import {
  getStoredProducts,
  saveStoredProducts,
  updateVariantPrice,
  updateVariant,
  addVariant,
  deleteVariant,
  addProduct,
  deleteProduct,
  updateProduct,
  bulkAdjustPrices,
  resetStoredProducts,
  EVENT_PRODUCTS_UPDATED,
} from '../utils/productStorage';
import { ProductBrandIcon } from './icons/BrandLogos';
import { fetchAllFromServer, getSyncStatus } from '../utils/syncManager';

// Available preset brand icons for quick selection
const PRESET_ICONS = [
  { id: 'mlbb', name: 'Mobile Legends' },
  { id: 'freefire', name: 'Free Fire' },
  { id: 'pubg', name: 'PUBG Mobile' },
  { id: 'genshin', name: 'Genshin Impact' },
  { id: 'pointblank', name: 'Point Blank' },
  { id: 'steam', name: 'Steam Wallet' },
  { id: 'googleplay', name: 'Google Play' },
  { id: 'telkomsel', name: 'Telkomsel' },
  { id: 'indosat', name: 'Indosat IM3' },
  { id: 'xl', name: 'XL Axiata' },
  { id: 'tri', name: 'Tri (3)' },
  { id: 'pln', name: 'PLN Listrik' },
  { id: 'treasury', name: 'Treasury Emas' },
  { id: 'adguard', name: 'DNS AdGuard' },
  { id: 'gestun', name: 'Gestun PayLater' },
  { id: 'dana', name: 'DANA E-Wallet' },
  { id: 'gopay', name: 'GoPay E-Wallet' },
  { id: 'ovo', name: 'OVO E-Wallet' },
  { id: 'shopeepay', name: 'ShopeePay' },
  { id: 'bca', name: 'Bank BCA' },
  { id: 'seabank', name: 'SeaBank' },
];

export const AdminProductPricing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    const list = getStoredProducts();
    return list[0]?.id || 'mlbb';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | CategoryType>('all');
  const [successToast, setSuccessToast] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Bulk Adjust State
  const [bulkAmount, setBulkAmount] = useState<number>(1000);
  const [bulkType, setBulkType] = useState<'fixed' | 'percent'>('fixed');

  // Add Product Modal State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<CategoryType>('game');
  const [newProdSubCategory, setNewProdSubCategory] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('');
  const [newProdInputLabel, setNewProdInputLabel] = useState('Nomor Akun / ID Pengguna');
  const [newProdInputPlaceholder, setNewProdInputPlaceholder] = useState('Masukkan ID Pengguna');
  const [newProdLogoType, setNewProdLogoType] = useState<'preset' | 'upload' | 'url'>('preset');
  const [newProdPresetIcon, setNewProdPresetIcon] = useState('mlbb');
  const [newProdCustomLogoUrl, setNewProdCustomLogoUrl] = useState('');
  const [newProdInitialVariants, setNewProdInitialVariants] = useState<Array<{ name: string; price: number; bonus?: string }>>([
    { name: 'Paket Dasar', price: 15000 },
    { name: 'Paket Menengah', price: 50000, bonus: 'Best Seller' },
    { name: 'Paket Sultan', price: 100000, bonus: 'Promo 10%' },
  ]);
  const newProdFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Product Modal State
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editProdName, setEditProdName] = useState('');
  const [editProdCategory, setEditProdCategory] = useState<CategoryType>('game');
  const [editProdSubCategory, setEditProdSubCategory] = useState('');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdBadge, setEditProdBadge] = useState('');
  const [editProdInputLabel, setEditProdInputLabel] = useState('');
  const [editProdInputPlaceholder, setEditProdInputPlaceholder] = useState('');
  const [editProdLogoType, setEditProdLogoType] = useState<'preset' | 'upload' | 'url'>('preset');
  const [editProdPresetIcon, setEditProdPresetIcon] = useState('mlbb');
  const [editProdCustomLogoUrl, setEditProdCustomLogoUrl] = useState('');
  const editProdFileInputRef = useRef<HTMLInputElement>(null);

  // Delete Product Confirmation State
  const [deleteProductConfirm, setDeleteProductConfirm] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

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
      const fresh = getStoredProducts();
      setProducts(fresh);
      if (!fresh.some((p) => p.id === selectedProductId) && fresh.length > 0) {
        setSelectedProductId(fresh[0].id);
      }
    };
    window.addEventListener(EVENT_PRODUCTS_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_PRODUCTS_UPDATED, handleUpdate);
  }, [selectedProductId]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Manual Trigger to re-sync across HP & PC
  const handleForceSync = async () => {
    setIsSyncing(true);
    await fetchAllFromServer();
    const fresh = getStoredProducts();
    setProducts(fresh);
    setIsSyncing(false);
    showToast('🔄 Data produk & pengaturan berhasil disinkronkan dengan server & HP!');
  };

  // Filter products for sidebar/selector
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.variants.some((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Handle Image Upload for New Product Logo
  const handleUploadNewProductLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar logo yang valid (PNG, JPG, WebP, SVG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setNewProdCustomLogoUrl(result);
        setNewProdLogoType('upload');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Image Upload for Edit Product Logo
  const handleUploadEditProductLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar logo yang valid (PNG, JPG, WebP, SVG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setEditProdCustomLogoUrl(result);
        setEditProdLogoType('upload');
      }
    };
    reader.readAsDataURL(file);
  };

  // CREATE NEW PRODUCT
  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      alert('Nama Produk wajib diisi!');
      return;
    }

    const prodId = 'prod-' + newProdName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) + '-' + Date.now().toString().slice(-4);
    
    let resolvedIconType = newProdPresetIcon;
    let resolvedCustomLogo: string | undefined = undefined;

    if (newProdLogoType === 'upload' || newProdLogoType === 'url') {
      resolvedCustomLogo = newProdCustomLogoUrl.trim() || undefined;
      resolvedIconType = 'custom';
    }

    const initialVars: ProductVariant[] = newProdInitialVariants.map((v, i) => ({
      id: `var-${Date.now()}-${i}`,
      name: v.name,
      price: Number(v.price) || 10000,
      bonus: v.bonus || undefined,
    }));

    const newProd: Product = {
      id: prodId,
      name: newProdName.trim(),
      category: newProdCategory,
      subCategory: newProdSubCategory.trim() || undefined,
      description: newProdDesc.trim() || `Layanan resmi dan top up ${newProdName.trim()} proses kilat otomatis 24 jam.`,
      badge: newProdBadge.trim() || undefined,
      inputLabel: newProdInputLabel.trim() || 'Nomor Akun / ID Pengguna',
      inputPlaceholder: newProdInputPlaceholder.trim() || 'Masukkan ID Pengguna',
      iconType: resolvedIconType,
      customLogoUrl: resolvedCustomLogo,
      minPrice: 0,
      maxPrice: 0,
      priceRange: '',
      variants: initialVars.length > 0 ? initialVars : [{ id: `var-${Date.now()}`, name: 'Nominal Standar', price: 10000 }],
    };

    const updated = addProduct(newProd);
    setProducts(updated);
    setSelectedProductId(prodId);
    setIsAddProductModalOpen(false);

    // Reset inputs
    setNewProdName('');
    setNewProdSubCategory('');
    setNewProdDesc('');
    setNewProdBadge('');
    setNewProdCustomLogoUrl('');
    setNewProdLogoType('preset');
    if (newProdFileInputRef.current) newProdFileInputRef.current.value = '';

    showToast(`🎉 Produk baru "${newProd.name}" berhasil ditambahkan ke toko & disinkronkan ke HP!`);
  };

  // OPEN EDIT PRODUCT MODAL
  const handleOpenEditProduct = (p: Product) => {
    setEditProdName(p.name);
    setEditProdCategory(p.category);
    setEditProdSubCategory(p.subCategory || '');
    setEditProdDesc(p.description || '');
    setEditProdBadge(p.badge || '');
    setEditProdInputLabel(p.inputLabel || '');
    setEditProdInputPlaceholder(p.inputPlaceholder || '');
    if (p.customLogoUrl) {
      setEditProdCustomLogoUrl(p.customLogoUrl);
      setEditProdLogoType(p.customLogoUrl.startsWith('data:') ? 'upload' : 'url');
    } else {
      setEditProdPresetIcon(p.iconType || 'mlbb');
      setEditProdCustomLogoUrl('');
      setEditProdLogoType('preset');
    }
    setIsEditProductModalOpen(true);
  };

  // SAVE EDIT PRODUCT DETAILS
  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!editProdName.trim()) {
      alert('Nama Produk tidak boleh kosong!');
      return;
    }

    let finalIconType = selectedProduct.iconType;
    let finalCustomLogoUrl: string | undefined = selectedProduct.customLogoUrl;

    if (editProdLogoType === 'preset') {
      finalIconType = editProdPresetIcon;
      finalCustomLogoUrl = undefined;
    } else {
      finalIconType = 'custom';
      finalCustomLogoUrl = editProdCustomLogoUrl.trim() || undefined;
    }

    const updated = updateProduct(selectedProduct.id, {
      name: editProdName.trim(),
      category: editProdCategory,
      subCategory: editProdSubCategory.trim() || undefined,
      description: editProdDesc.trim(),
      badge: editProdBadge.trim() || undefined,
      inputLabel: editProdInputLabel.trim() || undefined,
      inputPlaceholder: editProdInputPlaceholder.trim() || undefined,
      iconType: finalIconType,
      customLogoUrl: finalCustomLogoUrl,
    });

    setProducts(updated);
    setIsEditProductModalOpen(false);
    showToast(`✅ Detail dan Logo produk "${editProdName}" berhasil diperbarui & disinkronkan!`);
  };

  // EXECUTE DELETE PRODUCT
  const handleExecuteDeleteProduct = () => {
    if (!deleteProductConfirm.product) return;
    const target = deleteProductConfirm.product;
    const updated = deleteProduct(target.id);
    setProducts(updated);
    if (updated.length > 0) {
      setSelectedProductId(updated[0].id);
    }
    setDeleteProductConfirm({ isOpen: false, product: null });
    showToast(`🗑️ Produk "${target.name}" berhasil dihapus dari toko.`);
  };

  // Price Variant Handlers
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
    if (!selectedProduct) return;
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
    if (!selectedProduct || !editingVariant) return;
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
    if (!selectedProduct) return;
    if (confirm(`Apakah Anda yakin ingin menghapus pilihan nominal "${varName}"?`)) {
      const updated = deleteVariant(selectedProduct.id, variantId);
      setProducts(updated);
      showToast(`🗑️ Nominal "${varName}" berhasil dihapus`);
    }
  };

  const handleReset = () => {
    if (confirm('Kembalikan seluruh produk dan harga nominal ke daftar standar toko?')) {
      const updated = resetStoredProducts();
      setProducts(updated);
      showToast('🔄 Seluruh produk berhasil di-reset ke standar');
    }
  };

  const totalVariantsCount = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-slate-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header with Add Product & Sync Controls */}
      <div className="bg-[#091024] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-cyan-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
              <PackagePlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-black text-white">
                  Kelola Produk & Harga (Tambah / Hapus Produk, Atur Logo & Harga)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sinkron Otomatis HP & PC
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Tambah produk baru ke katalog, hapus produk lama, sesuaikan logo produk (upload file / URL / ikon preset), dan atur harga nominal rupiah. Perubahan langsung tersinkronkan antara HP dan PC/Laptop secara real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* ADD NEW PRODUCT BUTTON */}
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-98"
            >
              <PackagePlus className="w-4 h-4" />
              <span>+ Tambah Produk Baru</span>
            </button>

            {/* FORCE SYNC BUTTON */}
            <button
              onClick={handleForceSync}
              disabled={isSyncing}
              className="px-3.5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Sinkronkan data HP dan PC sekarang"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sinkronkan HP & PC</span>
            </button>

            {/* RESET BUTTON */}
            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Kembalikan ke produk default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Default</span>
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
                <span>Daftar Produk Toko</span>
              </span>
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Produk Baru</span>
              </button>
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
                        <ProductBrandIcon type={p.iconType} customLogoUrl={p.customLogoUrl} className="w-5 h-5 object-contain" />
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
                          {p.variants.length} Nominal • {p.category.toUpperCase()}
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

        {/* Right Col: Selected Product Management & Variants Table (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedProduct ? (
            <>
              {/* Product Info & Management Header */}
              <div className="bg-[#091024] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-inner p-1">
                      <ProductBrandIcon
                        type={selectedProduct.iconType}
                        customLogoUrl={selectedProduct.customLogoUrl}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-white">{selectedProduct.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                          {selectedProduct.category}
                        </span>
                        {selectedProduct.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                            {selectedProduct.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {selectedProduct.description}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Target: {selectedProduct.inputLabel || 'ID Pengguna'} • Rentang: <strong className="text-emerald-400">{selectedProduct.priceRange}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Product Actions: Edit Info, Change Logo, Delete Product */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditProduct(selectedProduct)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Ubah nama, kategori, dan logo produk"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Atur Logo & Info</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteProductConfirm({ isOpen: true, product: selectedProduct })}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Hapus produk ini dari toko"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Hapus Produk</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Nominal</span>
                    </button>
                  </div>
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
                    Pilihan Nominal ({selectedProduct.variants.length} Item)
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
              <p className="text-sm font-semibold">Pilih produk di sebelah kiri untuk mengatur harga dan logo.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: TAMBAH PRODUK BARU */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#091024] border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden my-auto animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0c152e]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">Tambah Produk Baru ke Toko</h3>
                  <p className="text-xs text-slate-400">Atur nama, kategori, logo kustom, dan nominal awal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Nama Produk <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Contoh: Honor of Kings / Netflix Premium"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Kategori <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as CategoryType)}
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="game">Game (Mobile / PC)</option>
                    <option value="pulsa">Pulsa & Paket Data</option>
                    <option value="pln">Token Listrik / PLN</option>
                    <option value="digital">Layanan Digital / Hiburan</option>
                    <option value="tagihan">PPOB / Tagihan</option>
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Publisher / Provider (Opsional)
                  </label>
                  <input
                    type="text"
                    value={newProdSubCategory}
                    onChange={(e) => setNewProdSubCategory(e.target.value)}
                    placeholder="Contoh: Level Infinite / Telkomsel / Riot Games"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                {/* Badge Promo */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Badge / Tagline Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    value={newProdBadge}
                    onChange={(e) => setNewProdBadge(e.target.value)}
                    placeholder="Contoh: NEW, HOT, EVENT SPESIAL"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                {/* Target Account Label */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Label Input Akun Pembeli
                  </label>
                  <input
                    type="text"
                    value={newProdInputLabel}
                    onChange={(e) => setNewProdInputLabel(e.target.value)}
                    placeholder="Contoh: User ID & Zone ID / No HP"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                {/* Target Account Placeholder */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Placeholder Kotak Input
                  </label>
                  <input
                    type="text"
                    value={newProdInputPlaceholder}
                    onChange={(e) => setNewProdInputPlaceholder(e.target.value)}
                    placeholder="Contoh: Masukkan ID Pengguna"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Keterangan singkat produk..."
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2 text-xs focus:border-emerald-400 focus:outline-none"
                />
              </div>

              {/* LOGO CONFIGURATION BOX */}
              <div className="bg-[#060c1c] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>Pengaturan Logo Produk:</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Pilih Preset, Upload File, atau URL</span>
                </div>

                {/* Logo Type Tabs */}
                <div className="flex items-center gap-2 bg-[#0c152e] p-1 rounded-xl border border-slate-700 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setNewProdLogoType('preset')}
                    className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      newProdLogoType === 'preset' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ikon Preset Brand
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProdLogoType('upload')}
                    className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      newProdLogoType === 'upload' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Upload File Logo
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProdLogoType('url')}
                    className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      newProdLogoType === 'url' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Link URL Gambar
                  </button>
                </div>

                {/* Preset Picker */}
                {newProdLogoType === 'preset' && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                    {PRESET_ICONS.map((icon) => (
                      <button
                        type="button"
                        key={icon.id}
                        onClick={() => setNewProdPresetIcon(icon.id)}
                        className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                          newProdPresetIcon === icon.id
                            ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
                            : 'border-slate-800 bg-[#081024] text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <ProductBrandIcon type={icon.id} className="w-5 h-5 shrink-0" />
                        <span className="text-[10px] font-bold truncate">{icon.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Upload from Device */}
                {newProdLogoType === 'upload' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        ref={newProdFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadNewProductLogo}
                        className="hidden"
                        id="new-product-file-input"
                      />
                      <label
                        htmlFor="new-product-file-input"
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Pilih Gambar Logo dari HP / Komputer</span>
                      </label>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WebP, SVG</span>
                    </div>

                    {newProdCustomLogoUrl && (
                      <div className="flex items-center gap-3 p-2 bg-[#0c152e] border border-cyan-500/40 rounded-xl">
                        <img src={newProdCustomLogoUrl} alt="Preview" className="w-10 h-10 object-contain rounded-lg bg-black/50 p-1" />
                        <span className="text-xs text-emerald-400 font-semibold">Logo berhasil diunggah!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* URL Input */}
                {newProdLogoType === 'url' && (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={newProdCustomLogoUrl}
                      onChange={(e) => setNewProdCustomLogoUrl(e.target.value)}
                      placeholder="https://domain.com/logo-game.png"
                      className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                    />
                    {newProdCustomLogoUrl && (
                      <div className="flex items-center gap-3 p-2 bg-[#0c152e] border border-cyan-500/40 rounded-xl">
                        <img src={newProdCustomLogoUrl} alt="Preview" className="w-10 h-10 object-contain rounded-lg bg-black/50 p-1" />
                        <span className="text-xs text-cyan-300 font-semibold">Preview link logo</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* INITIAL NOMINALS (Can be customized right now) */}
              <div className="bg-[#060c1c] border border-slate-800 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-white block">
                  Pilihan Nominal Awal (Otomatis dibuat):
                </span>
                <div className="space-y-2">
                  {newProdInitialVariants.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const copy = [...newProdInitialVariants];
                          copy[idx].name = e.target.value;
                          setNewProdInitialVariants(copy);
                        }}
                        placeholder="Nama Paket"
                        className="flex-1 bg-[#0c152e] border border-slate-700 text-white text-xs rounded-xl px-3 py-2"
                      />
                      <div className="flex items-center bg-[#0c152e] border border-slate-700 rounded-xl px-2.5 py-1.5 w-36">
                        <span className="text-xs text-amber-400 mr-1 font-bold">Rp</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const copy = [...newProdInitialVariants];
                            copy[idx].price = Number(e.target.value);
                            setNewProdInitialVariants(copy);
                          }}
                          className="w-full bg-transparent text-white text-xs font-mono font-bold text-right focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Simpan Produk Baru ke Toko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT & LOGO */}
      {isEditProductModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#091024] border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden my-auto animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0c152e]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">Atur Info & Logo Produk</h3>
                  <p className="text-xs text-slate-400">Ubah identitas, logo, dan kategori {selectedProduct.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProductModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Nama Produk <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editProdName}
                    onChange={(e) => setEditProdName(e.target.value)}
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Kategori <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={editProdCategory}
                    onChange={(e) => setEditProdCategory(e.target.value as CategoryType)}
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-400 focus:outline-none"
                  >
                    <option value="game">Game (Mobile / PC)</option>
                    <option value="pulsa">Pulsa & Paket Data</option>
                    <option value="pln">Token Listrik / PLN</option>
                    <option value="digital">Layanan Digital / Hiburan</option>
                    <option value="tagihan">PPOB / Tagihan</option>
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Publisher / Provider
                  </label>
                  <input
                    type="text"
                    value={editProdSubCategory}
                    onChange={(e) => setEditProdSubCategory(e.target.value)}
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Badge Promo */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Badge / Tagline Khusus
                  </label>
                  <input
                    type="text"
                    value={editProdBadge}
                    onChange={(e) => setEditProdBadge(e.target.value)}
                    placeholder="Contoh: NEW, HOT, EVENT SPESIAL"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Target Account Label */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Label Input Akun Pembeli
                  </label>
                  <input
                    type="text"
                    value={editProdInputLabel}
                    onChange={(e) => setEditProdInputLabel(e.target.value)}
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Target Account Placeholder */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Placeholder Kotak Input
                  </label>
                  <input
                    type="text"
                    value={editProdInputPlaceholder}
                    onChange={(e) => setEditProdInputPlaceholder(e.target.value)}
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={2}
                  value={editProdDesc}
                  onChange={(e) => setEditProdDesc(e.target.value)}
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2 text-xs focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* LOGO CONFIGURATION BOX */}
              <div className="bg-[#060c1c] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>Ubah Logo Produk:</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Pilih Preset, Upload File, atau URL</span>
                </div>

                {/* Logo Type Tabs */}
                <div className="flex items-center gap-2 bg-[#0c152e] p-1 rounded-xl border border-slate-700 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setEditProdLogoType('preset')}
                    className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      editProdLogoType === 'preset' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ikon Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditProdLogoType('upload')}
                    className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      editProdLogoType === 'upload' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Upload Gambar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditProdLogoType('url')}
                    className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      editProdLogoType === 'url' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    URL Gambar
                  </button>
                </div>

                {/* Preset Picker */}
                {editProdLogoType === 'preset' && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                    {PRESET_ICONS.map((icon) => (
                      <button
                        type="button"
                        key={icon.id}
                        onClick={() => setEditProdPresetIcon(icon.id)}
                        className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                          editProdPresetIcon === icon.id
                            ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
                            : 'border-slate-800 bg-[#081024] text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <ProductBrandIcon type={icon.id} className="w-5 h-5 shrink-0" />
                        <span className="text-[10px] font-bold truncate">{icon.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Upload from Device */}
                {editProdLogoType === 'upload' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        ref={editProdFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadEditProductLogo}
                        className="hidden"
                        id="edit-product-file-input"
                      />
                      <label
                        htmlFor="edit-product-file-input"
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Pilih File Logo Baru</span>
                      </label>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WebP, SVG</span>
                    </div>

                    {editProdCustomLogoUrl && (
                      <div className="flex items-center gap-3 p-2 bg-[#0c152e] border border-cyan-500/40 rounded-xl">
                        <img src={editProdCustomLogoUrl} alt="Preview" className="w-10 h-10 object-contain rounded-lg bg-black/50 p-1" />
                        <span className="text-xs text-emerald-400 font-semibold">Logo baru siap digunakan!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* URL Input */}
                {editProdLogoType === 'url' && (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={editProdCustomLogoUrl}
                      onChange={(e) => setEditProdCustomLogoUrl(e.target.value)}
                      placeholder="https://domain.com/logo-game.png"
                      className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                    />
                    {editProdCustomLogoUrl && (
                      <div className="flex items-center gap-3 p-2 bg-[#0c152e] border border-cyan-500/40 rounded-xl">
                        <img src={editProdCustomLogoUrl} alt="Preview" className="w-10 h-10 object-contain rounded-lg bg-black/50 p-1" />
                        <span className="text-xs text-cyan-300 font-semibold">Preview URL Logo</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  Simpan Perubahan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS PRODUK */}
      {deleteProductConfirm.isOpen && deleteProductConfirm.product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#091024] border border-rose-500/40 rounded-3xl w-full max-w-md shadow-2xl p-6 text-center space-y-4 my-auto animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">Hapus Produk Ini dari Toko?</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Apakah Anda yakin ingin menghapus produk <strong className="text-rose-400">{deleteProductConfirm.product.name}</strong> ({deleteProductConfirm.product.variants.length} pilihan nominal)? Produk akan seketika hilang dari katalog toko di HP dan PC.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteProductConfirm({ isOpen: false, product: null })}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteDeleteProduct}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Ya, Hapus Produk
              </button>
            </div>
          </div>
        </div>
      )}

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
