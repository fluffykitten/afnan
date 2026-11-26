/**
 * Router SPA utama & Controller State Aplikasi Story Quest
 */
import { CONFIG, extractYouTubeId, getPredikat } from './config.js';
import {
  getActiveStudent,
  createOrSelectStudent,
  switchActiveStudent,
  updateActiveStudent,
  getAllStudents,
  getSettings
} from './storage.js';
import { setMuted, getMuted, playClick, playVictory } from './sound.js';
import {
  AVATARS,
  getAvatarSvg,
  getLevelInfo,
  awardXpAndEvaluateBadges,
  renderLeaderboardModalHtml
} from './gamification.js';
import { renderQuizSession, buildBossQuizQuestions, buildPosttestQuestions } from './quiz-engine.js';
import { renderCertificateView, downloadLearningSummary } from './certificate.js';
import { openTeacherModal } from './teacher.js';

import { renderMatchPurposeGame } from './games/match-purpose.js';
import { renderStoryMapGame } from './games/story-map.js';
import { renderProportionCalcGame } from './games/proportion-calc.js';
import { renderQuizRaceGame } from './games/quiz-race.js';
import { renderFactOpinionGame } from './games/fact-opinion.js';
import { renderStoryBuilderGame } from './games/story-builder.js';

const appState = {
  route: 'home', // home | apersepsi | pretest | map | island | posttest | reflection | certificate
  islandId: 1,
  islandStep: 'material', // material | game | boss
  materialSlide: 0,
  textsData: null,
  questionsData: null,
  badgesData: [],
  modalInstance: null
};

const MINI_MATERIALS = {
  1: [
    {
      title: 'Mengenal Tujuan Komunikatif Narrative Text',
      body: 'Narrative text (seperti <strong>Legend</strong> dan <strong>Fable</strong>) memiliki dua fungsi sosial utama: <em>to entertain/amuse the readers</em> (menghibur pembaca dengan kisah imajinatif) dan <em>to convey moral values</em> (menyampaikan pesan moral).',
      boxTitle: 'Tahukah Kamu?',
      boxText: 'Dalam sebuah legenda atau fabel, pesan moral jarang berdiri sendiri—selalu ada <strong>kata kunci</strong> dan minimal <strong>2 bukti peristiwa</strong> dari awal hingga akhir cerita!'
    },
    {
      title: 'Cara Menemukan Bukti Tujuan di Dalam Teks',
      body: 'Perhatikan tindakan tokoh (misalnya Malin Kundang menolak ibunya), akibat dari tindakan tersebut (badai mengubahnya menjadi batu), dan kalimat penutup seperti <em>"...reminding everyone to keep their promises"</em>.',
      boxTitle: 'Fakta Menarik',
      boxText: 'Dua bukti paling kuat untuk membuktikan tujuan moral biasanya berasal dari pasangan <strong>Sebab (tindakan tokoh di Complication)</strong> + <strong>Akibat (hasil di Resolution)</strong>.'
    }
  ],
  2: [
    {
      title: 'Tiga Tahap Wajib Schematic Structure',
      body: 'Setiap narrative text yang utuh memiliki: <br>1. <strong>Orientation</strong>: mengenalkan tokoh, waktu, dan tempat.<br>2. <strong>Complication</strong>: munculnya masalah/konflik hingga klimaks.<br>3. <strong>Resolution</strong>: cara masalah diselesaikan (bahagia atau tragis).',
      boxTitle: 'Info Penting',
      boxText: 'Ciri bahasa Orientation sering memakai <em>Once upon a time</em> atau <em>Long ago</em> dengan <strong>Simple Past Tense</strong>.'
    },
    {
      title: 'Dua Tahap Opsional: Evaluation & Re-orientation',
      body: 'Selain 3 tahap wajib, penulis dapat menyisipkan:<br>• <strong>Evaluation</strong> (opsional): kesadaran atau penilaian batin tokoh di tengah krisis.<br>• <strong>Re-orientation</strong> (opsional): penutup yang merangkum pesan moral atau kondisi saat ini.',
      boxTitle: 'Tahukah Kamu?',
      boxText: 'Menggunakan <strong>Story Map Digital</strong> membantumu memetakan alur cerita secara visual sebelum menulis atau meringkas teks.'
    }
  ],
  3: [
    {
      title: 'Mengukur Proporsi Kalimat & Kata Tiap Tahap',
      body: 'Pembaca kritis tidak hanya membaca cerita, tetapi juga mengamati <strong>proporsi</strong>: berapa jumlah kalimat atau kata pada Orientation, Complication, dan Resolution, serta berapa selisihnya.',
      boxTitle: 'Info Penting',
      boxText: 'Rumus Persentase Tahap = <strong>(Jumlah Kalimat Tahap ÷ Total Kalimat Teks) × 100%</strong>.'
    },
    {
      title: 'Membaca Tahap Terpanjang & Terpendek',
      body: 'Tahap dengan persentase terbesar disebut <strong>tahap terpanjang</strong> (biasanya Complication atau Resolution karena memuat aksi terbanyak), sedangkan yang terkecil adalah <strong>tahap terpendek</strong> (sering kali Evaluation/Re-orientation).',
      boxTitle: 'Fakta Menarik',
      boxText: 'Grafik batang dan grafik donat memudahkan kita melihat keseimbangan cerita dalam sekali pandang!'
    }
  ],
  4: [
    {
      title: 'Legend vs Fable: Persamaan & Perbedaan',
      body: 'Keduanya sama-sama berbentuk naratif lampau dengan pesan moral. Namun:<br>• <strong>Legend</strong>: tokoh manusia/mistis, sering menjelaskan asal-usul bentang alam (danau, gunung, pantai).<br>• <strong>Fable</strong>: tokoh hewan yang berbicara/berpikir layaknya manusia.',
      boxTitle: 'Tahukah Kamu?',
      boxText: 'Indonesia kaya legenda Nusantara seperti <em>Lake Toba</em>, <em>Malin Kundang</em>, dan <em>Sangkuriang</em>, serta fabel cerdik seperti <em>Si Kancil</em>.'
    },
    {
      title: 'Membandingkan Dua Teks Secara Berbasis Bukti',
      body: 'Saat membandingkan Legend dan Fable, gunakan <strong>tabel komparatif</strong> dan <strong>grafik proporsi</strong>, lalu dukung kesimpulanmu dengan minimal <strong>2 bukti</strong> langsung dari kedua teks.',
      boxTitle: 'Info Penting',
      boxText: 'Jangan hanya menulis "berbeda"—tuliskan bukti spesifik seperti persentase Complication atau kutipan tindakan tokoh.'
    }
  ],
  5: [
    {
      title: 'Mengevaluasi Peran Tiap Tahap Cerita',
      body: 'Setiap tahap punya peran penting: tanpa <strong>Orientation</strong> pembaca bingung siapa tokohnya; tanpa <strong>Complication</strong> cerita terasa datar; tanpa <strong>Resolution</strong> konflik menggantung.',
      boxTitle: 'Fakta Menarik',
      boxText: 'Tahap <strong>Evaluation</strong> membuat pembaca ikut merasakan emosi tokoh tepat sebelum keputusan besar di Resolution terjadi.'
    },
    {
      title: 'Membedakan Fakta Teks vs Opini Pembaca',
      body: '• <strong>Fakta Teks</strong>: kejadian atau detail yang tertulis eksplisit dan bisa dibuktikan langsung di bacaan.<br>• <strong>Opini</strong>: penilaian subjektif pembaca (misalnya memakai kata <em>the best, worst, unfairly, boring</em>).',
      boxTitle: 'Info Penting',
      boxText: 'Selalu cek kalimat rujukan di teks asli sebelum menyimpulkan sebuah pernyataan sebagai fakta!'
    }
  ],
  6: [
    {
      title: 'Merancang Kerangka Cerita Orisinal (Story Builder)',
      body: 'Kini saatnya menjadi kreator! Gabungkan kartu <strong>Tokoh</strong>, <strong>Latar</strong>, <strong>Masalah</strong>, dan <strong>Nilai Moral</strong> menjadi kerangka cerita berbahasa Inggris yang runtut.',
      boxTitle: 'Tahukah Kamu?',
      boxText: 'Pastikan konflik di Complication berhubungan langsung dengan sifat tokoh di Orientation agar Resolution terasa logis!'
    },
    {
      title: 'Tips Presentasi Kolaboratif di Papan Interaktif (PID)',
      body: 'Saat mempresentasikan kerangka ceritamu bersama kelompok, gunakan tombol <strong>Mode PID</strong> agar teks tampil besar dan jelas di depan kelas, lalu jelaskan tujuan komunikatif dan alur tiap tahapnya.',
      boxTitle: 'Info Penting',
      boxText: 'Beri umpan balik yang membangun kepada kelompok temanmu dengan menyebutkan kelebihan struktur dan satu saran perbaikan.'
    }
  ]
};

const appRoot = document.getElementById('app-root');
const bottomNavBar = document.getElementById('bottom-nav-bar');

function getModal() {
  if (!appState.modalInstance) {
    appState.modalInstance = new window.bootstrap.Modal(document.getElementById('sqModal'));
  }
  return appState.modalInstance;
}

function showModal(title, renderFn) {
  const modalTitle = document.getElementById('sqModalLabel');
  const modalBody = document.getElementById('sqModalBody');
  const modalFooter = document.getElementById('sqModalFooter');
  modalTitle.textContent = title;
  modalFooter.innerHTML = '<button type="button" class="btn sq-btn-outline sq-touch" data-bs-dismiss="modal">Tutup</button>';
  renderFn(modalBody, modalFooter);
  getModal().show();
}

function calculateOverallProgress(student) {
  if (!student) return 0;
  let points = 0;
  if (student.pretest) points += 1;
  points += (student.completedIslands || []).length; // maks 6
  if (student.posttest) points += 1;
  if (student.reflection?.savedAt) points += 1;
  return Math.min(100, Math.round((points / 9) * 100));
}

function syncHeader() {
  const student = getActiveStudent();
  const strip = document.getElementById('student-status-strip');
  const pct = calculateOverallProgress(student);

  document.getElementById('global-progress-text').textContent = `${pct}%`;
  const bar = document.getElementById('global-progress-bar');
  bar.style.width = `${pct}%`;
  document.getElementById('global-progress-bar-wrap').setAttribute('aria-valuenow', String(pct));

  if (!student) {
    strip.classList.add('d-none');
    return;
  }

  strip.classList.remove('d-none');
  const lv = getLevelInfo(student.xp);
  document.getElementById('header-avatar-slot').innerHTML = getAvatarSvg(student.avatarId);
  document.getElementById('header-student-name').textContent = student.name;
  document.getElementById('header-student-class').textContent = student.className;
  document.getElementById('header-student-level').textContent = `Lv. ${lv.level}`;
  document.getElementById('header-xp').textContent = `⚡ ${student.xp} XP`;
  document.getElementById('header-streak').textContent = `🔥 ${student.streak || 1} Hari`;
  document.getElementById('header-badges').textContent = `🎖️ ${(student.badges || []).length} Badge`;
}

function navigate(route, opts = {}) {
  appState.route = route;
  if (opts.islandId !== undefined) appState.islandId = opts.islandId;
  if (opts.islandStep !== undefined) appState.islandStep = opts.islandStep;
  if (opts.materialSlide !== undefined) appState.materialSlide = opts.materialSlide;
  renderCurrentRoute();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateBottomNav() {
  const student = getActiveStudent();
  if (!student || appState.route === 'home') {
    bottomNavBar.classList.add('d-none');
    return;
  }
  bottomNavBar.classList.remove('d-none');
  const repeatBtn = document.getElementById('btn-repeat-material');
  const nextBtn = document.getElementById('btn-next-step');
  const prevBtn = document.getElementById('btn-prev-step');

  repeatBtn.classList.toggle('d-none', appState.route !== 'island');
  prevBtn.disabled = false;
  nextBtn.disabled = false;
}

function renderCurrentRoute() {
  syncHeader();
  updateBottomNav();
  const student = getActiveStudent();

  if (!student && appState.route !== 'home') {
    appState.route = 'home';
  }

  switch (appState.route) {
    case 'home':
      renderHomeView();
      break;
    case 'apersepsi':
      renderApersepsiView();
      break;
    case 'pretest':
      renderPretestView();
      break;
    case 'map':
      renderMapView();
      break;
    case 'island':
      renderIslandView();
      break;
    case 'posttest':
      renderPosttestView();
      break;
    case 'reflection':
      renderReflectionView();
      break;
    case 'certificate':
      renderCertificateView(appRoot, student, () => navigate('map'));
      break;
    default:
      renderHomeView();
  }
}

/* ============================================================================
   1. BERANDA & PROFIL MULTI-SISWA
   ============================================================================ */
function renderHomeView() {
  const student = getActiveStudent();
  const allStudents = getAllStudents();
  let selectedAvatar = student?.avatarId || AVATARS[0].id;

  appRoot.innerHTML = `
    <div class="row g-4 align-items-stretch">
      <div class="col-lg-6">
        <div class="sq-card-blue h-100 d-flex flex-column justify-content-between">
          <div>
            <span class="badge bg-light text-primary mb-2 px-3 py-2 rounded-pill">Bahasa Inggris SMP Kelas 9</span>
            <h1 class="display-6 fw-bold mb-3">Selamat Datang di Story Quest: Pulau Cerita! 🏝️</h1>
            <p class="mb-3">
              Jelajahi <strong>6 Pulau Interaktif</strong> untuk menguasai materi <strong>Narrative Text (Legend &amp; Fable)</strong> secara mendalam:
              dari tujuan komunikatif, Story Map, proporsi teks, perbandingan kritis, fakta vs opini, hingga merancang ceritamu sendiri!
            </p>
            <div class="sq-info-box mb-3">
              <div class="sq-info-title">🌟 Alur Petualangan</div>
              <ol class="mb-0 ps-3 small">
                <li>Isi profil petualang &amp; pilih avatar kartunmu.</li>
                <li>Tonton Apersepsi &amp; kerjakan Asesmen Awal Adaptif.</li>
                <li>Taklukkan 6 Pulau berurutan (Materi → Mini-Game → Boss Quiz).</li>
                <li>Selesaikan Asesmen Akhir, Refleksi, &amp; unduh Sertifikat PDF!</li>
              </ol>
            </div>
          </div>
          ${
            student
              ? `<div class="d-flex flex-wrap gap-2 mt-2">
                   <button type="button" id="btn-home-continue" class="btn btn-warning fw-bold sq-touch">🚀 Lanjutkan Petualangan</button>
                   <button type="button" id="btn-home-apersepsi" class="btn btn-light fw-bold sq-touch">🎬 Mulai dari Apersepsi</button>
                 </div>`
              : ''
          }
        </div>
      </div>

      <div class="col-lg-6">
        <div class="sq-card h-100">
          <h2 class="h4 fw-bold text-primary mb-3">🧭 Daftar / Masuk Profil Petualang</h2>
          <form id="profile-form">
            <div class="row g-2 mb-3">
              <div class="col-sm-7">
                <label class="form-label fw-bold small" for="inp-name">Nama Lengkap Siswa</label>
                <input type="text" id="inp-name" class="form-control sq-touch" placeholder="Contoh: Raka Pratama" value="${student?.name || ''}" required />
              </div>
              <div class="col-sm-5">
                <label class="form-label fw-bold small" for="inp-class">Kelas</label>
                <input type="text" id="inp-class" class="form-control sq-touch" placeholder="Contoh: 9A" value="${student?.className || ''}" required />
              </div>
            </div>

            <div class="mb-3">
              <div class="form-label fw-bold small">Pilih Avatar Kartunmu:</div>
              <div class="row g-2" id="avatar-grid">
                ${AVATARS.map(
                  (av) => `
                  <div class="col-4">
                    <button type="button" class="sq-avatar-card w-100 ${av.id === selectedAvatar ? 'selected' : ''}" data-avatar="${av.id}">
                      <div>${av.svg}</div>
                      <div class="small fw-bold mt-1">${av.label}</div>
                    </button>
                  </div>`
                ).join('')}
              </div>
            </div>

            <button type="submit" class="btn sq-btn-primary sq-touch w-100">
              ⚓ Simpan Profil &amp; Mulai Berpetualang
            </button>
          </form>

          ${
            allStudents.length > 0
              ? `<hr class="my-3"/>
                 <div class="small fw-bold text-secondary mb-2">Atau pilih profil tersimpan di perangkat ini:</div>
                 <div class="d-flex flex-wrap gap-2">
                   ${allStudents
                     .map(
                       (s) => `
                       <button type="button" class="btn btn-sm sq-btn-outline sq-touch-sm" data-quick-stu="${s.id}">
                         ${s.name} (${s.className}) • ${s.xp} XP
                       </button>`
                     )
                     .join('')}
                 </div>`
              : ''
          }
        </div>
      </div>
    </div>

    ${
      student
        ? `<div class="sq-card mt-4">
             <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
               <h3 class="h5 fw-bold mb-0">🎖️ Koleksi Badge Kamu (${(student.badges || []).length}/${appState.badgesData.length})</h3>
               <span class="small text-secondary">Kumpulkan badge dengan menyelesaikan pulau, mini-game, &amp; refleksi!</span>
             </div>
             <div class="row g-2">
               ${appState.badgesData
                 .map((b) => {
                   const owned = (student.badges || []).includes(b.id);
                   return `
                     <div class="col-6 col-md-4 col-lg-3">
                       <div class="p-2 rounded-4 border h-100 ${owned ? 'bg-primary-subtle border-primary' : 'bg-light opacity-50'}">
                         <div class="fw-bold">${b.icon} ${b.name}</div>
                         <div class="small text-secondary">${b.description}</div>
                       </div>
                     </div>`;
                 })
                 .join('')}
             </div>
           </div>`
        : ''
    }
  `;

  appRoot.querySelectorAll('[data-avatar]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playClick();
      selectedAvatar = btn.dataset.avatar;
      appRoot.querySelectorAll('[data-avatar]').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  appRoot.querySelector('#profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = appRoot.querySelector('#inp-name').value;
    const cls = appRoot.querySelector('#inp-class').value;
    createOrSelectStudent(name, cls, selectedAvatar);
    playVictory();
    navigate('apersepsi');
  });

  appRoot.querySelectorAll('[data-quick-stu]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playClick();
      switchActiveStudent(btn.dataset.quickStu);
      navigate('map');
    });
  });

  const btnCont = appRoot.querySelector('#btn-home-continue');
  if (btnCont) btnCont.addEventListener('click', () => { playClick(); navigate('map'); });
  const btnAper = appRoot.querySelector('#btn-home-apersepsi');
  if (btnAper) btnAper.addEventListener('click', () => { playClick(); navigate('apersepsi'); });
}

/* ============================================================================
   2. APERSEPSI (PEMANTIK TANPA LANGSUNG MENJELASKAN MATERI)
   ============================================================================ */
function renderApersepsiView() {
  const settings = getSettings();
  const ytId = extractYouTubeId(settings.youtubeUrl);

  appRoot.innerHTML = `
    <div class="sq-card">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <span class="badge sq-badge-tosca mb-1">Tahap 1 • Apersepsi Pemantik</span>
          <h2 class="h3 fw-bold mb-0">🎬 Mari Mengamati Sebelum Berlayar!</h2>
        </div>
        <button type="button" id="btn-skip-apersepsi" class="btn sq-btn-primary sq-touch">Lanjut ke Asesmen Awal ➡️</button>
      </div>

      <div class="row g-4 align-items-center">
        <div class="col-lg-7">
          ${
            ytId
              ? `<div class="ratio ratio-16x9 rounded-4 overflow-hidden shadow-sm border">
                   <iframe src="https://www.youtube.com/embed/${ytId}" title="Video Pemantik Story Quest" allowfullscreen></iframe>
                 </div>`
              : `<div class="p-5 text-center bg-light rounded-4 border">Video pemantik siap dipasang lewat link YouTube di Mode Guru.</div>`
          }
          <div class="small text-secondary mt-2">
            Jika koneksi offline, amati ilustrasi pulau di samping dan diskusikan pertanyaan pemantik bersama temanmu.
          </div>
        </div>

        <div class="col-lg-5">
          <div class="p-3 rounded-4 bg-primary-subtle border border-primary-subtle text-center mb-3">
            <!-- Ilustrasi SVG Kartun Pemantik -->
            <svg viewBox="0 0 280 140" class="w-100" style="max-height: 150px;" aria-label="Ilustrasi perahu dan sungai misterius">
              <rect width="280" height="140" rx="16" fill="#dbeafe"/>
              <path d="M0 95 Q70 80 140 95 T280 95 L280 140 L0 140 Z" fill="#0d9488"/>
              <path d="M75 95 L105 60 L155 60 L175 95 Z" fill="#f59e0b"/>
              <polygon points="125,20 125,60 160,50" fill="#ffffff"/>
              <circle cx="230" cy="36" r="18" fill="#fde047"/>
            </svg>
          </div>

          <div class="sq-info-box">
            <div class="sq-info-title">🤔 Pertanyaan Pemantik</div>
            <p class="fw-bold mb-2">"Apa yang akan terjadi jika tokoh dalam sebuah cerita melanggar janji sucinya atau meremehkan teman yang kecil?"</p>
            <p class="small mb-0">
              Tuliskan tebakan singkatmu di buku atau diskusikan secara lisan sebelum memulai misi! (Belum perlu menghafal teori apa pun dahulu.)
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  appRoot.querySelector('#btn-skip-apersepsi').addEventListener('click', () => {
    playClick();
    navigate('pretest');
  });
}

/* ============================================================================
   3. ASESMEN AWAL ADAPTIF (10 SOAL)
   ============================================================================ */
function renderPretestView() {
  const student = getActiveStudent();
  if (student?.pretest) {
    const recIsland = CONFIG.ISLANDS.find((i) => i.id === student.pretest.recommendedIsland) || CONFIG.ISLANDS[0];
    appRoot.innerHTML = `
      <div class="sq-card text-center">
        <div class="display-4 mb-2">🧭</div>
        <h2 class="h3 fw-bold">Asesmen Awal Sudah Diselesaikan</h2>
        <p class="mb-2">Skor Asesmen Awalmu: <strong class="text-primary fs-4">${student.pretest.score}</strong></p>
        <div class="sq-info-box text-start mx-auto my-3" style="max-width: 640px;">
          <div class="sq-info-title">📌 Rekomendasi Belajar</div>
          Fokus perhatian yang disarankan: <strong>Pulau ${recIsland.id}: ${recIsland.name}</strong>.
          Semua pulau tetap dimulai secara berurutan dari Pulau 1.
        </div>
        <div class="d-flex justify-content-center gap-2">
          <button type="button" id="btn-pre-retake" class="btn sq-btn-outline sq-touch">🔄 Ulangi Asesmen Awal</button>
          <button type="button" id="btn-pre-map" class="btn sq-btn-primary sq-touch">🗺️ Masuk ke Peta Pulau</button>
        </div>
      </div>
    `;
    appRoot.querySelector('#btn-pre-map').addEventListener('click', () => { playClick(); navigate('map'); });
    appRoot.querySelector('#btn-pre-retake').addEventListener('click', () => {
      playClick();
      startAdaptivePretest();
    });
    return;
  }
  startAdaptivePretest();
}

function startAdaptivePretest() {
  renderQuizSession({
    container: appRoot,
    title: 'Asesmen Awal Adaptif',
    subtitle: '10 soal adaptif untuk memetakan kesiapanmu dan memberi rekomendasi pulau fokus.',
    mode: 'pretest',
    questionsPool: appState.questionsData.pretest,
    totalQuestions: 10,
    onComplete: (result) => {
      if (result.userClickedContinue) {
        navigate('map');
        return;
      }
      updateActiveStudent((stu) => {
        stu.pretest = {
          score: result.score,
          recommendedIsland: result.recommendedIsland,
          completedAt: new Date().toISOString()
        };
      });
      awardXpAndEvaluateBadges(50, 'Menyelesaikan Asesmen Awal Adaptif', appState.badgesData);
      syncHeader();
    }
  });
}

/* ============================================================================
   4. PETA 6 PULAU CERITA (INTERAKTIF & BERURUTAN)
   ============================================================================ */
function renderMapView() {
  const student = getActiveStudent();
  const completedSet = new Set(student.completedIslands || []);
  const recIslandId = student.pretest?.recommendedIsland || null;
  const allIslandsDone = completedSet.size >= 6;

  appRoot.innerHTML = `
    <div class="sq-map-wrapper mb-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 class="h3 fw-bold mb-1 text-primary-emphasis">🗺️ Peta Pulau Cerita (6 Level Berurutan)</h2>
          <p class="small mb-0">Selesaikan mini-materi, mini-game, dan Boss Quiz (skor ≥ ${CONFIG.PASSING_SCORE}) untuk membuka pulau berikutnya.</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" id="btn-map-apersepsi" class="btn btn-sm sq-btn-outline sq-touch-sm">🎬 Apersepsi</button>
          <button type="button" id="btn-map-pretest" class="btn btn-sm sq-btn-outline sq-touch-sm">🧭 Asesmen Awal</button>
        </div>
      </div>

      <!-- Peta Jalur SVG Visual -->
      <div class="bg-white bg-opacity-75 rounded-4 p-2 mb-3 border">
        <svg viewBox="0 0 900 120" class="w-100" style="max-height: 110px;" aria-label="Jalur pelayaran 6 Pulau Cerita">
          <path d="M75 60 Q215 15 350 60 T625 60 T825 60" fill="none" stroke="#1d4ed8" stroke-width="5" stroke-dasharray="10 8"/>
          ${CONFIG.ISLANDS.map((isl, i) => {
            const cx = 75 + i * 150;
            const cy = i % 2 === 0 ? 60 : 42;
            const done = completedSet.has(isl.id);
            const unlocked = isl.id <= (student.unlockedIsland || 1);
            const fill = done ? '#0d9488' : unlocked ? '#1d4ed8' : '#94a3b8';
            return `
              <g>
                <circle cx="${cx}" cy="${cy}" r="22" fill="${fill}" stroke="#ffffff" stroke-width="4"/>
                <text x="${cx}" y="${cy + 6}" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold">${done ? '✓' : isl.id}</text>
                <text x="${cx}" y="108" text-anchor="middle" fill="#1e293b" font-size="13" font-weight="bold">${isl.name}</text>
              </g>`;
          }).join('')}
        </svg>
      </div>

      <!-- Kartu 6 Pulau -->
      <div class="row g-3">
        ${CONFIG.ISLANDS.map((isl) => {
          const isUnlocked = isl.id <= (student.unlockedIsland || 1);
          const isCompleted = completedSet.has(isl.id);
          const isRec = recIslandId === isl.id;
          const bossScore = student.bossScores?.[isl.id];

          return `
            <div class="col-md-6 col-lg-4">
              <div class="sq-island-card ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''} ${isRec ? 'recommended' : ''} d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <span class="fs-2">${isl.icon}</span>
                    <div class="text-end">
                      ${isRec ? '<span class="badge sq-badge-tosca mb-1 d-block">📌 Rekomendasi Asesmen Awal</span>' : ''}
                      ${
                        isCompleted
                          ? `<span class="badge bg-success">✅ Tuntas (Boss: ${bossScore})</span>`
                          : isUnlocked
                            ? '<span class="badge bg-primary">🔓 Terbuka</span>'
                            : '<span class="badge bg-secondary">🔒 Terkunci</span>'
                      }
                    </div>
                  </div>
                  <h3 class="h5 fw-bold mb-1">Pulau ${isl.id}: ${isl.name}</h3>
                  <div class="small fw-bold text-primary mb-2">${isl.subtitle}</div>
                  <p class="small text-secondary mb-3">${isl.goal}</p>
                </div>

                <button type="button" class="btn ${isUnlocked ? 'sq-btn-primary' : 'btn-secondary'} sq-touch w-100"
                        data-open-island="${isl.id}" ${isUnlocked ? '' : 'disabled'}>
                  ${isCompleted ? '🔄 Kunjungi / Ulangi Pulau' : isUnlocked ? '⛵ Jelajahi Pulau Ini' : `Selesaikan Pulau ${isl.id - 1} Dulu`}
                </button>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Gerbang Tahap Akhir: Asesmen Akhir, Refleksi, Sertifikat -->
    <div class="sq-card">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h3 class="h5 fw-bold mb-1">🏁 Gerbang Akhir Petualangan</h3>
          <p class="small text-secondary mb-0">
            ${
              allIslandsDone
                ? 'Hebat! Keenam pulau sudah ditaklukkan. Kerjakan Asesmen Akhir, isi Refleksi, dan klaim Sertifikatmu!'
                : `Selesaikan seluruh 6 pulau untuk membuka Asesmen Akhir & Sertifikat (${completedSet.size}/6 selesai).`
            }
          </p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" id="btn-go-posttest" class="btn sq-btn-primary sq-touch" ${allIslandsDone ? '' : 'disabled'}>
            📝 Asesmen Akhir ${student.posttest ? `(${student.posttest.score})` : ''}
          </button>
          <button type="button" id="btn-go-reflection" class="btn sq-btn-tosca sq-touch" ${student.posttest ? '' : 'disabled'}>
            💭 Refleksi
          </button>
          <button type="button" id="btn-go-cert" class="btn sq-btn-dark sq-touch" ${student.posttest ? '' : 'disabled'}>
            🎓 Sertifikat
          </button>
        </div>
      </div>
    </div>
  `;

  appRoot.querySelector('#btn-map-apersepsi').addEventListener('click', () => { playClick(); navigate('apersepsi'); });
  appRoot.querySelector('#btn-map-pretest').addEventListener('click', () => { playClick(); navigate('pretest'); });

  appRoot.querySelectorAll('[data-open-island]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playClick();
      navigate('island', { islandId: Number(btn.dataset.openIsland), islandStep: 'material', materialSlide: 0 });
    });
  });

  appRoot.querySelector('#btn-go-posttest').addEventListener('click', () => { playClick(); navigate('posttest'); });
  appRoot.querySelector('#btn-go-reflection').addEventListener('click', () => { playClick(); navigate('reflection'); });
  appRoot.querySelector('#btn-go-cert').addEventListener('click', () => { playClick(); navigate('certificate'); });
}

/* ============================================================================
   5. TAMPILAN PULAU (MINI-MATERI MAX 3 LAYAR -> MINI-GAME -> BOSS QUIZ)
   ============================================================================ */
function renderIslandView() {
  const island = CONFIG.ISLANDS.find((i) => i.id === appState.islandId) || CONFIG.ISLANDS[0];
  const student = getActiveStudent();
  const gameDone = Boolean(student.islandGamesDone?.[island.id]);
  const bossDone = (student.completedIslands || []).includes(island.id);

  appRoot.innerHTML = `
    <div class="mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div>
        <span class="badge bg-primary mb-1">Pulau ${island.id} dari 6</span>
        <h2 class="h3 fw-bold mb-0">${island.icon} ${island.name} — <span class="text-primary">${island.subtitle}</span></h2>
      </div>
      <div class="btn-group" role="group" aria-label="Tahap pulau">
        <button type="button" class="btn sq-btn-outline sq-touch-sm ${appState.islandStep === 'material' ? 'active' : ''}" data-step-tab="material">1. Mini-Materi</button>
        <button type="button" class="btn sq-btn-outline sq-touch-sm ${appState.islandStep === 'game' ? 'active' : ''}" data-step-tab="game">2. Mini-Game ${gameDone ? '✅' : ''}</button>
        <button type="button" class="btn sq-btn-outline sq-touch-sm ${appState.islandStep === 'boss' ? 'active' : ''}" data-step-tab="boss">3. Boss Quiz ${bossDone ? '✅' : ''}</button>
      </div>
    </div>

    <div id="island-stage-container"></div>
  `;

  appRoot.querySelectorAll('[data-step-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playClick();
      appState.islandStep = btn.dataset.stepTab;
      renderIslandView();
    });
  });

  const stageContainer = appRoot.querySelector('#island-stage-container');

  if (appState.islandStep === 'material') {
    renderMiniMaterial(stageContainer, island);
  } else if (appState.islandStep === 'game') {
    renderIslandMiniGame(stageContainer, island);
  } else {
    renderIslandBossQuiz(stageContainer, island);
  }
}

function renderMiniMaterial(container, island) {
  const slides = MINI_MATERIALS[island.id] || [];
  const slideIdx = Math.min(appState.materialSlide, slides.length - 1);
  const slide = slides[slideIdx];
  const sampleText = appState.textsData.texts[island.id - 1];

  container.innerHTML = `
    <div class="sq-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="badge sq-badge-tosca">Mini-Materi • Layar ${slideIdx + 1} / ${slides.length}</span>
        <button type="button" id="btn-read-sample" class="btn btn-sm sq-btn-outline sq-touch-sm">📖 Baca Teks Contoh (${sampleText.title})</button>
      </div>

      <h3 class="h4 fw-bold text-primary mb-3">${slide.title}</h3>
      <p class="fs-5 mb-4">${slide.body}</p>

      <div class="sq-info-box mb-4">
        <div class="sq-info-title">💡 ${slide.boxTitle}</div>
        <div class="mb-0">${slide.boxText}</div>
      </div>

      <div class="d-flex flex-wrap justify-content-between gap-2">
        <button type="button" id="btn-mat-prev" class="btn sq-btn-outline sq-touch" ${slideIdx === 0 ? 'disabled' : ''}>⬅️ Layar Sebelumnya</button>
        ${
          slideIdx + 1 < slides.length
            ? '<button type="button" id="btn-mat-next" class="btn sq-btn-primary sq-touch">Layar Materi Berikutnya ➡️</button>'
            : '<button type="button" id="btn-mat-togame" class="btn sq-btn-primary sq-touch">🎮 Lanjut ke Mini-Game ➡️</button>'
        }
      </div>
    </div>
  `;

  container.querySelector('#btn-read-sample').addEventListener('click', () => {
    playClick();
    showModal(`📖 ${sampleText.title} (${sampleText.type.toUpperCase()})`, (body) => {
      body.innerHTML = `
        <p class="small text-secondary mb-2"><strong>Asal:</strong> ${sampleText.origin} | <strong>Tujuan:</strong> ${sampleText.purpose}</p>
        ${sampleText.stages
          .map(
            (st) => `
            <div class="mb-3">
              <span class="sq-stage-tag tag-${st.stage.toLowerCase().replace('-', '')}">${st.stage}</span>
              <p class="mb-0">${st.sentences.join(' ')}</p>
            </div>`
          )
          .join('')}
        <div class="sq-info-box small">
          <div class="sq-info-title">🔍 Bukti Tujuan Komunikatif</div>
          <ul class="mb-0 ps-3">${sampleText.evidences.map((ev) => `<li>${ev}</li>`).join('')}</ul>
        </div>
      `;
    });
  });

  const prevBtn = container.querySelector('#btn-mat-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      playClick();
      appState.materialSlide = Math.max(0, slideIdx - 1);
      renderIslandView();
    });
  }
  const nextBtn = container.querySelector('#btn-mat-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      playClick();
      appState.materialSlide = slideIdx + 1;
      renderIslandView();
    });
  }
  const toGameBtn = container.querySelector('#btn-mat-togame');
  if (toGameBtn) {
    toGameBtn.addEventListener('click', () => {
      playClick();
      appState.islandStep = 'game';
      renderIslandView();
    });
  }
}

function renderIslandMiniGame(container, island) {
  const onGameComplete = (score, summary) => {
    updateActiveStudent((stu) => {
      stu.islandGamesDone = stu.islandGamesDone || {};
      stu.islandGamesDone[island.id] = { score, summary, completedAt: new Date().toISOString() };
    });
    awardXpAndEvaluateBadges(40, `Mini-Game Pulau ${island.id}`, appState.badgesData);
    syncHeader();

    // Tampilkan tombol cepat menuju Boss Quiz
    const nextBar = document.createElement('div');
    nextBar.className = 'mt-3 text-end';
    nextBar.innerHTML = `
      <button type="button" class="btn sq-btn-primary sq-touch" id="btn-after-game-boss">
        ⚔️ Tantang Boss Quiz Pulau ${island.id} ➡️
      </button>
    `;
    nextBar.querySelector('#btn-after-game-boss').addEventListener('click', () => {
      playClick();
      appState.islandStep = 'boss';
      renderIslandView();
    });
    container.appendChild(nextBar);
  };

  switch (island.id) {
    case 1:
      renderMatchPurposeGame(container, appState.textsData, onGameComplete);
      break;
    case 2:
      renderStoryMapGame(container, appState.textsData, onGameComplete);
      break;
    case 3:
      renderProportionCalcGame(container, appState.textsData, onGameComplete);
      break;
    case 4:
      renderQuizRaceGame(container, appState.textsData, onGameComplete);
      break;
    case 5:
      renderFactOpinionGame(container, appState.textsData, onGameComplete);
      break;
    case 6:
      renderStoryBuilderGame(container, appState.textsData, onGameComplete, (storyObj) => {
        // Mode Presentasi Papan Interaktif (PID)
        document.body.classList.add('pid-mode');
        document.getElementById('btn-toggle-pid').setAttribute('aria-pressed', 'true');
        showModal(`🖥️ Presentasi Kelompok: ${storyObj.title}`, (body) => {
          body.innerHTML = `
            <div class="p-2">
              <div class="badge sq-badge-tosca fs-6 mb-3">${storyObj.genre} • Karya Kelompok</div>
              <div class="mb-3"><span class="sq-stage-tag tag-orientation">Orientation</span><p class="fs-5">${storyObj.orientation}</p></div>
              <div class="mb-3"><span class="sq-stage-tag tag-complication">Complication</span><p class="fs-5">${storyObj.complication}</p></div>
              <div class="mb-3"><span class="sq-stage-tag tag-resolution">Resolution</span><p class="fs-5">${storyObj.resolution}</p></div>
              <div class="mb-3"><span class="sq-stage-tag tag-reorientation">Re-orientation</span><p class="fs-5">${storyObj.reorientation}</p></div>
              <div class="sq-info-box"><div class="sq-info-title">🎯 Nilai Moral</div>${storyObj.moral}</div>
            </div>
          `;
        });
      });
      break;
    default:
      renderMatchPurposeGame(container, appState.textsData, onGameComplete);
  }
}

function renderIslandBossQuiz(container, island) {
  const pool = buildBossQuizQuestions(appState.questionsData.hots, island.id);
  renderQuizSession({
    container,
    title: `Boss Quiz Pulau ${island.id}: ${island.name}`,
    subtitle: '10 soal HOTS (5 khusus topik pulau + 5 lintas topik). Raih skor ≥ 70 untuk membuka pulau berikutnya!',
    mode: 'boss',
    questionsPool: pool,
    totalQuestions: 10,
    onComplete: (result) => {
      if (result.userClickedContinue) {
        if (result.passed && island.id < 6) {
          navigate('island', { islandId: island.id + 1, islandStep: 'material', materialSlide: 0 });
        } else {
          navigate('map');
        }
        return;
      }

      updateActiveStudent((stu) => {
        stu.bossScores = stu.bossScores || {};
        stu.bossScores[island.id] = Math.max(stu.bossScores[island.id] || 0, result.score);
        if (result.passed) {
          const completed = new Set(stu.completedIslands || []);
          completed.add(island.id);
          stu.completedIslands = [...completed];
          if (island.id >= (stu.unlockedIsland || 1) && island.id < 6) {
            stu.unlockedIsland = island.id + 1;
          }
        }
      });

      const xpGain = result.passed ? 75 : 25;
      awardXpAndEvaluateBadges(xpGain, `Boss Quiz Pulau ${island.id} (Skor ${result.score})`, appState.badgesData);
      syncHeader();
    }
  });
}

/* ============================================================================
   6. ASESMEN AKHIR (10 SOAL SEDANG-TINGGI) & REFLEKSI (4 KALIMAT RUMPANG)
   ============================================================================ */
function renderPosttestView() {
  const pool = buildPosttestQuestions(appState.questionsData.posttest);
  renderQuizSession({
    container: appRoot,
    title: 'Asesmen Akhir Story Quest',
    subtitle: '10 soal komprehensif tingkat sedang–tinggi mencakup semua tujuan pembelajaran Narrative Text.',
    mode: 'posttest',
    questionsPool: pool,
    totalQuestions: 10,
    onComplete: (result) => {
      if (result.userClickedContinue) {
        navigate('reflection');
        return;
      }
      const pred = getPredikat(result.score);
      updateActiveStudent((stu) => {
        stu.posttest = {
          score: result.score,
          predikat: pred.label,
          completedAt: new Date().toISOString()
        };
      });
      awardXpAndEvaluateBadges(100, `Asesmen Akhir (Skor ${result.score})`, appState.badgesData);
      syncHeader();
    }
  });
}

function renderReflectionView() {
  const student = getActiveStudent();
  const ref = student.reflection || {};

  appRoot.innerHTML = `
    <div class="sq-card">
      <span class="badge sq-badge-tosca mb-2">Pembelajaran Mendalam • Refleksi Diri</span>
      <h2 class="h3 fw-bold mb-1">💭 Refleksi Petualanganmu</h2>
      <p class="text-secondary small mb-4">Lengkapi 4 kalimat rumpang di bawah ini dengan jujur, lalu simpan sebelum mencetak sertifikatmu.</p>

      <form id="reflection-form" class="d-grid gap-3">
        <div>
          <label class="form-label fw-bold" for="ref-1">1. Hal paling penting yang kupelajari dari Narrative Text (Legend &amp; Fable) adalah ...</label>
          <input type="text" id="ref-1" class="form-control sq-touch" value="${ref.blank1 || ''}" placeholder="Tuliskan pemahaman utamamu..." required />
        </div>
        <div>
          <label class="form-label fw-bold" for="ref-2">2. Tahap struktur atau bagian analisis yang menurutku paling menantang adalah ..., dan cara mengatasinya dengan ...</label>
          <input type="text" id="ref-2" class="form-control sq-touch" value="${ref.blank2 || ''}" placeholder="Ceritakan tantangan & strategimu..." required />
        </div>
        <div>
          <label class="form-label fw-bold" for="ref-3">3. Cara membedakan fakta teks dan opini pembaca secara akurat yaitu dengan memeriksa ...</label>
          <input type="text" id="ref-3" class="form-control sq-touch" value="${ref.blank3 || ''}" placeholder="Tuliskan kata kunci atau bukti..." required />
        </div>
        <div>
          <label class="form-label fw-bold" for="ref-4">4. Nilai moral dari cerita yang ingin kuterapkan dalam kehidupan sehari-hari adalah ...</label>
          <input type="text" id="ref-4" class="form-control sq-touch" value="${ref.blank4 || ''}" placeholder="Contoh: menepati janji, menghormati orang tua..." required />
        </div>

        <div class="d-flex flex-wrap justify-content-between gap-2 mt-2">
          <button type="submit" class="btn sq-btn-primary sq-touch">💾 Simpan Refleksi</button>
          <button type="button" id="btn-ref-cert" class="btn sq-btn-tosca sq-touch">🎓 Buka Sertifikat ➡️</button>
        </div>
      </form>
      <div id="ref-feedback" class="mt-3"></div>
    </div>
  `;

  appRoot.querySelector('#reflection-form').addEventListener('submit', (e) => {
    e.preventDefault();
    updateActiveStudent((stu) => {
      stu.reflection = {
        blank1: appRoot.querySelector('#ref-1').value.trim(),
        blank2: appRoot.querySelector('#ref-2').value.trim(),
        blank3: appRoot.querySelector('#ref-3').value.trim(),
        blank4: appRoot.querySelector('#ref-4').value.trim(),
        savedAt: new Date().toISOString()
      };
    });
    awardXpAndEvaluateBadges(35, 'Menyimpan Refleksi Belajar', appState.badgesData);
    syncHeader();
    playVictory();
    appRoot.querySelector('#ref-feedback').innerHTML =
      '<div class="alert alert-success rounded-4">✅ Refleksi tersimpan di perangkat! Kamu siap mengunduh Sertifikat PDF.</div>';
  });

  appRoot.querySelector('#btn-ref-cert').addEventListener('click', () => {
    playClick();
    navigate('certificate');
  });
}

/* ============================================================================
   7. BINDING GLOBAL HEADER, FOOTER NAV & INISIALISASI
   ============================================================================ */
function bindGlobalControls() {
  document.getElementById('btn-brand-home').addEventListener('click', () => { playClick(); navigate('home'); });
  document.getElementById('btn-nav-home').addEventListener('click', () => { playClick(); navigate('home'); });
  document.getElementById('btn-nav-map').addEventListener('click', () => { playClick(); navigate('map'); });
  document.getElementById('btn-switch-profile').addEventListener('click', () => { playClick(); navigate('home'); });

  document.getElementById('btn-nav-leaderboard').addEventListener('click', () => {
    playClick();
    showModal('🏆 Papan Peringkat Lokal', (body) => {
      body.innerHTML = renderLeaderboardModalHtml(appState.badgesData);
    });
  });

  document.getElementById('btn-toggle-pid').addEventListener('click', (e) => {
    playClick();
    const isPid = document.body.classList.toggle('pid-mode');
    e.currentTarget.setAttribute('aria-pressed', String(isPid));
    if (isPid && document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (!isPid && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  });

  document.getElementById('btn-toggle-sound').addEventListener('click', (e) => {
    const nextMute = !getMuted();
    setMuted(nextMute);
    e.currentTarget.textContent = nextMute ? '🔇' : '🔊';
    e.currentTarget.setAttribute('aria-pressed', String(nextMute));
    updateActiveStudent((stu) => {
      stu.muted = nextMute;
    });
  });

  document.getElementById('btn-teacher-mode').addEventListener('click', () => {
    playClick();
    showModal('👩‍🏫 Mode Guru (PIN Diperlukan)', (body, footer) => {
      openTeacherModal(body, footer, () => {
        getModal().hide();
        navigate('home');
      });
    });
  });

  // Navigasi Bawah
  document.getElementById('btn-prev-step').addEventListener('click', () => {
    playClick();
    const flow = ['home', 'apersepsi', 'pretest', 'map', 'island', 'posttest', 'reflection', 'certificate'];
    if (appState.route === 'island') {
      if (appState.islandStep === 'boss') {
        appState.islandStep = 'game';
        renderIslandView();
      } else if (appState.islandStep === 'game') {
        appState.islandStep = 'material';
        renderIslandView();
      } else {
        navigate('map');
      }
      return;
    }
    const idx = flow.indexOf(appState.route);
    navigate(flow[Math.max(0, idx - 1)]);
  });

  document.getElementById('btn-next-step').addEventListener('click', () => {
    playClick();
    const stu = getActiveStudent();
    if (appState.route === 'apersepsi') navigate('pretest');
    else if (appState.route === 'pretest') navigate('map');
    else if (appState.route === 'map') navigate('island', { islandId: stu?.unlockedIsland || 1, islandStep: 'material', materialSlide: 0 });
    else if (appState.route === 'island') {
      if (appState.islandStep === 'material') {
        appState.islandStep = 'game';
        renderIslandView();
      } else if (appState.islandStep === 'game') {
        appState.islandStep = 'boss';
        renderIslandView();
      } else if ((stu?.completedIslands || []).length >= 6) {
        navigate('posttest');
      } else {
        navigate('map');
      }
    } else if (appState.route === 'posttest') navigate('reflection');
    else if (appState.route === 'reflection') navigate('certificate');
    else navigate('map');
  });

  document.getElementById('btn-repeat-material').addEventListener('click', () => {
    playClick();
    appState.islandStep = 'material';
    appState.materialSlide = 0;
    renderIslandView();
  });

  document.getElementById('btn-download-summary').addEventListener('click', () => {
    playClick();
    downloadLearningSummary(getActiveStudent());
  });
}

async function initApp() {
  bindGlobalControls();

  // Daftarkan Service Worker PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  try {
    const [textsRes, questionsRes, badgesRes] = await Promise.all([
      fetch('./data/texts.json'),
      fetch('./data/questions.json'),
      fetch('./data/badges.json')
    ]);
    appState.textsData = await textsRes.json();
    appState.questionsData = await questionsRes.json();
    appState.badgesData = (await badgesRes.json()).badges || [];

    const activeStu = getActiveStudent();
    if (activeStu) {
      setMuted(Boolean(activeStu.muted));
      document.getElementById('btn-toggle-sound').textContent = activeStu.muted ? '🔇' : '🔊';
      navigate('map');
    } else {
      navigate('home');
    }
  } catch (err) {
    appRoot.innerHTML = `
      <div class="alert alert-danger rounded-4">
        <h4>Gagal memuat data aplikasi</h4>
        <p class="mb-0">Pastikan aplikasi dijalankan melalui server web (bukan langsung <code>file://</code>). Detail: ${err.message}</p>
      </div>
    `;
  }
}

initApp();
