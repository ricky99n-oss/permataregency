'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface House {
  id: string;
  type_name: any;
  price: any;
  virtual_tour_enabled: boolean;
  display_order: number;
}

export default function ProductsPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const fetchHouses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .order('display_order', { ascending: true }) // Sekarang diurutkan berdasarkan urutan drag
        .order('created_at', { ascending: true }); // Fallback jika urutannya sama (0)

      if (error) throw error;
      setHouses(data || []);
    } catch (error: any) {
      alert('Gagal memuat data produk.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleDelete = async (id: string, typeName: any) => {
    const safeName = typeof typeName === 'string' ? typeName : 'Data ini';
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${safeName}"?`)) return;

    try {
      const { error } = await supabase.from('houses').delete().eq('id', id);
      if (error) throw error;
      alert('Tipe rumah berhasil dihapus!');
      fetchHouses();
    } catch (error: any) {
      alert('Gagal menghapus data: ' + error.message);
    }
  };

  // --- LOGIKA DRAG AND DROP ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Wajib agar drop diizinkan
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const oldIndex = houses.findIndex(h => h.id === draggedId);
    const newIndex = houses.findIndex(h => h.id === targetId);

    // Salin array dan pindahkan elemen ke posisi baru
    const newHouses = [...houses];
    const [movedHouse] = newHouses.splice(oldIndex, 1);
    newHouses.splice(newIndex, 0, movedHouse);

    // Update UI langsung agar terasa instan
    setHouses(newHouses);
    setDraggedId(null);
    setIsSavingOrder(true);

    try {
      // Simpan urutan baru ke Supabase sekaligus menggunakan Promise.all
      const updates = newHouses.map((house, index) =>
        supabase.from('houses').update({ display_order: index }).eq('id', house.id)
      );
      await Promise.all(updates);
    } catch (error) {
      console.error('Gagal menyimpan urutan:', error);
      alert('Gagal menyimpan urutan baru.');
      fetchHouses(); // Kembalikan ke urutan semula jika gagal
    } finally {
      setIsSavingOrder(false);
    }
  };

  const formatRupiah = (price: any) => {
    const validPrice = Number(price) || 0;
    if (validPrice === 0) return "Hubungi Marketing";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(validPrice);
  };

  const safeString = (value: any) => {
    if (typeof value === 'string' || typeof value === 'number') return value;
    return "⚠️ Data Corrupt";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Tipe Rumah</h2>
          <p className="text-gray-500 text-sm mt-1">
            Daftar tipe rumah. <span className="font-bold text-orange-600">Tarik dan geser (drag & drop)</span> baris tabel untuk mengatur urutan tampilan di beranda.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isSavingOrder && <span className="text-sm text-gray-500 animate-pulse">Menyimpan urutan...</span>}
          <Link 
            href="/admin/products/create"
            className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 shadow-sm"
          >
            + Tambah Tipe
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="px-4 py-4 w-10"></th> {/* Kolom untuk Ikon Drag */}
                <th className="px-6 py-4 font-medium">Nama Tipe</th>
                <th className="px-6 py-4 font-medium">Harga</th>
                <th className="px-6 py-4 font-medium">Virtual Tour 360</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">Memuat data...</td>
                </tr>
              ) : houses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">Belum ada tipe rumah yang ditambahkan.</td>
                </tr>
              ) : (
                houses.map((house) => (
                  <tr 
                    key={house.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, house.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, house.id)}
                    className={`transition-all bg-white cursor-grab active:cursor-grabbing hover:bg-orange-50 ${draggedId === house.id ? 'opacity-40 scale-[0.99] shadow-inner' : ''}`}
                  >
                    <td className="px-4 py-4 text-gray-400">
                      {/* Ikon Grabber (Titik 6) */}
                      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {safeString(house.type_name)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatRupiah(house.price)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {house.virtual_tour_enabled ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Aktif</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Tidak Aktif</span>
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