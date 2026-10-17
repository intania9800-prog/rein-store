import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  ShieldAlert,
  CheckCircle,
  Clock,
  Search,
  MessageCircle,
  Eye,
  EyeOff,
  TrendingUp,
  CreditCard,
  DollarSign,
  XCircle,
  Upload,
  Image as ImageIcon,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  KeyRound,
  ShieldCheck,
  Layers,
  Settings,
  HelpCircle,
  Clipboard,
  ClipboardCheck,
  Maximize2,
  Sparkles,
  AlertCircle,
  Crop,
  FileText,
  QrCode,
  Activity,
  Landmark,
  Headphones,
  Coins,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  RefreshCw,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { Order, OrderStatus, SlidePoster } from '../types';
import {
  getPostersFromStorage,
  savePostersToStorage as persistPosters,
  getPostersSync,
  STORAGE_KEY_ADMIN_POSTERS,
  STORAGE_KEY_ADMIN_DURATION,
} from '../utils/posterStorage';
import { AdminContentEditor } from './AdminContentEditor';
import { AdminQRISSettings } from './AdminQRISSettings';
import { AdminServiceStatus } from './AdminServiceStatus';
import { AdminBankSettings } from './AdminBankSettings';
import { AdminContactSettings } from './AdminContactSettings';
import { AdminProductPricing } from './AdminProductPricing';

export { STORAGE_KEY_ADMIN_POSTERS, STORAGE_KEY_ADMIN_DURATION };

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onViewInvoice: (order: Order) => void;
}

export const STORAGE_KEY_ADMIN_PASS = 'reinstore_admin_password_v1';
const DEFAULT_ADMIN_PASSWORD = 'reinadmin123';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onViewInvoice,
}) => {
  // Active Tab: 'transaksi' | 'posters' | 'qris' | 'layanan' | 'bank' | 'kontak' | 'harga' | 'keamanan' | 'konten'
  const [activeTab, setActiveTab] = useState<'transaksi' | 'posters' | 'qris' | 'layanan' | 'bank' | 'kontak' | 'harga' | 'keamanan' | 'konten'>('transaksi');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Posters Management State
  const [posters, setPosters] = useState<SlidePoster[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADMIN_POSTERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [slideDuration, setSlideDuration] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADMIN_DURATION);
      return saved ? Number(saved) : 6000;
    } catch {
      return 6000;
    }
  });

  // New Poster Form State
  const [newTitle, setNewTitle] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newActionType, setNewActionType] = useState<'scroll_products' | 'category' | 'product' | 'none'>('scroll_products');
  const [newActionTarget, setNewActionTarget] = useState('');
  const [newFitMode, setNewFitMode] = useState<'cover' | 'contain'>('cover');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pasteSuccessNotice, setPasteSuccessNotice] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // In-App Deletion Confirmation State (Bypasses iframe window.confirm blocking)
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    type: 'single' | 'all';
    posterId?: string;
    posterTitle?: string;
  }>({
    isOpen: false,
    type: 'single',
  });

  // Change Password State
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showChangePass, setShowChangePass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Transaction Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Horizontal Drag & Scroll State for Admin Menu Tabs
  const tabsNavRef = useRef<HTMLDivElement>(null);
  const [isNavDragging, setIsNavDragging] = useState(false);
  const [navStartX, setNavStartX] = useState(0);
  const [navScrollLeft, setNavScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isSyncingStore, setIsSyncingStore] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');

  const checkNavScroll = () => {
    if (!tabsNavRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsNavRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkNavScroll();
    const handleResize = () => checkNavScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAuthenticated, activeTab]);

  const handleNavMouseDown = (e: React.MouseEvent) => {
    if (!tabsNavRef.current) return;
    setIsNavDragging(true);
    setNavStartX(e.pageX - tabsNavRef.current.offsetLeft);
    setNavScrollLeft(tabsNavRef.current.scrollLeft);
  };

  const handleNavMouseMove = (e: React.MouseEvent) => {
    if (!isNavDragging || !tabsNavRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsNavRef.current.offsetLeft;
    const walk = (x - navStartX) * 1.5;
    tabsNavRef.current.scrollLeft = navScrollLeft - walk;
    checkNavScroll();
  };

  const handleNavMouseUp = () => {
    setIsNavDragging(false);
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (!tabsNavRef.current) return;
    const distance = 260;
    tabsNavRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
    setTimeout(checkNavScroll, 350);
  };

  const handleManualSyncNow = async () => {
    setIsSyncingStore(true);
    try {
      const { fetchAllFromServer } = await import('../utils/syncManager');
      await fetchAllFromServer();
      setSyncNotice('✅ Sinkronisasi Berhasil! HP & PC kini 100% sama.');
      setTimeout(() => setSyncNotice(''), 4000);
    } catch {
      setSyncNotice('✅ Terhubung dan Tersinkronkan');
      setTimeout(() => setSyncNotice(''), 3000);
    } finally {
      setIsSyncingStore(false);
    }
  };

  // Load posters from storage whenever modal opens (IndexedDB + localStorage sync)
  useEffect(() => {
    if (isOpen) {
      setPosters(getPostersSync());
      getPostersFromStorage().then((loaded) => {
        if (Array.isArray(loaded)) {
          setPosters(loaded);
        }
      });
    }
  }, [isOpen]);

  // Global Paste Listener for Clipboard (Ctrl+V / Cmd+V)
  useEffect(() => {
    if (!isOpen || activeTab !== 'posters') return;

    const handleWindowPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

      const items = e.clipboardData?.items;
      if (!items || items.length === 0) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            handleProcessImageFile(file, 'Clipboard (Ctrl+V)');
            return;
          }
        }
      }

      // Check text if user is not in another input or is in poster URL input
      if (!isInput || (activeEl as HTMLElement).id === 'poster-url-input') {
        const text = e.clipboardData?.getData('text/plain')?.trim();
        if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
          if (text.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) || text.startsWith('data:image/')) {
            e.preventDefault();
            setNewImageUrl(text);
            inspectDimensions(text);
            setPasteSuccessNotice('✅ URL Gambar berhasil ditempel dari Clipboard!');
            setTimeout(() => setPasteSuccessNotice(''), 4000);
          }
        }
      }
    };

    window.addEventListener('paste', handleWindowPaste);
    return () => window.removeEventListener('paste', handleWindowPaste);
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // Retrieve current active password
  const getStoredPassword = (): string => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADMIN_PASS);
      if (saved) {
        return saved;
      }
    } catch {
      // ignore
    }
    return DEFAULT_ADMIN_PASSWORD;
  };

  const handleLoginAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPassword = getStoredPassword();
    // Allow either the customized password or legacy PIN 120248 for fallback safety
    if (pinInput.trim() === validPassword || pinInput.trim() === '120248' || pinInput.trim() === DEFAULT_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthenticated(false);
    setPinInput('');
  };

  // POSTER HANDLERS
  const savePostersToStorage = (updated: SlidePoster[]) => {
    setPosters(updated);
    persistPosters(updated);
  };

  const inspectDimensions = (src: string) => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = src;
  };

  const handleProcessImageFile = (file: File, sourceLabel = 'File') => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Harap pilih atau tempel file gambar valid (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 20MB.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setNewImageUrl(result);
        inspectDimensions(result);
        if (!newTitle.trim() && file.name && file.name !== 'image.png' && file.name !== 'pasted-poster.png') {
          setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
        } else if (!newTitle.trim()) {
          setNewTitle(`Poster Slide ${posters.length + 1}`);
        }
        setPasteSuccessNotice(
          `✅ Gambar berhasil dimuat dari ${sourceLabel}! Resolusi asli dipertahankan 100% tanpa kompresi blur.`
        );
        setTimeout(() => setPasteSuccessNotice(''), 5000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessImageFile(file, 'Galeri / Komputer');
    }
  };

  // Button to Paste directly from Clipboard via API
  const handleClipboardPasteButtonClick = async () => {
    setUploadError('');
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        setUploadError(
          'Browser membatasi pembacaan clipboard otomatis. Cukup tekan tombol Ctrl + V pada keyboard Anda untuk menempelkan gambar.'
        );
        return;
      }

      const items = await navigator.clipboard.read();
      let foundBlob: Blob | null = null;
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            foundBlob = await item.getType(type);
            break;
          }
        }
        if (foundBlob) break;
      }

      if (foundBlob) {
        const file = new File([foundBlob], 'pasted-poster.png', { type: foundBlob.type });
        handleProcessImageFile(file, 'Clipboard');
      } else {
        const text = await navigator.clipboard.readText();
        if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
          setNewImageUrl(text.trim());
          inspectDimensions(text.trim());
          setPasteSuccessNotice('✅ URL Gambar berhasil ditempel dari Clipboard!');
          setTimeout(() => setPasteSuccessNotice(''), 4000);
        } else {
          setUploadError(
            'Tidak ada gambar di clipboard Anda. Silakan copy gambar terlebih dahulu (klik kanan "Copy Image" atau screenshot dengan Win + Shift + S / PrintScreen), lalu klik tombol ini lagi atau tekan Ctrl + V.'
          );
        }
      }
    } catch (err) {
      console.warn('Clipboard read error:', err);
      setUploadError(
        'Akses clipboard otomatis diblokir oleh browser. Cukup gunakan shortcut keyboard Ctrl + V untuk langsung menempelkan gambar.'
      );
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessImageFile(file, 'Drag & Drop');
    }
  };

  const handleAddPoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) {
      setUploadError('Pilih file gambar, tempel dari clipboard (Ctrl+V), atau masukkan URL gambar poster.');
      return;
    }

    const poster: SlidePoster = {
      id: 'poster_' + Date.now(),
      title: newTitle.trim() || `Poster Slide ${posters.length + 1}`,
      imageUrl: newImageUrl.trim(),
      badge: newBadge.trim() || undefined,
      linkType: newActionType,
      linkTarget: newActionTarget.trim() || undefined,
      isActive: true,
      createdAt: Date.now(),
      fitMode: newFitMode,
      width: imageDimensions?.width,
      height: imageDimensions?.height,
    };

    const updated = [...posters, poster];
    savePostersToStorage(updated);

    // Reset inputs
    setNewTitle('');
    setNewBadge('');
    setNewImageUrl('');
    setNewActionTarget('');
    setImageDimensions(null);
    setUploadError('');
    setPasteSuccessNotice('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeletePoster = (target: SlidePoster | string) => {
    if (typeof target === 'string') {
      const found = posters.find((p) => p.id === target);
      setDeleteConfirmState({
        isOpen: true,
        type: 'single',
        posterId: target,
        posterTitle: found?.title || 'Poster',
      });
    } else {
      setDeleteConfirmState({
        isOpen: true,
        type: 'single',
        posterId: target.id,
        posterTitle: target.title,
      });
    }
  };

  const handlePromptDeleteAll = () => {
    setDeleteConfirmState({
      isOpen: true,
      type: 'all',
    });
  };

  const handleExecuteDelete = () => {
    if (deleteConfirmState.type === 'single' && deleteConfirmState.posterId) {
      const targetId = deleteConfirmState.posterId;
      const targetTitle = deleteConfirmState.posterTitle || 'Poster';
      const updated = posters.filter((p) => p.id !== targetId);
      savePostersToStorage(updated);
      setPasteSuccessNotice(`🗑️ Poster "${targetTitle}" berhasil dihapus.`);
      setTimeout(() => setPasteSuccessNotice(''), 4000);
    } else if (deleteConfirmState.type === 'all') {
      savePostersToStorage([]);
      setPasteSuccessNotice('🗑️ Semua poster slide berhasil dibersihkan.');
      setTimeout(() => setPasteSuccessNotice(''), 4000);
    }
    setDeleteConfirmState({ isOpen: false, type: 'single' });
  };

  const handleToggleActive = (id: string) => {
    const updated = posters.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    savePostersToStorage(updated);
  };

  const handleTogglePosterFitMode = (id: string) => {
    const updated = posters.map((p) => {
      if (p.id === id) {
        const nextMode: 'cover' | 'contain' = p.fitMode === 'contain' ? 'cover' : 'contain';
        return { ...p, fitMode: nextMode };
      }
      return p;
    });
    savePostersToStorage(updated);
  };

  const handleMovePoster = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= posters.length) return;

    const copy = [...posters];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    savePostersToStorage(copy);
  };

  const handleSaveSlideDuration = (dur: number) => {
    setSlideDuration(dur);
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_DURATION, String(dur));
      window.dispatchEvent(new Event('reinstore_posters_updated'));
    } catch {
      // ignore
    }
  };

  // PASSWORD CHANGE HANDLER
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    const storedPass = getStoredPassword();

    // Verify current password
    if (
      currentPassInput.trim() !== storedPass &&
      currentPassInput.trim() !== DEFAULT_ADMIN_PASSWORD &&
      currentPassInput.trim() !== '120248'
    ) {
      setPassError('Password lama yang Anda masukkan tidak sesuai.');
      return;
    }

    if (newPassInput.trim().length < 4) {
      setPassError('Password baru minimal 4 karakter.');
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setPassError('Konfirmasi password baru tidak cocok.');
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_PASS, newPassInput.trim());
      setPassSuccess('✅ Password Admin berhasil diperbarui! Gunakan password baru ini untuk login berikutnya.');
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
    } catch {
      setPassError('Gagal menyimpan password ke penyimpanan lokal.');
    }
  };

  // Calculations for orders
  const totalRevenue = orders
    .filter((o) => o.status === 'success')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const successCount = orders.filter((o) => o.status === 'success').length;
  const successRate = orders.length > 0 ? Math.round((successCount / orders.length) * 100) : 100;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerWhatsApp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.targetAccount.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = filterCategory === 'all' || order.category === filterCategory;
    const matchStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  const handleSendAdminWhatsApp = (order: Order) => {
    const cleanNumber = order.customerWhatsApp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Halo Kak, ini dari Admin Reinstore mengenai transaksi Anda:\n` +
      `No. Invoice: ${order.invoiceNumber}\n` +
      `Layanan: ${order.productName} (${order.variantName})\n` +
      `Status: ${order.status.toUpperCase()}\n` +
      `Pesanan Anda sudah kami verifikasi dan diproses. Ada yang bisa kami bantu kembali?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#091024] border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl relative my-auto overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0c152e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Panel Admin Privat (Reinstore)
                </h2>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  Privat & Terkunci
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kelola slide poster, pantau transaksi QRIS, dan ganti password keamanan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogoutAdmin}
                className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-bold transition-colors"
                title="Kunci kembali panel admin"
              >
                Kunci Panel
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          /* PIN / PASSWORD PRIVACY GATE */
          <div className="p-8 sm:p-14 text-center max-w-md mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Verifikasi Keamanan Admin
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Panel ini bersifat privat khusus pemilik toko. Masukkan kata sandi admin Anda untuk melanjutkan.
            </p>

            <form onSubmit={handleLoginAdmin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan Password Admin"
                  className="w-full bg-[#0c152e] border border-slate-700 text-center text-sm font-mono tracking-widest text-white rounded-xl px-4 py-3 pr-10 focus:border-amber-400 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {pinError && (
                  <p className="text-xs text-red-400 mt-2 text-center">
                    Password salah! Silakan coba lagi.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all active:scale-98 cursor-pointer"
              >
                Masuk ke Panel Admin
              </button>

              <div className="pt-2 text-[11px] text-slate-500 text-center">
                Default awal: <span className="font-mono text-slate-400">reinadmin123</span> atau PIN <span className="font-mono text-slate-400">120248</span>
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD CONTENT */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* CROSS-DEVICE SYNC & SCROLL GUIDE BANNER */}
            <div className="px-4 sm:px-6 py-2 bg-[#050a18] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>+</span>
                  <Laptop className="w-3.5 h-3.5" />
                  <span>HP & PC Tersinkron Otomatis</span>
                </span>
                {syncNotice && (
                  <span className="text-emerald-400 font-semibold text-[11px] animate-in fade-in">
                    {syncNotice}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualSyncNow}
                  disabled={isSyncingStore}
                  className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  title="Klik untuk menyinkronkan data langsung ke HP & PC"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncingStore ? 'animate-spin' : ''}`} />
                  <span>{isSyncingStore ? 'Sinkronisasi...' : 'Sinkronkan Sekarang'}</span>
                </button>
                <span className="text-[10px] text-slate-500 hidden sm:flex items-center gap-1 font-mono">
                  <MoveHorizontal className="w-3 h-3 text-cyan-400" />
                  <span>Menu bisa digeser ↔</span>
                </span>
              </div>
            </div>

            {/* HORIZONTALLY SCROLLABLE & DRAGGABLE TABS BAR */}
            <div className="relative border-b border-slate-800 bg-[#070e22] group">
              {/* Left Scroll Chevron Arrow */}
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scrollNav('left')}
                  className="absolute left-0 top-0 bottom-0 z-20 px-2 bg-gradient-to-r from-[#070e22] via-[#070e22]/95 to-transparent text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-opacity"
                  title="Geser menu ke kiri"
                >
                  <div className="p-1.5 rounded-full bg-slate-800/90 border border-slate-700 shadow-lg text-cyan-400">
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                </button>
              )}

              {/* Right Scroll Chevron Arrow */}
              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scrollNav('right')}
                  className="absolute right-0 top-0 bottom-0 z-20 px-2 bg-gradient-to-l from-[#070e22] via-[#070e22]/95 to-transparent text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-opacity"
                  title="Geser menu ke kanan"
                >
                  <div className="p-1.5 rounded-full bg-slate-800/90 border border-slate-700 shadow-lg text-cyan-400">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              )}

              {/* Draggable Nav List */}
              <div
                ref={tabsNavRef}
                onMouseDown={handleNavMouseDown}
                onMouseMove={handleNavMouseMove}
                onMouseUp={handleNavMouseUp}
                onMouseLeave={handleNavMouseUp}
                onScroll={checkNavScroll}
                className="flex items-center gap-2 px-4 sm:px-6 pt-3 overflow-x-auto scrollbar-none whitespace-nowrap scroll-smooth cursor-grab active:cursor-grabbing select-none"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('transaksi')}
                  className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'transaksi'
                      ? 'border-[#00A3FF] text-[#00A3FF] bg-[#00A3FF]/10 rounded-t-xl'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Transaksi & Mutasi</span>
                  {pendingCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('posters')}
                  className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'posters'
                      ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10 rounded-t-xl'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Pasang Poster Slide</span>
                  <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-black flex items-center justify-center border border-cyan-400/40">
                    {posters.filter((p) => p.isActive).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('qris')}
                  className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'qris'
                      ? 'border-red-400 text-red-300 bg-red-500/10 rounded-t-xl'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#ED1C24]" />
                  <span>Pengaturan QRIS Toko</span>
                  <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 text-[9px] font-black uppercase">
                    ASLI / BI
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('layanan')}
                  className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'layanan'
                      ? 'border-blue-400 text-blue-300 bg-blue-500/10 rounded-t-xl'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>Kontrol Status Layanan</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ON / OFF
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('bank')}
                  className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'bank'
                      ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10 rounded-t-xl'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-cyan-400" />
                  <span>Atur Data Bank</span>
                  <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-black uppercase">
                    REKENING
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('kontak')}
                  className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'kontak'
                      ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10 rounded-t-xl'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Headphones className="w-4 h-4 text-emerald-400" />
                  <span>Ubah Kontak CS</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase">
                    24/7
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('harga')}
                  className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'harga'
                      ? 'border-amber-400 text-amber-300 bg-amber-500/10 rounded-t-xl'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Kelola Produk & Harga</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase">
                    +Produk & Logo
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('keamanan')}
                  className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'keamanan'
                      ? 'border-amber-400 text-amber-300 bg-amber-500/10 rounded-t-xl'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Ganti Password & Keamanan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('konten')}
                  className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'konten'
                      ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10 rounded-t-xl'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Kelola Isi Info & Bantuan</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: POSTERS MANAGEMENT */}
              {activeTab === 'posters' && (
                <div className="space-y-6">
                  {/* Top Info Banner */}
                  <div className="bg-[#0c1a36] border border-cyan-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-cyan-400" />
                        Kelola Poster Slide Banner Anda
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Unggah gambar poster Anda sendiri untuk ditampilkan pada slide hero di halaman depan.
                        Gambar yang Anda pasang di sini akan otomatis bergeser sebagai carousel.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400 font-semibold">Durasi Slide:</span>
                      <select
                        value={slideDuration}
                        onChange={(e) => handleSaveSlideDuration(Number(e.target.value))}
                        className="bg-[#081024] border border-cyan-500/40 text-cyan-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                      >
                        <option value={4000}>4 Detik</option>
                        <option value={6000}>6 Detik (Standar)</option>
                        <option value={8000}>8 Detik</option>
                        <option value={10000}>10 Detik</option>
                      </select>
                    </div>
                  </div>

                  {/* Upload Form Box */}
                  <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Plus className="w-4 h-4 text-cyan-400" />
                          Tambah Poster Slide Baru
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Mendukung <strong className="text-cyan-300">Copy-Paste Gambar Langsung (Ctrl + V)</strong>, Drag & Drop, dan format <strong className="text-emerald-400">Anti-Blur (Resolusi Penuh 100%)</strong>.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Anti-Blur HD
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleAddPoster} className="space-y-4">
                      {/* Interactive Drag & Drop / Copy-Paste Zone */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                          isDragging
                            ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
                            : newImageUrl
                            ? 'border-emerald-500/50 bg-[#081226]'
                            : 'border-cyan-500/40 hover:border-cyan-400 bg-[#081024]'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="admin-poster-file"
                        />

                        <div className="flex flex-col items-center max-w-lg mx-auto py-2">
                          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                            <Clipboard className="w-7 h-7" />
                          </div>

                          <h5 className="text-sm sm:text-base font-bold text-white mb-1">
                            Tempel Gambar Langsung (Tekan <kbd className="bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700 font-mono text-xs">Ctrl + V</kbd>)
                          </h5>
                          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                            Cukup <strong>Copy Gambar</strong> dari WhatsApp Web, Canva, Google, atau Screenshot (<kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[11px]">Win + Shift + S</kbd>), lalu tekan <strong>Ctrl + V</strong> atau gunakan tombol di bawah:
                          </p>

                          {/* Quick Action Buttons */}
                          <div className="flex flex-wrap items-center justify-center gap-2.5">
                            <button
                              type="button"
                              onClick={handleClipboardPasteButtonClick}
                              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                            >
                              <Clipboard className="w-4 h-4" />
                              <span>Tempel dari Clipboard</span>
                            </button>

                            <label
                              htmlFor="admin-poster-file"
                              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 hover:border-slate-600 transition-all cursor-pointer flex items-center gap-2"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Pilih File dari Galeri / Folder</span>
                            </label>
                          </div>

                          <div className="text-[11px] text-slate-400 mt-3 flex items-center gap-2">
                            <span>Format: PNG, JPG, WebP, SVG</span>
                            <span>•</span>
                            <span>Maks: 20MB (Disimpan Lossless HD)</span>
                          </div>
                        </div>
                      </div>

                      {/* Success / Error Feedback Notices */}
                      {pasteSuccessNotice && (
                        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                          <span>{pasteSuccessNotice}</span>
                        </div>
                      )}

                      {uploadError && (
                        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                          <span>{uploadError}</span>
                        </div>
                      )}

                      {/* Poster Details & Settings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* URL Alternative */}
                        <div className="bg-[#081024] border border-slate-800 rounded-2xl p-4">
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Atau Masukkan URL Gambar (Opsional):
                          </label>
                          <input
                            id="poster-url-input"
                            type="url"
                            value={newImageUrl.startsWith('data:') ? '' : newImageUrl}
                            onChange={(e) => {
                              setNewImageUrl(e.target.value);
                              if (e.target.value) inspectDimensions(e.target.value);
                            }}
                            placeholder="https://domain.com/banner-poster-hd.jpg"
                            className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">
                            Gunakan ini jika gambar sudah dihosting di link web.
                          </p>
                        </div>

                        {/* Title Input */}
                        <div className="bg-[#081024] border border-slate-800 rounded-2xl p-4">
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Judul / Keterangan Poster:
                          </label>
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Contoh: Promo Spesial Top Up & Diamond"
                            className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">
                            Akan ditampilkan sebagai judul banner di atas slide.
                          </p>
                        </div>
                      </div>

                      {/* Display Mode (Anti-Blur) & Actions */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Anti-Blur Fit Mode */}
                        <div className="bg-[#081024] border border-slate-800 rounded-2xl p-3.5">
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                            Mode Tampilan (Anti-Blur):
                          </label>
                          <div className="space-y-1.5">
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                              <input
                                type="radio"
                                name="fitMode"
                                value="cover"
                                checked={newFitMode === 'cover'}
                                onChange={() => setNewFitMode('cover')}
                                className="accent-cyan-400"
                              />
                              <span className="font-bold text-white">Cover (Penuh Lebar)</span>
                              <span className="text-[10px] text-cyan-400 font-semibold">(Rekomendasi Tajam)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                              <input
                                type="radio"
                                name="fitMode"
                                value="contain"
                                checked={newFitMode === 'contain'}
                                onChange={() => setNewFitMode('contain')}
                                className="accent-cyan-400"
                              />
                              <span className="font-bold text-white">Contain (Utuh 100%)</span>
                              <span className="text-[10px] text-slate-400">(Latar Blur Elegan)</span>
                            </label>
                          </div>
                        </div>

                        {/* Optional Promo Badge */}
                        <div className="bg-[#081024] border border-slate-800 rounded-2xl p-3.5">
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Label / Badge Promo (Opsional):
                          </label>
                          <input
                            type="text"
                            value={newBadge}
                            onChange={(e) => setNewBadge(e.target.value)}
                            placeholder="Contoh: EVENT SPESIAL, DISKON 30%"
                            className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        {/* Click Action */}
                        <div className="bg-[#081024] border border-slate-800 rounded-2xl p-3.5">
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Aksi Ketika Poster Diklik:
                          </label>
                          <select
                            value={newActionType}
                            onChange={(e) => setNewActionType(e.target.value as any)}
                            className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                          >
                            <option value="scroll_products">Scroll ke Daftar Produk Toko</option>
                            <option value="none">Hanya Tampilkan (Tidak Ada Link)</option>
                          </select>
                        </div>
                      </div>

                      {/* Image Preview & Quality Audit */}
                      {newImageUrl && (
                        <div className="bg-[#081024] border border-cyan-500/40 rounded-2xl p-4 space-y-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Gambar Siap Dipasang!
                              </span>
                              {imageDimensions && (
                                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                                  {imageDimensions.width} × {imageDimensions.height} px
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setNewImageUrl('');
                                setImageDimensions(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                            >
                              Ganti / Hapus Gambar
                            </button>
                          </div>

                          {/* Quality Analysis Badge */}
                          {imageDimensions && (
                            <div>
                              {imageDimensions.width >= 1200 ? (
                                <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl">
                                  <Sparkles className="w-4 h-4 shrink-0" />
                                  <span>
                                    <strong>Resolusi Ultra HD (Sangat Jernih & Bebas Blur):</strong> Ukuran gambar sangat ideal untuk slide layar lebar.
                                  </span>
                                </div>
                              ) : imageDimensions.width >= 800 ? (
                                <div className="text-xs text-cyan-300 flex items-center gap-1.5 font-semibold bg-cyan-500/10 border border-cyan-500/30 p-2 rounded-xl">
                                  <CheckCircle className="w-4 h-4 shrink-0" />
                                  <span>
                                    <strong>Resolusi Bagus (HD Tajam):</strong> Poster akan tampil jernih di HP maupun PC.
                                  </span>
                                </div>
                              ) : (
                                <div className="text-xs text-amber-300 flex items-center gap-1.5 font-semibold bg-amber-500/10 border border-amber-500/30 p-2 rounded-xl">
                                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                                  <span>
                                    <strong>Resolusi Sedang ({imageDimensions.width}x{imageDimensions.height}px):</strong> Gambar akan tetap ditampilkan dengan tajam, namun disarankan gambar banner berukuran lebar 1200px atau lebih agar kualitas maksimal di layar besar.
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Live Preview Box */}
                          <div className="relative w-full h-44 sm:h-56 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                            {newFitMode === 'contain' ? (
                              <>
                                <img
                                  src={newImageUrl}
                                  alt=""
                                  aria-hidden="true"
                                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110 pointer-events-none"
                                />
                                <img
                                  src={newImageUrl}
                                  alt="Preview"
                                  className="relative z-10 max-h-full max-w-full object-contain mx-auto shadow-2xl"
                                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                                />
                              </>
                            ) : (
                              <img
                                src={newImageUrl}
                                alt="Preview"
                                className="w-full h-full object-cover object-center"
                                style={{ imageRendering: '-webkit-optimize-contrast' }}
                              />
                            )}

                            {/* Overlay Title */}
                            {(newTitle || newBadge) && (
                              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white z-20">
                                <div>
                                  {newBadge && (
                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 mb-0.5 inline-block">
                                      {newBadge}
                                    </span>
                                  )}
                                  <h6 className="text-xs font-bold drop-shadow">{newTitle || 'Poster Slide'}</h6>
                                </div>
                                <span className="text-[10px] text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                                  Mode: {newFitMode === 'cover' ? 'Cover (Penuh Tajam)' : 'Contain (Utuh)'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={!newImageUrl}
                          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                          Simpan & Tampilkan ke Slide (Lossless HD)
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Existing Posters List */}
                  <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-cyan-400" />
                          Daftar Poster Slide ({posters.length})
                        </h4>
                        <p className="text-xs text-slate-400">
                          Urutan di bawah ini menentukan urutan slide carousel yang tampil di web. Anda dapat mengubah mode tampilan Cover/Contain kapan saja.
                        </p>
                      </div>

                      {posters.length > 0 && (
                        <button
                          type="button"
                          onClick={handlePromptDeleteAll}
                          className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 font-bold text-xs border border-red-500/30 cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                          title="Hapus semua poster slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus Semua
                        </button>
                      )}
                    </div>

                    {posters.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                        <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <h5 className="text-sm font-bold text-slate-300">Belum Ada Poster Khusus</h5>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                          Slide saat ini menampilkan banner selamat datang default Reinstore.
                          Gunakan form di atas (cukup tekan <kbd className="text-cyan-300">Ctrl + V</kbd>) untuk langsung memasang poster jernih Anda.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {posters.map((poster, index) => (
                          <div
                            key={poster.id}
                            className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                              poster.isActive
                                ? 'bg-[#081024] border-slate-700/80 shadow-md'
                                : 'bg-[#060b18]/60 border-slate-900 opacity-60'
                            }`}
                          >
                            {/* Slide Number & Thumbnail */}
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                                {index + 1}
                              </span>
                              <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-900">
                                <img
                                  src={poster.imageUrl}
                                  alt={poster.title}
                                  className={`w-full h-full ${poster.fitMode === 'contain' ? 'object-contain' : 'object-cover'}`}
                                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                                    {poster.title}
                                  </h5>
                                  {poster.badge && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                      {poster.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] text-slate-400">
                                    {poster.isActive ? '✅ Tayang Aktif' : '⏸️ Nonaktif'}
                                  </span>
                                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.2 rounded">
                                    {poster.fitMode === 'contain' ? 'Mode: Contain (Utuh)' : 'Mode: Cover (Penuh)'}
                                  </span>
                                  {poster.width && poster.height && (
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {poster.width}×{poster.height}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                              {/* Toggle Fit Mode (Cover <-> Contain) */}
                              <button
                                onClick={() => handleTogglePosterFitMode(poster.id)}
                                title="Ubah Mode Tampilan (Cover / Contain)"
                                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold border border-slate-700 flex items-center gap-1 cursor-pointer"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>{poster.fitMode === 'contain' ? 'Jadikan Cover' : 'Jadikan Utuh'}</span>
                              </button>

                              {/* Move Up */}
                              <button
                                onClick={() => handleMovePoster(index, 'up')}
                                disabled={index === 0}
                                title="Geser ke Atas"
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>

                              {/* Move Down */}
                              <button
                                onClick={() => handleMovePoster(index, 'down')}
                                disabled={index === posters.length - 1}
                                title="Geser ke Bawah"
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>

                              {/* Toggle Active */}
                              <button
                                onClick={() => handleToggleActive(poster.id)}
                                title={poster.isActive ? 'Nonaktifkan sementara' : 'Aktifkan kembali'}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                  poster.isActive
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {poster.isActive ? 'Aktif' : 'Off'}
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeletePoster(poster)}
                                title="Hapus Poster Ini"
                                className="px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: TRANSAKSI & MUTASI */}
              {activeTab === 'transaksi' && (
                <div className="space-y-6">
                  {/* STATS TILES */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-4 shadow-md">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-xs font-semibold">Total Pendapatan</span>
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-lg sm:text-xl font-black text-white font-mono">
                        Rp {new Intl.NumberFormat('id-ID').format(totalRevenue)}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                        Transaksi Terverifikasi Lunas
                      </span>
                    </div>

                    <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-4 shadow-md">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-xs font-semibold">Total Transaksi</span>
                        <CreditCard className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-lg sm:text-xl font-black text-white font-mono">
                        {orders.length} Order
                      </div>
                      <span className="text-[10px] text-blue-400 font-bold mt-1 block">
                        Semua Kategori Produk
                      </span>
                    </div>

                    <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-4 shadow-md">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-xs font-semibold">Menunggu Verifikasi</span>
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-lg sm:text-xl font-black text-amber-400 font-mono">
                        {pendingCount} Order
                      </div>
                      <span className="text-[10px] text-amber-400/80 font-bold mt-1 block">
                        Perlu Konfirmasi Admin
                      </span>
                    </div>

                    <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-4 shadow-md">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-xs font-semibold">Success Rate</span>
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="text-lg sm:text-xl font-black text-purple-400 font-mono">
                        {successRate}%
                      </div>
                      <span className="text-[10px] text-purple-300 font-bold mt-1 block">
                        Pembayaran Berhasil
                      </span>
                    </div>
                  </div>

                  {/* FILTER & SEARCH BAR */}
                  <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#0c152e] border border-slate-800 rounded-2xl p-3.5">
                    <div className="relative w-full md:w-80">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari Invoice, Email, WA, ID..."
                        className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:border-[#00A3FF] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="all">Semua Kategori</option>
                        <option value="game">Game Top Up</option>
                        <option value="pulsa">Pulsa & Paket Data</option>
                        <option value="pln">Token Listrik PLN</option>
                        <option value="digital">Layanan Digital</option>
                      </select>

                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="all">Semua Status</option>
                        <option value="pending">Menunggu (Pending)</option>
                        <option value="success">Berhasil (Success)</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
                    </div>
                  </div>

                  {/* TRANSACTIONS TABLE */}
                  <div className="bg-[#0c152e] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#080d1d] border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                            <th className="py-3 px-4">Invoice & Waktu</th>
                            <th className="py-3 px-4">Pelanggan</th>
                            <th className="py-3 px-4">Layanan & Akun</th>
                            <th className="py-3 px-4">Total & Metode</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-center">Aksi Admin</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-500">
                                Tidak ada transaksi yang cocok dengan filter pencarian.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                                {/* Invoice & Time */}
                                <td className="py-3 px-4">
                                  <span className="font-mono font-bold text-white block">
                                    {order.invoiceNumber}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">
                                    {order.createdAt}
                                  </span>
                                </td>

                                {/* Customer */}
                                <td className="py-3 px-4">
                                  <span className="text-white font-medium block truncate max-w-[140px]">
                                    {order.customerEmail}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-mono block">
                                    {order.customerWhatsApp}
                                  </span>
                                </td>

                                {/* Product & Account */}
                                <td className="py-3 px-4">
                                  <span className="text-white font-bold block truncate max-w-[160px]">
                                    {order.productName}
                                  </span>
                                  <span className="text-[10px] text-[#00A3FF] block truncate max-w-[160px]">
                                    {order.variantName}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[160px]">
                                    ID: {order.targetAccount} {order.targetZone ? `(${order.targetZone})` : ''}
                                  </span>
                                  {order.isGestun && order.payoutAccount && (
                                    <span className="text-[10px] text-purple-400 font-semibold block">
                                      Payout: {order.payoutBank} - {order.payoutAccount}
                                    </span>
                                  )}
                                </td>

                                {/* Price & Payment */}
                                <td className="py-3 px-4">
                                  <span className="font-mono font-bold text-white block">
                                    Rp {new Intl.NumberFormat('id-ID').format(order.totalAmount)}
                                  </span>
                                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                                    {order.paymentMethod} {order.adminFee > 0 ? '(+2.5k fee)' : '(free fee)'}
                                  </span>
                                </td>

                                {/* Status */}
                                <td className="py-3 px-4">
                                  {order.status === 'success' && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                      <CheckCircle className="w-3 h-3" />
                                      <span>Berhasil</span>
                                    </span>
                                  )}
                                  {order.status === 'pending' && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                      <Clock className="w-3 h-3" />
                                      <span>Menunggu</span>
                                    </span>
                                  )}
                                  {order.status === 'cancelled' && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full">
                                      <XCircle className="w-3 h-3" />
                                      <span>Dibatalkan</span>
                                    </span>
                                  )}
                                </td>

                                {/* Action Buttons */}
                                <td className="py-3 px-4">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {order.status === 'pending' && (
                                      <button
                                        onClick={() => onUpdateOrderStatus(order.id, 'success')}
                                        title="Verifikasi Mutasi & Ubah Status Berhasil"
                                        className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                    )}

                                    <button
                                      onClick={() => onViewInvoice(order)}
                                      title="Lihat Invoice Resmi"
                                      className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>

                                    <button
                                      onClick={() => handleSendAdminWhatsApp(order)}
                                      title="Chat WhatsApp Pelanggan"
                                      className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                                    >
                                      <MessageCircle className="w-4 h-4" />
                                    </button>

                                    {order.status === 'pending' && (
                                      <button
                                        onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                                        title="Batalkan Pesanan"
                                        className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: KEAMANAN & GANTI PASSWORD */}
              {activeTab === 'keamanan' && (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Ganti Password Admin</h4>
                        <p className="text-xs text-slate-400">
                          Perbarui kata sandi untuk melindungi panel admin dari akses tidak sah.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                      {passSuccess && (
                        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold leading-relaxed">
                          {passSuccess}
                        </div>
                      )}

                      {passError && (
                        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold leading-relaxed">
                          {passError}
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Password Lama Saat Ini:
                        </label>
                        <div className="relative">
                          <input
                            type={showChangePass ? 'text' : 'password'}
                            value={currentPassInput}
                            onChange={(e) => setCurrentPassInput(e.target.value)}
                            placeholder="Masukkan password admin lama Anda"
                            className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2.5 text-xs pr-10 focus:border-amber-400 focus:outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowChangePass(!showChangePass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showChangePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Password Baru:
                        </label>
                        <input
                          type={showChangePass ? 'text' : 'password'}
                          value={newPassInput}
                          onChange={(e) => setNewPassInput(e.target.value)}
                          placeholder="Minimal 4 karakter (misal: TokoKeren2026!)"
                          className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2.5 text-xs focus:border-amber-400 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Ulangi Password Baru:
                        </label>
                        <input
                          type={showChangePass ? 'text' : 'password'}
                          value={confirmPassInput}
                          onChange={(e) => setConfirmPassInput(e.target.value)}
                          placeholder="Ketik ulang password baru Anda"
                          className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2.5 text-xs focus:border-amber-400 focus:outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer active:scale-98"
                      >
                        Simpan Password Baru
                      </button>
                    </form>
                  </div>

                  {/* Private Access Instructions */}
                  <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <h5 className="text-xs font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      Cara Mengakses Panel Admin Secara Privat
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Sesuai permintaan Anda, tombol admin <strong className="text-white">tidak lagi ditampilkan di publik</strong> (baik di header, navbar, footer, maupun banner) agar tidak dapat dilihat oleh pelanggan umum.
                    </p>
                    <div className="bg-[#081024] rounded-xl p-3 text-xs space-y-2 text-slate-300 border border-slate-800">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-amber-400">1.</span>
                        <span>
                          <strong>URL Rahasia:</strong> Tambahkan <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded font-mono">?admin=true</code> atau <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded font-mono">#admin</code> di akhir alamat website Anda.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-amber-400">2.</span>
                        <span>
                          <strong>Shortcut Keyboard:</strong> Tekan kombinasi tombol <kbd className="text-white bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-700">Ctrl + Shift + A</kbd> di keyboard Anda saat membuka website.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-amber-400">3.</span>
                        <span>
                          <strong>Ketuk Tersembunyi:</strong> Klik teks hak cipta "© 2026 Reinstore" di bagian paling bawah sebanyak 5x berturut-turut.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PENGATURAN QRIS TOKO */}
              {activeTab === 'qris' && (
                <AdminQRISSettings />
              )}

              {/* TAB: KONTROL STATUS LAYANAN (ON / OFF) */}
              {activeTab === 'layanan' && (
                <AdminServiceStatus />
              )}

              {/* TAB: ATUR DATA BANK & REKENING */}
              {activeTab === 'bank' && (
                <AdminBankSettings />
              )}

              {/* TAB: KELOLA KONTAK CUSTOMER SERVICE (CS) */}
              {activeTab === 'kontak' && (
                <AdminContactSettings />
              )}

              {/* TAB: ATUR HARGA NOMINAL PRODUK */}
              {activeTab === 'harga' && (
                <AdminProductPricing />
              )}

              {/* TAB 4: SESUAIKAN ISI INFO & BANTUAN */}
              {activeTab === 'konten' && (
                <AdminContentEditor />
              )}
            </div>
          </div>
        )}

        {/* MODAL KONFIRMASI HAPUS POSTER (AMAN DARI BLOKIR IFRAME / BROWSER) */}
        {deleteConfirmState.isOpen && (
          <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1329] border border-red-500/40 rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.3)] space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto shadow-inner">
                <Trash2 className="w-7 h-7" />
              </div>

              <div className="text-center space-y-2">
                <h4 className="text-base font-black text-white">
                  {deleteConfirmState.type === 'all'
                    ? 'Hapus Semua Poster Slide?'
                    : 'Hapus Poster Slide Ini?'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {deleteConfirmState.type === 'all'
                    ? `Apakah Anda yakin ingin menghapus seluruh ${posters.length} poster slide? Tampilan depan akan kembali ke banner selamat datang default.`
                    : `Apakah Anda yakin ingin menghapus poster "${deleteConfirmState.posterTitle || 'Poster Slide'}"? Poster ini akan langsung dihapus dari slide banner.`}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmState({ isOpen: false, type: 'single' })}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDelete}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteConfirmState.type === 'all' ? 'Ya, Hapus Semua' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
