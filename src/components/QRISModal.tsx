import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, ShieldCheck, RefreshCw, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../types';
import { QRISDisplay } from './QRISDisplay';
import { ADMIN_WHATSAPP_SUPPORT } from '../data/products';

interface QRISModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (order: Order) => void;
}

export const QRISModal: React.FC<QRISModalProps> = ({
  order,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  if (!isOpen || !order) return null;

  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore confetti error if any
      }
      onPaymentSuccess({
        ...order,
        status: 'success',
      });
    }, 1500);
  };

  const handleSendWhatsAppProof = () => {
    const phone = ADMIN_WHATSAPP_SUPPORT.replace(/[^0-9]/g, '');
    const accountInfo = order.targetZone
      ? `${order.targetAccount} (Server: ${order.targetZone})`
      : order.targetAccount;
    const text = encodeURIComponent(
      `Halo Admin Reinstore, saya sudah melakukan pembayaran via QRIS:\n\n` +
      `🧾 Invoice: ${order.invoiceNumber}\n` +
      `🎮 Produk: ${order.productName} (${order.variantName})\n` +
      `💰 Total: Rp ${new Intl.NumberFormat('id-ID').format(order.totalAmount)}\n` +
      `🎯 Akun / User ID: ${accountInfo}\n\n` +
      `Mohon dibantu proses dan cek pesanannya, terima kasih!`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#091024] border border-blue-900/40 rounded-3xl w-full max-w-md p-4 sm:p-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-[#ED1C24]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                Pembayaran QRIS Nasional
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Invoice: <strong className="text-white">{order.invoiceNumber}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Banner */}
        <div className="flex items-center justify-between bg-blue-950/40 border border-blue-500/30 rounded-xl px-3.5 py-2 mb-3.5 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-[#00A3FF] animate-spin" />
            <span>Selesaikan pembayaran dalam:</span>
          </div>
          <span className="font-mono font-bold text-amber-400 text-sm">
            {formatTimer(timeLeft)}
          </span>
        </div>

        {/* Authentic QRIS Card Display */}
        <QRISDisplay amount={order.totalAmount} invoiceId={order.invoiceNumber} />

        {/* Instructions */}
        <div className="mt-3.5 bg-[#0c152e] border border-slate-800 rounded-xl p-3 text-left space-y-1 text-xs text-slate-300">
          <div className="text-[11px] font-bold text-white uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Panduan Pembayaran:</span>
            <span className="text-[9px] text-emerald-400 font-bold">Proses Real-Time</span>
          </div>
          <p className="text-[11px]">
            1. Buka m-Banking (BCA, Mandiri, BRI, BNI) atau e-Wallet (DANA, GoPay, OVO, ShopeePay).
          </p>
          <p className="text-[11px]">
            2. Buka menu <strong>Scan QR / Bayar QRIS</strong> (atau upload gambar QR yang telah diunduh).
          </p>
          <p className="text-[11px]">
            3. Pastikan merchant: <strong>REINSTORE</strong> dan nominal bayar pas <strong>Rp {new Intl.NumberFormat('id-ID').format(order.totalAmount)}</strong>.
          </p>
          <p className="text-[11px]">
            4. Setelah bayar di aplikasi Anda, klik tombol konfirmasi di bawah.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={handleSimulatePayment}
            disabled={isChecking}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Mutasi QRIS Real-Time...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Saya Sudah Bayar (Verifikasi Otomatis)</span>
              </>
            )}
          </button>

          <button
            onClick={handleSendWhatsAppProof}
            className="w-full py-2.5 px-4 rounded-xl bg-[#075e54]/30 hover:bg-[#075e54]/50 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Kirim Bukti Pembayaran ke WhatsApp Admin</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Tutup & Bayar Nanti
          </button>
        </div>
      </div>
    </div>
  );
};
