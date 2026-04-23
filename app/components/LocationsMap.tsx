'use client';

import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Membuat Pin/Marker Kustom berwarna Oranye dengan Tailwind
const createCustomIcon = () => {
  return new L.DivIcon({
    className: 'bg-transparent',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="absolute w-full h-full bg-orange-500 rounded-full animate-ping opacity-40"></div>
        <div class="relative w-6 h-6 bg-orange-500 border-2 border-white rounded-full shadow-lg"></div>
        <div class="absolute bottom-[-6px] left-[10px] w-1 h-2 bg-orange-500"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Data lokasi dengan Koordinat "Dummy" di area Karangploso, Malang
const locations = [
  {
    id: 1,
    title: "Permata Regency 1",
    // Menggunakan gambar representatif (Proxy untuk gambar Google Maps)
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
    pos: [-7.8987794, 112.6061789] as [number, number], // Koordinat Malang
    link: "https://www.google.com/maps/place/Perumahan+Permata+Regency+1,+blok+24+no+7,+Ngijo,+Karangploso/data=!4m2!3m1!1s0x0:0x65ba7f5ef64e59e2?sa=X&ved=1t:2428&ictx=111"
  },
  {
    id: 2,
    title: "Permata Regency 2",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80",
    pos: [-7.8907547, 112.6054930] as [number, number],
    link: "https://www.google.com/maps/place/PERMATA+REGENCY+2/@-7.8945213,112.6013055,16z/data=!4m10!1m2!2m1!1sPermata+Regency+2!3m6!1s0x2e7881b23bbd03d5:0x1a8db007dd40cf5f!8m2!3d-7.8907547!4d112.605493!15sChFQZXJtYXRhIFJlZ2VuY3kgMpIBD2hvdXNpbmdfY29tcGxleOABAA!16s%2Fg%2F11h_1ksf6v?entry=ttu&g_ep=EgoyMDI2MDQyMC4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    id: 3,
    title: "Permata Regency 3",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
    pos: [-7.8958403, 112.6093962] as [number, number],
    link: "https://www.google.com/maps/place/Permata+Regency+3/@-7.8958403,112.6093962,17z/data=!3m1!4b1!4m6!3m5!1s0x2e78813b7ec49d0b:0x17e16b1ce295a35!8m2!3d-7.8958403!4d112.6093962!16s%2Fg%2F11khb6ddm9?entry=ttu&g_ep=EgoyMDI2MDQyMC4wIKXMDSoASAFQAw%3D%3D"
  }
];

export default function LocationsMap() {
  const customIcon = createCustomIcon();

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-200 relative z-0">
      {/* CSS Khusus untuk tooltip agar Card terlihat rapi */}
      <style>{`
        .leaflet-tooltip { background: transparent; border: none; box-shadow: none; padding: 0; }
        .leaflet-tooltip-bottom:before, .leaflet-tooltip-top:before { border: none !important; }
      `}</style>
      
      <MapContainer 
        // Pusat peta disesuaikan agar pas menengahi tiga lokasi (Malang)
        center={[-7.8951000, 112.6070000]} 
        zoom={15} 
        scrollWheelZoom={false} // Matikan zoom scroll agar halaman web tidak tersangkut
        className="w-full h-full z-0"
      >
        {/* Peta dasar Hitam Putih (Grayscale) dari CartoDB */}
        <TileLayer
          attribution='© <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {locations.map((loc) => (
          <Marker key={loc.id} position={loc.pos} icon={customIcon}>
            {/* Tooltip muncul saat marker di-hover (over mouse) */}
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              <div className="w-56 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
                <img src={loc.img} alt={loc.title} className="w-full h-32 object-cover" />
                <div className="p-3 text-center">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{loc.title}</h4>
                  <a href={loc.link} target="_blank" rel="noreferrer" className="text-[10px] text-orange-500 font-bold uppercase tracking-wider hover:underline">
                    Buka di Google Maps →
                  </a>
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}