'use client';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer id="kontak" className="bg-green-900 pt-20 pb-10 px-6 border-t-4 border-orange-500 text-white">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-16 text-sm">
        <div className="md:col-span-2">
          <span className="font-bold text-xl tracking-tight mb-4 block"><span className="text-orange-500">PERMATA</span><span className="text-white">REGENCY</span></span>
          <p className="text-green-100/80 leading-relaxed max-w-sm">Temukan pengalaman hidup terbaik di kawasan perumahan eksklusif dengan fasilitas memadai dan lingkungan yang tertata rapi.</p>
        </div>
        <div>
          <h4 className="font-bold text-white uppercase tracking-widest mb-6">Hubungi Kami</h4>
          <ul className="space-y-4 text-green-100/80">
            <li><a href="https://wa.me/6288293227900" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition">Devi: 0882-9322-7900</a></li>
            <li><a href="https://wa.me/6285746100710" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition">Lina: 0857-4610-0710</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white uppercase tracking-widest mb-6">Ikuti Kami</h4>
          <ul className="space-y-4 text-green-100/80">
            <li><a href="https://www.instagram.com/permata_regency" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition">Instagram</a></li>
            <li><a href="https://www.facebook.com/permataregencyofficial/" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition">Facebook</a></li>
            <li><a href="https://www.tiktok.com/@permataregency" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition">TikTok</a></li>
          </ul>
        </div>
      </motion.div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-green-800 flex flex-col md:flex-row justify-between items-center text-xs text-green-200/60">
        <p>© {new Date().getFullYear()} Permata Regency Malang. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Developed by Askara Indonesia</p>
      </div>
    </footer>
  );
}