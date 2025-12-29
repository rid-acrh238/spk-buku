import db from "../config/database.js";

// 1. AMBIL NILAI SPESIFIK SATU BUKU (Buat ditampilkan di form edit)
export const getNilaiByBuku = async (req, res) => {
    const { id_buku } = req.params;
    try {
        // Kita join biar tau nama kriterianya juga
        const query = `
            SELECT k.id_kriteria, k.nama_kriteria, k.kode_kriteria, COALESCE(n.nilai, 0) as nilai 
            FROM kriteria k 
            LEFT JOIN nilai n ON k.id_kriteria = n.id_kriteria AND n.id_buku = ?
        `;
        const [rows] = await db.query(query, [id_buku]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: error.message});
    }
};

// 2. SIMPAN / UPDATE NILAI (Logic "Upsert")
export const updateNilaiBuku = async (req, res) => {
    const { id_buku } = req.params;
    const { nilai_data } = req.body; // Array [{id_kriteria: 1, nilai: 90}, ...]

    try {
        // Kita loop inputan dari frontend
        for (let item of nilai_data) {
            // Gunakan Syntax MySQL "INSERT ... ON DUPLICATE KEY UPDATE"
            // Artinya: Kalau belum ada -> Insert. Kalau sudah ada -> Update.
            const query = `
                INSERT INTO nilai (id_buku, id_kriteria, nilai) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)
            `;
            await db.query(query, [id_buku, item.id_kriteria, item.nilai]);
        }
        res.json({msg: "Penilaian berhasil disimpan!"});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "Gagal menyimpan nilai"});
    }
};