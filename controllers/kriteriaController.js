import db from "../config/database.js";

// 1. AMBIL SEMUA DATA KRITERIA
export const getKriteria = async (req, res) => {
    try {
        // Kita urutkan berdasarkan ID biar rapi
        const [rows] = await db.query("SELECT * FROM kriteria ORDER BY id_kriteria ASC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// 2. TAMBAH KRITERIA BARU
export const createKriteria = async (req, res) => {
    // Ambil data yang dikirim dari Frontend
    const { kode_kriteria, nama_kriteria, atribut, bobot } = req.body;
    
    try {
        await db.query("INSERT INTO kriteria (kode_kriteria, nama_kriteria, atribut, bobot) VALUES (?, ?, ?, ?)", 
            [kode_kriteria, nama_kriteria, atribut, bobot]);
        res.status(201).json({msg: "Kriteria Berhasil Ditambahkan"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// 3. UPDATE KRITERIA
export const updateKriteria = async (req, res) => {
    const { kode_kriteria, nama_kriteria, atribut, bobot } = req.body;
    const { id } = req.params; // Ambil ID dari URL (misal: /kriteria/1)

    try {
        await db.query("UPDATE kriteria SET kode_kriteria=?, nama_kriteria=?, atribut=?, bobot=? WHERE id_kriteria=?", 
            [kode_kriteria, nama_kriteria, atribut, bobot, id]);
        res.json({msg: "Kriteria Berhasil Diupdate"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// 4. HAPUS KRITERIA
export const deleteKriteria = async (req, res) => {
    try {
        await db.query("DELETE FROM kriteria WHERE id_kriteria=?", [req.params.id]);
        res.json({msg: "Kriteria Berhasil Dihapus"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}