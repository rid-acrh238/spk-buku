import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // 1. Ambil Header Authorization
    const authHeader = req.headers['authorization'];
    
    // 2. Ambil tokennya saja (Format: "Bearer <token>")
    const token = authHeader && authHeader.split(' ')[1];

    // 3. Kalau tidak ada token, tendang!
    if(token == null) return res.status(401).json({msg: "Akses Ditolak: Anda belum login!"});

    // 4. Cek keaslian token
    // Pastikan 'rahasia_negara_api' SAMA PERSIS dengan secret key di AuthController saat Login
    // Disarankan pakai process.env.ACCESS_TOKEN_SECRET biar aman
    const secretKey = process.env.ACCESS_TOKEN_SECRET || "rahasia_negara_api";

    jwt.verify(token, secretKey, (err, decoded) => {
        if(err) return res.status(403).json({msg: "Token Invalid atau Kadaluarsa"});
        
        // 5. Kalau valid, simpan email/username ke dalam request
        // Biar controller selanjutnya tau siapa yang lagi akses
        req.username = decoded.username; 
        
        next(); // Lanjut ke Controller tujuan
    });
}