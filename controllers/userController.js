import db from "../config/database.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

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

// UPDATE USER (Dengan Cloudinary)
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nama_lengkap, username, password, avatar } = req.body; // Avatar isinya Base64 string
    
    try {
        let finalAvatarUrl = null;

        // 1. Jika ada avatar base64 dikirim, Upload ke Cloudinary
        if (avatar && avatar.startsWith('data:image')) {
            try {
                const uploadRes = await cloudinary.uploader.upload(avatar, {
                    folder: 'spk-buku-users', // Nama folder di Cloudinary
                    resource_type: 'image'
                });
                finalAvatarUrl = uploadRes.secure_url; // Ambil URL asli (https://...)
            } catch (err) {
                console.error("Gagal Upload Cloudinary:", err);
                return res.status(500).json({msg: "Gagal upload gambar ke server cloud"});
            }
        } else {
            // Kalau tidak ganti gambar, pakai yang lama (bisa handle di frontend/disini)
            finalAvatarUrl = avatar; 
        }

        // 2. Siapkan Query Database
        let query = "UPDATE users SET nama_lengkap=?, username=?";
        let params = [nama_lengkap, username];

        if (finalAvatarUrl) {
            query += ", avatar=?";
            params.push(finalAvatarUrl);
        }

        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);
            query += ", password=?";
            params.push(hashPassword);
        }

        query += " WHERE id_user=?";
        params.push(id);

        await db.query(query, params);
        
        // Kirim balik URL baru ke frontend biar langsung update
        res.json({msg: "Data User Berhasil Diupdate", avatar: finalAvatarUrl});

    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY') return res.status(400).json({msg: "Username sudah dipakai!"});
        res.status(500).json({msg: error.message});
    }
};
// EDIT USER (Bisa Ganti Nama, Username, & Password)
// export const updateUser = async (req, res) => {
//     const { id } = req.params;
//     const { nama_lengkap, username, password } = req.body;
    
//     try {
//         // Cek dulu user lama
//         const [oldUser] = await db.query("SELECT * FROM users WHERE id_user = ?", [id]);
//         if(oldUser.length === 0) return res.status(404).json({msg: "User tidak ditemukan"});

//         let query = "UPDATE users SET nama_lengkap=?, username=?";
//         let params = [nama_lengkap, username];

//         // LOGIC PENTING:
//         // Kalau password diisi, kita encrypt dan update.
//         // Kalau kosong/null, kita JANGAN update passwordnya.
//         if (password && password.trim() !== "") {
//             const salt = await bcrypt.genSalt();
//             const hashPassword = await bcrypt.hash(password, salt);
//             query += ", password=?";
//             params.push(hashPassword);
//         }

//         query += " WHERE id_user=?";
//         params.push(id);

//         await db.query(query, params);
//         res.json({msg: "Data User Berhasil Diupdate"});
//     } catch (error) {
//         // Handle error kalau username kembar
//         if(error.code === 'ER_DUP_ENTRY') {
//             return res.status(400).json({msg: "Username sudah dipakai user lain!"});
//         }
//         res.status(500).json({msg: error.message});
//     }
// };


// HAPUS USER
export const deleteUser = async (req, res) => {
    try {
        await db.query("DELETE FROM users WHERE id_user=?", [req.params.id]);
        res.json({msg: "User Dihapus"});
    } catch (error) { res.status(500).json({msg: error.message}); }
}