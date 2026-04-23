'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Impor komponen modular baru
import Navbar from './components/Navbar';
import HouseGallery from './components/HouseGallery';
import TourModal from './components/TourModal';
import Footer from './components/Footer';

// Peta Lokasi di-load dinamis agar tidak error di server
const LocationsMap = dynamic(() => import('./components/LocationsMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">Memuat Peta Lokasi...</div>
});

export default function Home() {
  const [activeTour, setActiveTour] = useState<string | null>(null);

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-gray-800 font-sans selection:bg-orange-200 selection:text-orange-900 overflow-hidden">
      
      <Navbar />

      {/* HERO SECTION */}
      <section id="beranda" className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}>
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-16">
          <p className="text-orange-400 font-medium tracking-[0.3em] uppercase mb-4 text-sm md:text-base">Hunian Eksklusif di Malang</p>
          <h1 className="text-4xl md:text-7xl font-light text-white mb-8 leading-tight">Harmoni Kehidupan <br/> <span className="font-bold">Modern & Asri</span></h1>
          <button onClick={() => scrollToSection('tipe')} className="px-10 py-4 bg-orange-500 text-white text-sm md:text-base rounded-full font-bold hover:bg-orange-600 transition duration-300 tracking-wide">EKSPLORASI HUNIAN</button>
        </motion.div>
      </section>

      {/* TENTANG KAMI */}
      <section id="tentang" className="py-32 px-6 bg-white overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8">Sebuah <span className="font-bold text-green-800">Standar Baru</span> Kenyamanan</h2>
          <p className="text-lg text-gray-500 leading-relaxed font-light">Permata Regency menghadirkan konsep hunian yang memadukan estetika desain minimalis modern dengan hijaunya alam Kota Malang. Dibangun dengan material premium dan tata ruang yang dioptimalkan untuk sirkulasi cahaya serta udara, menjadikannya investasi sempurna untuk keluarga Anda.</p>
        </motion.div>
      </section>

      {/* Galeri Tipe Rumah Modular */}
      <HouseGallery onOpenTour={setActiveTour} />

      {/* KATA MEREKA / TESTIMONI */}
      <section id="testimoni" className="py-24 px-6 bg-white border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kata Mereka</h2>
            <div className="w-16 h-1 bg-green-700 mx-auto"></div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { nama: "Keluarga Bpk. Andi", tipe: "Pemilik Tipe 36", teks: "Lingkungannya sangat asri dan udaranya sejuk. Anak-anak betah bermain di taman. Desain rumah minimalisnya sangat sesuai dengan selera kami." },
              { nama: "Ibu Sarah", tipe: "Pemilik Tipe 25", teks: "Fitur survey 360 derajat sangat membantu saya yang berada di luar kota. Saya bisa melihat detail rumah tanpa harus datang langsung ke Malang." },
              { nama: "Bpk. Budi Santoso", tipe: "Pemilik Tipe 45", teks: "Proses KPR dibantu sampai tuntas oleh tim marketing. Kualitas bangunan rapi dan pencahayaan alami di dalam rumah sangat bagus." }
            ].map((testi, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: index * 0.2 }} className="p-8 border border-gray-100 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition duration-300">
                <p className="text-gray-600 font-light leading-relaxed mb-6">"{testi.teks}"</p>
                <h4 className="font-bold text-gray-900 text-sm tracking-wide uppercase">{testi.nama}</h4>
                <p className="text-xs text-gray-400 mt-1">{testi.tipe}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MAPS LOKASI PROYEK (BARU) */}
      <section id="lokasi" className="py-24 px-6 bg-[#F8F9FA] border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lokasi Proyek Kami</h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
              Jelajahi lokasi strategis Permata Regency di Malang. Arahkan kursor (hover) ke pin oranye untuk melihat detail.
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <LocationsMap />
          </motion.div>
        </div>
      </section>

      {/* Komponen Footer dan Modal Modular */}
      <Footer />
      <TourModal tourUrl={activeTour} onClose={() => setActiveTour(null)} />

    </main>
  );
}