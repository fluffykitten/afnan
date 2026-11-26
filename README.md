# Story Quest — Pulau Cerita (Narrative Text: Legend & Fable)

Aplikasi web pembelajaran interaktif berbasis **Deep Learning / Pembelajaran Mendalam** untuk siswa **SMP Kelas 9** (usia 13–15 tahun). Antarmuka menggunakan Bahasa Indonesia, sedangkan konten teks, soal, dan latihan cerita menggunakan Bahasa Inggris.

## Fitur Utama
1. **Profil Multi-Siswa & Avatar Kartun (SVG)**: Tersimpan di `localStorage` tanpa login/backend sehingga aman dipakai bergantian di perangkat kelas maupun PID.
2. **Apersepsi Pemantik**: Video YouTube (default `https://www.youtube.com/watch?v=5GhtevFmhxw`, bisa diubah dari Mode Guru atau `js/config.js`) dan pertanyaan pemantik *"Apa yang akan terjadi jika…?"*.
3. **Asesmen Awal Adaptif (10 Soal dari Bank 30 Soal)**: Menyesuaikan tingkat kesulitan soal secara dinamis dan memberikan label pulau rekomendasi tanpa melompati urutan pulau.
4. **Peta 6 Pulau Cerita (Berurutan)**:
   - **Pulau 1 (Pulau Tujuan)**: Tujuan komunikatif + bukti teks + mini-game pencocokan pasangan.
   - **Pulau 2 (Pulau Struktur)**: Schematic Structure + Story Map Drag & Drop digital.
   - **Pulau 3 (Pulau Hitung)**: Kalkulator proporsi kalimat/kata + grafik batang/donat Chart.js otomatis.
   - **Pulau 4 (Pulau Banding)**: Perbandingan Legend vs Fable (tabel & grafik) + Balapan Kuis dengan timer dan power-up (50:50, +15 detik).
   - **Pulau 5 (Pulau Evaluasi)**: Evaluasi peran tiap tahap + Detektif Fakta vs Opini (swipe kartu kiri/kanan).
   - **Pulau 6 (Pulau Kreator)**: Story Builder (kartu acak + template 4 tahap) + Presentasi Kelompok di Mode Papan Interaktif (PID).
5. **Boss Quiz (10 Soal HOTS per Pulau)** dengan pembahasan, progress bar, dan umpan balik *growth mindset*.
6. **Asesmen Akhir (10 Soal Sedang–Tinggi)** lengkap dengan predikat (*Sangat Baik*, *Baik*, *Cukup*, *Perlu Bimbingan*).
7. **Refleksi (4 Kalimat Rumpang)** tersimpan lokal + **Sertifikat Otomatis** (Unduh PDF via `html2pdf.js` dan Cetak).
8. **Gamifikasi & PWA**: XP, Level, Streak Harian, 14 Badge, Konfeti untuk nilai ≥ 90, Efek Suara Web Audio API + tombol Mute, Papan Peringkat Lokal, Mode PID (Layar Penuh & font besar), serta dukungan offline (`manifest.json` + `sw.js`).

## Struktur Proyek
- `index.html`, `manifest.json`, `sw.js`
- `css/style.css`
- `assets/icon-192.svg`, `assets/icon-512.svg`
- `data/texts.json` (6 teks naratif: 3 legend, 3 fable + item fakta/opini + kartu Story Builder)
- `data/questions.json` (90 soal: 30 `pretest`, 30 `hots`, 30 `posttest`)
- `data/badges.json` (14 badge)
- `js/config.js`, `js/storage.js`, `js/sound.js`, `js/gamification.js`, `js/quiz-engine.js`, `js/certificate.js`, `js/teacher.js`, `js/app.js`
- `js/games/*.js` (6 modul mini-game)

## Cara Menjalankan di Lokal
Karena aplikasi menggunakan ES Modules (`type="module"`) dan `fetch()` ke file JSON, jalankan lewat server HTTP lokal (bukan `file://`):

```bash
# Pilihan 1: Python
python -m http.server 8080

# Pilihan 2: Node.js
npx serve . -l 8080
```
Lalu buka `http://localhost:8080` di browser.

## Cara Mengubah Materi, Soal, Video, dan PIN Guru
- **Ganti PIN Guru & Pengaturan Default**: Edit `TEACHER_PIN` (default `1234`) dan `APERSEPSI_YOUTUBE_URL` di `js/config.js`. Guru juga bisa mengubah timer balapan kuis & link video langsung lewat tombol **Guru** di header.
- **Edit/Tambah Teks Cerita**: Edit `data/texts.json`. Setiap teks berisi `stages` (`Orientation`, `Complication`, `Evaluation`, `Resolution`, `Re-orientation`) yang otomatis dihitung oleh kalkulator proporsi.
- **Edit/Tambah Soal**: Edit `data/questions.json` pada bagian `pretest`, `hots`, atau `posttest`. Pastikan properti `answerIndex` dimulai dari `0` (A=0, B=1, C=2, D=3).

## Deploy ke GitHub Pages
1. Unggah seluruh isi folder proyek ini ke repositori GitHub.
2. Buka **Settings → Pages** pada repositori.
3. Pada **Source**, pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
4. Tunggu 1–2 menit hingga tautan GitHub Pages aktif. Aplikasi siap dipakai online maupun offline sebagai PWA!
