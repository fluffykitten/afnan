/**
 * Konfigurasi global aplikasi Story Quest.
 * Guru dapat mengubah PIN, link video YouTube apersepsi, atau durasi timer di sini.
 */
export const CONFIG = {
  APP_NAME: 'Story Quest: Pulau Cerita',
  SUBJECT: 'Bahasa Inggris SMP Kelas 9 — Narrative Text (Legend & Fable)',
  TEACHER_PIN: '1234',
  APERSEPSI_YOUTUBE_URL: 'https://www.youtube.com/watch?v=5GhtevFmhxw',
  DEFAULT_BGM_YOUTUBE_URL: 'https://www.youtube.com/watch?v=AF6pUQkENoY',
  DEFAULT_BGM_ENABLED: true,
  DEFAULT_QUIZ_RACE_SECONDS: 90,
  XP_PER_LEVEL: 250,
  MIN_CONFETTI_SCORE: 90,
  PASSING_SCORE: 70,
  PREDIKAT: [
    { min: 90, label: 'Sangat Baik', color: 'success' },
    { min: 80, label: 'Baik', color: 'primary' },
    { min: 70, label: 'Cukup', color: 'warning' },
    { min: 0, label: 'Perlu Bimbingan', color: 'danger' }
  ],
  GROWTH_MINDSET_FEEDBACK: [
    'Belum tepat, kesalahan membantu kita tumbuh!',
    'Terus mencoba! Setiap kesalahan melatih ketelitianmu membaca teks.',
    'Hampir tepat! Otak kita berkembang saat mengevaluasi jawaban.',
    'Jangan menyerah, petualang! Cek pembahasannya untuk petunjuk berharga.'
  ],
  ISLANDS: [
    {
      id: 1,
      name: 'Pulau Tujuan',
      subtitle: 'Social Function & Evidence',
      goal: 'Menentukan tujuan komunikatif (to entertain, to convey moral values) beserta kata kunci dan minimal 2 bukti teks.',
      icon: '🧭',
      color: '#1d4ed8'
    },
    {
      id: 2,
      name: 'Pulau Struktur',
      subtitle: 'Schematic Structure',
      goal: 'Mengidentifikasi Orientation, Complication, Resolution, serta Evaluation & Re-orientation memakai Story Map digital.',
      icon: '🗺️',
      color: '#0284c7'
    },
    {
      id: 3,
      name: 'Pulau Hitung',
      subtitle: 'Proporsi Kalimat & Kata',
      goal: 'Menghitung jumlah kalimat/kata, selisih, dan persentase proporsi tiap tahap, serta menentukan tahap terpanjang & terpendek.',
      icon: '📊',
      color: '#0d9488'
    },
    {
      id: 4,
      name: 'Pulau Banding',
      subtitle: 'Legend vs Fable',
      goal: 'Membandingkan dua teks naratif (Legend vs Fable) lewat tabel dan grafik proporsi dengan minimal 2 bukti.',
      icon: '⚖️',
      color: '#2563eb'
    },
    {
      id: 5,
      name: 'Pulau Evaluasi',
      subtitle: 'Peran Tahap, Fakta & Opini',
      goal: 'Mengevaluasi peran tiap tahap naratif serta membedakan pernyataan fakta dan opini dari teks.',
      icon: '🔍',
      color: '#4f46e5'
    },
    {
      id: 6,
      name: 'Pulau Kreator',
      subtitle: 'Merancang & Presentasi Cerita',
      goal: 'Merancang kerangka cerita orisinal dengan template & kartu acak lalu mempresentasikannya di Papan Interaktif.',
      icon: '✍️',
      color: '#7c3aed'
    }
  ]
};

export function getPredikat(score) {
  const numeric = Number(score) || 0;
  return CONFIG.PREDIKAT.find((p) => numeric >= p.min) || CONFIG.PREDIKAT[CONFIG.PREDIKAT.length - 1];
}

export function extractYouTubeId(url) {
  if (!url) return '';
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : '';
}
