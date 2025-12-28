import db from "../config/database.js";

export const BukuModel = {
    // 1. Ambil Semua Data
    getAll: async () => {
        const sql = "SELECT * FROM buku ORDER BY id_buku DESC";
        const [rows] = await db.query(sql);
        return rows;
    },

    // 2. Ambil Satu Data (Untuk Edit)
    getById: async (id) => {
        const sql = "SELECT * FROM buku WHERE id_buku = ?";
        const [rows] = await db.query(sql, [id]);
        return rows[0]; // Mengembalikan object buku atau undefined
    },

    // 3. Tambah Data
    create: async (data) => {
        const { judul_buku, penulis, penerbit, tahun_terbit, stok } = data;
        const sql = "INSERT INTO buku (judul_buku, penulis, penerbit, tahun_terbit, stok) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.query(sql, [judul_buku, penulis, penerbit, tahun_terbit, stok]);
        return result;
    },

    // 4. Update Data
    update: async (id, data) => {
        const { judul_buku, penulis, penerbit, tahun_terbit, stok } = data;
        const sql = "UPDATE buku SET judul_buku=?, penulis=?, penerbit=?, tahun_terbit=?, stok=? WHERE id_buku=?";
        const [result] = await db.query(sql, [judul_buku, penulis, penerbit, tahun_terbit, stok, id]);
        return result;
    },

    // 5. Hapus Data
    delete: async (id) => {
        const sql = "DELETE FROM buku WHERE id_buku = ?";
        const [result] = await db.query(sql, [id]);
        return result;
    }
};


// import db from "../config/database.js";

// export const BukuModel = {
//     // Ambil semua data
//     getAll: async () => {
//         const sql = "SELECT * FROM buku ORDER BY id_buku DESC";
//         const [rows] = await db.query(sql);
//         return rows;
//     },

//     // Ambil satu data (untuk Edit)
//     getById: async (id) => {
//         const sql = "SELECT * FROM buku WHERE id_buku = ?";
//         const [rows] = await db.query(sql, [id]);
//         return rows[0];
//     },

//     // Tambah data
//     create: async (data) => {
//         const { judul_buku, penulis, penerbit, tahun_terbit, stok } = data;
//         const sql = "INSERT INTO buku (judul_buku, penulis, penerbit, tahun_terbit, stok) VALUES (?, ?, ?, ?, ?)";
//         const [result] = await db.query(sql, [judul_buku, penulis, penerbit, tahun_terbit, stok]);
//         return result;
//     },

//     // Update data
//     update: async (id, data) => {
//         const { judul_buku, penulis, penerbit, tahun_terbit, stok } = data;
//         const sql = "UPDATE buku SET judul_buku=?, penulis=?, penerbit=?, tahun_terbit=?, stok=? WHERE id_buku=?";
//         const [result] = await db.query(sql, [judul_buku, penulis, penerbit, tahun_terbit, stok, id]);
//         return result;
//     },

//     // Hapus data
//     delete: async (id) => {
//         const sql = "DELETE FROM buku WHERE id_buku = ?";
//         const [result] = await db.query(sql, [id]);
//         return result;
//     }
// };