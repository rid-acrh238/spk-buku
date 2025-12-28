const fs = require("fs");
const path = require("path");

const structure = [
  "config",
  "controllers",
  "models",
  "routes",
  "middleware"
];

const files = {
  "config": ["database.js"],
  "controllers": [
    "AuthController.js",
    "BukuController.js",
    "SPKController.js"
  ],
  "models": [
    "User.js",
    "Buku.js",
    "Kriteria.js",
    "Nilai.js"
  ],
  "routes": [
    "authRoutes.js",
    "bukuRoutes.js"
  ],
  "middleware": ["authMiddleware.js"],
  ".": [".env", "server.js"]
};

function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }
}

// buat folder
structure.forEach(createDir);

// buat file
Object.entries(files).forEach(([folder, fileList]) => {
  fileList.forEach(file => {
    const filePath = folder === "."
      ? file
      : path.join(folder, file);
    createFile(filePath);
  });
});

console.log("✅ Struktur SPK Express API berhasil dibuat");
