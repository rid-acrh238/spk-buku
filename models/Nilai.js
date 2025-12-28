import db from "../config/database.js";

export const NilaiModel = {
    // Ambil Data Lengkap untuk Perhitungan SAW (Join 3 Tabel)
    getMatrixLengkap: async () => {
        const sql = `
            SELECT n.id_buku, b.judul_buku, n.id_kriteria, k.nama_kriteria, k.atribut, k.bobot, n.nilai
            FROM nilai n
            JOIN buku b ON n.id_buku = b.id_buku
            JOIN kriteria k ON n.id_kriteria = k.id_kriteria
        `;
        const [rows] = await db.query(sql);
        return rows;
    },

    // Cari Nilai Max/Min per Kriteria (Untuk Normalisasi)
    getMinMax: async () => {
        const sql = `
            SELECT id_kriteria, MAX(nilai) as max_val, MIN(nilai) as min_val 
            FROM nilai GROUP BY id_kriteria
        `;
        const [rows] = await db.query(sql);
        return rows;
    },
    
    // Simpan/Update Nilai (Input Penilaian)
    upsert: async (id_buku, id_kriteria, nilai) => {
        // Cek dulu udah ada belum? Kalau ada Update, kalau belum Insert
        // Tapi biar simpel, kita hapus dulu lalu insert baru (teknik lazy)
        // Atau pakai ON DUPLICATE KEY UPDATE kalau key-nya unik
        
        const sql = "INSERT INTO nilai (id_buku, id_kriteria, nilai) VALUES (?, ?, ?)";
        return await db.query(sql, [id_buku, id_kriteria, nilai]);
    }
};