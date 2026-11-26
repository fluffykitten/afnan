/**
 * Modul Sertifikat Otomatis (Dominasi Ungu & Tosca) + Unduh PDF (html2pdf.js) + Cetak
 * serta fitur Unduh Ringkasan Hasil Belajar.
 */
import { CONFIG, getPredikat } from './config.js';
import { playClick, playVictory } from './sound.js';

export function renderCertificateView(container, student, onBackToMap) {
  const score = student.posttest ? student.posttest.score : 0;
  const predikat = getPredikat(score);
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const eligible = Boolean(student.posttest);

  container.innerHTML = `
    <div class="sq-card">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 no-print">
        <div>
          <h2 class="h4 fw-bold mb-1">🎓 Sertifikat Kelulusan Story Quest</h2>
          <p class="small text-secondary mb-0">Sertifikat resmi petualangan Narrative Text (Legend &amp; Fable) untuk diunduh sebagai PDF atau dicetak.</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" id="btn-cert-map" class="btn sq-btn-outline sq-touch">🗺️ Kembali ke Peta</button>
          <button type="button" id="btn-cert-print" class="btn sq-btn-tosca sq-touch" ${eligible ? '' : 'disabled'}>🖨️ Cetak</button>
          <button type="button" id="btn-cert-pdf" class="btn sq-btn-primary sq-touch" ${eligible ? '' : 'disabled'}>📥 Unduh PDF</button>
        </div>
      </div>

      ${
        !eligible
          ? `<div class="alert alert-warning rounded-4">
               ⚠️ Selesaikan <strong>Asesmen Akhir</strong> terlebih dahulu untuk mengaktifkan data nilai pada sertifikatmu.
             </div>`
          : ''
      }

      <div id="certificate-printable" class="sq-certificate text-center">
        <div class="sq-cert-ribbon mb-3">CERTIFICATE OF ACHIEVEMENT</div>
        <h1 class="h2 fw-bold mb-1" style="color: #5b21b6;">STORY QUEST: PULAU CERITA</h1>
        <p class="text-secondary mb-4">${CONFIG.SUBJECT}</p>

        <p class="mb-1">Diberikan dengan bangga kepada:</p>
        <div class="display-5 fw-bold my-2" style="color: #0f766e;">${student.name}</div>
        <p class="fs-5 fw-bold mb-4">Kelas: ${student.className}</p>

        <p class="mx-auto mb-4" style="max-width: 680px;">
          Telah menyelesaikan pembelajaran mendalam materi <strong>Narrative Text (Legend &amp; Fable)</strong>
          yang mencakup analisis tujuan komunikatif, schematic structure, proporsi teks, perbandingan kritis, evaluasi fakta vs opini, serta perancangan cerita orisinal.
        </p>

        <div class="row justify-content-center g-3 mb-4">
          <div class="col-sm-4">
            <div class="p-3 rounded-4 border" style="background: #f5f3ff; border-color: #c4b5fd !important;">
              <div class="small text-secondary">Nilai Akhir</div>
              <div class="h2 fw-bold mb-0" style="color: #6d28d9;">${score}</div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="p-3 rounded-4 border" style="background: #f0fdfa; border-color: #99f6e4 !important;">
              <div class="small text-secondary">Predikat</div>
              <div class="h4 fw-bold mb-0" style="color: #0d9488;">${predikat.label}</div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="p-3 rounded-4 border" style="background: #ffffff;">
              <div class="small text-secondary">Total XP &amp; Pulau</div>
              <div class="h5 fw-bold mb-0">${student.xp} XP • ${(student.completedIslands || []).length}/6 Pulau</div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-end flex-wrap gap-3 pt-3 border-top">
          <div class="text-start small">
            <div>Tanggal Terbit: <strong>${dateStr}</strong></div>
            <div>ID Sertifikat: <strong>SQ-${student.id.slice(-6).toUpperCase()}</strong></div>
          </div>
          <div class="text-end">
            <div class="fw-bold" style="color: #5b21b6;">Tim Pengembang Story Quest</div>
            <div class="small text-secondary">Pembelajaran Bahasa Inggris SMP Kelas 9</div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-cert-map').addEventListener('click', () => {
    playClick();
    onBackToMap();
  });

  container.querySelector('#btn-cert-print').addEventListener('click', () => {
    playClick();
    window.print();
  });

  container.querySelector('#btn-cert-pdf').addEventListener('click', () => {
    playVictory();
    const element = container.querySelector('#certificate-printable');
    const safeName = student.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    if (typeof window.html2pdf === 'function') {
      window
        .html2pdf()
        .set({
          margin: 10,
          filename: `Sertifikat_StoryQuest_${safeName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        })
        .from(element)
        .save();
    } else {
      window.print();
    }
  });
}

export function downloadLearningSummary(student) {
  if (!student) return;
  const lines = [
    `LAPORAN HASIL BELAJAR — ${CONFIG.APP_NAME}`,
    `Nama Siswa   : ${student.name}`,
    `Kelas        : ${student.className}`,
    `XP & Streak  : ${student.xp} XP | Streak ${student.streak} hari`,
    `Pulau Selesai: ${(student.completedIslands || []).join(', ') || 'Belum ada'}`,
    `Asesmen Awal : ${student.pretest ? `${student.pretest.score} (Rekomendasi Pulau ${student.pretest.recommendedIsland})` : 'Belum dikerjakan'}`,
    `Asesmen Akhir: ${student.posttest ? `${student.posttest.score} (${student.posttest.predikat})` : 'Belum dikerjakan'}`,
    `Badge        : ${(student.badges || []).length} badge`,
    '',
    '--- REFLEKSI SISWA ---',
    `1. Hal baru yang kupelajari: ${student.reflection?.blank1 || '-'}`,
    `2. Bagian yang paling menantang: ${student.reflection?.blank2 || '-'}`,
    `3. Cara menentukanku membedakan fakta & opini: ${student.reflection?.blank3 || '-'}`,
    `4. Nilai moral yang akan kuteladani: ${student.reflection?.blank4 || '-'}`,
    '',
    '--- RANCANGAN CERITA ORISINAL ---',
    student.createdStory
      ? `Judul: ${student.createdStory.title} (${student.createdStory.genre})\nOrientation: ${student.createdStory.orientation}\nComplication: ${student.createdStory.complication}\nResolution: ${student.createdStory.resolution}\nRe-orientation: ${student.createdStory.reorientation}`
      : 'Belum membuat rancangan cerita.'
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Hasil_Belajar_${student.name.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
