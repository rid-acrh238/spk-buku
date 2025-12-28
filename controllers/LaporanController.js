import db from "../config/database.js";

// 1. SIMPAN LAPORAN
export const simpanLaporan = async (req, res) => {
    // Ambil data dari Frontend
    // keterangan: "Laporan Januari"
    // hasilRanking: Array object hasil hitungan SAW tadi
    const { keterangan, hasilRanking } = req.body;

    try {
        // Trik: Array Object diubah jadi String JSON
        const jsonString = JSON.stringify(hasilRanking);

        const sql = "INSERT INTO laporan (keterangan, data_json) VALUES (?, ?)";
        await db.query(sql, [keterangan, jsonString]);

        res.json({ msg: "Laporan berhasil disimpan!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Gagal simpan laporan" });
    }
}

// 2. LIHAT SEMUA LAPORAN
export const getLaporan = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM laporan ORDER BY tanggal DESC");
        
        // Data di database kan bentuknya String, kita balikin jadi JSON beneran
        // Biar Frontend enak bacanya
        const dataRapih = rows.map(item => ({
            ...item,
            data_json: JSON.parse(item.data_json) // Magic happens here
        }));

        res.json(dataRapih);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error ambil data" });
    }
}

// 3. HAPUS LAPORAN
export const hapusLaporan = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM laporan WHERE id_laporan = ?", [id]);
        res.json({ msg: "Laporan dihapus" });
    } catch (error) {
        res.status(500).json({ msg: "Gagal hapus" });
    }
}