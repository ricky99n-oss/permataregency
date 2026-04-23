'use client';

import React from 'react';
import { Pannellum } from 'pannellum-react';

// Komponen ini sekarang menerima 'imageUrl' agar gambarnya bisa ganti-ganti
export default function VirtualTour360({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="w-full h-[350px] md:h-[450px] rounded-xl overflow-hidden bg-gray-100">
      <Pannellum
        width="100%"
        height="100%"
        image={imageUrl}
        pitch={0}
        yaw={0}
        hfov={100}
        autoLoad={true}
        showZoomCtrl={false}
      />
    </div>
  );
}