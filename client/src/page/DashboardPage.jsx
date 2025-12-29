// import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaHome, FaBook, FaCalculator, FaSignOutAlt, FaChartBar, FaBars, 
    FaFileAlt, FaUsers, FaUserCircle, FaCamera, FaSave, FaTrash, FaEdit, FaPlus
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api';
import { useState, useEffect } from 'react';
// ... import lama (react, framer-motion, icons, dll) ...

// --- TAMBAHAN IMPORT BARU ---
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Registrasi Komponen Chart.js (Wajib biar gak error)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard'); // State untuk pindah menu
    const [user, setUser] = useState({ nama: 'Admin', role: 'Administrator', avatar: null });

    // Cek Login saat halaman dimuat
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/');
        const savedUser = localStorage.getItem('user_name');
        if (savedUser) setUser(prev => ({ ...prev, nama: savedUser }));
    }, [navigate]);

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout?', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya'
        }).then((res) => {
            if (res.isConfirmed) {
                localStorage.clear();
                navigate('/');
            }
        });
    };

    // --- LOGIC RENDER KONTEN (SWITCH CASE) ---
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <ViewDashboard />;
            case 'buku': return <ViewBuku />;
            case 'kriteria': return <ViewKriteria />;
            case 'saw': return <ViewHitungSAW />;
            case 'laporan': return <ViewLaporan />;
            case 'users': return <ViewUsers />;
            case 'profile': return <ViewProfile user={user} setUser={setUser} />;
            default: return <ViewDashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
            
            {/* SIDEBAR */}
            <motion.aside 
                animate={{ width: sidebarOpen ? "260px" : "80px" }}
                className="bg-slate-900 text-white flex flex-col shadow-xl z-20 relative transition-all duration-300"
            >
                <div className="p-4 flex items-center justify-center border-b border-gray-700 h-16">
                    {sidebarOpen ? (
    <div className="text-center">
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            SPK Aliyah Agency Book
        </h1>
        <p className="text-[10px] text-gray-400 tracking-widest">METODE SAW</p>
    </div>
) : (
    <h1 className="font-bold text-blue-500">SAW</h1>
)}
                </div>

                <nav className="flex-1 mt-4 px-2 space-y-1 overflow-y-auto custom-scrollbar">
                    {/* Menu Items dengan OnClick handler */}
                    <MenuItem icon={<FaHome />} label="Dashboard" isOpen={sidebarOpen} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    
                    <div className="pt-4 pb-1 pl-3 text-xs text-gray-500 font-bold uppercase">{sidebarOpen && "Master Data"}</div>
                    <MenuItem icon={<FaBook />} label="Data Buku" isOpen={sidebarOpen} active={activeTab === 'buku'} onClick={() => setActiveTab('buku')} />
                    <MenuItem icon={<FaChartBar />} label="Kriteria" isOpen={sidebarOpen} active={activeTab === 'kriteria'} onClick={() => setActiveTab('kriteria')} />
                    
                    <div className="pt-4 pb-1 pl-3 text-xs text-gray-500 font-bold uppercase">{sidebarOpen && "SPK System"}</div>
                    <MenuItem icon={<FaCalculator />} label="Hitung SAW" isOpen={sidebarOpen} active={activeTab === 'saw'} onClick={() => setActiveTab('saw')} />
                    <MenuItem icon={<FaFileAlt />} label="Laporan" isOpen={sidebarOpen} active={activeTab === 'laporan'} onClick={() => setActiveTab('laporan')} />

                    <div className="pt-4 pb-1 pl-3 text-xs text-gray-500 font-bold uppercase">{sidebarOpen && "Pengaturan"}</div>
                    <MenuItem icon={<FaUsers />} label="Kelola Pengguna" isOpen={sidebarOpen} active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <MenuItem icon={<FaUserCircle />} label="Profil Saya" isOpen={sidebarOpen} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                </nav>

                <div className="p-2 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition">
                        <FaSignOutAlt className="text-xl" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col bg-gray-50 h-full overflow-y-auto">
                {/* Header */}
                <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <FaBars size={20} />
                    </button>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('profile')}>
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-500">Halo,</p>
                            <p className="font-bold text-gray-700">{user.nama}</p>
                        </div>
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-blue-500">
                            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <FaUserCircle className="w-full h-full text-gray-400" />}
                        </div>
                    </div>
                </header>

                {/* Content Area (Berubah Sesuai Menu) */}
                <div className="p-6">
                    <motion.div 
                        key={activeTab} // Kunci animasi saat tab berubah
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent()}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

// ==========================================
// SUB-KOMPONEN (TAMPILAN PER MENU)
// ==========================================

// 1. DASHBOARD VIEW
const ViewDashboard = () => {
    const [stats, setStats] = useState({ buku: 0, kriteria: 0, laporan: 0 });
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Ambil Data Statistik Dasar
                const resBuku = await api.get('/buku');
                const resLaporan = await api.get('/laporan');
                const resKriteria = await api.get('/hitung-saw'); // Kita intip jumlah kriteria dari sini juga bisa/manual

                // 2. Ambil Data Hasil Perhitungan SAW (Untuk Grafik)
                // Backend otomatis menghitung ulang saat endpoint ini dipanggil
                const dataRanking = resKriteria.data.data; // Array hasil ranking

                // Ambil 5 Buku dengan Skor Tertinggi (Top 5 Best Seller)
                const top5 = dataRanking.slice(0, 5);

                setStats({
                    buku: resBuku.data.length, 
                    kriteria: 5, 
                    laporan: resLaporan.data.length
                });

                // 3. Masukkan ke Chart.js
                setChartData({
                    labels: top5.map(item => `Rank #${item.rank} - ${item.judul_buku.substring(0, 15)}...`),
                    datasets: [
                        {
                            label: 'Skor Kelarisan (Nilai V)',
                            data: top5.map(item => item.total_nilai),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',  // Merah (Rank 1)
                                'rgba(54, 162, 235, 0.7)',  // Biru
                                'rgba(255, 206, 86, 0.7)',  // Kuning
                                'rgba(75, 192, 192, 0.7)',  // Hijau
                                'rgba(153, 102, 255, 0.7)', // Ungu
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                });

            } catch (err) {
                console.error("Gagal ambil data dashboard", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            
            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Buku" value={stats.buku} color="blue" icon={<FaBook />} />
                <StatCard title="Kriteria Penilaian" value={stats.kriteria} color="purple" icon={<FaChartBar />} />
                <StatCard title="Laporan Tersimpan" value={stats.laporan} color="orange" icon={<FaFileAlt />} />
            </div>
            
            {/* Area Grafik */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-700">Top 5 Buku Terlaris (Analisa SAW)</h3>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Realtime Analysis</span>
                </div>
                
                <div className="h-72 w-full flex justify-center items-center">
                    {chartData ? (
                        <Bar 
                            data={chartData} 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false }, // Sembunyikan legend biar bersih
                                    title: { 
                                        display: true, 
                                        text: 'Perbandingan Skor Preferensi (Nilai V)' 
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 1 // Karena nilai SAW max 1
                                    }
                                }
                            }} 
                        />
                    ) : (
                        <div className="text-center text-gray-400 animate-pulse">
                            <p>Sedang Menganalisis Data...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 2. DATA BUKU VIEW

// 2. DATA BUKU VIEW (DENGAN FITUR INPUT NILAI MANUAL)
const ViewBuku = () => {
    const [listBuku, setListBuku] = useState([]);
    
    // --- STATE BARU: UNTUK MODAL PENILAIAN ---
    const [showModalNilai, setShowModalNilai] = useState(false);
    const [selectedBuku, setSelectedBuku] = useState(null);
    const [formNilai, setFormNilai] = useState([]); // Nyimpen data nilai sementara

    const fetchBuku = async () => {
        try { const res = await api.get('/buku'); setListBuku(res.data); } 
        catch (error) { console.error(error); }
    };

    useEffect(() => { fetchBuku(); }, []);

    // --- 1. LOGIC INPUT NILAI (FITUR BARU) ---
    const handleOpenNilai = async (buku) => {
        setSelectedBuku(buku);
        try {
            // Ambil data nilai yang sudah ada dari backend
            const res = await api.get(`/nilai/${buku.id_buku}`);
            setFormNilai(res.data); 
            setShowModalNilai(true);
        } catch (err) {
            Swal.fire('Error', 'Gagal memuat form penilaian. Pastikan Data Kriteria tidak kosong.', 'error');
        }
    };

    const handleSaveNilai = async () => {
        try {
            await api.post(`/nilai/${selectedBuku.id_buku}`, { nilai_data: formNilai });
            Swal.fire('Sukses', 'Penilaian berhasil disimpan!', 'success');
            setShowModalNilai(false);
        } catch (err) {
            Swal.fire('Gagal', 'Gagal menyimpan nilai', 'error');
        }
    };

    const handleInputChange = (index, value) => {
        const newForm = [...formNilai];
        newForm[index].nilai = value;
        setFormNilai(newForm);
    };

    // --- 2. LOGIC CRUD BUKU BIASA (DARI KODE KAMU) ---
    const showForm = async (buku = null) => {
        const isEdit = !!buku;
        const { value: formValues } = await Swal.fire({
            title: isEdit ? 'Edit Buku' : 'Tambah Buku Baru',
            html:
                `<input id="swal-judul" class="swal2-input" placeholder="Judul Buku" value="${buku?.judul_buku || ''}">` +
                `<input id="swal-penulis" class="swal2-input" placeholder="Penulis" value="${buku?.penulis || ''}">` +
                `<input id="swal-penerbit" class="swal2-input" placeholder="Penerbit" value="${buku?.penerbit || ''}">` +
                `<input id="swal-tahun" type="number" class="swal2-input" placeholder="Tahun Terbit" value="${buku?.tahun_terbit || ''}">` +
                `<input id="swal-stok" type="number" class="swal2-input" placeholder="Stok" value="${buku?.stok || ''}">`,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return {
                    judul_buku: document.getElementById('swal-judul').value,
                    penulis: document.getElementById('swal-penulis').value,
                    penerbit: document.getElementById('swal-penerbit').value,
                    tahun_terbit: document.getElementById('swal-tahun').value,
                    stok: document.getElementById('swal-stok').value
                }
            }
        });

        if (formValues) {
            try {
                if (isEdit) {
                    await api.patch(`/buku/${buku.id_buku}`, formValues); // Sudah pakai PATCH sesuai server.js
                    Swal.fire('Update Sukses', '', 'success');
                } else {
                    await api.post('/buku', formValues);
                    Swal.fire('Tambah Sukses', '', 'success');
                }
                fetchBuku(); 
            } catch (error) {
                Swal.fire('Error', 'Gagal menyimpan data', 'error');
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({ title: 'Hapus?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
        if (result.isConfirmed) {
            await api.delete(`/buku/${id}`);
            fetchBuku();
            Swal.fire('Terhapus!', '', 'success');
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm relative">
            {/* Header Tabel */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Data Buku & Penilaian</h2>
                <button onClick={() => showForm(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <FaPlus /> Tambah Buku
                </button>
            </div>

            {/* Tabel Data */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
                            <th className="p-3">Judul</th>
                            <th className="p-3">Penulis</th>
                            <th className="p-3 text-center w-32">Aksi Dasar</th>
                            <th className="p-3 text-center w-40">Penilaian (SPK)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {listBuku.map((buku) => (
                            <tr key={buku.id_buku} className="hover:bg-gray-50">
                                <td className="p-3 font-medium">{buku.judul_buku}</td>
                                <td className="p-3 text-gray-600">{buku.penulis}</td>
                                
                                {/* Tombol Edit & Hapus */}
                                <td className="p-3 text-center flex justify-center gap-2">
                                    <button onClick={() => showForm(buku)} className="text-blue-500 hover:bg-blue-50 p-2 rounded" title="Edit Buku"><FaEdit /></button>
                                    <button onClick={() => handleDelete(buku.id_buku)} className="text-red-500 hover:bg-red-50 p-2 rounded" title="Hapus Buku"><FaTrash /></button>
                                </td>

                                {/* Tombol Input Nilai (KUNING) */}
                                <td className="p-3 text-center">
                                    <button 
                                        onClick={() => handleOpenNilai(buku)}
                                        className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-yellow-200 flex items-center gap-2 mx-auto transition"
                                    >
                                        <FaCalculator /> Input Nilai
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL POPUP (Overlay) --- */}
            {showModalNilai && selectedBuku && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        {/* Header Modal */}
                        <div className="bg-yellow-500 p-4 text-white flex justify-between items-center">
                            <h3 className="font-bold text-lg">Penilaian: {selectedBuku.judul_buku}</h3>
                            <button onClick={() => setShowModalNilai(false)} className="text-white/80 hover:text-white text-2xl">&times;</button>
                        </div>

                        {/* Body Form */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <p className="text-sm text-gray-500 mb-4 bg-yellow-50 p-3 rounded border border-yellow-200">
                                Masukkan nilai riil (Contoh: Harga dalam Rupiah, Tahun Terbit, atau Skala 1-100).
                            </p>
                            
                            <div className="space-y-4">
                                {formNilai.map((item, index) => (
                                    <div key={item.id_kriteria}>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            {item.kode_kriteria} - {item.nama_kriteria}
                                        </label>
                                        <input 
                                            type="number" 
                                            value={item.nilai} 
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                            placeholder="Masukkan nilai..."
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 bg-gray-50 text-right border-t flex justify-end gap-2">
                            <button onClick={() => setShowModalNilai(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium">Batal</button>
                            <button onClick={handleSaveNilai} className="px-4 py-2 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 shadow-lg">Simpan Penilaian</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

// const ViewBuku = () => {
//     const [listBuku, setListBuku] = useState([]);
    
//     const fetchBuku = async () => {
//         try { const res = await api.get('/buku'); setListBuku(res.data); } 
//         catch (error) { console.error(error); }
//     };

//     useEffect(() => { fetchBuku(); }, []);

//     // --- FORM TAMBAH / EDIT (Pakai SweetAlert) ---
//     const showForm = async (buku = null) => {
//         const isEdit = !!buku;
//         const { value: formValues } = await Swal.fire({
//             title: isEdit ? 'Edit Buku' : 'Tambah Buku Baru',
//             html:
//                 `<input id="swal-judul" class="swal2-input" placeholder="Judul Buku" value="${buku?.judul_buku || ''}">` +
//                 `<input id="swal-penulis" class="swal2-input" placeholder="Penulis" value="${buku?.penulis || ''}">` +
//                 `<input id="swal-penerbit" class="swal2-input" placeholder="Penerbit" value="${buku?.penerbit || ''}">` +
//                 `<input id="swal-tahun" type="number" class="swal2-input" placeholder="Tahun Terbit" value="${buku?.tahun_terbit || ''}">` +
//                 `<input id="swal-stok" type="number" class="swal2-input" placeholder="Stok" value="${buku?.stok || ''}">`,
//             focusConfirm: false,
//             showCancelButton: true,
//             preConfirm: () => {
//                 return {
//                     judul_buku: document.getElementById('swal-judul').value,
//                     penulis: document.getElementById('swal-penulis').value,
//                     penerbit: document.getElementById('swal-penerbit').value,
//                     tahun_terbit: document.getElementById('swal-tahun').value,
//                     stok: document.getElementById('swal-stok').value
//                 }
//             }
//         });

//         if (formValues) {
//             try {
//                 if (isEdit) {
//                     await api.patch(`/buku/${buku.id_buku}`, formValues);
//                     Swal.fire('Update Sukses', '', 'success');
//                 } else {
//                     await api.post('/buku', formValues);
//                     Swal.fire('Tambah Sukses', '', 'success');
//                 }
//                 fetchBuku(); // Refresh Tabel
//             } catch (error) {
//                 Swal.fire('Error', 'Gagal menyimpan data', 'error');
//             }
//         }
//     };

//     const handleDelete = async (id) => {
//         const result = await Swal.fire({ title: 'Hapus?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
//         if (result.isConfirmed) {
//             await api.delete(`/buku/${id}`);
//             fetchBuku();
//             Swal.fire('Terhapus!', '', 'success');
//         }
//     };

//     return (
//         <div className="bg-white p-6 rounded-2xl shadow-sm">
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">Data Buku</h2>
//                 <button onClick={() => showForm(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
//                     <FaPlus /> Tambah Buku
//                 </button>
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                     <thead>
//                         <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
//                             <th className="p-3">Judul</th>
//                             <th className="p-3">Penulis</th>
//                             <th className="p-3">Stok</th>
//                             <th className="p-3">Aksi</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y">
//                         {listBuku.map((buku) => (
//                             <tr key={buku.id_buku} className="hover:bg-gray-50">
//                                 <td className="p-3 font-medium">{buku.judul_buku}</td>
//                                 <td className="p-3">{buku.penulis}</td>
//                                 <td className="p-3">{buku.stok}</td>
//                                 <td className="p-3 flex gap-2">
//                                     <button onClick={() => showForm(buku)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><FaEdit /></button>
//                                     <button onClick={() => handleDelete(buku.id_buku)} className="text-red-500 hover:bg-red-50 p-2 rounded"><FaTrash /></button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// 3. KRITERIA VIEW
const ViewKriteria = () => {
    const [kriteria, setKriteria] = useState([]);

    const fetchKriteria = async () => {
        try { const res = await api.get('/kriteria'); setKriteria(res.data); } 
        catch (err) { console.error(err); }
    };

    useEffect(() => { fetchKriteria(); }, []);

    const showForm = async (item = null) => {
        const isEdit = !!item;
        const { value: formValues } = await Swal.fire({
            title: isEdit ? 'Edit Kriteria' : 'Tambah Kriteria',
            html:
                `<input id="k-kode" class="swal2-input" placeholder="Kode (C1, C2)" value="${item?.kode_kriteria || ''}">` +
                `<input id="k-nama" class="swal2-input" placeholder="Nama Kriteria" value="${item?.nama_kriteria || ''}">` +
                `<select id="k-attr" class="swal2-input"><option value="benefit" ${item?.atribut === 'benefit' ? 'selected' : ''}>Benefit</option><option value="cost" ${item?.atribut === 'cost' ? 'selected' : ''}>Cost</option></select>` +
                `<input id="k-bobot" type="number" step="0.01" class="swal2-input" placeholder="Bobot (Contoh: 0.25)" value="${item?.bobot || ''}">`,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return {
                    kode_kriteria: document.getElementById('k-kode').value,
                    nama_kriteria: document.getElementById('k-nama').value,
                    atribut: document.getElementById('k-attr').value,
                    bobot: document.getElementById('k-bobot').value
                }
            }
        });

        if (formValues) {
            try {
                if (isEdit) {
                    await api.put(`/kriteria/${item.id_kriteria}`, formValues);
                } else {
                    await api.post('/kriteria', formValues);
                }
                fetchKriteria();
                Swal.fire('Sukses', '', 'success');
            } catch (err) { Swal.fire('Error', '', 'error'); }
        }
    };

    const handleDelete = async (id) => {
        if((await Swal.fire({title:'Hapus?', icon:'warning', showCancelButton:true})).isConfirmed){
            await api.delete(`/kriteria/${id}`);
            fetchKriteria();
            Swal.fire('Dihapus', '', 'success');
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Data Kriteria</h2>
                <button onClick={() => showForm()} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
                    <FaPlus /> Tambah
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kriteria.map((k) => (
                    <div key={k.id_kriteria} className="p-4 border border-gray-200 rounded-xl flex justify-between items-center hover:shadow-md transition bg-gray-50">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-blue-600">{k.kode_kriteria}</span>
                                <h3 className="font-semibold text-gray-700">{k.nama_kriteria}</h3>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex gap-2">
                                <span className={`px-2 py-0.5 rounded ${k.atribut === 'benefit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{k.atribut.toUpperCase()}</span>
                                <span className="bg-gray-200 px-2 py-0.5 rounded">Bobot: {k.bobot}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => showForm(k)} className="text-blue-500 p-2"><FaEdit /></button>
                            <button onClick={() => handleDelete(k.id_kriteria)} className="text-red-500 p-2"><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// 4. HITUNG SAW VIEW (KOMPONEN YANG HILANG)
const ViewHitungSAW = () => {
    const [hasil, setHasil] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bestOption, setBestOption] = useState(null); 
    
    // STATE BARU BUAT MODAL DETAIL & LIST KRITERIA
    const [showModal, setShowModal] = useState(false);
    const [kriteriaList, setKriteriaList] = useState([]);

    // 1. Ambil Data Kriteria (Biar kita tau ID 1 itu namanya "Harga", dll)
    const fetchKriteria = async () => {
        try {
            const res = await api.get('/kriteria');
            setKriteriaList(res.data);
        } catch (err) {}
    };

    // 2. Hitung SAW
    const hitungSAW = async () => {
        setLoading(true);
        try {
            // Panggil API Kriteria dulu biar datanya siap
            await fetchKriteria();

            const res = await api.get('/hitung-saw');
            const dataHasil = res.data.data || res.data; 
            setHasil(dataHasil);

            if (dataHasil.length > 0) {
                setBestOption(dataHasil[0]);
            }
            
            Swal.fire({ icon: 'success', title: 'Analisa Selesai!', timer: 1000, showConfirmButton: false });
        } catch (err) {
            Swal.fire('Error', 'Gagal menghitung SAW.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { hitungSAW(); }, []);

    // 3. Simpan Laporan
    const handleSimpanLaporan = async () => {
        if (hasil.length === 0) return Swal.fire('Data Kosong', 'Tidak ada hasil.', 'warning');
        const { value: judul } = await Swal.fire({
            title: 'Simpan Laporan',
            input: 'text',
            inputLabel: 'Judul Laporan',
            showCancelButton: true
        });
        if (judul) {
            try {
                await api.post('/laporan', { keterangan: judul, data_json: JSON.stringify(hasil) });
                Swal.fire('Berhasil', 'Laporan disimpan.', 'success');
            } catch (error) { Swal.fire('Gagal', 'Gagal menyimpan.', 'error'); }
        }
    };

    // 4. HELPER: Cari Nama Kriteria berdasarkan ID
    const getNamaKriteria = (id) => {
        const k = kriteriaList.find(item => item.id_kriteria === id);
        return k ? k.nama_kriteria : `Kriteria ID ${id}`;
    };

    return (
        <div className="space-y-6 relative">
            
            {/* --- BAGIAN 1: REKOMENDASI UTAMA --- */}
            {bestOption && (
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                            <FaCalculator className="text-4xl text-yellow-300" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-1">KEPUTUSAN SISTEM</h3>
                            <h2 className="text-3xl font-bold mb-2">Rekomendasi: <span className="text-yellow-300">"{bestOption.judul_buku}"</span></h2>
                            <p className="text-indigo-100 text-sm">
                                Skor Tertinggi: <strong>{bestOption.total_nilai}</strong>
                            </p>
                        </div>
                        
                        {/* TOMBOL LIHAT DETAIL (SEKARANG SUDAH BERFUNGSI) */}
                        <div className="flex flex-col gap-2 min-w-[150px]">
                            <button 
                                onClick={() => setShowModal(true)} // <--- INI FUNGSINYA
                                className="bg-white text-indigo-700 font-bold py-2 px-4 rounded-lg hover:bg-indigo-50 transition shadow-lg text-sm"
                            >
                                Lihat Detail Nilai
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* --- BAGIAN 2: TABEL --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Ranking Lengkap</h2>
                    <div className="flex gap-2">
                        <button onClick={hitungSAW} disabled={loading} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm">
                            {loading ? '...' : <FaCalculator />} Refresh
                        </button>
                        <button onClick={handleSimpanLaporan} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm">
                            <FaSave /> Simpan
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-800 text-white text-sm">
                            <tr>
                                <th className="p-3 text-center w-16">Rank</th>
                                <th className="p-3">Judul Buku</th>
                                <th className="p-3">Penulis</th>
                                <th className="p-3 text-right">Skor Akhir (V)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {hasil.map((item, index) => (
                                <tr key={index} className={`hover:bg-gray-50 ${item.rank === 1 ? 'bg-indigo-50' : ''}`}>
                                    <td className="p-3 text-center">#{item.rank}</td>
                                    <td className="p-3 font-semibold">{item.judul_buku}</td>
                                    <td className="p-3 text-gray-500">{item.penulis}</td>
                                    <td className="p-3 text-right font-mono font-bold text-blue-600">{item.total_nilai}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- BAGIAN 3: MODAL POPUP DETAIL PEMENANG (YANG BARU) --- */}
            {showModal && bestOption && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        {/* Header Modal */}
                        <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                            <h3 className="font-bold text-lg">Kenapa Buku Ini Menang?</h3>
                            <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white text-2xl">&times;</button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">{bestOption.judul_buku}</h2>
                                <p className="text-gray-500">{bestOption.penulis}</p>
                                <div className="mt-2 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                    Skor Total: {bestOption.total_nilai}
                                </div>
                            </div>

                            <h4 className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Rincian Perolehan Poin:</h4>
                            <div className="space-y-2">
                                {bestOption.detail && bestOption.detail.map((d, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border hover:border-indigo-300 transition">
                                        <div>
                                            <p className="font-bold text-gray-700 text-sm">{getNamaKriteria(d.id_kriteria)}</p>
                                            <p className="text-xs text-gray-400">Nilai Normalisasi: {Number(d.normalisasi).toFixed(3)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-indigo-600">{Number(d.poin).toFixed(4)}</p>
                                            <p className="text-[10px] text-gray-400">Poin Akhir</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 bg-gray-50 text-right border-t">
                            <button onClick={() => setShowModal(false)} className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm">
                                Tutup
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

        </div>
    );
};
// const ViewHitungSAW = () => {
//     const [hasil, setHasil] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [bestOption, setBestOption] = useState(null); // Simpan Juara 1

//     const hitungSAW = async () => {
//         setLoading(true);
//         try {
//             const res = await api.get('/hitung-saw');
//             const dataHasil = res.data.data || res.data; 
//             setHasil(dataHasil);

//             // Ambil Juara 1 buat Rekomendasi
//             if (dataHasil.length > 0) {
//                 setBestOption(dataHasil[0]);
//             }
            
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Analisa Selesai!',
//                 timer: 1000,
//                 showConfirmButton: false
//             });
//         } catch (err) {
//             console.error(err);
//             Swal.fire('Error', 'Gagal menghitung SAW.', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { hitungSAW(); }, []);

//     // Fungsi Simpan ke Laporan
//     const handleSimpanLaporan = async () => {
//         if (hasil.length === 0) return Swal.fire('Data Kosong', 'Tidak ada hasil.', 'warning');
//         const { value: judul } = await Swal.fire({
//             title: 'Simpan Laporan',
//             input: 'text',
//             inputLabel: 'Berikan Judul Laporan',
//             inputPlaceholder: 'Contoh: Rekomendasi Buku Terbaik 2024',
//             showCancelButton: true
//         });
//         if (judul) {
//             try {
//                 await api.post('/laporan', { keterangan: judul, data_json: JSON.stringify(hasil) });
//                 Swal.fire('Berhasil', 'Laporan disimpan.', 'success');
//             } catch (error) {
//                 Swal.fire('Gagal', 'Gagal menyimpan.', 'error');
//             }
//         }
//     };

//     return (
//         <div className="space-y-6">
            
//             {/* --- BAGIAN 1: KOTAK SARAN / REKOMENDASI (INI YANG BARU) --- */}
//             {bestOption && (
//                 <motion.div 
//                     initial={{ scale: 0.9, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
//                 >
//                     {/* Hiasan Background */}
//                     <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                    
//                     <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
//                         <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
//                             <FaCalculator className="text-4xl text-yellow-300" />
//                         </div>
//                         <div className="flex-1 text-center md:text-left">
//                             <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-1">
//                                 KEPUTUSAN SISTEM (SAW)
//                             </h3>
//                             <h2 className="text-3xl font-bold mb-2">
//                                 Rekomendasi Utama: <span className="text-yellow-300">"{bestOption.judul_buku}"</span>
//                             </h2>
//                             <p className="text-indigo-100 text-sm leading-relaxed">
//                                 Berdasarkan perhitungan algoritma SAW, buku ini memiliki nilai preferensi tertinggi 
//                                 (<strong>{bestOption.total_nilai}</strong>). Buku ini unggul dalam kriteria yang memiliki bobot terbesar.
//                             </p>
//                         </div>
                        
//                         {/* Tombol Aksi Cepat */}
//                         <div className="flex flex-col gap-2 min-w-[150px]">
//                             <button className="bg-white text-indigo-700 font-bold py-2 px-4 rounded-lg hover:bg-indigo-50 transition shadow-lg text-sm">
//                                 Lihat Detail
//                             </button>
//                             {/* Tampilkan Runner Up (Juara 2) kalau ada */}
//                             {hasil.length > 1 && (
//                                 <div className="text-xs text-center text-indigo-200 mt-2">
//                                     Alternatif ke-2: <br/> 
//                                     <strong>{hasil[1].judul_buku}</strong>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </motion.div>
//             )}

//             {/* --- BAGIAN 2: TABEL SEPERTI BIASA --- */}
//             <div className="bg-white p-6 rounded-2xl shadow-sm">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-bold text-gray-800">Rincian Perhitungan</h2>
//                     <div className="flex gap-2">
//                         <button onClick={hitungSAW} disabled={loading} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm">
//                             {loading ? '...' : <FaCalculator />} Refresh
//                         </button>
//                         <button onClick={handleSimpanLaporan} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm">
//                             <FaSave /> Simpan
//                         </button>
//                     </div>
//                 </div>

//                 <div className="overflow-x-auto border rounded-xl">
//                     <table className="w-full text-left border-collapse">
//                         <thead className="bg-slate-800 text-white text-sm">
//                             <tr>
//                                 <th className="p-3 text-center w-16">Rank</th>
//                                 <th className="p-3">Judul Buku</th>
//                                 <th className="p-3">Penulis</th>
//                                 <th className="p-3 text-right">Skor (V)</th>
//                                 <th className="p-3 text-center">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y text-sm">
//                             {hasil.map((item, index) => (
//                                 <tr key={index} className={`hover:bg-gray-50 ${item.rank === 1 ? 'bg-indigo-50' : ''}`}>
//                                     <td className="p-3 text-center">
//                                         {item.rank === 1 ? <span className="text-2xl">🥇</span> : 
//                                          item.rank === 2 ? <span className="text-xl">🥈</span> : 
//                                          item.rank === 3 ? <span className="text-xl">🥉</span> : `#${item.rank}`}
//                                     </td>
//                                     <td className="p-3 font-semibold text-gray-700">
//                                         {item.judul_buku}
//                                         {item.rank === 1 && <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] rounded-full uppercase font-bold">Sangat Disarankan</span>}
//                                     </td>
//                                     <td className="p-3 text-gray-500">{item.penulis}</td>
//                                     <td className="p-3 text-right font-mono font-bold text-blue-600">
//                                         {item.total_nilai}
//                                     </td>
//                                     <td className="p-3 text-center">
//                                         {item.rank <= 3 ? (
//                                             <span className="text-green-600 font-bold text-xs">Layak Dipilih</span>
//                                         ) : (
//                                             <span className="text-gray-400 text-xs">Alternatif</span>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };
//     const handleSimpanLaporan = async () => {
//         if (hasil.length === 0) return Swal.fire('Data Kosong', 'Tidak ada hasil untuk disimpan.', 'warning');

//         const { value: judul } = await Swal.fire({
//             title: 'Simpan Laporan',
//             input: 'text',
//             inputLabel: 'Berikan Judul/Keterangan Laporan',
//             inputPlaceholder: 'Contoh: Laporan Periode Januari 2024',
//             showCancelButton: true,
//             inputValidator: (value) => {
//                 if (!value) return 'Judul tidak boleh kosong!';
//             }
//         });

//         if (judul) {
//             try {
//                 // Kirim data hasil ranking (JSON) ke tabel laporan
//                 await api.post('/laporan', {
//                     keterangan: judul,
//                     data_json: JSON.stringify(hasil) // Array hasil dikonversi jadi string JSON
//                 });
//                 Swal.fire('Berhasil', 'Laporan telah disimpan ke database.', 'success');
//             } catch (error) {
//                 Swal.fire('Gagal', 'Gagal menyimpan laporan.', 'error');
//             }
//         }
//     };

//     return (
//         <div className="bg-white p-6 rounded-2xl shadow-sm">
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-800">Hasil Perhitungan SAW</h2>
//                     <p className="text-sm text-gray-500">Sistem otomatis mengurutkan buku terbaik.</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <button 
//                         onClick={hitungSAW} 
//                         disabled={loading}
//                         className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
//                     >
//                         {loading ? <span className="animate-spin">↻</span> : <FaCalculator />} 
//                         Hitung Ulang
//                     </button>
//                     <button 
//                         onClick={handleSimpanLaporan} 
//                         className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
//                     >
//                         <FaSave /> Simpan Laporan
//                     </button>
//                 </div>
//             </div>

//             {/* Tabel Ranking */}
//             <div className="overflow-x-auto border rounded-xl">
//                 <table className="w-full text-left border-collapse">
//                     <thead className="bg-slate-800 text-white">
//                         <tr>
//                             <th className="p-3 text-center w-20">Rank</th>
//                             <th className="p-3">Judul Buku</th>
//                             <th className="p-3">Penulis</th>
//                             <th className="p-3 text-right">Nilai Preferensi (V)</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y">
//                         {hasil.length > 0 ? (
//                             hasil.map((item, index) => (
//                                 <tr key={index} className={`hover:bg-gray-50 ${item.rank === 1 ? 'bg-yellow-50' : ''}`}>
//                                     <td className="p-3 text-center font-bold">
//                                         {item.rank === 1 ? '🥇 1' : 
//                                          item.rank === 2 ? '🥈 2' : 
//                                          item.rank === 3 ? '🥉 3' : item.rank}
//                                     </td>
//                                     <td className="p-3 font-medium">{item.judul_buku}</td>
//                                     <td className="p-3 text-gray-600">{item.penulis}</td>
//                                     <td className="p-3 text-right font-bold text-blue-600">
//                                         {typeof item.total_nilai === 'number' ? item.total_nilai.toFixed(4) : item.total_nilai}
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="4" className="p-8 text-center text-gray-400">
//                                     {loading ? 'Sedang menghitung...' : 'Data tidak tersedia. Cek data Buku & Kriteria.'}
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// 5. LAPORAN VIEW
// GANTI ViewLaporan dengan yang ini biar detailnya rapi
const ViewLaporan = () => {
    const [laporan, setLaporan] = useState([]);
    const [selectedDetail, setSelectedDetail] = useState(null);

    // --- FUNGSI AMBIL DATA (DIPERBAIKI PARSINGNYA) ---
    const fetchLaporan = async () => {
        try {
            const res = await api.get('/laporan');
            
            // Kita proses datanya satu per satu biar aman
            const dataRapih = res.data.map(item => {
                let parsedData = []; // Default kosong

                try {
                    // Cek 1: Apakah datanya String JSON? Kita Parse.
                    if (typeof item.data_json === 'string') {
                        parsedData = JSON.parse(item.data_json);
                    } 
                    // Cek 2: Apakah datanya sudah jadi Object/Array? (Kadang driver MySQL otomatis parse)
                    else if (typeof item.data_json === 'object' && item.data_json !== null) {
                        parsedData = item.data_json;
                    }
                    // Cek 3: Apakah datanya null?
                    else {
                        parsedData = [];
                    }

                    // Pastikan hasil akhirnya Array. Kalau object tunggal, bungkus jadi array
                    if (!Array.isArray(parsedData) && parsedData) {
                        parsedData = [parsedData];
                    }

                } catch (e) {
                    console.error("Gagal membaca data laporan ID:", item.id_laporan, e);
                    parsedData = []; 
                }

                return {
                    ...item,
                    data_json: parsedData || [] // Pastikan tidak pernah null
                };
            });

            console.log("Data Laporan Siap:", dataRapih); // Cek Console (F12) kalau masih blank
            setLaporan(dataRapih);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchLaporan(); }, []);

    const hapusLaporan = async (id) => {
        if(confirm('Hapus laporan ini?')) {
            await api.delete(`/laporan/${id}`);
            fetchLaporan();
        }
    };

    const handleDownloadExcel = () => {
        if (!selectedDetail) return;
        const dataSheet = selectedDetail.data_json.map(item => ({
            Rank: item.rank,
            Judul: item.judul_buku,
            Penulis: item.penulis,
            Nilai_Preferensi: item.total_nilai
        }));
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataSheet);
        XLSX.utils.book_append_sheet(wb, ws, "Laporan SPK");
        XLSX.writeFile(wb, `Laporan_${selectedDetail.keterangan}.xlsx`);
    };

    const handlePrintBrowser = () => {
        if (!selectedDetail) return;
        const printWindow = window.open('', '', 'height=650,width=900');
        printWindow.document.write('<html><head><title>Cetak Laporan</title>');
        printWindow.document.write(`
            <style>
                body { font-family: sans-serif; padding: 20px; }
                h2, h4, p { text-align: center; margin: 5px 0; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; font-size: 12px; }
                th { background-color: #f2f2f2; }
                .rank-1 { background-color: #fff9c4; font-weight: bold; }
                .footer { margin-top: 30px; text-align: right; font-size: 12px; }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<h2>LAPORAN HASIL SPK</h2><h4>"${selectedDetail.keterangan}"</h4><p>Tanggal: ${new Date().toLocaleString()}</p><hr/>`);
        printWindow.document.write('<table><thead><tr><th>Rank</th><th>Judul Buku</th><th>Penulis</th><th style="text-align:right">Nilai Akhir</th></tr></thead><tbody>');

        selectedDetail.data_json.forEach(item => {
            printWindow.document.write(`
                <tr ${item.rank === 1 ? 'class="rank-1"' : ''}>
                    <td>#${item.rank}</td>
                    <td>${item.judul_buku}</td>
                    <td>${item.penulis}</td>
                    <td style="text-align:right">${Number(item.total_nilai).toFixed(4)}</td>
                </tr>
            `);
        });

        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Arsip Laporan</h2>
            
            {laporan.length === 0 ? (
                <div className="p-8 text-center text-gray-400 border border-dashed border-gray-300 rounded-xl"><p>Belum ada laporan.</p></div>
            ) : (
                <div className="space-y-3">
                    {laporan.map((item) => (
                        <div key={item.id_laporan} className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50">
                            <div>
                                <p className="font-bold text-gray-800">{item.keterangan}</p>
                                <p className="text-xs text-gray-500">{new Date(item.tanggal).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setSelectedDetail(item)} className="text-blue-600 text-sm font-semibold hover:underline">Lihat Detail & Cetak</button>
                                <button onClick={() => hapusLaporan(item.id_laporan)} className="text-red-500 p-2 hover:bg-red-50 rounded"><FaTrash /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL POPUP DETAIL (YANG TADI BLANK) --- */}
            {selectedDetail && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-lg">{selectedDetail.keterangan}</h3>
                                <p className="text-xs text-gray-500">{new Date(selectedDetail.tanggal).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedDetail(null)} className="text-gray-500 hover:text-red-500 font-bold text-2xl">&times;</button>
                        </div>
                        
                        <div className="p-3 bg-blue-50 flex gap-3 justify-end border-b">
                            <button onClick={handleDownloadExcel} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2">
                                <FaFileAlt /> Excel
                            </button>
                            <button onClick={handlePrintBrowser} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2">
                                <FaFileAlt /> Print PDF
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-800 text-white">
                                        <th className="p-2">Rank</th>
                                        <th className="p-2">Judul Buku</th>
                                        <th className="p-2">Penulis</th>
                                        <th className="p-2 text-right">Nilai Akhir</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {/* --- BAGIAN INI SUDAH DIAMANKAN --- */}
                                    {(selectedDetail.data_json && selectedDetail.data_json.length > 0) ? (
                                        selectedDetail.data_json.map((row, index) => (
                                            <tr key={index} className={row.rank === 1 ? "bg-yellow-50" : ""}>
                                                <td className="p-2 font-bold">#{row.rank || index + 1}</td>
                                                <td className="p-2">{row.judul_buku || '-'}</td>
                                                <td className="p-2">{row.penulis || '-'}</td>
                                                <td className="p-2 text-right font-bold text-blue-600">
                                                    {Number(row.total_nilai || 0).toFixed(4)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-400">
                                                Data kosong atau rusak. Cek Console (F12).
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-3 border-t bg-gray-50 text-right">
                            <button onClick={() => setSelectedDetail(null)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Tutup</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 6. KELOLA PENGGUNA VIEW
// 6. KELOLA PENGGUNA VIEW (DINAMIS - PAKAI INI!)
const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [myUser, setMyUser] = useState('');

    const fetchUsers = async () => {
        try { 
            const res = await api.get('/users'); 
            setUsers(res.data);
            setMyUser(localStorage.getItem('user_name')); 
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchUsers(); }, []);

    // --- TAMBAH USER BARU ---
    const handleAddUser = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Tambah Admin Baru',
            html:
                `<input id="u-nama" class="swal2-input" placeholder="Nama Lengkap">` +
                `<input id="u-user" class="swal2-input" placeholder="Username">` +
                `<input id="u-pass" type="password" class="swal2-input" placeholder="Password">`,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return {
                    nama_lengkap: document.getElementById('u-nama').value,
                    username: document.getElementById('u-user').value,
                    password: document.getElementById('u-pass').value
                }
            }
        });

        if (formValues) {
            try {
                if(!formValues.nama_lengkap || !formValues.username || !formValues.password) {
                    throw new Error("Semua field wajib diisi!");
                }
                await api.post('/users', formValues);
                fetchUsers();
                Swal.fire('Berhasil', 'User baru ditambahkan', 'success');
            } catch (err) { 
                Swal.fire('Gagal', err.response?.data?.msg || err.message, 'error'); 
            }
        }
    };

    // --- EDIT USER (BARU DITAMBAHKAN) ---
    const handleEditUser = async (user) => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Data User',
            html:
                `<div class="text-left mb-1 text-sm font-bold text-gray-600">Nama Lengkap</div>` +
                `<input id="u-nama" class="swal2-input" placeholder="Nama Lengkap" value="${user.nama_lengkap}">` +
                
                `<div class="text-left mt-3 mb-1 text-sm font-bold text-gray-600">Username</div>` +
                `<input id="u-user" class="swal2-input" placeholder="Username" value="${user.username}">` +
                
                `<div class="text-left mt-3 mb-1 text-sm font-bold text-gray-600">Password Baru (Opsional)</div>` +
                `<input id="u-pass" type="password" class="swal2-input" placeholder="Kosongkan jika tidak diganti">`,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return {
                    nama_lengkap: document.getElementById('u-nama').value,
                    username: document.getElementById('u-user').value,
                    password: document.getElementById('u-pass').value // Bisa kosong
                }
            }
        });

        if (formValues) {
            try {
                // Kirim data ke backend (PUT)
                await api.put(`/users/${user.id_user}`, formValues);
                
                // Refresh data
                fetchUsers();
                
                // Kalau yang diedit diri sendiri, update nama di localstorage biar header berubah
                const currentUser = localStorage.getItem('user_name');
                if (user.username === currentUser) {
                     localStorage.setItem('user_name', formValues.nama_lengkap);
                     // Reload biar header update (opsional)
                     window.location.reload(); 
                } else {
                     Swal.fire('Berhasil', 'Data user diperbarui!', 'success');
                }

            } catch (err) { 
                Swal.fire('Gagal', err.response?.data?.msg || 'Gagal update user', 'error'); 
            }
        }
    };

    // --- HAPUS USER ---
    const handleDelete = async (id, username) => {
        if (username === myUser) return Swal.fire('Error', 'Tidak bisa menghapus akun sendiri yang sedang login!', 'error');
        
        const result = await Swal.fire({
            title: 'Hapus User?', 
            text: `Yakin ingin menghapus ${username}?`,
            icon: 'warning', 
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
        });

        if(result.isConfirmed){
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
                Swal.fire('Terhapus!', 'User telah dihapus.', 'success');
            } catch (error) {
                Swal.fire('Gagal', 'Terjadi kesalahan.', 'error');
            }
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Kelola Pengguna</h2>
                <button onClick={handleAddUser} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <FaPlus /> Tambah Admin
                </button>
            </div>
            <div className="space-y-3">
                {users.map((u) => (
                    <div key={u.id_user} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border hover:shadow-sm transition">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold shadow-md">
                                {u.nama_lengkap ? u.nama_lengkap.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{u.nama_lengkap} {u.username === localStorage.getItem('user_name') && '(Saya)'}</p>
                                <p className="text-xs text-gray-500 font-mono">@{u.username}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            {/* Tombol Edit */}
                            <button 
                                onClick={() => handleEditUser(u)} 
                                className="bg-yellow-100 text-yellow-600 p-2 rounded-lg hover:bg-yellow-200 transition"
                                title="Edit User"
                            >
                                <FaEdit />
                            </button>

                            {/* Tombol Hapus (Jangan tampilkan kalau user sendiri) */}
                            {u.username !== localStorage.getItem('user_name') && (
                                <button 
                                    onClick={() => handleDelete(u.id_user, u.username)} 
                                    className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition"
                                    title="Hapus User"
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 7. PROFIL SAYA VIEW (FIXED - Jalan sama Backend)
const ViewProfile = ({ user, setUser }) => {
    // Kita butuh ID user. Karena di localStorage gak nyimpen ID, kita cari dulu dari API Users
    const [myId, setMyId] = useState(null);
    const [preview, setPreview] = useState(user.avatar || null);
    const [nama, setNama] = useState(user.nama || "");
    const [password, setPassword] = useState("");

    // Cari ID saya dulu berdasarkan username yg login
    useEffect(() => {
        const cariIdSaya = async () => {
            try {
                const res = await api.get('/users');
                const usernameSaya = localStorage.getItem('user_name');
                const ketemu = res.data.find(u => u.username === usernameSaya);
                if(ketemu) {
                    setMyId(ketemu.id_user);
                    setNama(ketemu.nama_lengkap);
                    // Kalau di database ada avatar, pake itu (ini contoh logic frontend aja)
                    // Karena API /users saya tadi belum return avatar, ini mungkin null dulu gapapa
                }
            } catch(err) {}
        }
        cariIdSaya();
    }, []);

    const [fileFoto, setFileFoto] = useState(null); // State khusus buat nyimpen file mentah

    // 1. HANDLE GANTI FOTO (Cuma buat preview & simpan file mentah)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileFoto(file); // Simpan file aslinya buat dikirim nanti
            setPreview(URL.createObjectURL(file)); // Buat preview lokal aja
        }
    };

    // 2. HANDLE SAVE (PAKAI FORMDATA)
    const handleSave = async () => {
        if(!myId) return Swal.fire("Loading...", "Tunggu data user...", "info");

        // GUNAKAN FORMDATA (Wajib buat kirim file lewat Multer)
        const formData = new FormData();
        formData.append('nama_lengkap', nama);
        formData.append('username', localStorage.getItem('user_name')); // atau username dari state
        if (password) formData.append('password', password);
        
        // Kuncinya disini: Masukkan file mentah ke 'avatar'
        if (fileFoto) {
            formData.append('avatar', fileFoto);
        }

        try {
            // Header 'Content-Type': 'multipart/form-data' itu otomatis dipasang axios kalau kita kirim FormData
            await api.put(`/users/${myId}`, formData);

            // Update UI
            setUser({ ...user, nama: nama, avatar: preview });
            localStorage.setItem('user_name', nama);
            
            Swal.fire("Berhasil", "Profil diperbarui!", "success");
            setPassword("");
            setFileFoto(null); // Reset file
        } catch (err) {
            console.error(err);
            Swal.fire("Gagal", err.response?.data?.msg || "Gagal update profil", "error");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profil</h2>
            <div className="flex flex-col items-center mb-8">
                <div className="relative w-32 h-32">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                        {preview ? <img src={preview} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl"><FaUserCircle /></div>}
                    </div>
                    <label htmlFor="upload-foto" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md"><FaCamera /></label>
                    <input type="file" id="upload-foto" className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>
            </div>
            <div className="space-y-4">
                <div><label className="text-sm font-medium">Nama Lengkap</label><input type="text" value={nama} onChange={(e) => setNama(e.target.value)} className="w-full p-3 border rounded-xl" /></div>
                <div><label className="text-sm font-medium">Username</label><input type="text" value={localStorage.getItem('user_name')} disabled className="w-full p-3 border rounded-xl bg-gray-100" /></div>
                <div><label className="text-sm font-medium">Password Baru</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Opsional" className="w-full p-3 border rounded-xl" /></div>
                <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4"><FaSave /> Simpan</button>
            </div>
        </div>
    );
};

// Komponen Helper MenuItem
const MenuItem = ({ icon, label, isOpen, active, onClick }) => (
    <div 
        onClick={onClick} 
        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-1
        ${active ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
    >
        <span className="text-xl min-w-[24px]">{icon}</span>
        {isOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
    </div>
);

const StatCard = ({ title, value, color, icon }) => (
    <motion.div whileHover={{ y: -5 }} className={`bg-white p-6 rounded-2xl shadow-md border-b-4 border-${color}-500 flex justify-between items-center`}>
        <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        <div className={`p-4 bg-${color}-50 text-${color}-600 rounded-xl text-2xl`}>
            {icon}
        </div>
    </motion.div>
);