import db from "../config/database.js";

export const hitungSAW = async (req, res) => {
    try {
        // 1. AMBIL KRITERIA (Buat tau bobot & atribut Cost/Benefit)
        const [kriteria] = await db.query("SELECT * FROM kriteria");
        
        // Buat Dictionary Kriteria biar gampang akses bobotnya
        // Format: { 1: {atribut: 'benefit', bobot: 0.2}, 2: ... }
        const kriteriaMap = {};
        kriteria.forEach(k => {
            kriteriaMap[k.id_kriteria] = { atribut: k.atribut, bobot: k.bobot };
        });

        // 2. CARI NILAI MAX & MIN PER KRITERIA (Untuk Rumus Normalisasi)
        const [minMax] = await db.query(`
            SELECT 
                id_kriteria, 
                MAX(nilai) as max_val, 
                MIN(nilai) as min_val 
            FROM nilai 
            GROUP BY id_kriteria
        `);
        
        const statsMap = {};
        minMax.forEach(s => {
            statsMap[s.id_kriteria] = { max: s.max_val, min: s.min_val };
        });

        // 3. AMBIL DATA NILAI MATRIX LENGKAP
        const [dataNilai] = await db.query(`
            SELECT n.id_buku, b.judul_buku, b.penulis, n.id_kriteria, n.nilai
            FROM nilai n
            JOIN buku b ON n.id_buku = b.id_buku
        `);

        // 4. HITUNG NORMALISASI (R) & PREFERENSI (V)
        // Kita kelompokkan data per buku dulu
        let hasilSementara = {};

        dataNilai.forEach(row => {
            const { id_buku, judul_buku, penulis, id_kriteria, nilai } = row;
            
            // Ambil info kriteria
            const infoKriteria = kriteriaMap[id_kriteria];
            const infoStats = statsMap[id_kriteria];

            if(!infoKriteria || !infoStats) return; // Skip kalau data gak lengkap

            // --- RUMUS SAW ---
            let normalisasi = 0;
            if (infoKriteria.atribut === 'benefit') {
                // Rumus Benefit: Nilai / Max
                normalisasi = nilai / infoStats.max;
            } else {
                // Rumus Cost: Min / Nilai
                normalisasi = infoStats.min / nilai;
            }

            // Hitung Poin Terbobot (Normalisasi x Bobot)
            const poin = normalisasi * infoKriteria.bobot;

            // Masukkan ke object hasil
            if (!hasilSementara[id_buku]) {
                hasilSementara[id_buku] = {
                    id_buku,
                    judul_buku,
                    penulis,
                    total_nilai: 0,
                    detail: [] // Opsional: kalau mau liat rincian
                };
            }
            hasilSementara[id_buku].total_nilai += poin;
            hasilSementara[id_buku].detail.push({ id_kriteria, normalisasi, poin });
        });

        // 5. UBAH KE ARRAY & SORTING (Ranking Tertinggi ke Terendah)
        const ranking = Object.values(hasilSementara)
            .sort((a, b) => b.total_nilai - a.total_nilai)
            .map((item, index) => ({
                rank: index + 1,
                ...item,
                total_nilai: item.total_nilai.toFixed(4) // Bulatkan 4 desimal
            }));

        res.json({
            status: "success",
            data: ranking
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Gagal menghitung SAW: " + error.message });
    }
}