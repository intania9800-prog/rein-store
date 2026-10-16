import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Smartphone,
  Flame,
} from 'lucide-react';
import { SlidePoster } from '../types';
import {
  getPostersFromStorage,
  getPostersSync,
  STORAGE_KEY_ADMIN_DURATION,
} from '../utils/posterStorage';

interface PosterSliderProps {
  onScrollToProducts: () => void;
  onOpenTreasuryModal: () => void;
  onOpenAdGuardModal: () => void;
  onOpenGestunModal: () => void;
  onSelectProduct?: (productId: string) => void;
}

export const PosterSlider: React.FC<PosterSliderProps> = ({
  onScrollToProducts,
  onOpenTreasuryModal,
  onOpenAdGuardModal,
  onOpenGestunModal,
  onSelectProduct,
}) => {
  const [posters, setPosters] = useState<SlidePoster[]>(() => {
    return getPostersSync().filter((p) => p.isActive);
  });
  const [slideDuration, setSlideDuration] = useState<number>(6000);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  // Sync posters & settings from IndexedDB (lossless HD) with localStorage fallback
  const loadPostersFromStorage = async () => {
    try {
      // 1. Instant fallback
      const syncList = getPostersSync();
      const activeSync = syncList.filter((p) => p.isActive);
      setPosters(activeSync);

      // 2. Full resolution IndexedDB load
      const fullList = await getPostersFromStorage();
      if (Array.isArray(fullList)) {
        const activeFull = fullList.filter((p) => p.isActive);
        setPosters(activeFull);
      }

      const savedDuration = localStorage.getItem(STORAGE_KEY_ADMIN_DURATION);
      if (savedDuration) {
        setSlideDuration(Number(savedDuration));
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    loadPostersFromStorage();

    // Listen to custom updates from Admin Panel & storage events
    const handleUpdate = () => {
      loadPostersFromStorage();
    };
    window.addEventListener('reinstore_posters_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('reinstore_posters_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const totalSlides = posters.length;

  // Next & Prev slide handlers
  const nextSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setProgress(0);
  };

  const prevSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  };

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    setProgress(0);
  };

  // Reset slide index if items were deleted and index exceeds bounds
  useEffect(() => {
    if (totalSlides > 0 && currentSlide >= totalSlides) {
      setCurrentSlide(0);
      setProgress(0);
    }
  }, [totalSlides, currentSlide]);

  // Autoplay timer
  useEffect(() => {
    if (totalSlides <= 1 || isHovered) return;

    const intervalStep = 50;
    const stepIncrement = (intervalStep / slideDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isHovered, currentSlide, totalSlides, slideDuration]);

  // Handle Touch Swipe on Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    setTouchStartX(null);
  };

  const handleSlideClick = (poster: SlidePoster) => {
    if (poster.linkType === 'none') return;
    if (poster.linkTarget) {
      if (poster.linkTarget === 'treasury') {
        onOpenTreasuryModal();
        return;
      }
      if (poster.linkTarget === 'dns-adguard') {
        onOpenAdGuardModal();
        return;
      }
      if (poster.linkTarget === 'gestun') {
        onOpenGestunModal();
        return;
      }
      if (onSelectProduct) {
        onSelectProduct(poster.linkTarget);
        return;
      }
    }
    onScrollToProducts();
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-3 select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[90%] bg-gradient-to-r from-blue-600/15 via-cyan-500/15 to-indigo-600/15 rounded-3xl blur-[70px] pointer-events-none" />

      {/* IF ADMIN HAS UPLOADED POSTERS: RENDER CUSTOM SLIDES */}
      {posters.length > 0 ? (
        <div
          className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#060b18] shadow-2xl group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Active Poster Display with Anti-Blur Crisp Rendering */}
          <div className="relative w-full aspect-[16/8] sm:aspect-[21/9] md:aspect-[24/9] min-h-[220px] max-h-[460px] flex items-center justify-center bg-slate-950 overflow-hidden">
            {posters.map((poster, index) => {
              const isActive = index === currentSlide;
              const isContain = poster.fitMode === 'contain';

              return (
                <div
                  key={poster.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer flex items-center justify-center overflow-hidden ${
                    isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  onClick={() => handleSlideClick(poster)}
                >
                  {isContain ? (
                    <>
                      {/* Ambient Cinematic Backdrop for Contain Mode */}
                      <img
                        src={poster.imageUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none"
                      />
                      {/* Crisp Foreground Poster */}
                      <img
                        src={poster.imageUrl}
                        alt={poster.title}
                        className="relative z-10 max-w-full max-h-full object-contain mx-auto transition-transform duration-700 group-hover:scale-[1.01] drop-shadow-2xl"
                        style={{
                          imageRendering: '-webkit-optimize-contrast',
                          transform: 'translateZ(0)',
                          backfaceVisibility: 'hidden',
                        }}
                      />
                    </>
                  ) : (
                    /* Default Cover Mode: Ultra-sharp full-width banner */
                    <img
                      src={poster.imageUrl}
                      alt={poster.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
                      style={{
                        imageRendering: '-webkit-optimize-contrast',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                      }}
                    />
                  )}

                  {/* Optional Poster Caption Overlay at Bottom */}
                  {(poster.title || poster.badge) && (
                    <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between text-white pointer-events-none">
                      <div>
                        {poster.badge && (
                          <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 mb-1 inline-block">
                            {poster.badge}
                          </span>
                        )}
                        <h3 className="text-sm sm:text-lg font-black drop-shadow-md">
                          {poster.title}
                        </h3>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-cyan-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-cyan-400/30">
                        Klik untuk info <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows (if multiple slides) */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95 shadow-lg"
                title="Slide Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95 shadow-lg"
                title="Slide Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Autoplay Progress Bar */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-20">
                <div
                  className="h-full bg-gradient-to-r from-[#00A3FF] to-cyan-400 transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Dots Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {posters.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(idx);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlide
                        ? 'w-6 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        : 'w-2 bg-slate-600 hover:bg-slate-400'
                    }`}
                    title={`Ke Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        /* CLEAN DEFAULT HERO BANNER (WHEN NO CUSTOM POSTERS ARE UPLOADED YET) */
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-[#0c1a36] via-[#091326] to-[#060b18] p-6 sm:p-10 shadow-2xl">
          {/* Subtle Cyber Grid & Light Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Promo & Transaksi Spesial Reinstore</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Top Up Game & Layanan Digital{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">
                  Cepat, Otomatis & Terpercaya
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Platform resmi untuk top up diamond Mobile Legends, Free Fire, token listrik PLN, pulsa seluruh operator, serta layanan privat Web Monitor Treasury & DNS AdGuard.
              </p>

              {/* Key Features Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-200 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Bebas Biaya Admin QRIS
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-200 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Proses 1-5 Menit 24 Jam
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-200 font-medium">
                  <Flame className="w-3.5 h-3.5 text-red-400" /> Harga Termurah & Legal
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                <button
                  onClick={onScrollToProducts}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0070F3] to-[#00A3FF] hover:from-[#0060df] hover:to-[#0092e6] text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,112,243,0.4)] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Mulai Belanja Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={onOpenTreasuryModal}
                  className="px-5 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Lihat Web Monitor Treasury</span>
                </button>
              </div>
            </div>

            {/* Right Visual Card Showcase */}
            <div className="w-full md:w-80 shrink-0 grid grid-cols-2 gap-3">
              <div
                onClick={onScrollToProducts}
                className="bg-[#081226]/90 border border-blue-500/30 hover:border-cyan-400/60 p-4 rounded-2xl transition-all hover:-translate-y-1 cursor-pointer shadow-lg group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Top Up Game</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">MLBB, Free Fire, dll</p>
                <span className="text-[10px] font-bold text-cyan-300 mt-2 block">
                  Instan 24 Jam →
                </span>
              </div>

              <div
                onClick={onScrollToProducts}
                className="bg-[#081226]/90 border border-emerald-500/30 hover:border-emerald-400/60 p-4 rounded-2xl transition-all hover:-translate-y-1 cursor-pointer shadow-lg group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Token Listrik</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">PLN Prabayar</p>
                <span className="text-[10px] font-bold text-emerald-300 mt-2 block">
                  Langsung Masuk →
                </span>
              </div>

              <div
                onClick={onScrollToProducts}
                className="bg-[#081226]/90 border border-sky-500/30 hover:border-sky-400/60 p-4 rounded-2xl transition-all hover:-translate-y-1 cursor-pointer shadow-lg group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Pulsa & Kuota</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Semua Operator</p>
                <span className="text-[10px] font-bold text-sky-300 mt-2 block">
                  Termurah →
                </span>
              </div>

              <div
                onClick={onOpenAdGuardModal}
                className="bg-[#081226]/90 border border-purple-500/30 hover:border-purple-400/60 p-4 rounded-2xl transition-all hover:-translate-y-1 cursor-pointer shadow-lg group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">DNS AdGuard</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Anti Iklan & Blokir</p>
                <span className="text-[10px] font-bold text-purple-300 mt-2 block">
                  Aktivasi CS →
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
