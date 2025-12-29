import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database.js";
import router from "./routes/index.js"; // Pastikan route utama kamu ada di sini

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. MIDDLEWARE ---

// Izinkan Frontend (Vite) mengakses Backend ini
// Origin 'http://localhost:5173' adalah port default Vite. 
// Kalau port Vite kamu beda, sesuaikan di sini.
app.use(cors({
    origin: 'http://localhost:5173',
    'https://nama-project-frontend-kamu.vercel.app', 
    credentials: true
}));

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