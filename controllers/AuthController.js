import { UserModel } from "../models/User.js"; // Pakai Model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// LOGIN
export const Login = async (req, res) => {
    try {
        console.log("📥 Data masuk:", req.body);
        const user = await UserModel.findAll({ where: { username: req.body.username } });
         console.log("🔍 Hasil cari di DB:", user); 
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Password Salah"});
        console.log("❌ Password Salah!");
        
        
        const userId = user[0].id_user;
        const username = user[0].username;
        const nama = user[0].nama_lengkap;

        // 1. Access Token (Pendek)
        const accessToken = jwt.sign({userId, username, nama}, process.env.ACCESS_TOKEN_SECRET || "rahasia_negara_api", {
            expiresIn: '20s' 
        });

        // 2. Refresh Token (Panjang)
        const refreshToken = jwt.sign({userId, username, nama}, process.env.REFRESH_TOKEN_SECRET || "rahasia_refresh_api", {
            expiresIn: '1d'
        });

        // BEDANYA DISINI: Kita GAK simpan token ke database
        // await UserModel.update(...) <-- HAPUS BAGIAN INI

        // 3. Kirim Refresh Token via Cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 Hari
            // secure: true (kalau https)
        });

        res.json({ accessToken });

    } catch (error) {
        res.status(404).json({msg:"Username tidak ditemukan"});
    }
}

// LOGOUT
export const Logout = async (req, res) => {
    // Cukup hapus cookie di browser aja
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

// MINTA TOKEN BARU
export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);

        // BEDANYA DISINI: Kita gak perlu cek ke Database apakah tokennya ada di kolom refresh_token
        // Langsung verifikasi aja tanda tangannya
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "rahasia_refresh_api", (err, decoded) => {
            if(err) return res.sendStatus(403);
            
            // Kalau valid, kita ambil data user terbaru (opsional, biar datanya fresh)
            // Atau langsung pakai data dari decoded token juga boleh biar irit query
            const userId = decoded.userId;
            const username = decoded.username;
            const nama = decoded.nama;

            const accessToken = jwt.sign({userId, username, nama}, process.env.ACCESS_TOKEN_SECRET || "rahasia_negara_api", {
                expiresIn: '20s'
            });
            
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}


export const Register = async (req, res) => {
    try {
        // Kita HAPUS 'confPassword' dari sini
        const { nama_lengkap, username, password } = req.body;
        
        // HAPUS validasi password match yang bikin error
        // if(password !== confPassword) return res.status(400).json({msg: "Password tidak cocok"});
        
        // Cek username duplikat via Model
        const existingUser = await UserModel.findByUsername(username);
        if(existingUser) return res.status(400).json({msg: "Username sudah dipakai, ganti yang lain"});

        // Enkripsi Password
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Create via Model
        await UserModel.create({ nama_lengkap, username, password: hashPassword });

        res.json({msg: "Register Berhasil"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
}

// import db from "../config/database.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// // 1. FUNGSI LOGIN
// export const Login = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Validasi input kosong
//         if (!username || !password) {
//             return res.status(400).json({ msg: "Username dan Password wajib diisi" });
//         }

//         // Cek User di Database
//         const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        
//         // Jika user tidak ditemukan
//         if (users.length === 0) {
//             return res.status(404).json({ msg: "Username tidak ditemukan" });
//         }

//         const user = users[0];

//         // Cek Password (Bandingkan input user dengan hash di DB)
//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             return res.status(400).json({ msg: "Password Salah" });
//         }

//         // Jika Login Sukses, Buat Token JWT
//         const userId = user.id_user;
//         const nama = user.nama_lengkap;
        
//         // Token akan kadaluarsa dalam 1 hari
//         const accessToken = jwt.sign({ userId, nama, username }, process.env.JWT_SECRET, {
//             expiresIn: '1d' 
//         });

//         // Kirim respon ke Frontend
//         res.json({
//             status: "success",
//             msg: "Login Berhasil",
//             token: accessToken,
//             user: {
//                 nama: nama,
//                 username: user.username
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: "Terjadi kesalahan server saat login" });
//     }
// }

// // 2. FUNGSI REGISTER (Opsional, buat bikin user admin baru)
// export const Register = async (req, res) => {
//     try {
//         const { nama_lengkap, username, password, confPassword } = req.body;

//         // Validasi Password Match
//         if(password !== confPassword) {
//             return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
//         }

//         // Cek apakah username sudah ada
//         const [cekUser] = await db.query("SELECT username FROM users WHERE username = ?", [username]);
//         if(cekUser.length > 0) {
//             return res.status(400).json({msg: "Username sudah digunakan, cari yang lain"});
//         }

//         // Enkripsi Password
//         const salt = await bcrypt.genSalt();
//         const hashPassword = await bcrypt.hash(password, salt);

//         // Masukkan ke Database
//         await db.query("INSERT INTO users (nama_lengkap, username, password) VALUES (?, ?, ?)", 
//             [nama_lengkap, username, hashPassword]);

//         res.json({msg: "Register Berhasil"});

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({msg: "Gagal Register"});
//     }
// }

// // 3. FUNGSI ME (Cek User Login) - Opsional buat validasi token di frontend
// export const Me = async (req, res) => {
//     // Fungsi ini biasanya dipanggil frontend untuk memastikan token masih valid
//     // Data user diambil dari middleware (req.userId) nanti
//     try {
//         const [users] = await db.query("SELECT id_user, nama_lengkap, username FROM users WHERE id_user = ?", [req.userId]);
//         if(!users[0]) return res.status(404).json({msg: "User tidak ditemukan"});
        
//         res.json(users[0]);
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }