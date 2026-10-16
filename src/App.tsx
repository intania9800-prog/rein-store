import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickCategories } from './components/QuickCategories';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { MainCatalog } from './components/MainCatalog';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { QRISModal } from './components/QRISModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { TreasuryDetailModal } from './components/TreasuryDetailModal';
import { PromoModal } from './components/PromoModal';
import { UserHistoryView } from './components/UserHistoryView';
import { InfoPagesModal, InfoModalTab } from './components/InfoPagesModal';
import { PRODUCTS, INITIAL_ORDERS, ADMIN_WHATSAPP_SUPPORT } from './data/products';
import { Product, Order, User, OrderStatus } from './types';
import {
  getCSConfig,
  EVENT_CS_CONTACTS_UPDATED,
  getWhatsAppUrl,
  ContactCSConfig,
} from './utils/contactStorage';
import {
  getStoredProducts,
  EVENT_PRODUCTS_UPDATED,
} from './utils/productStorage';

export default function App() {
  // Navigation & Search State
  const [activeTab, setActiveTab] = useState('beranda');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Products with Dynamic Pricing State
  const [productsList, setProductsList] = useState<Product[]>(() => getStoredProducts());

  useEffect(() => {
    const handleProductsUpdate = (e: any) => {
      setProductsList(e.detail || getStoredProducts());
    };
    window.addEventListener(EVENT_PRODUCTS_UPDATED, handleProductsUpdate);
    return () => window.removeEventListener(EVENT_PRODUCTS_UPDATED, handleProductsUpdate);
  }, []);

  // Customer Service Contact State
  const [csConfig, setCsConfig] = useState<ContactCSConfig>(() => getCSConfig());

  useEffect(() => {
    const handleCSUpdate = (e: any) => {
      setCsConfig(e.detail || getCSConfig());
    };
    window.addEventListener(EVENT_CS_CONTACTS_UPDATED, handleCSUpdate);
    return () => window.removeEventListener(EVENT_CS_CONTACTS_UPDATED, handleCSUpdate);
  }, []);

  // Info & Bantuan Modal State
  const [infoModalState, setInfoModalState] = useState<{
    isOpen: boolean;
    activeTab: InfoModalTab;
  }>({
    isOpen: false,
    activeTab: 'tentang',
  });

  // Orders State (Persisted in localStorage)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('reinstore_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('reinstore_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Current User (Persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('reinstore_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('reinstore_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('reinstore_user');
      }
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [currentUser]);

  // Active Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [activeQRISOrder, setActiveQRISOrder] = useState<Order | null>(null);
  const [isQRISModalOpen, setIsQRISModalOpen] = useState(false);

  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isTreasuryDetailOpen, setIsTreasuryDetailOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  // Check URL params (?admin=true), hash (#admin), and keyboard shortcut (Ctrl+Shift+A) for private admin access
  useEffect(() => {
    // Purge previous mock/sent posters from storage as requested by user
    try {
      localStorage.removeItem('reinstore_custom_posters_v1');
      localStorage.removeItem('reinstore_poster_view_mode_v1');
    } catch {
      // ignore
    }

    const checkAdminTrigger = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || window.location.hash === '#admin') {
        setIsAdminDashboardOpen(true);
      }
    };

    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminDashboardOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminTrigger);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter products by category & search query
  const filteredProducts = productsList.filter((p) => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Handlers
  const handleOpenProductOrder = (product: Product) => {
    // Ensure we use the latest version from productsList with up-to-date pricing
    const fresh = productsList.find((p) => p.id === product.id) || product;
    setSelectedProduct(fresh);
    setIsOrderModalOpen(true);
  };

  const handleOpenProductById = (productId: string) => {
    const prod = productsList.find((p) => p.id === productId);
    if (prod) {
      handleOpenProductOrder(prod);
    }
  };

  const handleScrollToProducts = () => {
    const el = document.getElementById('produk-terpopuler');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setIsOrderModalOpen(false);
    setActiveInvoiceOrder(newOrder);
    setIsInvoiceModalOpen(true);
  };

  const handleOpenQRIS = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setIsOrderModalOpen(false);
    setActiveQRISOrder(newOrder);
    setIsQRISModalOpen(true);
  };

  const handleQRISPaymentSuccess = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    setIsQRISModalOpen(false);
    setActiveInvoiceOrder(updatedOrder);
    setIsInvoiceModalOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleOpenLogin = () => {
    setAuthInitialMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthInitialMode('register');
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleContactAdmin = () => {
    const url = getWhatsAppUrl(
      csConfig.whatsappPrimary,
      csConfig.defaultGreetingText
    );
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'kontak') {
            handleContactAdmin();
          } else if (tab === 'tentang') {
            setInfoModalState({ isOpen: true, activeTab: 'tentang' });
          } else {
            setActiveTab(tab);
          }
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onLogout={handleLogout}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
      />

      {/* Main Content Area */}
      {activeTab === 'riwayat' ? (
        <main className="flex-1">
          <UserHistoryView
            orders={orders}
            onBackToHome={() => setActiveTab('beranda')}
            onViewInvoice={(order) => {
              setActiveInvoiceOrder(order);
              setIsInvoiceModalOpen(true);
            }}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onScrollToProducts={handleScrollToProducts}
            onOpenTreasuryModal={() => setIsTreasuryDetailOpen(true)}
            onOpenAdGuardModal={() => handleOpenProductById('dns-adguard')}
            onOpenGestunModal={() => handleOpenProductById('gestun')}
            onSelectProduct={(productId) => handleOpenProductById(productId)}
          />

          {/* Quick Categories Bar (5-item row) */}
          <QuickCategories
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />

          {/* Main 3-Column Body Section matching Image 1 */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Sidebar (Col 1-3) */}
              <div className="lg:col-span-3">
                <LeftSidebar
                  onOpenRegister={handleOpenRegister}
                  onFilterCategory={(cat) => setSelectedCategory(cat)}
                  onSelectProduct={(productId) => handleOpenProductById(productId)}
                />
              </div>

              {/* Center Main Catalog (Col 4-9) */}
              <div className="lg:col-span-6">
                <MainCatalog
                  products={filteredProducts}
                  onSelectProduct={handleOpenProductOrder}
                  onFilterCategory={(cat) => setSelectedCategory(cat)}
                />
              </div>

              {/* Right Sidebar (Col 10-12) */}
              <div className="lg:col-span-3">
                <RightSidebar
                  onOpenTreasuryModal={() => setIsTreasuryDetailOpen(true)}
                  onOpenPromoModal={() => setIsPromoModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        onFilterCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('beranda');
          handleScrollToProducts();
        }}
        onSelectProductById={(id) => handleOpenProductById(id)}
        onOpenInfo={(tab) => setInfoModalState({ isOpen: true, activeTab: tab })}
      />

      {/* MODALS */}
      {/* 1. Order & Checkout Modal */}
      <OrderModal
        product={selectedProduct}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
        onOpenQRIS={handleOpenQRIS}
      />

      {/* 2. QRIS Modal */}
      <QRISModal
        order={activeQRISOrder}
        isOpen={isQRISModalOpen}
        onClose={() => setIsQRISModalOpen(false)}
        onPaymentSuccess={handleQRISPaymentSuccess}
      />

      {/* 3. Invoice & Success Modal */}
      <InvoiceModal
        order={activeInvoiceOrder}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />

      {/* 4. Login & Register with 2FA Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* 5. Private Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onViewInvoice={(order) => {
          setActiveInvoiceOrder(order);
          setIsInvoiceModalOpen(true);
        }}
      />

      {/* 6. Treasury Detail Modal */}
      <TreasuryDetailModal
        isOpen={isTreasuryDetailOpen}
        onClose={() => setIsTreasuryDetailOpen(false)}
        onBuyAccess={() => handleOpenProductById('treasury')}
      />

      {/* 7. Promo Modal */}
      <PromoModal
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
        onSelectPromo={() => {
          setActiveTab('beranda');
          handleScrollToProducts();
        }}
      />

      {/* 8. Info & Bantuan Pages Modal (Tentang Kami, Cara Order, Pembayaran, FAQ, Syarat & Ketentuan, Kebijakan Privasi) */}
      <InfoPagesModal
        isOpen={infoModalState.isOpen}
        onClose={() => setInfoModalState((prev) => ({ ...prev, isOpen: false }))}
        initialTab={infoModalState.activeTab}
        onOpenProductOrder={handleOpenProductById}
      />
    </div>
  );
}
