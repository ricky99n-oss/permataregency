'use client';

import React, { useState } from 'react';
import { Pannellum } from 'pannellum-react';

export default function VirtualTour360() {
  const tourData = {
    teras: {
      name: "Teras Depan",
      image: "https://pannellum.org/images/bma-0.jpg",
      hotspots: [
        { pitch: -5, yaw: 110, text: "Masuk ke Ruang Tamu →", target: "ruangTamu" },
        { pitch: 0, yaw: -160, text: "Lihat Halaman Belakang →", target: "halamanBelakang" }
      ]
    },
    ruangTamu: {
      name: "Ruang Tamu Minimalis",
      image: "https://pannellum.org/images/bma-1.jpg",
      hotspots: [
        { pitch: -10, yaw: 180, text: "← Kembali ke Teras Depan", target: "teras" },
        { pitch: 5, yaw: -30, text: "Buka Pintu Halaman Belakang →", target: "halamanBelakang" }
      ]
    },
    halamanBelakang: {
      name: "Halaman Belakang",
      image: "https://pannellum.org/images/jfk.jpg",
      hotspots: [
        { pitch: 0, yaw: 50, text: "← Masuk ke Ruang Tamu", target: "ruangTamu" },
        { pitch: 0, yaw: -130, text: "← Kembali ke Teras Depan", target: "teras" }
      ]
    }
  };

  const [activeScene, setActiveScene] = useState<keyof typeof tourData>('teras');
  const currentView = tourData[activeScene];

  const handleSceneChange = (sceneTarget: keyof typeof tourData) => {
    setActiveScene(sceneTarget);
  };

  // 🌟 FUNGSI BARU: Membuat UI Tombol Hotspot Kustom agar bisa di-klik
  const customHotspotTooltip = (hotSpotDiv: any, args: any) => {
    hotSpotDiv.classList.add('custom-hotspot-icon');
    
    // Mencegah teks digambar dobel oleh sistem
    if (hotSpotDiv.children.length === 0) {
      const span = document.createElement('span');
      span.innerHTML = args;
      span.className = 'custom-tooltip';
      hotSpotDiv.appendChild(span);
      
      // Animasi teks muncul saat di-hover mouse
      hotSpotDiv.onmouseover = () => { span.style.display = 'block'; };
      hotSpotDiv.onmouseout = () => { span.style.display = 'none'; };
    }
  };

  return (
    <div className="w-full h-[450px] md:h-[600px] rounded-b-2xl overflow-hidden bg-gray-900 relative">
      
      {/* 🌟 CSS BARU: Gaya untuk tombol Oranye kustom dan Teks Tooltip */}
      <style>{`
        .custom-hotspot-icon {
          width: 24px;
          height: 24px;
          background-color: #f97316; /* Warna Oranye Permata Regency */
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          position: relative;
          transition: transform 0.2s;
        }
        .custom-hotspot-icon:hover {
          transform: scale(1.2);
        }
        .custom-tooltip {
          display: none;
          position: absolute;
          bottom: 35px; /* Teks melayang di atas tombol */
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: bold;
          white-space: nowrap;
          pointer-events: none; /* PENTING: Agar teks tidak memblokir klik mouse */
        }
      `}</style>

      {/* Label Navigasi Aktif */}
      <div className="absolute top-4 left-4 z-20 bg-green-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase border border-white/20 shadow-lg">
        📍 {currentView.name}
      </div>

      <Pannellum
        key={activeScene} 
        width="100%"
        height="100%"
        image={currentView.image}
        pitch={0}
        yaw={0}
        hfov={110}
        autoLoad={true}
        showZoomCtrl={true}
      >
        {currentView.hotspots.map((hotspot, index) => (
          <Pannellum.Hotspot
            key={`${activeScene}-${index}`}
            type="custom" // 🌟 UBAH: Dari 'info' menjadi 'custom'
            pitch={hotspot.pitch}
            yaw={hotspot.yaw}
            tooltip={customHotspotTooltip} // Pasang UI kustom kita
            tooltipArg={hotspot.text}      // Masukkan teks ke UI kustom
            handleClick={(evt: any, arg: any) => handleSceneChange(arg as keyof typeof tourData)}
            handleClickArg={hotspot.target}
          />
        ))}
      </Pannellum>

      {/* Tombol Cadangan (Quick Nav) */}
      <div className="absolute bottom-4 left-4 z-20 flex gap-2">
        <p className="text-[10px] text-white/50 absolute -top-5 left-0">Quick Nav:</p>
        {Object.keys(tourData).map((sceneKey) => (
          <button
            key={sceneKey}
            onClick={() => handleSceneChange(sceneKey as keyof typeof tourData)}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all shadow-md ${
              activeScene === sceneKey 
              ? 'bg-orange-500 text-white' 
              : 'bg-black/50 text-gray-300 hover:bg-black/80'
            }`}
          >
            {tourData[sceneKey as keyof typeof tourData].name}
          </button>
        ))}
      </div>
    </div>
  );
}