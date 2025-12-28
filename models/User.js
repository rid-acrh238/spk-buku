import db from "../config/database.js";

export const UserModel = {
    // Cari user by Username
    findByUsername: async (username) => {
        const sql = "SELECT * FROM users WHERE username = ?";
        const [rows] = await db.query(sql, [username]);
        return rows[0];
    },

    // Buat User Baru
    create: async (data) => {
        const { nama_lengkap, username, password } = data;
        const sql = "INSERT INTO users (nama_lengkap, username, password) VALUES (?, ?, ?)";
        return await db.query(sql, [nama_lengkap, username, password]);
    }
};

// import db from "../config/database.js";

// export const UserModel = {
//     // Cari user berdasarkan username (Untuk Login)
//     getByUsername: async (username) => {
//         const sql = "SELECT * FROM users WHERE username = ?";
//         const [rows] = await db.query(sql, [username]);
//         return rows[0]; // Kembalikan objek user pertama (atau undefined)
//     },

//     // Tambah user baru (Untuk Register)
//     create: async (data) => {
//         const { nama_lengkap, username, password } = data;
//         const sql = "INSERT INTO users (nama_lengkap, username, password) VALUES (?, ?, ?)";
//         const [result] = await db.query(sql, [nama_lengkap, username, password]);
//         return result;
//     },

//     // Cari user berdasarkan ID (Opsional, buat profil)
//     getById: async (id) => {
//         const sql = "SELECT id_user, nama_lengkap, username FROM users WHERE id_user = ?";
//         const [rows] = await db.query(sql, [id]);
//         return rows[0];
//     }
// };