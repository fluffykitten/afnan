/**
 * Pulau 5 Mini-Game: Detektif Fakta vs Opini (Swipe Kiri/Kanan + Tombol Aksesibel)
 */
import { playClick, playCorrect, playWrong, playVictory } from '../sound.js';
import { t } from '../i18n.js';

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
      lastFeedback = `<div class="alert alert-success rounded-4 small">${t('mg5Correct', { type: item.type.toUpperCase(), reason: item.reason })}</div>`;
    } else {
      playWrong();
      lastFeedback = `<div class="alert alert-warning rounded-4 small">${t('mg5Wrong', { type: item.type.toUpperCase(), reason: item.reason })}</div>`;
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
          <h3 class="h4 fw-bold">${t('mg5DoneTitle')}</h3>
          <p class="mb-2">${t('mg5DoneSub', { correct: scoreCount, total: items.length })}</p>
          <div class="display-4 fw-bold text-primary mb-3">${score}</div>
          ${lastFeedback}
          <button type="button" id="btn-fo-retry" class="btn sq-btn-outline sq-touch mt-2">${t('mg5Retry')}</button>
        </div>
      `;
      container.querySelector('#btn-fo-retry').addEventListener('click', () => {
        playClick();
        idx = 0;
        scoreCount = 0;
        lastFeedback = '';
        render();
      });
      onComplete(score, `Fact vs Opinion Detective: ${scoreCount}/${items.length} correct.`);
      return;
    }

    const current = items[idx];
    container.innerHTML = `
      <div class="sq-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 class="h4 fw-bold mb-1">${t('mg5Title')}</h3>
            <p class="small text-secondary mb-0">${t('mg5Sub')}</p>
          </div>
          <span class="badge sq-badge-tosca fs-6">${t('mg5CardCount', { curr: idx + 1, total: items.length })}</span>
        </div>

        ${lastFeedback}

        <div id="swipe-card" class="sq-swipe-card text-center my-3" tabindex="0">
          <div class="small fw-bold text-primary mb-2">${t('mg5CardHeader')}</div>
          <p class="fs-5 fw-bold mb-0">"${current.text}"</p>
        </div>

        <div class="row g-2">
          <div class="col-6">
            <button type="button" id="btn-fact" class="btn sq-btn-primary sq-touch w-100">
              ${t('mg5FactBtn')}
            </button>
          </div>
          <div class="col-6">
            <button type="button" id="btn-opinion" class="btn sq-btn-tosca sq-touch w-100">
              ${t('mg5OpinionBtn')}
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
