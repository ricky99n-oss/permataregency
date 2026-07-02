'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ManageTestimonialsPage() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      alert('Gagal memuat testimoni: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      // Upload ke bucket 'testimonial-images'
      const { error: uploadError } = await supabase.storage
        .from('testimonial-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Ambil Public URL
      const { data: urlData } = supabase.storage
        .from('testimonial-images')
        .getPublicUrl(fileName);

      // Simpan URL ke database
      const { error: dbError } = await supabase
        .from('testimonials')
        .insert([{ image_url: urlData.publicUrl }]);

      if (dbError) throw dbError;

      alert('Foto testimoni berhasil diunggah!');
      fetchImages();
    } catch (error: any) {
      alert('Gagal mengunggah foto: ' + error.message);
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!window.confirm('Yakin ingin menghapus foto testimoni ini?')) return;
    
    try {
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Hapus dari Storage
      await supabase.storage.from('testimonial-images').remove([fileName]);
      
      // Hapus dari Database
      await supabase.from('testimonials').delete().eq('id', id);

      alert('Foto dihapus!');
      fetchImages();
    } catch (error: any) {
      alert('Gagal menghapus: ' + error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Foto Testimoni</h2>
          <p className="text-gray-500 text-sm mt-1">Upload bukti percakapan WA atau foto penyerahan kunci.</p>
        </div>
        <label className={`px-4 py-2 text-sm font-bold text-white rounded-lg cursor-pointer transition-colors shadow-sm ${isUploading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}>
          {isUploading ? 'Mengunggah...' : '+ Upload Foto'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
        </label>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {isLoading ? (
          <p className="text-center text-gray-500">Memuat foto...</p>
        ) : images.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Belum ada foto testimoni. Silakan upload.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {images.map(img => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-[3/4]">
                <img src={img.image_url} alt="Testimoni" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDelete(img.id, img.image_url)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transform hover:scale-105 transition-transform"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}