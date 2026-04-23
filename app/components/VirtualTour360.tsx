'use client';

import React, { useState } from 'react';
import { Pannellum } from 'pannellum-react';

// Menghapus prop imageUrl untuk bukti konsep tur sampel ini
export default function VirtualTour360() {
  // 1. DATA MASTER TUR (SCENES DAN HOTSPOTS)
  // Data ini menampung adegan ( scenes ) dan hotspot ( titik interaktif ).
  // Di masa depan, kamu bisa memindahkan objek data ini ke file data terpisah.
  const tourData = {
    teras: {
      name: "Teras Depan",
      // Menggunakan gambar teras asli dari sampel Pannellum
      image: "https://pannellum.org/images/bma-0.jpg",
      hotspots: [
        // Hotspot menuju Ruang Tamu
        { pitch: -5, yaw: 110, text: "Masuk ke Ruang Tamu Minimalis →", target: "ruangTamu" },
        // Hotspot menuju Halaman Belakang (Jauh di luar)
        { pitch: 0, yaw: -160, text: "Lihat Halaman Belakang →", target: "halamanBelakang" }
      ]
    },
    ruangTamu: {
      name: "Ruang Tamu Minimalis",
      // Menggunakan gambar ruang tamu asli dari sampel Pannellum
      image: "https://pannellum.org/images/bma-1.jpg",
      hotspots: [
        // Hotspot menuju Teras (Kembali ke luar)
        { pitch: -10, yaw: 180, text: "← Kembali ke Teras Depan", target: "teras" },
        // Hotspot menuju Halaman Belakang
        { pitch: 5, yaw: -30, text: "Buka Pintu Halaman Belakang →", target: "halamanBelakang" }
      ]
    },
    halamanBelakang: {
      name: "Halaman Belakang",
      // Menggunakan gambar halaman belakang asli dari sampel Pannellum
      image: "https://pannellum.org/images/jfk.jpg",
      hotspots: [
        // Hotspot menuju Ruang Tamu (Kembali ke dalam)
        { pitch: 0, yaw: 50, text: "← Masuk ke Ruang Tamu Minimalis", target: "ruangTamu" },
        // Hotspot menuju Teras (Kembali ke depan)
        { pitch: 0, yaw: -130, text: "← Kembali ke Teras Depan", target: "teras" }
      ]
    }
  };

  // 2. STATE UNTUK MELACAK RUANGAN AKTIF
  // Secara default, tur dimulai dari 'teras'.
  const [activeScene, setActiveScene] = useState<keyof typeof tourData>('teras');
  const currentView = tourData[activeScene];

  return (
    <div className="w-full h-[400px] md:h-[550px] rounded-b-2xl overflow-hidden bg-gray-900 relative">
      
      {/* LABEL INDIKATOR RUANGAN (Dinamis) */}
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase border border-white/20 shadow-lg">
        📍 {currentView.name}
      </div>

      <Pannellum
        // KUNCI: Gunakan state activeScene sebagai atribut key.
        // Ini memaksa penampil merender ulang sepenuhnya saat adegan berubah.
        key={activeScene}
        width="100%"
        height="100%"
        image={currentView.image}
        pitch={0} // Titik vertikal awal
        yaw={0}   // Titik horizontal awal
        hfov={100} // Horizontal Field of View awal
        autoLoad={true}
        showZoomCtrl={true}
      >
        {/* 3. MAPPING HOTSPOTS UNTUK RUANGAN YANG SEDANG AKTIF */}
        {currentView.hotspots.map((hotspot, index) => (
          <Pannellum.Hotspot
            key={index}
            type="info" // Tipe 'info' menampilkan icon informasi "i" bawaan
            pitch={hotspot.pitch}
            yaw={hotspot.yaw}
            text={hotspot.text} // Teks yang muncul saat kursor diarahkan ke icon
            // Logic perpindahan ruangan
            handleClick={() => setActiveScene(hotspot.target as keyof typeof tourData)}
          />
        ))}
      </Pannellum>
    </div>
  );
}