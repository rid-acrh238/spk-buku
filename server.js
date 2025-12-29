import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Pastikan install: npm install cookie-parser
import db from "./config/database.js";
import router from "./routes/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// --- 1. SETTING CORS (VERSI AMAN VERCEL) ---
// Kita deklarasikan dulu whitelist domainnya
const allowedOrigins = [
    'http://localhost:5173',               // Localhost Frontend
    'https://spk-frontend-eta.vercel.app', // Domain Vercel Frontend Kamu
    'http://localhost:5000',
    'https://spk-bukufe.vercel.app'                // Localhost Backend (Jaga-jaga)
];

const corsOptions = {
    origin: function (origin, callback) {
        // !origin = request dari server-to-server atau tools kayak Postman (kita izinkan)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin); // Bantu debug di log Vercel
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Izinkan cookie/token lewat
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Izinkan method ini
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// Pasang CORS di urutan PERTAMA middleware
// app.use(cors(corsOptions)) otomatis menangani Preflight Request (OPTIONS).
// Jadi kita TIDAK BUTUH app.options('/(.*)', ...) yang bikin error regex kemarin.
app.use(cors(corsOptions));


// --- 2. MIDDLEWARE LAINNYA ---
app.use(cookieParser()); // Wajib buat baca cookie refresh token
app.use(express.json({ limit: '10mb' })); // Limit besar buat upload gambar
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// --- 3. ROUTING ---
app.use(router);

// Route Root (Opsional, buat ngecek server nyala atau nggak di browser)
app.get('/', (req, res) => {
    res.send('Backend SPK Berjalan! 🚀');
});


// --- 4. CEK DATABASE (Opsional) ---
(async () => {
    try {
        const connection = await db.getConnection();
        console.log("✅ Database Connected Successfully!");
        connection.release();
    } catch (error) {
        console.error("❌ Database Connection Failed:", error.message);
    }
})();


// --- 5. JALANKAN SERVER ---

// PENTING: Logic ini membedakan Localhost vs Vercel
if (process.env.NODE_ENV !== 'production') {
    // Kalau di Laptop (Localhost), kita butuh app.listen
    app.listen(PORT, () => {
        console.log(`🚀 Server running locally on port ${PORT}`);
    });
}

// TAPI DI VERCEL, KITA WAJIB EXPORT APP
export default app;