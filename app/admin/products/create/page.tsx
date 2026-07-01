'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Import supabase client yang baru dibuat

export default function CreateProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    typeName: '',
    price: '',
    description: '',
    virtualTourEnabled: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Menyimpan data ke tabel 'houses' di Supabase
      const { data, error } = await supabase
        .from('houses')
        .insert([
          {
            type_name: formData.typeName,
            price: Number(formData.price), // Pastikan harga diconvert menjadi angka
            description: formData.description,
            virtual_tour_enabled: formData.virtualTourEnabled,
          }
        ])
        .select();

      if (error) throw error;

      alert('Berhasil! Tipe rumah baru telah ditambahkan.');
      
      // Redirect kembali ke halaman daftar produk
      router.push('/admin/products');
      
    } catch (error: any) {
      console.error('Error saat menyimpan:', error.message);
      alert('Gagal menyimpan data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tambah Tipe Rumah Baru</h2>
          <p className="text-gray-500 text-sm mt-1">Masukkan detail spesifikasi dan harga hunian.</p>
        </div>
        <Link 
          href="/admin/products"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Batal
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
        
        {/* Nama Tipe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Tipe Rumah <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="typeName"
            value={formData.typeName}
            onChange={handleChange}
            placeholder="Misal: Tipe 36 Minimalis"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            required 
          />
        </div>

        {/* Harga */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Harga (Rp) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Misal: 500000000"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            required 
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi Rumah
          </label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Jelaskan detail spesifikasi, jumlah kamar, dll..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
          ></textarea>
        </div>

        {/* Fitur Virtual Tour */}
        <div className="flex items-center p-4 bg-orange-50 rounded-lg border border-orange-100">
          <input 
            type="checkbox" 
            id="virtualTourEnabled" 
            name="virtualTourEnabled"
            checked={formData.virtualTourEnabled}
            onChange={handleChange}
            className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500" 
          />
          <label htmlFor="virtualTourEnabled" className="ml-3 font-medium text-orange-900 cursor-pointer">
            Aktifkan Fitur Virtual Tour 360° untuk tipe ini
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`px-6 py-3 font-bold rounded-lg transition-colors shadow-sm text-white ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Tipe Rumah'}
          </button>
        </div>

      </form>
    </div>
  );
}