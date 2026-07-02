'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

export default function TestimonialImages() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setImages(data || []);
      } catch (error) {
        console.error('Gagal mengambil foto testimoni:', error);
      }
    };

    fetchImages();
  }, []);

  if (images.length === 0) return null; // Jika tidak ada foto, jangan tampilkan apa-apa

  return (
    <div className="mt-16 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900">Bukti Nyata Konsumen Kami</h3>
      </motion.div>
      
      {/* Grid foto yang bisa digeser (scroll) jika di layar HP */}
      <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
        {images.map((img, index) => (
          <motion.div 
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex-none w-64 md:w-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-md snap-center"
          >
            <img src={img.image_url} alt="Bukti Testimoni Konsumen" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}