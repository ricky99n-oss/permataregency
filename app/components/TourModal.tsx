'use client';

import VirtualTour360 from './VirtualTour360';

interface TourModalProps {
  tourUrl: string | null; // Pada kasus ini, ini adalah houseId yang dilempar dari HouseGallery
  onClose: () => void;
}

export default function TourModal({ tourUrl, onClose }: TourModalProps) {
  if (!tourUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-6xl h-[80vh] flex flex-col relative shadow-2xl">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 tracking-wide">VIRTUAL TOUR 360°</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 transition cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Area Pannellum 360 */}
        <div className="flex-1 bg-gray-900 relative">
          <VirtualTour360 houseId={tourUrl} />
        </div>

      </div>
    </div>
  );
}