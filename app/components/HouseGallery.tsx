'use client';

import { motion } from 'framer-motion';

const houseTypes = [
  { id: '21', title: 'Permata Type 21', lt: '60', lb: '21', bed: 1, bath: 1, floor: 1, imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', tourUrl: 'https://pannellum.org/images/alma.jpg' },
  { id: '25', title: 'Permata Type 25', lt: '60', lb: '25', bed: 2, bath: 1, floor: 1, imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', tourUrl: 'https://pannellum.org/images/jfk.jpg' },
  { id: '36', title: 'Permata Type 36', lt: '60', lb: '36', bed: 2, bath: 1, floor: 1, imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', tourUrl: 'https://pannellum.org/images/bma-1.jpg' },
  { id: '45', title: 'Permata Type 45', lt: '84', lb: '45', bed: 2, bath: 1, floor: 1, imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', tourUrl: 'https://pannellum.org/images/cerro-toco-0.jpg' }
];

export default function HouseGallery({ onOpenTour }: { onOpenTour: (url: string) => void }) {
  return (
    <section id="tipe" className="py-24 px-6 bg-[#F8F9FA]">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pilih Hunian Anda</h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {houseTypes.map((house, index) => (
            <motion.div key={house.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6, delay: index * 0.2 }} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden hover:-translate-y-2 flex flex-col transition-transform">
              <div className="h-72 overflow-hidden relative">
                <img src={house.imageUrl} alt={house.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold tracking-wider text-green-800">TERSEDIA</div>
              </div>
              {/* CLASS DIPERBARUI DI SINI: grow (sebelumnya flex-grow) */}
              <div className="p-8 grow flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{house.title}</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10">
                  <div className="flex items-center gap-3"><span className="text-sm font-semibold text-gray-700">LT : {house.lt} M²</span></div>
                  <div className="flex items-center gap-3"><span className="text-sm font-semibold text-gray-700">LB : {house.lb} M²</span></div>
                  <div className="flex items-center gap-3"><span className="text-sm font-semibold text-gray-700">{house.bed} K. Tidur</span></div>
                  <div className="flex items-center gap-3"><span className="text-sm font-semibold text-gray-700">{house.bath} K. Mandi</span></div>
                </div>
                <div className="mt-auto flex flex-col gap-3">
                  <button onClick={() => onOpenTour(house.tourUrl)} className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-bold text-sm tracking-wide hover:bg-orange-600 transition flex justify-center items-center gap-2">SURVEY 360° ONLINE</button>
                  <a href="https://wa.me/6288293227900" target="_blank" rel="noreferrer" className="w-full bg-white text-orange-500 border border-orange-500 py-3.5 rounded-lg font-bold text-sm tracking-wide hover:bg-orange-50 transition flex justify-center items-center gap-2">CONTACT MARKETING</a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}