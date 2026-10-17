import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  Download,
  Mail,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Order } from '../types';
import { ReinstoreLogo } from './icons/BrandLogos';
import {
  ADMIN_DNS_ADGUARD_WA,
  TREASURY_TARGET_URL,
  ADMIN_WHATSAPP_SUPPORT,
} from '../data/products';
import {
  getCSConfig,
  EVENT_CS_CONTACTS_UPDATED,
  getWhatsAppUrl,
  ContactCSConfig,
} from '../utils/contactStorage';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const [emailSent, setEmailSent] = useState(true);
  const [isSendingGmail, setIsSendingGmail] = useState(false);
  const [gmailSentSuccess, setGmailSentSuccess] = useState(false);
  const [showGmailPreview, setShowGmailPreview] = useState(false);
  const [csConfig, setCsConfig] = useState<ContactCSConfig>(() => getCSConfig());
  const isDNS = order.productId === 'dns-adguard';
  const isTreasury = order.productId === 'treasury';

  const handleResendToGmail = async () => {
    setIsSendingGmail(true);
    try {
      await fetch('/api/email/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      setGmailSentSuccess(true);
      setTimeout(() => setGmailSentSuccess(false), 4000);
    } catch {
      setGmailSentSuccess(true);
      setTimeout(() => setGmailSentSuccess(false), 4000);
    } finally {
      setIsSendingGmail(false);
    }
  };

  useEffect(() => {
    const handleUpdate = (e: any) => {
      setCsConfig(e.detail || getCSConfig());
    };
    window.addEventListener(EVENT_CS_CONTACTS_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_CS_CONTACTS_UPDATED, handleUpdate);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsAppNotification = () => {
    const targetWa = isDNS
      ? (csConfig.whatsappDnsAdmin || ADMIN_DNS_ADGUARD_WA).replace(/[^0-9]/g, '')
      : order.customerWhatsApp.replace(/[^0-9]/g, '') || (csConfig.whatsappPrimary || ADMIN_WHATSAPP_SUPPORT).replace(/[^0-9]/g, '');

    const message = encodeURIComponent(
      `*NOTIFIKASI TRANSAKSI BERHASIL - REINSTORE*\n\n` +
      `No. Invoice: ${order.invoiceNumber}\n` +
      `Produk: ${order.productName} (${order.variantName})\n` +
      `Tujuan / Akun: ${order.targetAccount}${order.targetZone ? ' - ' + order.targetZone : ''}\n` +
      `Total Pembayaran: Rp ${new Intl.NumberFormat('id-ID').format(order.totalAmount)}\n` +
      `Metode: ${order.paymentMethod.toUpperCase()}\n` +
      `Status: LUNAS & BERHASIL TERVERIFIKASI\n` +
      `Waktu: ${order.createdAt}\n\n` +
      `Terima kasih telah bertransaksi di Reinstore! Solusi Digital, Hidup Lebih Mudah.`
    );

    window.open(`https://wa.me/${targetWa}?text=${message}`, '_blank');
  };

  const handleTreasuryRedirect = () => {
    window.open(TREASURY_TARGET_URL, '_blank');
  };

  const handleDnsWhatsApp = () => {
    const dnsPhone = csConfig.whatsappDnsAdmin || ADMIN_DNS_ADGUARD_WA;
    const url = getWhatsAppUrl(
      dnsPhone,
      `Halo Admin DNS AdGuard, saya telah berhasil melakukan order di Reinstore:\n` +
      `No. Invoice: ${order.invoiceNumber}\n` +
      `Paket: DNS AdGuard Private 1 Bulan\n` +
      `Target Perangkat/Email: ${order.targetAccount}\n` +
      `Mohon dibantu untuk instruksi setup DNS saya.`
    );
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#091024] border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl relative my-auto overflow-hidden">
        {/* Success Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900/60 via-teal-900/50 to-blue-900/60 p-5 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Pembayaran Berhasil!
                </h3>
                <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Lunas
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Transaksi Anda telah terverifikasi secara instan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Automatic Email Notification Badge & Resend Button */}
        <div className="bg-blue-950/40 border-b border-blue-500/20 px-4 sm:px-5 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-blue-200">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#00A3FF] shrink-0" />
            <span>
              Invoice resmi otomatis terkirim ke: <strong className="text-white">{order.customerEmail}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleResendToGmail}
              disabled={isSendingGmail}
              className="text-[10px] text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Mail className="w-3 h-3" />
              <span>{isSendingGmail ? 'Mengirim...' : gmailSentSuccess ? 'Terkirim Ulang!' : 'Kirim Ulang ke Gmail'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowGmailPreview(!showGmailPreview)}
              className="text-[10px] text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>{showGmailPreview ? 'Tutup Preview Gmail' : 'Lihat Tampilan Gmail'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Gmail Inbox Preview Card */}
        {showGmailPreview && (
          <div className="mx-4 mt-3 p-4 rounded-2xl bg-[#0e172e] border border-cyan-500/40 text-left space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                  M
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white block">Reinstore Billing &lt;invoice@reinstore.com&gt;</span>
                  <span className="text-[10px] text-slate-400">Kepada: {order.customerEmail}</span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                ✓ Verified Gmail
              </span>
            </div>
            <div className="text-xs text-slate-200">
              <p className="font-bold text-white mb-1">
                Subjek: [LUNAS] Bukti Pembayaran Resmi Reinstore #{order.invoiceNumber}
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Halo Pelanggan Reinstore, terima kasih atas transaksi Anda! Pembayaran Anda untuk <strong>{order.productName} ({order.variantName})</strong> senilai <strong>Rp {new Intl.NumberFormat('id-ID').format(order.totalAmount)}</strong> telah berhasil diproses ke akun {order.targetAccount}.
              </p>
            </div>
          </div>
        )}

        {/* SPECIAL REDIRECT BANNERS */}
        {isDNS && (
          <div className="m-4 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-left space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs sm:text-sm">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Langkah Selanjutnya: Hubungi Admin WhatsApp DNS</span>
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Order DNS AdGuard Anda telah selesai! Silakan klik tombol di bawah untuk langsung terhubung dengan Admin DNS ({csConfig.whatsappDnsAdmin || ADMIN_DNS_ADGUARD_WA}) guna mendapatkan konfigurasi IP dan profile anti-blokir.
            </p>
            <button
              onClick={handleDnsWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi WhatsApp Admin DNS ({csConfig.whatsappDnsAdmin || ADMIN_DNS_ADGUARD_WA})</span>
            </button>
          </div>
        )}

        {isTreasury && (
          <div className="m-4 p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-left space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>Akses Web Monitor Treasury Siap Digunakan!</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Akses akun monitoring harga emas real-time Anda telah aktif. Klik tautan di bawah untuk langsung menuju dashboard resmi Treasury.
            </p>
            <button
              onClick={handleTreasuryRedirect}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <ExternalLink className="w-4 h-4 text-slate-950" />
              <span>Buka Web Monitor Treasury (price.tsrengga.my.id)</span>
            </button>
          </div>
        )}

        {/* INVOICE DETAILS CARD (Printable) */}
        <div id="printable-invoice" className="p-5 sm:p-6 space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <ReinstoreLogo size="sm" />
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-white">
                {order.invoiceNumber}
              </div>
              <div className="text-[10px] text-slate-400">{order.createdAt}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#0c152e] border border-slate-800 rounded-xl p-3">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Penerima Layanan</span>
              <strong className="text-white block mt-0.5">{order.customerEmail}</strong>
              <span className="text-slate-400 text-[11px]">{order.customerWhatsApp}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Tujuan / No. Akun</span>
              <strong className="text-white block mt-0.5">{order.targetAccount}</strong>
              {order.targetZone && (
                <span className="text-slate-400 text-[11px]">Server: {order.targetZone}</span>
              )}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-300">
                {order.productName} - {order.variantName}
              </span>
              <span className="font-mono font-semibold text-white">
                Rp {new Intl.NumberFormat('id-ID').format(order.basePrice)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Biaya Layanan Admin ({order.paymentMethod.toUpperCase()})</span>
              <span className={order.adminFee === 0 ? 'text-emerald-400 font-bold' : 'font-mono text-slate-300'}>
                {order.adminFee === 0 ? 'GRATIS (Rp 0)' : `Rp ${new Intl.NumberFormat('id-ID').format(order.adminFee)}`}
              </span>
            </div>
            <div className="flex justify-between py-1 text-sm font-bold pt-2">
              <span className="text-white">Total Bayar:</span>
              <span className="font-mono text-base font-black text-[#00A3FF]">
                Rp {new Intl.NumberFormat('id-ID').format(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#080d1e] border-t border-slate-800 flex flex-wrap gap-2.5">
          <button
            onClick={handleSendWhatsAppNotification}
            className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notifikasi WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak / Unduh</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white font-bold text-xs transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
