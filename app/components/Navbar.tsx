'use client';

import { motion } from 'framer-motion';

export default function Navbar() {
  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-0 right-0 w-full z-50 flex justify-center px-4"
    >
      <div className="bg-green-950/95 backdrop-blur-md border border-green-800/50 rounded-full px-3 py-2.5 flex justify-between items-center w-full max-w-5xl shadow-2xl">
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2 pl-2 w-1/3 justify-end pr-4">
          <button onClick={() => scrollToSection('beranda')} className="px-5 py-2.5 bg-orange-500 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:bg-orange-600">Beranda</button>
          <button onClick={() => scrollToSection('tentang')} className="px-5 py-2.5 text-green-50 hover:text-white hover:bg-green-800/60 rounded-full text-xs font-semibold uppercase tracking-widest transition-all">Tentang</button>
          <button onClick={() => scrollToSection('tipe')} className="px-5 py-2.5 text-green-50 hover:text-white hover:bg-green-800/60 rounded-full text-xs font-semibold uppercase tracking-widest transition-all">Tipe</button>
        </div>

        {/* CLASS DIPERBARUI DI SINI: shrink-0 (sebelumnya flex-shrink-0) */}
        <div className="shrink-0 cursor-pointer flex justify-center w-auto md:w-1/3" onClick={() => scrollToSection('beranda')}>
          <div className="bg-white px-5 py-2 rounded-full shadow-inner flex items-center justify-center border border-gray-100">
            <img src="/logo permata new.png" alt="Logo Permata Regency" className="h-8 w-auto object-contain" />
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-1 lg:space-x-2 pr-2 w-1/3 justify-start pl-4">
          <button onClick={() => scrollToSection('lokasi')} className="px-5 py-2.5 text-green-50 hover:text-white hover:bg-green-800/60 rounded-full text-xs font-semibold uppercase tracking-widest transition-all">Lokasi</button>
          <button onClick={() => scrollToSection('testimoni')} className="px-5 py-2.5 text-green-50 hover:text-white hover:bg-green-800/60 rounded-full text-xs font-semibold uppercase tracking-widest transition-all">Testimoni</button>
          <button onClick={() => scrollToSection('kontak')} className="px-5 py-2.5 text-green-50 hover:text-white hover:bg-green-800/60 rounded-full text-xs font-semibold uppercase tracking-widest transition-all">Kontak</button>
        </div>

        <div className="md:hidden pr-4">
           <button className="text-white p-2 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
           </button>
        </div>
      </div>
    </motion.nav>
  );
}