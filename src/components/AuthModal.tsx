import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  CheckCircle,
} from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [step, setStep] = useState<'form' | '2fa'>('form');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // 2FA OTP state
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('120248');
  const [countdown, setCountdown] = useState(60);

  const handleGoogleAuth = () => {
    // Google OAuth integration simulation
    const googleUser: User = {
      id: `google-usr-${Date.now()}`,
      name: email ? email.split('@')[0] : 'Pengguna Google',
      email: email || 'user.google@gmail.com',
      phone: phone || '+62 812-3456-7890',
      isVerified2FA: true,
      role: 'user',
    };

    // Transition to 2FA verification to enforce maximum security
    setStep('2fa');
    // Pre-seed demo OTP for convenience
    setGeneratedOtp('582910');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Mohon isi email dan kata sandi!');
      return;
    }
    // Proceed to Two-Factor Authentication (2FA)
    setStep('2fa');
    setCountdown(60);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');

    const verifiedUser: User = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0] || 'Member Reinstore',
      email,
      phone: phone || '+62 812-3456-7890',
      isVerified2FA: true,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
    };

    onLoginSuccess(verifiedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#091024] border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            {/* Header Tabs */}
            <div className="flex border-b border-slate-800 mb-6 pb-2 gap-4">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`text-sm font-bold pb-2 transition-all relative ${
                  mode === 'login' ? 'text-[#00A3FF]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Masuk Akun
                {mode === 'login' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00A3FF] rounded-full" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`text-sm font-bold pb-2 transition-all relative ${
                  mode === 'register' ? 'text-[#00A3FF]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daftar Baru
                {mode === 'register' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00A3FF] rounded-full" />
                )}
              </button>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-98 mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{mode === 'login' ? 'Masuk dengan Google' : 'Daftar dengan Google'}</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <span className="flex-1 h-px bg-slate-800" />
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Atau Email</span>
              <span className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Standard Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Rengga Armanda"
                      className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:border-[#00A3FF] focus:outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:border-[#00A3FF] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nomor WhatsApp (Untuk 2FA & Notifikasi)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:border-[#00A3FF] focus:outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:border-[#00A3FF] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-2.5 flex items-center gap-2 text-[10px] text-blue-300">
                <ShieldCheck className="w-4 h-4 text-[#00A3FF] shrink-0" />
                <span>Akun Anda dilindungi Autentikasi Dua Faktor (2FA) wajib.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,112,243,0.3)] transition-all active:scale-98"
              >
                <span>Lanjut ke Verifikasi 2FA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: 2FA VERIFICATION STEP */
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0070F3]/20 border border-[#00A3FF]/40 text-[#00A3FF] flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(0,163,255,0.25)]">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-white mb-1">
              Verifikasi Autentikasi Dua Faktor (2FA)
            </h3>
            <p className="text-xs text-slate-300 mb-4 px-2">
              Masukkan 6 digit kode keamanan yang dikirimkan ke email{' '}
              <strong className="text-white">{email || 'akun Anda'}</strong>
            </p>

            {/* Demo code helper hint */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-300 mb-4 font-mono">
              Kode OTP 2FA Demo: <strong>120248</strong>
            </div>

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="flex justify-center gap-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-mono font-black bg-[#0c152e] border border-slate-700 focus:border-[#00A3FF] rounded-xl text-white focus:outline-none"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setOtpCode(['1', '2', '0', '2', '4', '8'])}
                className="text-[11px] text-[#00A3FF] hover:underline"
              >
                Gunakan Kode Otomatis (120248)
              </button>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="flex-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verifikasi & Masuk</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
