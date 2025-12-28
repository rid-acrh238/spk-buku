import db from "../config/database.js";

export const KriteriaModel = {
    getAll: async () => {
        const sql = "SELECT * FROM kriteria ORDER BY id_kriteria ASC";
        const [rows] = await db.query(sql);
        return rows;
    },

    create: async (data) => {
        const { kode_kriteria, nama_kriteria, atribut, bobot } = data;
        const sql = "INSERT INTO kriteria (kode_kriteria, nama_kriteria, atribut, bobot) VALUES (?, ?, ?, ?)";
        return await db.query(sql, [kode_kriteria, nama_kriteria, atribut, bobot]);
    },
    
    // Nanti bisa tambah update/delete jika perlu
};