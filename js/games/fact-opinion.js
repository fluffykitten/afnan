/**
 * Pulau 5 Mini-Game: Detektif Fakta vs Opini (Swipe Kiri/Kanan + Tombol Aksesibel)
 */
import { playClick, playCorrect, playWrong, playVictory } from '../sound.js';

export function renderFactOpinionGame(container, textsData, onComplete) {
  const items = (textsData.factOpinionItems || []).slice(0, 8);
  let idx = 0;
  let scoreCount = 0;
  let lastFeedback = '';
  let touchStartX = 0;

  function answer(choice) {
    const item = items[idx];
    const isCorrect = choice === item.type;
    if (isCorrect) {
      scoreCount += 1;
      playCorrect();
      lastFeedback = `<div class="alert alert-success rounded-4 small">✅ Benar! (${item.type.toUpperCase()}) — ${item.reason}</div>`;
    } else {
      playWrong();
      lastFeedback = `<div class="alert alert-warning rounded-4 small">🌱 Belum tepat! Seharusnya <strong>${item.type.toUpperCase()}</strong>. ${item.reason}</div>`;
    }
    idx += 1;
    render();
  }

  function render() {
    if (idx >= items.length) {
      const score = Math.round((scoreCount / items.length) * 100);
      playVictory();
      container.innerHTML = `
        <div class="sq-card text-center">
          <div class="display-4 mb-2">🔍</div>
          <h3 class="h4 fw-bold">Misi Detektif Fakta vs Opini Tuntas!</h3>
          <p class="mb-2">Ketepatan memilah: <strong>${scoreCount} / ${items.length}</strong> kartu</p>
          <div class="display-4 fw-bold text-primary mb-3">${score}</div>
          ${lastFeedback}
          <button type="button" id="btn-fo-retry" class="btn sq-btn-outline sq-touch mt-2">🔄 Main Lagi</button>
        </div>
      `;
      container.querySelector('#btn-fo-retry').addEventListener('click', () => {
        playClick();
        idx = 0;
        scoreCount = 0;
        lastFeedback = '';
        render();
      });
      onComplete(score, `Detektif Fakta vs Opini: ${scoreCount}/${items.length} benar.`);
      return;
    }

    const current = items[idx];
    container.innerHTML = `
      <div class="sq-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 class="h4 fw-bold mb-1">🔍 Detektif Fakta vs Opini</h3>
            <p class="small text-secondary mb-0">Geser (swipe) kartu ke <strong>Kiri (FAKTA)</strong> atau <strong>Kanan (OPINI)</strong>, atau tekan tombol di bawah.</p>
          </div>
          <span class="badge sq-badge-tosca fs-6">Kartu ${idx + 1} / ${items.length}</span>
        </div>

        ${lastFeedback}

        <div id="swipe-card" class="sq-swipe-card text-center my-3" tabindex="0">
          <div class="small fw-bold text-primary mb-2">PERNYATAAN TEKS</div>
          <p class="fs-5 fw-bold mb-0">"${current.text}"</p>
        </div>

        <div class="row g-2">
          <div class="col-6">
            <button type="button" id="btn-fact" class="btn sq-btn-primary sq-touch w-100">
              ⬅️ FAKTA TEKS
            </button>
          </div>
          <div class="col-6">
            <button type="button" id="btn-opinion" class="btn sq-btn-tosca sq-touch w-100">
              OPINI PEMBACA ➡️
            </button>
          </div>
        </div>
      </div>
    `;

    const cardEl = container.querySelector('#swipe-card');
    cardEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    cardEl.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (diff < -45) answer('fact');
      else if (diff > 45) answer('opinion');
    });

    container.querySelector('#btn-fact').addEventListener('click', () => answer('fact'));
    container.querySelector('#btn-opinion').addEventListener('click', () => answer('opinion'));
  }

  render();
}
