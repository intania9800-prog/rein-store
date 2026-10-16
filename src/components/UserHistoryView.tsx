import React from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  Search,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';
import { Order } from '../types';

interface UserHistoryViewProps {
  orders: Order[];
  onBackToHome: () => void;
  onViewInvoice: (order: Order) => void;
}

export const UserHistoryView: React.FC<UserHistoryViewProps> = ({
  orders,
  onBackToHome,
  onViewInvoice,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredOrders = orders.filter((o) =>
    o.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.targetAccount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A3FF] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#00A3FF]" />
            <span>Riwayat Transaksi Saya</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Lacak status pembayaran, nomor token, dan invoice resmi transaksi Anda.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Invoice atau Akun..."
            className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl pl-9 pr-3.5 py-2 text-xs focus:border-[#00A3FF] focus:outline-none"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3.5">
        {filteredOrders.length === 0 ? (
          <div className="bg-[#091024] border border-slate-800 rounded-3xl p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Belum Ada Riwayat Transaksi</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
              Anda belum melakukan pemesanan atau pencarian tidak menemukan hasil.
            </p>
            <button
              onClick={onBackToHome}
              className="px-5 py-2.5 rounded-xl bg-[#0070F3] text-white text-xs font-bold"
            >
              Mulai Belanja Sekarang
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#091024] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">
                    {order.invoiceNumber}
                  </span>
                  <span className="text-[10px] text-slate-400">• {order.createdAt}</span>
                </div>

                <h4 className="text-sm font-bold text-white">
                  {order.productName} - {order.variantName}
                </h4>

                <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    Tujuan: <strong className="text-slate-200">{order.targetAccount}</strong>
                  </span>
                  <span>
                    Metode: <strong className="text-slate-200 uppercase">{order.paymentMethod}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Total Bayar</span>
                  <span className="text-sm font-black text-[#00A3FF] font-mono">
                    Rp {new Intl.NumberFormat('id-ID').format(order.totalAmount)}
                  </span>
                </div>

                <div>
                  {order.status === 'success' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Berhasil</span>
                    </span>
                  )}
                  {order.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Menunggu</span>
                    </span>
                  )}
                  {order.status === 'cancelled' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-full">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Dibatalkan</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onViewInvoice(order)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
