'use client';

import { useEffect, useState } from 'react';
import { Pannellum } from 'pannellum-react';
import { supabase } from '@/lib/supabaseClient';

export default function VirtualTour360({ houseId }: { houseId: string }) {
  const [scenes, setScenes] = useState<any[]>([]);
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch360Images = async () => {
      try {
        const { data, error } = await supabase
          .from('house_images')
          .select('*')
          .eq('house_id', houseId)
          .eq('image_type', '360_PANORAMA')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setScenes(data || []);
      } catch (error) {
        console.error('Gagal memuat gambar 360:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (houseId) fetch360Images();
  }, [houseId]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p>Memuat Virtual Tour...</p>
        </div>
      </div>
    );
  }

  if (scenes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <p>Belum ada foto 360 untuk tipe rumah ini.</p>
      </div>
    );
  }

  const activeScene = scenes[currentScene];

  return (
    <div className="relative w-full h-full">
      {/* 
        Key ditambahkan agar saat pindah scene, Pannellum melakukan remount 
        dan mencegah glitch pergantian gambar 
      */}
      <Pannellum
        key={activeScene.id} 
        width="100%"
        height="100%"
        image={activeScene.image_url}
        pitch={10}
        yaw={180}
        hfov={110}
        autoLoad
        showZoomCtrl={true}
      >
      </Pannellum>

      {/* Quick Navigation Menu (Seperti di referensi gambarmu) */}
      <div className="absolute bottom-6 left-6 z-10">
        <p className="text-white text-xs mb-2 opacity-70">Quick Nav:</p>
        <div className="flex flex-wrap gap-2">
          {scenes.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => setCurrentScene(idx)}
              className={`px-4 py-2 text-xs font-bold rounded cursor-pointer transition-colors ${
                currentScene === idx 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-black/70 text-gray-300 hover:bg-black'
              }`}
            >
              {scene.scene_name || `Ruangan ${idx + 1}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}