import mysql from 'mysql2/promise'; // PENTING: Pakai versi promise
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'spk_pemilihan_buku',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Cek koneksi (Opsional, buat debug aja)
try {
    const connection = await db.getConnection();
    console.log("Database Connected via Pool!");
    connection.release(); // Jangan lupa balikin koneksi ke kolam (pool)
} catch (error) {
    console.error("Database Error:", error);
}

export default db;