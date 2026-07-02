'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const houseId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sceneName, setSceneName] = useState(''); // Untuk nama ruangan foto 360

  const [formData, setFormData] = useState({
    typeName: '',
    price: '',
    description: '',
    virtualTourEnabled: false,
  });

  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [panoramaImages, setPanoramaImages] = useState<any[]>([]);

  // 1. Mengambil data rumah dan gambar-gambarnya
  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        // Ambil data rumah
        const { data: house, error: houseError } = await supabase
          .from('houses')
          .select('*')
          .eq('id', houseId)
          .single();

        if (houseError) throw houseError;

        setFormData({
          typeName: house.type_name,
          price: house.price.toString(),
          description: house.description || '',
          virtualTourEnabled: house.virtual_tour_enabled,
        });

        // Ambil data gambar
        const { data: images, error: imagesError } = await supabase
          .from('house_images')
          .select('*')
          .eq('house_id', houseId);

        if (imagesError) throw imagesError;

        if (images) {
          setGalleryImages(images.filter(img => img.image_type === 'GALLERY'));
          setPanoramaImages(images.filter(img => img.image_type === '360_PANORAMA'));
        }
      } catch (error: any) {
        alert('Gagal memuat detail rumah: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (houseId) fetchHouseDetails();
  }, [houseId]);

  // 2. Fungsi untuk menyimpan perubahan data teks
  const handleSaveText = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('houses')
        .update({
          type_name: formData.typeName,
          price: Number(formData.price),
          description: formData.description,
          virtual_tour_enabled: formData.virtualTourEnabled,
        })
        .eq('id', houseId);

      if (error) throw error;
      alert('Perubahan detail rumah berhasil disimpan!');
    } catch (error: any) {
      alert('Gagal menyimpan: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Fungsi inti untuk UPLOAD Gambar
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageType: 'GALLERY' | '360_PANORAMA') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imageType === '360_PANORAMA' && !sceneName) {
      alert('Tulis nama ruangan dulu (Misal: Ruang Tamu) sebelum upload foto 360!');
      return;
    }

    setIsUploading(true);
    try {
      // Bikin nama file unik supaya tidak bentrok
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${houseId}/${fileName}`; // Disusun dalam folder berdasarkan ID rumah

      // Upload ke Storage Bucket "house-images"
      const { error: uploadError } = await supabase.storage
        .from('house-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Ambil URL Publiknya
      const { data: publicUrlData } = supabase.storage
        .from('house-images')
        .getPublicUrl(filePath);

      // Simpan URL tersebut ke tabel house_images
      const { data: newImage, error: dbError } = await supabase
        .from('house_images')
        .insert([{
          house_id: houseId,
          image_url: publicUrlData.publicUrl,
          image_type: imageType,
          scene_name: imageType === '360_PANORAMA' ? sceneName : null
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      // Update UI langsung
      if (imageType === 'GALLERY') {
        setGalleryImages(prev => [...prev, newImage]);
      } else {
        setPanoramaImages(prev => [...prev, newImage]);
        setSceneName(''); // Reset input nama ruangan
      }
      
      alert('Gambar berhasil diupload!');
    } catch (error: any) {
      alert('Gagal upload gambar: ' + error.message);
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input file
    }
  };

  // 4. Fungsi untuk menghapus gambar
  const handleDeleteImage = async (imageId: string, imageUrl: string, imageType: string) => {
    if (!window.confirm('Hapus gambar ini?')) return;
    
    try {
      // Ekstrak nama file/path dari URL untuk dihapus dari Storage
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${houseId}/${fileName}`;

      await supabase.storage.from('house-images').remove([filePath]);
      await supabase.from('house_images').delete().eq('id', imageId);

      if (imageType === 'GALLERY') {
        setGalleryImages(prev => prev.filter(img => img.id !== imageId));
      } else {
        setPanoramaImages(prev => prev.filter(img => img.id !== imageId));
      }
    } catch (error: any) {
      alert('Gagal menghapus gambar: ' + error.message);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Memuat data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Tipe Rumah</h2>
          <p className="text-gray-500 text-sm mt-1">Ubah detail dan kelola foto untuk tipe ini.</p>
        </div>
        <Link href="/admin/products" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          Kembali ke Daftar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: FORM DETAIL TEKS */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h3 className="font-bold text-lg mb-4 border-b pb-2">Detail Informasi</h3>
          <form onSubmit={handleSaveText} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Tipe</label>
              <input type="text" value={formData.typeName} onChange={e => setFormData({...formData, typeName: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Harga (Angka 0 = Hub. Marketing)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"></textarea>
            </div>
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <input type="checkbox" checked={formData.virtualTourEnabled} onChange={e => setFormData({...formData, virtualTourEnabled: e.target.checked})} className="w-4 h-4 text-orange-500 border-gray-300 rounded" />
              <label className="text-xs font-medium text-orange-900 cursor-pointer">Aktifkan Tombol 360</label>
            </div>
            <button type="submit" disabled={isSaving} className="w-full py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors">
              {isSaving ? 'Menyimpan...' : 'Simpan Detail'}
            </button>
          </form>
        </div>

        {/* KOLOM KANAN: UPLOAD GAMBAR */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION: FOTO GALERI */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Foto Galeri Biasa</h3>
            
            <div className="mb-4">
              <label className="block px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 text-center rounded-lg font-medium cursor-pointer hover:bg-blue-100 transition">
                {isUploading ? 'Mengunggah...' : '+ Pilih & Upload Foto Galeri'}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'GALLERY')} className="hidden" disabled={isUploading} />
              </label>
            </div>

            {/* Grid Gambar Galeri */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map(img => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200 h-32">
                  <img src={img.image_url} alt="Galeri" className="w-full h-full object-cover" />
                  <button onClick={() => handleDeleteImage(img.id, img.image_url, 'GALLERY')} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
                    Hapus
                  </button>
                </div>
              ))}
              {galleryImages.length === 0 && <p className="text-sm text-gray-400 col-span-3">Belum ada foto galeri.</p>}
            </div>
          </div>

          {/* SECTION: FOTO 360 PANORAMA */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Foto 360 Panorama</h3>
            
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Nama Ruangan (Misal: Teras)" 
                value={sceneName}
                onChange={(e) => setSceneName(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-orange-500"
              />
              <label className="px-4 py-2 bg-orange-500 text-white text-center rounded-lg font-medium cursor-pointer hover:bg-orange-600 transition whitespace-nowrap">
                {isUploading ? '...' : 'Upload 360'}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, '360_PANORAMA')} className="hidden" disabled={isUploading || !sceneName} />
              </label>
            </div>

            {/* List Gambar 360 */}
            <div className="space-y-3">
              {panoramaImages.map(img => (
                <div key={img.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <img src={img.image_url} alt="360" className="w-16 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-800">{img.scene_name || 'Tanpa Nama'}</p>
                    <p className="text-xs text-gray-500 truncate w-48">Gambar 360°</p>
                  </div>
                  <button onClick={() => handleDeleteImage(img.id, img.image_url, '360_PANORAMA')} className="text-xs font-bold text-red-600 hover:text-red-800 px-3">
                    Hapus
                  </button>
                </div>
              ))}
              {panoramaImages.length === 0 && <p className="text-sm text-gray-400">Belum ada foto 360.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}