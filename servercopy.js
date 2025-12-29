// import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();

/* =========================
   CORS — SUPER SIMPLE DULU
   ========================= */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://spk-bukufe.vercel.app"
  ],
  credentials: true,
}));

// ⚠️ INI PENTING DI VERCEL
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

/* =========================
   EXPORT UNTUK VERCEL
   ========================= */
export default app;
