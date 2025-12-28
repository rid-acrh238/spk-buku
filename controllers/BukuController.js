// Import Model yang baru kita buat
import { BukuModel } from "../models/Buku.js";

// 1. AMBIL SEMUA BUKU
export const getBuku = async (req, res) => {
    try {
        const buku = await BukuModel.getAll();
        res.json(buku);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Gagal mengambil data buku" });
    }
}

// 2. AMBIL 1 BUKU (BY ID)
export const getBukuById = async (req, res) => {
    try {
        const buku = await BukuModel.getById(req.params.id);
        
        // Cek apakah buku ditemukan?
        if (!buku) return res.status(404).json({ msg: "Buku tidak ditemukan" });
        
        res.json(buku);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 3. TAMBAH BUKU
export const createBuku = async (req, res) => {
    // Validasi sederhana (Wajib isi Judul & Penulis)
    if(!req.body.judul_buku || !req.body.penulis) {
        return res.status(400).json({ msg: "Judul dan Penulis wajib diisi" });
    }

    try {
        await BukuModel.create(req.body);
        res.status(201).json({ msg: "Buku Berhasil Ditambahkan" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 4. UPDATE BUKU
export const updateBuku = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await BukuModel.update(id, req.body);

        // Cek affectedRows. Jika 0 berarti ID tidak ada di database
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Gagal update, ID buku tidak ditemukan" });
        }

        res.json({ msg: "Buku Berhasil Diupdate" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 5. HAPUS BUKU
export const deleteBuku = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await BukuModel.delete(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Data tidak ditemukan atau sudah dihapus" });
        }

        res.json({ msg: "Buku Berhasil Dihapus" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// import db from "../config/database.js";
// import { BukuModel } from "../models/Buku.js";
// // 1. AMBIL SEMUA BUKU
// export const getBuku = async (req, res) => {
//     try {
//         // SELECT * FROM buku ORDER BY id_buku DESC (Biar data terbaru diatas)
//         const [rows] = await db.query("SELECT * FROM buku ORDER BY id_buku DESC");
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: error.message });
//     }
// }

// // 2. AMBIL 1 BUKU BERDASARKAN ID (Buat form Edit)
// export const getBukuById = async (req, res) => {
//     try {
//         const [rows] = await db.query("SELECT * FROM buku WHERE id_buku = ?", [req.params.id]);
        
//         if (rows.length === 0) return res.status(404).json({ msg: "Data tidak ditemukan" });
        
//         res.json(rows[0]);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// }

// // 3. TAMBAH BUKU BARU
// export const createBuku = async (req, res) => {
//     const { judul_buku, penulis, penerbit, tahun_terbit, stok } = req.body;
    
//     try {
//         const sql = "INSERT INTO buku (judul_buku, penulis, penerbit, tahun_terbit, stok) VALUES (?, ?, ?, ?, ?)";
//         const values = [judul_buku, penulis, penerbit, tahun_terbit, stok];
        
//         await db.query(sql, values);
        
//         res.status(201).json({ msg: "Buku Berhasil Ditambahkan" });
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// }

// // 4. UPDATE BUKU
// export const updateBuku = async (req, res) => {
//     const { judul_buku, penulis, penerbit, tahun_terbit, stok } = req.body;
//     const { id } = req.params; // Ambil ID dari URL

//     try {
//         const sql = "UPDATE buku SET judul_buku=?, penulis=?, penerbit=?, tahun_terbit=?, stok=? WHERE id_buku=?";
//         const values = [judul_buku, penulis, penerbit, tahun_terbit, stok, id];

//         const [result] = await db.query(sql, values);

//         if (result.affectedRows === 0) return res.status(404).json({ msg: "Gagal update, ID tidak ditemukan" });

//         res.json({ msg: "Data Buku Berhasil Diupdate" });
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// }

// // 5. HAPUS BUKU
// export const deleteBuku = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const [result] = await db.query("DELETE FROM buku WHERE id_buku = ?", [id]);

//         if (result.affectedRows === 0) return res.status(404).json({ msg: "Data tidak ditemukan" });

//         res.json({ msg: "Buku Berhasil Dihapus" });
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// }