import mysql from "mysql2/promise";

// KITA LANGSUNG TULIS DISINI (JANGAN PAKAI process.env DULU)
const db = mysql.createPool({
    // host: '127.0.0.1',      // <--- KUNCI KEBERHASILAN (Jangan localhost)
    // user: 'root',           // User default XAMPP
    // password: '123',           // Password default XAMPP (biasanya kosong)
    // database: 'spk_pemilihan_buku', // <--- CEK EJAAN INI DI PHPMYADMIN
    // port: 3306,             // Cek di XAMPP, port 3306 atau 3307?
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0,
    // connectTimeout: 10000   // Kita set 10 detik aja, jangan lama-lama

    host: process.env.DB_HOST || '127.0.0.1', 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'spk_pemilihan_buku',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // SSL Wajib buat TiDB, tapi Error buat XAMPP.
    // Kita aktifkan SSL CUMA kalau lagi di Vercel (DB_HOST bukan localhost)
    ssl: process.env.DB_HOST ? {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    } : undefined
});


// Kita pasang "CCTV" biar tau konek atau nggak
const cekKoneksi = async () => {
    try {
        const connection = await db.getConnection();
        console.log("✅ ALHAMDULILLAH! Database XAMPP Konek Pakai 127.0.0.1");
        connection.release();
    } catch (error) {
        console.error("❌ MASIH GAGAL! Cek Pesan Error Ini:");
        console.error("👉 Code:", error.code);
        console.error("👉 Message:", error.message);
    }
};

cekKoneksi(); // Jalankan pengecekan saat server nyala

export default db;



// import mysql from "mysql2/promise";
// import dotenv from "dotenv";
// dotenv.config();

// const db = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASS || '',
//     database: process.env.DB_NAME || 'spk_pemilihan_buku',
//     port: process.env.DB_PORT || 5000,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//     // ssl: {
//     //     minVersion: 'TLSv1.2',
//     //     rejectUnauthorized: true
//     // }
// });

// export default db;

// import mysql from 'mysql2/promise'; // PENTING: Pakai versi promise
// import dotenv from 'dotenv';
// dotenv.config();

// const db = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASS || '',
//     database: process.env.DB_NAME || 'spk_pemilihan_buku',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// // Cek koneksi (Opsional, buat debug aja)
// try {
//     const connection = await db.getConnection();
//     console.log("Database Connected via Pool!");
//     connection.release(); // Jangan lupa balikin koneksi ke kolam (pool)
// } catch (error) {
//     console.error("Database Error:", error);
// }

// export default db;