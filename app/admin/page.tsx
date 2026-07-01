export default function AdminDashboard() {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Statistik Sederhana */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Tipe Rumah</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">4</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Gambar 360</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
          </div>
        </div>
      </div>
    );
  }