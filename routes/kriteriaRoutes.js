import express from "express";
import { getKriteria, createKriteria, updateKriteria, deleteKriteria } from "../controllers/KriteriaController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route Buku
router.get('/kriteria', verifyToken, getKriteria);
router.post('/kriteria', verifyToken, createKriteria);
router.put('/kriteria/:id', verifyToken, updateKriteria); // Pakai PUT/PATCH bebas
router.delete('/kriteria/:id', verifyToken, deleteKriteria);

export default router;