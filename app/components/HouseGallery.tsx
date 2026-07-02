'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface House {
  id: string;
  type_name: any;
  price: any;
  description: any;
  virtual_tour_enabled: boolean;
  house_images?: { id: string, image_url: string, image_type: string }[];
}

export default function HouseGallery({ onOpenTour }: { onOpenTour: (houseId: string) => void }) {
  const [houses, setHouses] = useState<House[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        // Tarik data rumah SEKALIGUS dengan gambar-gambarnya
        const { data, error } = await supabase
          .from('houses')
          .select('*, house_images(id, image_url, image_type)')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setHouses(data || []);
      } catch (error) {
        console.error('Gagal mengambil data rumah:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHouses();
  }, []);

  const formatRupiah = (price: any) => {
    const validPrice = Number(price) || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(validPrice);
  };

  const safeString = (value: any, fallback: string = '') => {
    if (typeof value === 'string' || typeof value === 'number') return value;
    return fallback;
  };

  return (
    <section id="tipe" className="py-24 px-6 bg-[#F8F9FA]">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pilih Hunian Anda</h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p>Memuat daftar hunian...</p>
            </div>
          </div>
        ) : houses.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Belum ada data tipe hunian.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {houses.map((house, index) => {
              const safeTypeName = safeString(house.type_name, 'Tipe Rumah');
              const safePrice = Number(house.price) || 0;
              const safeDescription = safeString(house.description, 'Deskripsi belum tersedia.');
              
              // Cari foto galeri pertama untuk dijadikan sampul, jika tidak ada pakai placeholder
              const coverImage = house.house_images?.find(img => img.image_type === 'GALLERY')?.image_url 
                || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
              
              return (
                <motion.div 
                  key={house.id || index} 
                  initial={{ opacity: 0, y: 50 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, amount: 0.1 }} 
                  transition={{ duration: 0.6, delay: index * 0.1 }} 
                  className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden hover:-translate-y-2 flex flex-col transition-transform"
                >
                  <div className="h-72 overflow-hidden relative bg-gray-200">
                    <img src={coverImage} alt={String(safeTypeName)} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold tracking-wider text-green-800">
                      TERSEDIA
                    </div>
                  </div>
                  
                  <div className="p-8 grow flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{safeTypeName}</h3>
                    
                    <p className="text-xl font-bold text-orange-600 mb-4">
                      {safePrice === 0 ? 'Hubungi Marketing' : formatRupiah(safePrice)}
                    </p>
                    
                    <div className="mb-8">
                      <p className="text-sm text-gray-500 line-clamp-3">{safeDescription}</p>
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                      {house.virtual_tour_enabled && (
                        <button 
                          onClick={() => onOpenTour(house.id)} 
                          className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-bold text-sm tracking-wide hover:bg-orange-600 transition flex justify-center items-center gap-2"
                        >
                          SURVEY 360° ONLINE
                        </button>
                      )}
                      
                      <a 
                        href={`https://wa.me/6288293227900?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(String(safeTypeName))}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="w-full bg-white text-orange-500 border border-orange-500 py-3.5 rounded-lg font-bold text-sm tracking-wide hover:bg-orange-50 transition flex justify-center items-center gap-2"
                      >
                        CONTACT MARKETING
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}