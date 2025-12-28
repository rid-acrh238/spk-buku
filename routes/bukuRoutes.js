import express from "express";
import { 
    getBuku, 
    getBukuById, 
    createBuku, 
    updateBuku, 
    deleteBuku 
} from "../controllers/BukuController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route Buku
router.get('/buku', verifyToken, getBuku);           // Ambil semua buku
router.get('/buku/:id', verifyToken, getBukuById);   // Ambil 1 buku (buat edit)
router.post('/buku', verifyToken, createBuku);       // Tambah buku
router.patch('/buku/:id', verifyToken, updateBuku);  // Update buku (Pakai PATCH atau PUT)
router.delete('/buku/:id', verifyToken, deleteBuku); // Hapus buku

export default router;