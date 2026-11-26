/**
 * Mesin Kuis Reusable untuk Asesmen Awal Adaptif, Boss Quiz (10 soal HOTS),
 * dan Asesmen Akhir (10 soal sedang-tinggi).
 */
import { CONFIG, getPredikat } from './config.js';
import { playClick, playCorrect, playWrong, playVictory } from './sound.js';
import { fireConfettiIfHigh } from './gamification.js';

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Mengambil paket 10 soal untuk Boss Quiz Pulau (5 khusus pulau + 5 lintas topik)
 */
export function buildBossQuizQuestions(allHots, islandId) {
  const specific = shuffle(allHots.filter((q) => q.islandId === islandId)).slice(0, 5);
  const cross = shuffle(allHots.filter((q) => q.islandId !== islandId)).slice(0, 5);
  return [...specific, ...cross];
}

/**
 * Mengambil paket 10 soal Asesmen Akhir (sedang-tinggi)
 */
export function buildPosttestQuestions(allPosttest) {
  const hard = shuffle(allPosttest.filter((q) => q.difficulty === 'hard')).slice(0, 5);
  const medium = shuffle(allPosttest.filter((q) => q.difficulty !== 'hard')).slice(0, 5);
  return shuffle([...hard, ...medium]);
}

/**
 * Render dan jalankan sesi kuis pada elemen container.
 * @param {Object} opts
 */
export function renderQuizSession({
  container,
  title,
  subtitle,
  mode, // 'pretest' | 'boss' | 'posttest'
  questionsPool,
  totalQuestions = 10,
  onComplete
}) {
  const isAdaptive = mode === 'pretest';
  let activeQuestions = isAdaptive ? [] : questionsPool.slice(0, totalQuestions);
  const usedIds = new Set();

  // Untuk mode adaptif pretest, mulai dari soal tingkat medium
  function pickNextAdaptiveQuestion(currentDiff) {
    let candidates = questionsPool.filter((q) => !usedIds.has(q.id) && q.difficulty === currentDiff);
    if (candidates.length === 0) {
      candidates = questionsPool.filter((q) => !usedIds.has(q.id));
    }
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    if (chosen) usedIds.add(chosen.id);
    return chosen;
  }

  let currentDiff = 'medium';
  if (isAdaptive) {
    const first = pickNextAdaptiveQuestion('medium');
    if (first) activeQuestions.push(first);
  }

  let index = 0;
  let correctCount = 0;
  let answered = false;
  const topicStats = {}; // untuk rekomendasi adaptif

  function renderQuestion() {
    const q = activeQuestions[index];
    if (!q) {
      finishQuiz();
      return;
    }
    answered = false;
    const progressPct = Math.round(((index) / totalQuestions) * 100);
    const diffBadge =
      q.difficulty === 'hard'
        ? '<span class="badge bg-danger">Level: Tinggi (HOTS)</span>'
        : q.difficulty === 'easy'
          ? '<span class="badge bg-success">Level: Dasar</span>'
          : '<span class="badge bg-primary">Level: Sedang</span>';

    container.innerHTML = `
      <div class="sq-card">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h2 class="h4 fw-bold mb-1">${title}</h2>
            <p class="text-secondary mb-0 small">${subtitle}</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            ${diffBadge}
            <span class="badge sq-badge-tosca fs-6">Soal ${index + 1} / ${totalQuestions}</span>
          </div>
        </div>

        <div class="progress sq-progress-bar mb-4" role="progressbar" aria-valuenow="${progressPct}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: ${progressPct}%"></div>
        </div>

        ${
          q.passage
            ? `<div class="sq-reading-box mb-3">
                 <div class="small fw-bold text-primary mb-1">📖 Cuplikan Teks (English):</div>
                 <p class="mb-0">${q.passage}</p>
               </div>`
            : ''
        }

        <div class="mb-3">
          <span class="badge bg-light text-dark border mb-2">${q.topicLabel || 'Narrative Text'}</span>
          <h3 class="h5 fw-bold">${q.question}</h3>
        </div>

        <div class="d-grid gap-2 mb-3" id="quiz-options">
          ${q.options
            .map(
              (opt, idx) => `
              <button type="button" class="sq-option-btn sq-touch" data-idx="${idx}">
                <span class="me-2 fw-bold">${String.fromCharCode(65 + idx)}.</span> ${opt}
              </button>`
            )
            .join('')}
        </div>

        <div id="quiz-feedback" class="d-none"></div>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <div class="small fw-bold text-secondary">Skor benar sementara: ${correctCount}</div>
          <button type="button" id="btn-quiz-next" class="btn sq-btn-primary sq-touch d-none">
            ${index + 1 < totalQuestions ? 'Soal Berikutnya ➡️' : 'Lihat Hasil Akhir 🏁'}
          </button>
        </div>
      </div>
    `;

    const optBtns = container.querySelectorAll('.sq-option-btn');
    optBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const selected = Number(btn.dataset.idx);
        const isCorrect = selected === q.answerIndex;

        const topicKey = q.topicIsland || q.islandId || 1;
        if (!topicStats[topicKey]) topicStats[topicKey] = { total: 0, wrong: 0 };
        topicStats[topicKey].total += 1;

        optBtns.forEach((b, bIdx) => {
          b.disabled = true;
          if (bIdx === q.answerIndex) b.classList.add('correct');
          else if (bIdx === selected && !isCorrect) b.classList.add('wrong');
        });

        const feedbackBox = container.querySelector('#quiz-feedback');
        feedbackBox.classList.remove('d-none');

        if (isCorrect) {
          correctCount += 1;
          playCorrect();
          feedbackBox.innerHTML = `
            <div class="alert alert-success rounded-4 border-2">
              <strong>✅ Hebat! Jawabanmu tepat!</strong>
              <p class="mb-0 mt-1 small">${q.explanation}</p>
            </div>
          `;
          if (isAdaptive) {
            currentDiff = currentDiff === 'easy' ? 'medium' : 'hard';
          }
        } else {
          topicStats[topicKey].wrong += 1;
          playWrong();
          const gmMsg =
            CONFIG.GROWTH_MINDSET_FEEDBACK[Math.floor(Math.random() * CONFIG.GROWTH_MINDSET_FEEDBACK.length)];
          feedbackBox.innerHTML = `
            <div class="alert alert-warning rounded-4 border-2">
              <strong>🌱 ${gmMsg}</strong>
              <p class="mb-1 mt-1 small"><strong>Kunci Jawaban:</strong> ${String.fromCharCode(65 + q.answerIndex)}. ${q.options[q.answerIndex]}</p>
              <p class="mb-0 small"><strong>Pembahasan:</strong> ${q.explanation}</p>
            </div>
          `;
          if (isAdaptive) {
            currentDiff = currentDiff === 'hard' ? 'medium' : 'easy';
          }
        }

        const nextBtn = container.querySelector('#btn-quiz-next');
        nextBtn.classList.remove('d-none');
        nextBtn.focus();
      });
    });

    container.querySelector('#btn-quiz-next').addEventListener('click', () => {
      playClick();
      index += 1;
      if (isAdaptive && index < totalQuestions) {
        const nextQ = pickNextAdaptiveQuestion(currentDiff);
        if (nextQ) activeQuestions.push(nextQ);
      }
      renderQuestion();
    });
  }

  function finishQuiz() {
    const score = Math.round((correctCount / totalQuestions) * 100);
    const predikat = getPredikat(score);
    playVictory();
    fireConfettiIfHigh(score);

    // Cari pulau rekomendasi berdasarkan topik dengan kesalahan terbanyak (untuk pretest)
    let recommendedIsland = 1;
    let maxWrong = -1;
    Object.entries(topicStats).forEach(([islandKey, st]) => {
      if (st.wrong > maxWrong) {
        maxWrong = st.wrong;
        recommendedIsland = Number(islandKey);
      }
    });
    if (maxWrong <= 0) recommendedIsland = 1;

    const islandInfo = CONFIG.ISLANDS.find((isl) => isl.id === recommendedIsland) || CONFIG.ISLANDS[0];

    let extraHtml = '';
    if (mode === 'pretest') {
      extraHtml = `
        <div class="sq-info-box my-3 text-start">
          <div class="sq-info-title">🧭 Rekomendasi Peta Petualanganmu</div>
          <p class="mb-1">
            Berdasarkan jawabanmu pada Asesmen Awal Adaptif, fokus belajar yang paling disarankan adalah
            <strong>Pulau ${islandInfo.id}: ${islandInfo.name}</strong> (${islandInfo.subtitle}).
          </p>
          <p class="mb-0 small">
            Sesuai aturan petualangan, semua pulau tetap dibuka berurutan mulai dari Pulau 1. Pulau rekomendasi akan ditandai khusus di peta agar kamu lebih teliti saat sampai di sana!
          </p>
        </div>
      `;
    } else if (mode === 'posttest') {
      extraHtml = `
        <div class="my-3">
          <span class="badge bg-${predikat.color} fs-5 px-4 py-2 rounded-pill">
            Predikat: ${predikat.label}
          </span>
        </div>
      `;
    } else if (mode === 'boss') {
      const passed = score >= CONFIG.PASSING_SCORE;
      extraHtml = `
        <div class="alert ${passed ? 'alert-success' : 'alert-info'} rounded-4 my-3">
          ${
            passed
              ? '🎉 <strong>Boss Pulau Berhasil Dikalahkan!</strong> Pulau berikutnya kini terbuka di peta!'
              : `🌱 <strong>Skor masih di bawah ${CONFIG.PASSING_SCORE}.</strong> Tidak apa-apa! Ulangi mini-materi atau coba Boss Quiz lagi untuk membuka pulau berikutnya.`
          }
        </div>
      `;
    }

    container.innerHTML = `
      <div class="sq-card text-center">
        <div class="display-4 mb-2">${score >= 90 ? '🏆' : score >= 70 ? '🎉' : '🌱'}</div>
        <h2 class="h3 fw-bold mb-1">Hasil ${title}</h2>
        <p class="text-secondary mb-3">${correctCount} dari ${totalQuestions} soal dijawab benar</p>
        <div class="display-3 fw-bold text-primary mb-2">${score}</div>
        ${extraHtml}
        <div class="d-flex flex-wrap justify-content-center gap-2 mt-4">
          <button type="button" id="btn-quiz-retry" class="btn sq-btn-outline sq-touch">🔄 Coba Lagi</button>
          <button type="button" id="btn-quiz-finish" class="btn sq-btn-primary sq-touch">Lanjutkan Petualangan ➡️</button>
        </div>
      </div>
    `;

    const resultPayload = {
      score,
      correctCount,
      totalQuestions,
      predikat: predikat.label,
      recommendedIsland,
      passed: score >= CONFIG.PASSING_SCORE
    };

    if (typeof onComplete === 'function') {
      onComplete(resultPayload, {
        onRetry: () => {
          playClick();
          renderQuizSession({ container, title, subtitle, mode, questionsPool, totalQuestions, onComplete });
        }
      });
    }

    container.querySelector('#btn-quiz-retry').addEventListener('click', () => {
      playClick();
      renderQuizSession({ container, title, subtitle, mode, questionsPool, totalQuestions, onComplete });
    });

    container.querySelector('#btn-quiz-finish').addEventListener('click', () => {
      playClick();
      if (typeof onComplete === 'function') {
        onComplete({ ...resultPayload, userClickedContinue: true });
      }
    });
  }

  renderQuestion();
}
