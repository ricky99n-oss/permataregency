'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && pathname !== '/admin/login') {
        setIsAuthenticated(false);
        router.push('/admin/login');
      } else if (session && session.user?.email === 'admin@permataregencyofficial.com') {
        setIsAuthenticated(true);
        if (pathname === '/admin/login') {
          router.push('/admin');
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && pathname !== '/admin/login') {
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
        Memverifikasi Akses Admin...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-orange-600">Admin Permata</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link 
            href="/admin" 
            className={`block px-4 py-2 rounded-lg text-sm font-medium ${
              pathname === '/admin' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/products" 
            className={`block px-4 py-2 rounded-lg text-sm font-medium ${
              pathname.startsWith('/admin/products') ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
            }`}
          >
            Kelola Produk & Tipe
          </Link>

          {/* MENU KELOLA FOTO TESTIMONI */}
          <Link 
            href="/admin/testimonials" 
            className={`block px-4 py-2 rounded-lg text-sm font-medium ${
              pathname.startsWith('/admin/testimonials') ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
            }`}
          >
            Kelola Foto Testimoni
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}