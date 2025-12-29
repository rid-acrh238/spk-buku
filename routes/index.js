import express from "express";

// 1. Import Sub-Routes
import authRoutes from "./authRoutes.js"; // <--- Pastikan ini ada
import bukuRoutes from "./bukuRoutes.js";
import userRoutes from "./userRoutes.js";
import kriteriaRoutes from "./kriteriaRoutes.js";
import { getNilaiByBuku, updateNilaiBuku } from "../controllers/NilaiController.js"; // Import baru

// 2. Import Controller Manual
import { hitungSAW } from "../controllers/SPKController.js";
import { simpanLaporan, getLaporan, hapusLaporan } from "../controllers/LaporanController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// DAFTARKAN ROUTE DISINI
// ==========================================

// 1. JALUR PUBLIC (Login/Register) - WAJIB PALING ATAS
// Tanpa verifyToken!
router.use(authRoutes); 

// 2. JALUR PRIVATE (Harus Login)
// Pasang satpam di pintu masuk buku, user, dll
router.use(verifyToken); // Opsional: Pasang global middleware untuk route di bawahnya

router.use(bukuRoutes);
router.use(userRoutes);
router.use(kriteriaRoutes);

// Route Manual
router.get('/hitung-saw', hitungSAW);
router.post('/laporan', simpanLaporan);
router.get('/laporan', getLaporan);
router.delete('/laporan/:id', hapusLaporan);

router.get('/nilai/:id_buku', verifyToken, getNilaiByBuku);  // Ambil data nilai buku A
router.post('/nilai/:id_buku', verifyToken, updateNilaiBuku); // Simpan data nilai buku A

export default router;


// import express from "express";

// // 1. Import Semua Sub-Routes
// import authRoutes from "./authRoutes.js";
// import bukuRoutes from "./bukuRoutes.js";
// import userRoutes from "./userRoutes.js";       // <-- Tadi belum ada
// import kriteriaRoutes from "./kriteriaRoutes.js"; // <-- Tadi belum ada

// // 2. Import Controller manual (SPK & Laporan)
// import { hitungSAW } from "../controllers/SPKController.js";
// import { simpanLaporan, getLaporan, hapusLaporan } from "../controllers/LaporanController.js";
// import { verifyToken } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // --- GABUNGKAN SUB-ROUTES ---
// // Pastikan authRoutes paling atas biar Login tidak kena block verifyToken (jika ada global middleware)
// router.use(authRoutes);     // Isinya: /login, /register
// router.use(bukuRoutes);     // Isinya: /buku
// router.use(userRoutes);     // Isinya: /users
// router.use(kriteriaRoutes); // Isinya: /kriteria

// // --- ROUTE MANUAL (SPK & LAPORAN) ---
// router.get('/hitung-saw', verifyToken, hitungSAW);

// router.post('/laporan', verifyToken, simpanLaporan);
// router.get('/laporan', verifyToken, getLaporan);
// router.delete('/laporan/:id', verifyToken, hapusLaporan);

// export default router;

// // import express from "express";

// // // 1. Import Sub-Routes yang tadi kita buat
// // import authRoutes from "./authRoutes.js";
// // import bukuRoutes from "./bukuRoutes.js";

// // // 2. Import Controller yang belum punya route file sendiri (SPK & Laporan)
// // import { hitungSAW } from "../controllers/SPKController.js";
// // import { simpanLaporan, getLaporan, hapusLaporan } from "../controllers/LaporanController.js";

// // import { verifyToken } from "../middleware/authMiddleware.js";

// // const router = express.Router();

// // // --- GABUNGKAN SUB-ROUTES ---
// // // Artinya: route di authRoutes & bukuRoutes langsung dipakai di sini
// // router.use(authRoutes);
// // router.use(bukuRoutes);


// // // --- ROUTE SPK & LAPORAN ---
// // // (Masih manual di sini karena belum ada file spkRoutes.js / laporanRoutes.js)
// // router.get('/hitung-saw' , verifyToken, hitungSAW);

// // router.post('/laporan', verifyToken, simpanLaporan);
// // router.get('/laporan', verifyToken, getLaporan);
// // router.delete('/laporan/:id', verifyToken, hapusLaporan);

// // export default router;


// // // import express from "express";
// // // import { Login, Register } from "../controllers/AuthController.js";
// // // import { getBuku, getBukuById, createBuku, updateBuku, deleteBuku } from "../controllers/BukuController.js";
// // // import { simpanLaporan, getLaporan, hapusLaporan } from "../controllers/LaporanController.js";
// // // import { hitungSAW } from "../controllers/SPKController.js";
// // // // Import middleware cek login jika sudah ada
// // // // import { verifyToken } from "../middleware/authMiddleware.js"; 

// // // const router = express.Router();

// // // // --- Auth Routes ---
// // // router.post('/login', Login);
// // // router.post('/register', Register); // Buat controller register jika perlu

// // // // --- Buku Routes ---
// // // router.get('/buku', getBuku);
// // // router.get('/buku/:id', getBukuById); // Buat ambil data pas mau edit
// // // router.post('/buku', createBuku);
// // // router.patch('/buku/:id', updateBuku); // Pakai PATCH atau PUT buat update
// // // router.delete('/buku/:id', deleteBuku);

// // // // --- SPK Routes ---
// // // router.get('/hitung-saw', hitungSAW);   // Hitung SPK

// // // // --- ROUTE LAPORAN SIMPEL ---
// // // router.post('/laporan', simpanLaporan); // Buat nyimpen
// // // router.get('/laporan', getLaporan);     // Buat nampilin di tabel riwayat
// // // router.delete('/laporan/:id', hapusLaporan); // Buat hapus

// // // export default router;