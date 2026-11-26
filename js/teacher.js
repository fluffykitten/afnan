/**
 * Modul Mode Guru (Dilindungi PIN sederhana di CONFIG.TEACHER_PIN)
 * Fitur: Rekap hasil semua siswa, ekspor CSV/JSON, atur durasi timer & URL YouTube, reset data.
 */
import { CONFIG } from './config.js';
import { getAllStudents, getSettings, updateSettings, clearAllData } from './storage.js';
import { playClick, playCorrect, playWrong } from './sound.js';

export function openTeacherModal(modalBody, modalFooter, onDataReset) {
  let unlocked = false;

  function renderPinPrompt(errorMsg = '') {
    modalBody.innerHTML = `
      <div class="p-2">
        <p class="mb-3">Masukkan <strong>PIN Guru</strong> untuk mengakses rekap nilai, pengaturan timer, ekspor CSV/JSON, dan reset data perangkat.</p>
        <form id="teacher-pin-form" class="row g-2 align-items-center">
          <div class="col-sm-8">
            <input type="password" id="teacher-pin-input" class="form-control sq-touch" placeholder="Masukkan PIN (default: 1234)" required />
          </div>
          <div class="col-sm-4">
            <button type="submit" class="btn sq-btn-primary sq-touch w-100">🔓 Masuk</button>
          </div>
        </form>
        ${errorMsg ? `<div class="alert alert-danger mt-3 mb-0 small">${errorMsg}</div>` : ''}
      </div>
    `;
    modalFooter.innerHTML = '<button type="button" class="btn sq-btn-outline sq-touch" data-bs-dismiss="modal">Tutup</button>';

    modalBody.querySelector('#teacher-pin-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const val = modalBody.querySelector('#teacher-pin-input').value.trim();
      if (val === CONFIG.TEACHER_PIN) {
        unlocked = true;
        playCorrect();
        renderDashboard();
      } else {
        playWrong();
        renderPinPrompt('PIN salah! Cek nilai CONFIG.TEACHER_PIN pada file js/config.js.');
      }
    });
  }

  function renderDashboard(notice = '') {
    if (!unlocked) return;
    const students = getAllStudents();
    const settings = getSettings();

    modalBody.innerHTML = `
      ${notice ? `<div class="alert alert-success rounded-4 small">${notice}</div>` : ''}
      <div class="mb-4">
        <h6 class="fw-bold text-primary mb-2">📊 Rekap Hasil Belajar Siswa (${students.length} Profil di Perangkat Ini)</h6>
        ${
          students.length === 0
            ? '<p class="small text-secondary">Belum ada data siswa.</p>'
            : `<div class="table-responsive">
                 <table class="table table-sm table-bordered small align-middle">
                   <thead class="table-light">
                     <tr>
                       <th>Nama</th>
                       <th>Kelas</th>
                       <th>Pretest</th>
                       <th>Pulau</th>
                       <th>Nilai Akhir</th>
                       <th>Predikat</th>
                       <th>XP</th>
                     </tr>
                   </thead>
                   <tbody>
                     ${students
                       .map(
                         (s) => `
                         <tr>
                           <td class="fw-bold">${s.name}</td>
                           <td>${s.className}</td>
                           <td>${s.pretest ? s.pretest.score : '-'}</td>
                           <td>${(s.completedIslands || []).length}/6</td>
                           <td>${s.posttest ? s.posttest.score : '-'}</td>
                           <td>${s.posttest ? s.posttest.predikat : '-'}</td>
                           <td>${s.xp || 0}</td>
                         </tr>`
                       )
                       .join('')}
                   </tbody>
                 </table>
               </div>`
        }
        <div class="d-flex flex-wrap gap-2 mt-2">
          <button type="button" id="btn-export-csv" class="btn btn-sm sq-btn-primary sq-touch-sm">📄 Ekspor CSV</button>
          <button type="button" id="btn-export-json" class="btn btn-sm sq-btn-tosca sq-touch-sm">📦 Ekspor JSON</button>
        </div>
      </div>

      <hr/>

      <form id="teacher-settings-form" class="row g-3 mb-4">
        <div class="col-12"><h6 class="fw-bold text-primary mb-0">⚙️ Pengaturan Pembelajaran</h6></div>
        <div class="col-md-5">
          <label class="form-label small fw-bold" for="cfg-timer">Durasi Balapan Kuis (detik)</label>
          <input type="number" id="cfg-timer" min="30" max="300" class="form-control sq-touch-sm" value="${settings.quizRaceSeconds}" />
        </div>
        <div class="col-md-7">
          <label class="form-label small fw-bold" for="cfg-yt">Link Video YouTube Apersepsi</label>
          <input type="url" id="cfg-yt" class="form-control sq-touch-sm" value="${settings.youtubeUrl}" />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-sm sq-btn-outline sq-touch-sm">💾 Simpan Pengaturan</button>
        </div>
      </form>

      <hr/>

      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div class="small text-danger fw-bold">Zona Berbahaya: Hapus seluruh profil &amp; progres di browser ini.</div>
        <button type="button" id="btn-reset-all" class="btn btn-sm btn-danger sq-touch-sm">🗑️ Reset Semua Data</button>
      </div>
    `;

    modalBody.querySelector('#btn-export-csv').addEventListener('click', () => {
      playClick();
      const header = ['Nama', 'Kelas', 'XP', 'Streak', 'Pretest', 'Pulau_Selesai', 'Nilai_Akhir', 'Predikat', 'Badge_Count'];
      const rows = students.map((s) => [
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.className.replace(/"/g, '""')}"`,
        s.xp || 0,
        s.streak || 0,
        s.pretest ? s.pretest.score : '',
        (s.completedIslands || []).length,
        s.posttest ? s.posttest.score : '',
        s.posttest ? `"${s.posttest.predikat}"` : '',
        (s.badges || []).length
      ]);
      const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
      triggerDownload(csv, 'Rekap_StoryQuest_SMP9.csv', 'text/csv;charset=utf-8');
    });

    modalBody.querySelector('#btn-export-json').addEventListener('click', () => {
      playClick();
      triggerDownload(JSON.stringify(students, null, 2), 'Rekap_StoryQuest_SMP9.json', 'application/json');
    });

    modalBody.querySelector('#teacher-settings-form').addEventListener('submit', (e) => {
      e.preventDefault();
      playClick();
      const quizRaceSeconds = Math.max(30, Number(modalBody.querySelector('#cfg-timer').value) || 90);
      const youtubeUrl = modalBody.querySelector('#cfg-yt').value.trim() || CONFIG.APERSEPSI_YOUTUBE_URL;
      updateSettings({ quizRaceSeconds, youtubeUrl });
      renderDashboard('✅ Pengaturan berhasil disimpan.');
    });

    modalBody.querySelector('#btn-reset-all').addEventListener('click', () => {
      if (window.confirm('Yakin ingin menghapus seluruh data siswa di perangkat ini? Tindakan tidak dapat dibatalkan.')) {
        clearAllData();
        if (typeof onDataReset === 'function') onDataReset();
      }
    });
  }

  function triggerDownload(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  renderPinPrompt();
}
