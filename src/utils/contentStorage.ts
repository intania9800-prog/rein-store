export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface StepItem {
  number: number;
  title: string;
  description: string;
  iconName?: string;
}

export interface PolicySection {
  heading: string;
  paragraphs: string[];
}

export interface ReinstoreContent {
  tentang: {
    title: string;
    tagline: string;
    description: string;
    vision: string;
    mission: string[];
    features: { title: string; desc: string; icon: string }[];
    contactWhatsApp: string;
  };
  caraOrder: {
    title: string;
    tagline: string;
    steps: StepItem[];
    tips: string[];
  };
  pembayaran: {
    title: string;
    tagline: string;
    qrisInfo: {
      title: string;
      desc: string;
      supportedWallets: string[];
    };
    bankInfo: {
      title: string;
      accounts: { bank: string; accountNo: string; holder: string }[];
    };
    minimarketInfo: {
      title: string;
      desc: string;
    };
    paymentSteps: string[];
  };
  faq: {
    title: string;
    tagline: string;
    items: FAQItem[];
  };
  terms: {
    title: string;
    tagline: string;
    lastUpdated: string;
    sections: PolicySection[];
  };
  privacy: {
    title: string;
    tagline: string;
    lastUpdated: string;
    sections: PolicySection[];
  };
}

export const STORAGE_KEY_CONTENT = 'reinstore_custom_content_v2';
export const EVENT_CONTENT_UPDATED = 'reinstore_content_updated_event';

export const DEFAULT_CONTENT: ReinstoreContent = {
  tentang: {
    title: 'Tentang Reinstore',
    tagline: 'Solusi Digital Tercepat, Termurah & Terpercaya di Indonesia',
    description:
      'Reinstore adalah platform penyedia layanan top up game, voucher digital, pulsa all-operator, paket data, dan token listrik PLN dengan proses instan 24 jam nonstop. Selain produk harian, Reinstore juga menghadirkan solusi teknologi mutakhir seperti Web Monitor Treasury (live pantau harga emas), DNS AdGuard (internet aman tanpa iklan), serta layanan pencairan limit Gestun PayLater dengan sistem QRIS otomatis super cepat.',
    vision:
      'Menjadi pusat layanan digital dan top up game nomor satu yang menghadirkan pengalaman transaksi termudah, teraman, dan paling transparan bagi seluruh masyarakat Indonesia.',
    mission: [
      'Menyediakan produk digital dengan harga langsung tangan pertama yang bersaing dan terjangkau.',
      'Menghadirkan sistem otomatisasi QRIS real-time untuk pemrosesan order kilat dalam hitungan detik.',
      'Menjaga integritas dan keamanan pengguna dengan proteksi akun 2FA serta garansi transaksi 100% legal.',
      'Memberikan layanan bantuan pelanggan (Customer Support) yang sigap, ramah, dan solutif setiap saat.',
    ],
    features: [
      {
        title: 'Proses Kilat 1-60 Detik',
        desc: 'Sistem terotomatisasi mendeteksi pembayaran secara real-time dan langsung memproses pesanan Anda.',
        icon: 'Zap',
      },
      {
        title: '100% Legal & Bergaransi',
        desc: 'Seluruh produk game dan voucher bersumber dari distributor resmi resmi, dijamin aman dari banned.',
        icon: 'ShieldCheck',
      },
      {
        title: 'Pembayaran Lengkap QRIS & Bank',
        desc: 'Mendukung QRIS All Payment, BCA, SeaBank, Bank Krom, e-Wallet DANA/OVO/GoPay/ShopeePay, dan Minimarket.',
        icon: 'CreditCard',
      },
      {
        title: 'Tools Digital Eksklusif',
        desc: 'Akses ke Web Monitor Treasury, DNS AdGuard proteksi privasi, dan Gestun PayLater berizin terpercaya.',
        icon: 'Sparkles',
      },
    ],
    contactWhatsApp: '0857-5509-5431',
  },

  caraOrder: {
    title: 'Panduan Cara Order',
    tagline: '6 Langkah Mudah Transaksi Kilat di Reinstore',
    steps: [
      {
        number: 1,
        title: 'Pilih Kategori & Produk',
        description:
          'Pilih game favorit Anda (MLBB, Free Fire, Genshin, dll), pulsa, token PLN, atau tools digital yang ingin dibeli.',
        iconName: 'LayoutGrid',
      },
      {
        number: 2,
        title: 'Masukkan Data Tujuan / User ID',
        description:
          'Isikan User ID & Zone ID Game, Nomor HP untuk Pulsa, atau Nomor Meter / ID Pelanggan untuk Token Listrik.',
        iconName: 'UserCheck',
      },
      {
        number: 3,
        title: 'Pilih Nominal / Paket Produk',
        description:
          'Tentukan nominal diamond, denom pulsa, atau varian paket layanan sesuai kebutuhan Anda.',
        iconName: 'CheckCircle2',
      },
      {
        number: 4,
        title: 'Pilih Metode Pembayaran',
        description:
          'Gunakan QRIS untuk verifikasi instan tanpa biaya admin, atau pilih Transfer Bank / e-Wallet favorit Anda.',
        iconName: 'QrCode',
      },
      {
        number: 5,
        title: 'Masukkan Kontak WhatsApp',
        description:
          'Tulis nomor WhatsApp aktif Anda untuk menerima bukti invoice otomatis dan notifikasi status pesanan.',
        iconName: 'Phone',
      },
      {
        number: 6,
        title: 'Bayar & Pesanan Selesai!',
        description:
          'Selesaikan pembayaran sesuai nominal yang tertera. Sistem akan otomatis mengisi produk dalam 1 - 60 detik!',
        iconName: 'Sparkles',
      },
    ],
    tips: [
      'Pastikan User ID dan Server ID yang dimasukkan sudah benar sebelum menekan tombol Bayar.',
      'Untuk pembayaran QRIS, gunakan fitur Scan QR di aplikasi m-Banking atau e-Wallet apapun dan bayar nominal pas.',
      'Simpan nomor Invoice transaksi untuk pengecekan status di menu Riwayat atau konfirmasi ke Admin Support.',
    ],
  },

  pembayaran: {
    title: 'Metode & Panduan Pembayaran',
    tagline: 'Pilihan Jalur Pembayaran Resmi, Cepat, dan Bebas Ribet',
    qrisInfo: {
      title: 'QRIS All Payment (Otomatis & Real-Time)',
      desc: 'Cukup scan satu kode QRIS Reinstore menggunakan aplikasi m-Banking atau e-Wallet apapun. Sistem mendeteksi mutasi secara otomatis tanpa perlu kirim struk.',
      supportedWallets: [
        'BCA Mobile',
        'Livin Mandiri',
        'BRImo',
        'BNI Mobile',
        'SeaBank',
        'Bank Krom',
        'DANA',
        'GoPay',
        'OVO',
        'ShopeePay',
        'LinkAja',
      ],
    },
    bankInfo: {
      title: 'Transfer Bank Manual & Virtual Account',
      accounts: [
        { bank: 'BCA (Bank Central Asia)', accountNo: '8735-192-801', holder: 'REINSTORE OFFICIAL' },
        { bank: 'SeaBank Indonesia', accountNo: '9019-3382-7711', holder: 'REINSTORE DIGITAL' },
        { bank: 'Bank Krom', accountNo: '010-8829-1029', holder: 'REINSTORE CORP' },
      ],
    },
    minimarketInfo: {
      title: 'Gerai Ritel (Alfamart & Indomaret)',
      desc: 'Bagi Anda yang belum memiliki rekening bank atau e-wallet, pembayaran dapat dilakukan secara tunai di kasir gerai Alfamart atau Indomaret terdekat dengan menyebutkan kode pembayaran pesanan.',
    },
    paymentSteps: [
      'Pilih metode pembayaran saat checkout (disarankan QRIS untuk proses tercepat).',
      'Buka aplikasi m-Banking atau e-Wallet pilihan Anda di smartphone.',
      'Pilih menu Scan / Bayar, lalu arahkan kamera ke barcode QRIS di layar (atau unduh gambar QRIS jika memesan dari HP).',
      'Pastikan nominal transfer sesuai persis dengan total tagihan invoice.',
      'Selesaikan PIN transaksi dan kembali ke halaman Reinstore. Sistem akan otomatis memperbarui status menjadi Berhasil!',
    ],
  },

  faq: {
    title: 'Pertanyaan yang Sering Diajukan (FAQ)',
    tagline: 'Temukan Jawaban Lengkap Seputar Transaksi & Layanan Reinstore',
    items: [
      {
        id: 'faq-1',
        category: 'Proses Transaksi',
        question: 'Berapa lama waktu yang dibutuhkan sampai pesanan masuk?',
        answer:
          'Secara umum, proses pengiriman produk berjalan otomatis dan instan hanya dalam 1 hingga 60 detik setelah pembayaran terverifikasi oleh sistem QRIS. Pada jam sibuk atau maintenance server game tertentu, proses maksimal memakan waktu 5-15 menit.',
      },
      {
        id: 'faq-2',
        category: 'Proses Transaksi',
        question: 'Bagaimana jika saya salah memasukkan User ID atau Nomor HP?',
        answer:
          'Harap selalu cek kembali data sebelum membayar. Jika pesanan belum terproses di server game/provider, segera hubungi Admin Support via WhatsApp dengan melampirkan nomor Invoice untuk bantuan penyesuaian secepatnya.',
      },
      {
        id: 'faq-3',
        category: 'Keamanan & Legalitas',
        question: 'Apakah diamond atau produk game di Reinstore 100% legal?',
        answer:
          'Ya, 100% legal! Reinstore bermitra langsung dengan authorized distributor resmi publisher game (Moonton, Garena, Hoyoverse, dll). Akun game Anda dijamin aman dan bebas resiko banned.',
      },
      {
        id: 'faq-4',
        category: 'Pembayaran',
        question: 'Apakah ada biaya tambahan (admin fee) untuk QRIS?',
        answer:
          'Tidak ada! Pembayaran via QRIS di Reinstore bebas biaya admin tambahan (Rp 0), sehingga Anda cukup membayar nominal harga produk yang tertera.',
      },
      {
        id: 'faq-5',
        category: 'Layanan Digital',
        question: 'Bagaimana cara kerja Web Monitor Treasury dan Gestun PayLater?',
        answer:
          'Web Monitor Treasury adalah platform pemantau harga emas real-time dengan grafik dan notifikasi fluktuasi harga. Sedangkan Gestun PayLater adalah layanan resmi bantuan pencairan limit paylater (Shopee PayLater, Kredivo, Akulaku) menjadi saldo rekening/e-wallet dengan fee transparan.',
      },
      {
        id: 'faq-6',
        category: 'Garansi & Pengembalian',
        question: 'Bagaimana kebijakan pengembalian dana (refund) jika produk gagal kirim?',
        answer:
          'Jika terjadi kendala teknis dari sisi provider pusat yang menyebabkan pesanan gagal diproses dalam waktu 1x24 jam, Reinstore memberikan garansi uang kembali 100% (Full Refund) langsung ke rekening/e-wallet pembeli.',
      },
    ],
  },

  terms: {
    title: 'Syarat & Ketentuan Layanan',
    tagline: 'Ketentuan Penggunaan Platform & Transaksi di Reinstore',
    lastUpdated: '15 Oktober 2026',
    sections: [
      {
        heading: '1. Ketentuan Umum & Penerimaan Layanan',
        paragraphs: [
          'Dengan mengakses dan melakukan transaksi di website Reinstore, pengguna secara otomatis menyetujui seluruh syarat dan ketentuan yang berlaku.',
          'Reinstore berhak memperbarui atau memodifikasi ketentuan sewaktu-waktu demi meningkatkan kenyamanan, kepatuhan hukum, dan keamanan transaksi.',
        ],
      },
      {
        heading: '2. Akurasi Informasi & Tanggung Jawab Pengguna',
        paragraphs: [
          'Pengguna wajib memastikan bahwa data identitas akun game (User ID, Server ID), nomor ponsel, atau nomor meter PLN yang diinputkan adalah benar dan valid.',
          'Reinstore tidak bertanggung jawab atas kerugian atau kesalahan pengiriman yang disebabkan oleh kelalaian pengguna dalam memasukkan data tujuan.',
        ],
      },
      {
        heading: '3. Pembayaran & Batas Waktu Transaksi',
        paragraphs: [
          'Setiap pesanan yang dibuat memiliki batas waktu kedaluwarsa pembayaran (QRIS berlaku 15-30 menit). Pembayaran yang masuk setelah melewati batas waktu dapat mengalami delay verifikasi.',
          'Pengguna wajib membayar nominal pas sesuai dengan nominal unik yang tertera pada invoice agar sistem otomatis dapat memverifikasi pembayaran tanpa kendala.',
        ],
      },
      {
        heading: '4. Garansi Produk & Kebijakan Pengembalian Dana (Refund)',
        paragraphs: [
          'Semua produk yang dijual dijamin 100% original, legal, dan resmi dari mitra distributor terverifikasi.',
          'Pengembalian dana (refund) hanya berlaku apabila pesanan gagal terkirim karena gangguan sistemik di pihak Reinstore atau server provider dan tidak dapat diselesaikan dalam 1x24 jam.',
          'Pesanan yang statusnya sudah dinyatakan "Berhasil" dan item telah masuk ke akun game tujuan tidak dapat dibatalkan atau direfund.',
        ],
      },
      {
        heading: '5. Batasan Tanggung Jawab',
        paragraphs: [
          'Reinstore tidak bertanggung jawab atas force majeure atau gangguan jaringan skala nasional dari pihak operator telekomunikasi, server publisher game, atau bank penyedia layanan transfer.',
        ],
      },
    ],
  },

  privacy: {
    title: 'Kebijakan Privasi',
    tagline: 'Komitmen Perlindungan Data & Keamanan Pengguna Reinstore',
    lastUpdated: '15 Oktober 2026',
    sections: [
      {
        heading: '1. Informasi yang Kami Kumpulkan',
        paragraphs: [
          'Kami hanya mengumpulkan informasi yang diperlukan untuk pemrosesan pesanan, seperti User ID Game, Nomor Telepon / WhatsApp (untuk pengiriman bukti nota/invoice), serta alamat email untuk pendaftaran akun.',
          'Kami TIDAK PERNAH meminta, menyimpan, atau mencatat data sensitif seperti password game, PIN transaksi perbankan, atau kode OTP pribadi Anda.',
        ],
      },
      {
        heading: '2. Penggunaan Informasi Pribadi',
        paragraphs: [
          'Data kontak Anda digunakan semata-mata untuk memverifikasi pesanan, mengirimkan update status transaksi, dan memberikan bantuan customer care jika terdapat kendala.',
          'Reinstore berkomitmen teguh untuk TIDAK PERNAH menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga manapun untuk tujuan periklanan atau spam.',
        ],
      },
      {
        heading: '3. Standar Keamanan Data & Proteksi 2FA',
        paragraphs: [
          'Seluruh lalu lintas data di situs Reinstore dilindungi dengan enkripsi SSL/TLS 256-bit standar industri perbankan.',
          'Untuk akun pengguna terdaftar dan panel administrator, Reinstore menyediakan autentikasi dua faktor (Two-Factor Authentication / 2FA) guna mencegah akses tidak sah.',
        ],
      },
      {
        heading: '4. Hak Pengguna & Penghapusan Data',
        paragraphs: [
          'Pengguna memiliki hak penuh untuk meminta klarifikasi, pembaruan, atau penghapusan data riwayat pesanan dengan menghubungi tim Customer Support resmi kami via WhatsApp.',
        ],
      },
    ],
  },
};

// Retrieve content from localStorage with fallback to default
export function getReinstoreContent(): ReinstoreContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTENT);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        tentang: { ...DEFAULT_CONTENT.tentang, ...(parsed.tentang || {}) },
        caraOrder: { ...DEFAULT_CONTENT.caraOrder, ...(parsed.caraOrder || {}) },
        pembayaran: { ...DEFAULT_CONTENT.pembayaran, ...(parsed.pembayaran || {}) },
        faq: { ...DEFAULT_CONTENT.faq, ...(parsed.faq || {}) },
        terms: { ...DEFAULT_CONTENT.terms, ...(parsed.terms || {}) },
        privacy: { ...DEFAULT_CONTENT.privacy, ...(parsed.privacy || {}) },
      };
    }
  } catch (err) {
    console.error('Failed to parse reinstore content from storage:', err);
  }
  return DEFAULT_CONTENT;
}

// Save customized content
export function saveReinstoreContent(newContent: ReinstoreContent): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(newContent));
    window.dispatchEvent(new CustomEvent(EVENT_CONTENT_UPDATED, { detail: newContent }));
    import('./syncManager').then(({ pushSyncUpdate }) => {
      pushSyncUpdate('content', newContent);
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to save reinstore content to storage:', err);
  }
}

// Reset content back to defaults
export function resetReinstoreContent(): ReinstoreContent {
  try {
    localStorage.removeItem(STORAGE_KEY_CONTENT);
    window.dispatchEvent(new CustomEvent(EVENT_CONTENT_UPDATED, { detail: DEFAULT_CONTENT }));
  } catch (err) {
    console.error('Failed to reset content:', err);
  }
  return DEFAULT_CONTENT;
}
