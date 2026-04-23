'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const VirtualTour = dynamic(() => import('./VirtualTour360'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full flex items-center justify-center bg-gray-50 border border-gray-200">Memuat 360 Viewer...</div>
});

export default function TourModal({ tourUrl, onClose }: { tourUrl: string | null, onClose: () => void }) {
  if (!tourUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md" onClick={onClose}></div>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-gray-100 flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 tracking-wide uppercase">Virtual Tour 360°</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="bg-gray-100">
          <VirtualTour imageUrl={tourUrl} />
        </div>
      </motion.div>
    </div>
  );
}