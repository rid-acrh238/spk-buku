import express from "express";
// Perhatikan huruf 'u' kecil di awal, sesuai tree folder kamu
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js"; 
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route User (CRUD)
router.get('/users', verifyToken, getUsers);
router.post('/users', verifyToken, createUser);
router.put('/users/:id', verifyToken, updateUser);
router.delete('/users/:id', verifyToken, deleteUser);

export default router;

// import express from "express";
// import { getUsers, createUser, updateUser, deleteUser } from "../controllers/UserController.js";
// import { verifyToken } from "../middleware/authMiddleware.js";
// const router = express.Router();

// // Route User (CRUD)
// router.get('/users', verifyToken, getUsers);
// router.post('/users', verifyToken, createUser);
// router.put('/users/:id', verifyToken, updateUser);
// router.delete('/users/:id', verifyToken, deleteUser);

// export default router;