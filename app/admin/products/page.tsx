'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// Definisi tipe data agar TypeScript tidak error
interface House {
  id: string;
  type_name: string;
  price: number;
  virtual_tour_enabled: boolean;
}

export default function ProductsPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data dari Supabase
  const fetchHouses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHouses(data || []);
    } catch (error: any) {
      console.error('Gagal memuat data:', error.message);
      alert('Gagal memuat data produk.');
    } finally {
      setIsLoading(false);
    }
  };

  // Panggil fetchHouses saat halaman pertama kali dimuat
  useEffect(() => {
    fetchHouses();
  }, []);

  // Fungsi untuk menghapus data
  const handleDelete = async (id: string, typeName: string) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus "${typeName}"? Tindakan ini tidak bisa dibatalkan.`);
    
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('houses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Tipe rumah berhasil dihapus!');
      fetchHouses(); // Refresh tabel setelah dihapus
    } catch (error: any) {
      alert('Gagal menghapus data: ' + error.message);
    }
  };

  // Format angka ke Rupiah
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Tipe Rumah</h2>
          <p className="text-gray-500 text-sm mt-1">Daftar semua tipe rumah yang tersedia di Permata Regency.</p>
        </div>
        <Link 
          href="/admin/products/create"
          className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
        >
          + Tambah Tipe
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="px-6 py-4 font-medium">Nama Tipe</th>
                <th className="px-6 py-4 font-medium">Harga</th>
                <th className="px-6 py-4 font-medium">Virtual Tour 360</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Memuat data...
                  </td>
                </tr>
              ) : houses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Belum ada tipe rumah yang ditambahkan.
                  </td>
                </tr>
              ) : (
                houses.map((house) => (
                  <tr key={house.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {house.type_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatRupiah(house.price)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {house.virtual_tour_enabled ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Tidak Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-3">
                      <Link 
                        href={`/admin/products/${house.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(house.id, house.type_name)}
                        className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}