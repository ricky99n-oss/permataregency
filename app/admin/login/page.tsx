'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Proses autentikasi ke Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Proteksi Tambahan: Memastikan hanya email admin resmi yang bisa masuk ke panel
      const loggedInEmail = data.user?.email;
      if (loggedInEmail !== 'admin@permataregencyofficial.com') {
        // Jika email tidak sesuai, langsung sign out kembali
        await supabase.auth.signOut();
        throw new Error('Akses ditolak. Akun Anda bukan Administrator resmi.');
      }

      // 3. Jika valid, arahkan ke dashboard admin
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Permata Regency Official</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@permataregencyofficial.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-bold rounded-lg text-white transition-colors shadow-sm ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}