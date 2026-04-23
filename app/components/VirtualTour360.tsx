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

  const handleSceneChange = (scene: keyof typeof tourData) => {
    console.log("Pindah ke scene:", scene); // Debugging: cek di console browser
    setActiveScene(scene);
  };

  return (
    <div className="w-full h-[450px] md:h-[600px] rounded-b-2xl overflow-hidden bg-gray-900 relative">
      {/* Label Navigasi Aktif */}
      <div className="absolute top-4 left-4 z-20 bg-green-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase border border-white/20">
        📍 {currentView.name}
      </div>

      <Pannellum
        key={activeScene} // PENTING: Memastikan scene lama dibuang dan yang baru dimuat bersih
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
            type="info"
            pitch={hotspot.pitch}
            yaw={hotspot.yaw}
            text={hotspot.text}
            handleClick={() => handleSceneChange(hotspot.target as keyof typeof tourData)}
          />
        ))}
      </Pannellum>

      {/* Tombol Cadangan jika Hotspot di gambar sulit diklik */}
      <div className="absolute bottom-4 left-4 z-20 flex gap-2">
        <p className="text-[10px] text-white/50 absolute -top-5 left-0">Quick Nav:</p>
        {Object.keys(tourData).map((sceneKey) => (
          <button
            key={sceneKey}
            onClick={() => handleSceneChange(sceneKey as keyof typeof tourData)}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
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