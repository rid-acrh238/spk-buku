import db from "../config/database.js";
import bcrypt from "bcryptjs";

// AMBIL USER (Kecuali password)
export const getUsers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id_user, nama_lengkap, username, created_at FROM users");
        res.json(rows);
    } catch (error) { res.status(500).json({msg: error.message}); }
}

// TAMBAH USER (Register Admin Baru)
export const createUser = async (req, res) => {
    const { nama_lengkap, username, password } = req.body;
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        await db.query("INSERT INTO users (nama_lengkap, username, password) VALUES (?, ?, ?)", 
            [nama_lengkap, username, hashPassword]);
        res.json({msg: "User Berhasil Ditambahkan"});
    } catch (error) { res.status(500).json({msg: error.message}); }
}

// ... import yang sudah ada ...

// UPDATE PROFILE (Nama, Password, Avatar)
export const updateProfile = async (req, res) => {
const { id } = req.params; // Ambil ID dari URL
    const { nama_lengkap, password, avatar } = req.body;
    
    try {
        let query = "UPDATE users SET nama_lengkap=?, avatar=?";
        let params = [nama_lengkap, avatar];

        if (password) {
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);
            query += ", password=?";
            params.push(hashPassword);
        }

        query += " WHERE id_user=?";
        params.push(id);

        await db.query(query, params);
        res.json({msg: "Profil Diupdate"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
};


// HAPUS USER
export const deleteUser = async (req, res) => {
    try {
        await db.query("DELETE FROM users WHERE id_user=?", [req.params.id]);
        res.json({msg: "User Dihapus"});
    } catch (error) { res.status(500).json({msg: error.message}); }
}