import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  CheckCircle,
  Copy,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Building,
  Wallet,
  Store,
  QrCode,
  ArrowRight,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import {
  Product,
  ProductVariant,
  PaymentMethodId,
  PaymentMethodInfo,
  Order,
  User,
} from '../types';
import {
  STANDARD_PAYMENT_METHODS,
  DNS_ADGUARD_PAYMENT_METHODS,
  GESTUN_PROVIDERS,
  GESTUN_PAYOUT_BANKS,
  ADMIN_DNS_ADGUARD_WA,
  TREASURY_TARGET_URL,
  ADMIN_WHATSAPP_SUPPORT,
} from '../data/products';
import {
  ProductBrandIcon,
  UniversalBankLogo,
  BCALogo,
  SeaBankLogo,
  KromLogo,
  DanaLogo,
  OvoLogo,
  GoPayLogo,
  ShopeePayLogo,
  AlfamartLogo,
  IndomaretLogo,
  QRISLogo,
} from './icons/BrandLogos';
import {
  BankAccount,
  getBankAccounts,
  EVENT_BANK_ACCOUNTS_UPDATED,
} from '../utils/bankStorage';
import {
  getCSConfig,
  EVENT_CS_CONTACTS_UPDATED,
  ContactCSConfig,
} from '../utils/contactStorage';

interface OrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onOrderSuccess: (order: Order) => void;
  onOpenQRIS: (order: Order) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  isOpen,
  onClose,
  currentUser,
  onOrderSuccess,
  onOpenQRIS,
}) => {
  if (!isOpen || !product) return null;

  const isDNS = product.id === 'dns-adguard' || product.isSpecialDNS;
  const isTreasury = product.id === 'treasury' || product.isSpecialTreasury;
  const isGestun = product.id === 'gestun' || product.isGestun;

  // Selected Variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || { id: 'default', name: 'Default', price: product.minPrice }
  );

  // Form inputs
  const [targetAccount, setTargetAccount] = useState('');
  const [targetZone, setTargetZone] = useState('');
  const [selectedServer, setSelectedServer] = useState(
    product.serverList ? product.serverList[0] : ''
  );
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerWhatsApp, setCustomerWhatsApp] = useState(currentUser?.phone || '');

  // Gestun specific state
  const [gestunProvider, setGestunProvider] = useState(GESTUN_PROVIDERS[0]);
  const [gestunNominal, setGestunNominal] = useState<number>(500000);
  const [gestunPayoutBank, setGestunPayoutBank] = useState(GESTUN_PAYOUT_BANKS[0]);
  const [gestunPayoutAccount, setGestunPayoutAccount] = useState('');
  const [gestunPayoutName, setGestunPayoutName] = useState('');

  // Bank accounts from storage with real-time listener
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => getBankAccounts());
  const [csConfig, setCsConfig] = useState<ContactCSConfig>(() => getCSConfig());

  useEffect(() => {
    const handleBankUpdate = () => {
      setBankAccounts(getBankAccounts());
    };
    window.addEventListener(EVENT_BANK_ACCOUNTS_UPDATED, handleBankUpdate);
    return () => window.removeEventListener(EVENT_BANK_ACCOUNTS_UPDATED, handleBankUpdate);
  }, []);

  useEffect(() => {
    const handleCSUpdate = (e: any) => {
      setCsConfig(e.detail || getCSConfig());
    };
    window.addEventListener(EVENT_CS_CONTACTS_UPDATED, handleCSUpdate);
    return () => window.removeEventListener(EVENT_CS_CONTACTS_UPDATED, handleCSUpdate);
  }, []);

  // Payment Method List dynamically built from bankAccounts
  const paymentMethodsList = useMemo<PaymentMethodInfo[]>(() => {
    if (isDNS) {
      const dnsAccounts = bankAccounts.filter((a) => a.isActive && a.isSpecialDNS);
      if (dnsAccounts.length > 0) {
        return dnsAccounts.map((a) => ({
          id: a.id,
          name: a.bankName,
          category: a.category,
          accountNumber: a.accountNumber,
          accountName: a.accountName,
          fee: a.fee,
          isAvailableForDNS: true,
          badge: a.badge || 'Akun Khusus DNS',
          bankCode: a.bankCode,
        }));
      }
      return DNS_ADGUARD_PAYMENT_METHODS;
    }

    // Always start with QRIS All Payment
    const list: PaymentMethodInfo[] = [
      {
        id: 'qris',
        name: 'QRIS All Payment',
        category: 'qris',
        accountNumber: 'NMID: ID1026614748022',
        accountName: 'REINSTORE, ELEKTRONIK',
        fee: 0,
        badge: 'Otomatis & Free Admin',
        bankCode: 'QRIS',
      },
    ];

    // Append all active non-DNS bank accounts and e-wallets
    const activeAccounts = bankAccounts.filter((a) => a.isActive && !a.isSpecialDNS);
    for (const acc of activeAccounts) {
      list.push({
        id: acc.id,
        name: acc.bankName,
        category: acc.category,
        accountNumber: acc.accountNumber,
        accountName: acc.accountName,
        fee: acc.fee,
        badge: acc.badge,
        bankCode: acc.bankCode,
      });
    }

    // Append retail channels
    list.push(
      {
        id: 'alfamart',
        name: 'Alfamart / AlfaMidi',
        category: 'retail',
        accountNumber: 'Kode Bayar Kasir Otomatis',
        accountName: 'REINSTORE PAYMENT',
        fee: 2500,
        badge: 'Gerai Retail',
        bankCode: 'ALFA',
      },
      {
        id: 'indomaret',
        name: 'Indomaret / Ceriamart',
        category: 'retail',
        accountNumber: 'Kode Bayar Kasir Otomatis',
        accountName: 'REINSTORE PAYMENT',
        fee: 2500,
        badge: 'Gerai Retail',
        bankCode: 'INDO',
      }
    );

    return list;
  }, [bankAccounts, isDNS]);

  const [selectedPaymentId, setSelectedPaymentId] = useState<PaymentMethodId>(
    isDNS ? 'shopeepay' : isGestun ? 'qris' : 'qris'
  );

  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Reset or initialize when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariant((prev) => {
        const found = product.variants.find((v) => v.id === prev?.id);
        return found || product.variants[0];
      });
      if (isDNS) {
        setSelectedPaymentId('shopeepay');
      } else if (isGestun) {
        setSelectedPaymentId('qris');
      } else {
        setSelectedPaymentId('qris');
      }
    }
  }, [product]);

  // Compute pricing
  const basePrice = isGestun ? gestunNominal : selectedVariant.price;
  const selectedPaymentInfo = paymentMethodsList.find((p) => p.id === selectedPaymentId) || paymentMethodsList[0];
  const adminFee = selectedPaymentInfo.fee; // 0 for QRIS, 2500 for others
  const totalAmount = basePrice + adminFee;

  // Gestun calculation
  const gestunFeeAmount = isGestun
    ? Math.round((gestunNominal * gestunProvider.feePercent) / 100)
    : 0;
  const gestunCleanPayout = isGestun ? gestunNominal - gestunFeeAmount : 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetAccount && !isGestun) {
      alert(`Mohon lengkapi ${product.inputLabel || 'Data Akun / Tujuan'}!`);
      return;
    }

    if (isGestun && (!gestunPayoutAccount || !gestunPayoutName)) {
      alert('Mohon isi Nomor Rekening & Nama Pemilik Rekening penerima pencairan Gestun!');
      return;
    }

    if (!customerEmail) {
      alert('Mohon masukkan Email untuk pengiriman invoice otomatis!');
      return;
    }

    if (!customerWhatsApp) {
      alert('Mohon masukkan Nomor WhatsApp untuk notifikasi real-time transaksi!');
      return;
    }

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      invoiceNumber,
      productId: product.id,
      productName: product.name,
      category: product.category,
      variantId: selectedVariant.id,
      variantName: isGestun
        ? `Gestun ${gestunProvider.name} Rp ${new Intl.NumberFormat('id-ID').format(gestunNominal)}`
        : selectedVariant.name,
      targetAccount: isGestun ? `${gestunPayoutBank} - ${gestunPayoutAccount}` : targetAccount,
      targetZone: product.requiresServer ? selectedServer : targetZone,
      customerEmail,
      customerWhatsApp,
      basePrice,
      adminFee,
      totalAmount,
      paymentMethod: selectedPaymentId,
      status: 'pending',
      createdAt: new Date().toLocaleString('id-ID'),
      isGestun,
      gestunProvider: isGestun ? gestunProvider.name : undefined,
      gestunPayoutAmount: isGestun ? gestunCleanPayout : undefined,
      payoutBank: isGestun ? gestunPayoutBank : undefined,
      payoutAccount: isGestun ? `${gestunPayoutAccount} (${gestunPayoutName})` : undefined,
    };

    if (selectedPaymentId === 'qris') {
      onOpenQRIS(newOrder);
    } else {
      // Direct completion / manual bank verification
      onOrderSuccess(newOrder);
    }
  };

  const renderPaymentIcon = (pm: PaymentMethodInfo) => {
    return (
      <UniversalBankLogo
        bankCode={pm.bankCode}
        bankName={pm.name}
        id={pm.id}
        className="h-6"
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#091024] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-[#0c152e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden p-1">
              <ProductBrandIcon type={product.iconType} customLogoUrl={product.customLogoUrl} className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{product.name}</span>
                {isDNS && (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    DNS Anti Blokir
                  </span>
                )}
                {isTreasury && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    Akses Live Rp 5.000
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">{product.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* SPECIAL INSTRUCTION NOTICES */}
          {isDNS && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 text-xs text-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-300 text-sm mb-0.5">
                  Ketentuan Khusus DNS AdGuard (Rp 100.000 / Bulan)
                </strong>
                <p className="leading-relaxed">
                  Metode pembayaran khusus DNS AdGuard hanya melalui{' '}
                  <span className="font-bold underline">ShopeePay (089654454210)</span> dan{' '}
                  <span className="font-bold underline">KROM (770071702112)</span> an Guruh Samudra.
                  Setelah order sukses, Anda akan langsung dihubungkan ke WhatsApp Admin DNS ({csConfig.whatsappDnsAdmin || '+62 896-5445-4210'})
                  untuk aktivasi konfigurasi server.
                </p>
              </div>
            </div>
          )}

          {isTreasury && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 text-xs text-amber-200 flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300 text-sm mb-0.5">
                  Web Monitor Harga Treasury (Rp 5.000 / Bulan)
                </strong>
                <p className="leading-relaxed">
                  Akses live grafik spread dan harga emas real-time. Setelah pembayaran berhasil, Anda
                  akan secara otomatis dialihkan ke portal{' '}
                  <span className="font-bold text-white underline">https://price.tsrengga.my.id/</span>.
                </p>
              </div>
            </div>
          )}

          {/* STEP 1: Select Denomination / Variant OR Gestun Calculator */}
          {isGestun ? (
            <div className="bg-[#0c152e] border border-purple-500/30 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  1. Kalkulator Gestun Pencairan PayLater
                </span>
                <span className="text-[10px] text-slate-400">Fee Resmi Reinstore</span>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Pilih Layanan PayLater:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {GESTUN_PROVIDERS.map((prov) => (
                    <button
                      type="button"
                      key={prov.id}
                      onClick={() => setGestunProvider(prov)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        gestunProvider.id === prov.id
                          ? 'border-purple-500 bg-purple-900/40 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                          : 'border-slate-800 bg-[#081024] text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{prov.name}</div>
                      <div className="text-[10px] text-purple-300 font-semibold mt-0.5">
                        Fee: {prov.feePercent}% • {prov.note}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nominal Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nominal Limit yang Ingin Dicairkan (Minimal Rp 100.000):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="100000"
                    step="10000"
                    value={gestunNominal}
                    onChange={(e) => setGestunNominal(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#081024] border border-slate-700 text-white font-mono font-bold rounded-xl pl-11 pr-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Nominal Chips */}
              <div className="flex flex-wrap gap-2">
                {[100000, 250000, 500000, 1000000, 2000000].map((nom) => (
                  <button
                    type="button"
                    key={nom}
                    onClick={() => setGestunNominal(nom)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:bg-purple-900/60"
                  >
                    Rp {new Intl.NumberFormat('id-ID').format(nom)}
                  </button>
                ))}
              </div>

              {/* Gestun Breakdown */}
              <div className="bg-[#080d1d] border border-purple-500/20 rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Nominal Pencairan Limit:</span>
                  <span className="font-mono font-semibold">
                    Rp {new Intl.NumberFormat('id-ID').format(gestunNominal)}
                  </span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>Fee Gestun ({gestunProvider.feePercent}%):</span>
                  <span className="font-mono font-semibold">
                    - Rp {new Intl.NumberFormat('id-ID').format(gestunFeeAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold pt-1.5 border-t border-slate-800 text-sm">
                  <span>Dana Bersih Diterima:</span>
                  <span className="font-mono text-base">
                    Rp {new Intl.NumberFormat('id-ID').format(gestunCleanPayout)}
                  </span>
                </div>
              </div>

              {/* Payout Destination Account */}
              <div className="space-y-3 pt-2 border-t border-purple-500/20">
                <label className="text-xs font-bold text-white block">
                  Rekening Penerima Dana Pencairan:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Bank / E-Wallet</label>
                    <select
                      value={gestunPayoutBank}
                      onChange={(e) => setGestunPayoutBank(e.target.value)}
                      className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
                    >
                      {GESTUN_PAYOUT_BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Nomor Rekening / HP</label>
                    <input
                      type="text"
                      placeholder="Contoh: 901699374570"
                      value={gestunPayoutAccount}
                      onChange={(e) => setGestunPayoutAccount(e.target.value)}
                      className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Atas Nama Rekening</label>
                    <input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={gestunPayoutName}
                      onChange={(e) => setGestunPayoutName(e.target.value)}
                      className="w-full bg-[#081024] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  1. Pilih Nominal / Paket
                </span>
                <span className="text-[10px] text-slate-400">
                  {product.variants.length} Pilihan Tersedia
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  return (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-[#00A3FF] bg-blue-950/40 text-white shadow-[0_0_15px_rgba(0,163,255,0.25)]'
                          : 'border-slate-800 bg-[#0c152e] text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{v.name}</div>
                      <div className="text-xs font-mono font-bold text-[#00A3FF] mt-1">
                        Rp {new Intl.NumberFormat('id-ID').format(v.price)}
                      </div>
                      {v.bonus && (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded mt-1 inline-block">
                          {v.bonus}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Input Target ID / Account (For Non-Gestun) */}
          {!isGestun && (
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                2. Masukkan Data Akun / Tujuan
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={product.secondaryInputLabel || product.requiresServer ? '' : 'sm:col-span-2'}>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {product.inputLabel || 'Nomor Akun / ID Tujuan'}
                  </label>
                  <input
                    type="text"
                    value={targetAccount}
                    onChange={(e) => setTargetAccount(e.target.value)}
                    placeholder={product.inputPlaceholder || 'Contoh: 12345678'}
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-[#00A3FF] focus:outline-none"
                    required
                  />
                </div>

                {product.secondaryInputLabel && (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {product.secondaryInputLabel}
                    </label>
                    <input
                      type="text"
                      value={targetZone}
                      onChange={(e) => setTargetZone(e.target.value)}
                      placeholder={product.secondaryInputPlaceholder || 'Contoh: 2024'}
                      className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-[#00A3FF] focus:outline-none"
                      required
                    />
                  </div>
                )}

                {product.requiresServer && product.serverList && (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Pilih Server
                    </label>
                    <select
                      value={selectedServer}
                      onChange={(e) => setSelectedServer(e.target.value)}
                      className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-[#00A3FF] focus:outline-none"
                    >
                      {product.serverList.map((srv) => (
                        <option key={srv} value={srv}>
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {isGestun ? '2. Metode Pembayaran' : '3. Pilih Metode Pembayaran'}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                QRIS Free Admin (Lainnya +Rp 2.500)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {paymentMethodsList.map((pm) => {
                const isSelected = selectedPaymentId === pm.id;
                return (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setSelectedPaymentId(pm.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all text-left ${
                      isSelected
                        ? 'border-[#00A3FF] bg-blue-950/40 text-white shadow-[0_0_15px_rgba(0,163,255,0.2)]'
                        : 'border-slate-800 bg-[#0c152e] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="shrink-0">{renderPaymentIcon(pm)}</div>
                      <div>
                        <div className="text-xs font-bold truncate flex items-center gap-1.5">
                          <span>{pm.name}</span>
                          {pm.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                              {pm.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {pm.fee === 0 ? (
                            <span className="text-emerald-400 font-bold">Gratis Biaya Admin</span>
                          ) : (
                            <span>Biaya Admin: Rp {new Intl.NumberFormat('id-ID').format(pm.fee)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#00A3FF] bg-[#00A3FF] text-white'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 fill-white text-[#091024]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Details Card (Account Number & Holder) */}
            {selectedPaymentInfo && selectedPaymentInfo.accountNumber && selectedPaymentInfo.id !== 'qris' && (
              <div className="mt-3 p-3.5 rounded-2xl bg-[#080f24] border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-cyan-400 block text-[10px] uppercase font-bold tracking-wider">
                      Tujuan Transfer Resmi ({selectedPaymentInfo.name}):
                    </span>
                    {selectedPaymentInfo.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {selectedPaymentInfo.badge}
                      </span>
                    )}
                  </div>
                  <div className="font-mono font-black text-white text-base sm:text-lg select-all tracking-wider">
                    {selectedPaymentInfo.accountNumber}
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                    Atas Nama (a.n.): <strong className="text-cyan-300 uppercase">{selectedPaymentInfo.accountName}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedPaymentInfo.accountNumber!)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedText === selectedPaymentInfo.accountNumber ? 'Tersalin!' : 'Salin Nomor Rekening'}</span>
                </button>
              </div>
            )}
          </div>

          {/* STEP 4: Customer Contact Info for Invoice & WhatsApp Notification */}
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              {isGestun ? '3. Kontak Penerima Invoice & Notifikasi' : '4. Kontak Penerima Invoice & Notifikasi'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Email / Gmail <span className="text-cyan-400">*</span>
                  </label>
                  {currentUser?.email ? (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 rounded-full">
                      ✓ Akun Terhubung
                    </span>
                  ) : customerEmail.toLowerCase().includes('@gmail.com') ? (
                    <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.2 rounded-full">
                      ✓ Gmail Terdeteksi
                    </span>
                  ) : null}
                </div>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Contoh: namaanda@gmail.com"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-[#00A3FF] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nomor WhatsApp (Notifikasi Real-Time) <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="tel"
                  value={customerWhatsApp}
                  onChange={(e) => setCustomerWhatsApp(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-[#00A3FF] focus:outline-none"
                  required
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1.5">
              <span className="text-cyan-400 font-bold">📧 Invoice Resmi Otomatis:</span>
              <span>Akan langsung dikirimkan ke kotak masuk Gmail Anda setelah pembayaran berhasil diverifikasi.</span>
            </p>
          </div>

          {/* Price Breakdown Footer */}
          <div className="bg-[#080d1e] border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Harga Layanan / Subtotal:</span>
              <span className="text-white font-mono font-semibold">
                Rp {new Intl.NumberFormat('id-ID').format(basePrice)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Biaya Layanan Admin:</span>
              <span className={adminFee === 0 ? 'text-emerald-400 font-bold' : 'text-slate-300 font-mono font-semibold'}>
                {adminFee === 0 ? 'GRATIS (Rp 0)' : `Rp ${new Intl.NumberFormat('id-ID').format(adminFee)}`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
              <span className="text-white">Total Pembayaran:</span>
              <span className="text-lg font-black text-[#00A3FF] font-mono">
                Rp {new Intl.NumberFormat('id-ID').format(totalAmount)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-2 py-3 px-6 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,112,243,0.4)] transition-all active:scale-98"
            >
              <span>
                {selectedPaymentId === 'qris'
                  ? 'Lanjut ke QRIS Otomatis'
                  : 'Konfirmasi & Bayar Sekarang'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
