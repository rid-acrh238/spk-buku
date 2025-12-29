import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database.js";
import router from "./routes/index.js"; // Pastikan route utama kamu ada di sini

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();


// --- SETTING CORS BARU ---
// Kita pakai origin function biar dinamis dan aman
app.use(cors({
    origin: function (origin, callback) {
        // Izinkan request dari mana saja (asal bukan bot aneh)
        // atau izinkan jika originnya sesuai link frontend kamu
        const allowedOrigins = [
            'http://localhost:5173', 
            'https://spk-frontend-eta.vercel.app'
        ];
        
        // !origin artinya request dari server-to-server (bukan browser), kita izinkan
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Izinkan cookie/token
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// MENANGANI PREFLIGHT REQUEST (PENTING BUAT VERCEL)
app.options('*', cors()); 

// ... lanjut middleware express.json dll ...



// --- 1. MIDDLEWARE ---

// Izinkan Frontend (Vite) mengakses Backend ini
// Origin 'http://localhost:5173' adalah port default Vite. 
// Kalau port Vite kamu beda, sesuaikan di sini.
// app.use(cors({
//     origin: [
//         'http://localhost:5173', 
//         'https://spk-frontend-eta.vercel.app' // 
//     ], 
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));

// app.use(cors({
//     // Izinkan Frontend Vercel DAN Localhost
//     origin: true, 
//     credentials: true
// }));

// Agar backend bisa membaca data JSON yang dikirim dari Frontend
// app.use(express.json());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// --- 2. ROUTING ---

// Gunakan semua route yang sudah kita definisikan di routes/index.js
app.use(router);


// --- 3. CEK KONEKSI DATABASE (Opsional tapi Bagus) ---

const testConnection = async () => {
    try {
        // Coba minta satu koneksi dari pool
        const connection = await db.getConnection();
        console.log("✅ Database Connected Successfully!");
        connection.release(); // Kembalikan koneksi ke pool
    } catch (error) {
        console.error("❌ Database Connection Failed:", error.message);
    }
};

testConnection();


// --- 4. JALANKAN SERVER ---

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running locally on port ${PORT}`);
    });
}