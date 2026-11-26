/**
 * Mesin Kuis Reusable untuk Asesmen Awal Adaptif, Boss Quiz (10 soal HOTS),
 * dan Asesmen Akhir (10 soal sedang-tinggi).
 */
import { CONFIG } from './config.js';
import { playClick, playCorrect, playWrong, playVictory } from './sound.js';
import { fireConfettiIfHigh } from './gamification.js';
import { t, getPredikatLocalized, getIslandMeta, getGrowthMindsetMsg } from './i18n.js';

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildBossQuizQuestions(allHots, islandId) {
  const specific = shuffle(allHots.filter((q) => q.islandId === islandId)).slice(0, 5);
  const cross = shuffle(allHots.filter((q) => q.islandId !== islandId)).slice(0, 5);
  return [...specific, ...cross];
}

export function buildPosttestQuestions(allPosttest) {
  const hard = shuffle(allPosttest.filter((q) => q.difficulty === 'hard')).slice(0, 5);
  const medium = shuffle(allPosttest.filter((q) => q.difficulty !== 'hard')).slice(0, 5);
  return shuffle([...hard, ...medium]);
}

export function renderQuizSession({
  container,
  title,
  subtitle,
  mode,
  questionsPool,
  totalQuestions = 10,
  onComplete
}) {
  const isAdaptive = mode === 'pretest';
  let activeQuestions = isAdaptive ? [] : questionsPool.slice(0, totalQuestions);
  const usedIds = new Set();

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
  const topicStats = {};

  function renderQuestion() {
    const q = activeQuestions[index];
    if (!q) {
      finishQuiz();
      return;
    }
    answered = false;
    const progressPct = Math.round((index / totalQuestions) * 100);
    const diffBadge =
      q.difficulty === 'hard'
        ? `<span class="badge bg-danger">${t('diffHard')}</span>`
        : q.difficulty === 'easy'
          ? `<span class="badge bg-success">${t('diffEasy')}</span>`
          : `<span class="badge bg-primary">${t('diffMedium')}</span>`;

    container.innerHTML = `
      <div class="sq-card">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h2 class="h4 fw-bold mb-1">${title}</h2>
            <p class="text-secondary mb-0 small">${subtitle}</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            ${diffBadge}
            <span class="badge sq-badge-tosca fs-6">${t('questionProgress', { curr: index + 1, total: totalQuestions })}</span>
          </div>
        </div>

        <div class="progress sq-progress-bar mb-4" role="progressbar" aria-valuenow="${progressPct}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: ${progressPct}%"></div>
        </div>

        ${
          q.passage
            ? `<div class="sq-reading-box mb-3">
                 <div class="small fw-bold text-primary mb-1">${t('passageLabel')}</div>
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
          <div class="small fw-bold text-secondary">${t('tempCorrect', { count: correctCount })}</div>
          <button type="button" id="btn-quiz-next" class="btn sq-btn-primary sq-touch d-none">
            ${index + 1 < totalQuestions ? t('nextQuestionBtn') : t('seeFinalResultBtn')}
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
              <strong>${t('correctToast')}</strong>
              <p class="mb-0 mt-1 small">${q.explanation}</p>
            </div>
          `;
          if (isAdaptive) {
            currentDiff = currentDiff === 'easy' ? 'medium' : 'hard';
          }
        } else {
          topicStats[topicKey].wrong += 1;
          playWrong();
          const gmMsg = getGrowthMindsetMsg();
          feedbackBox.innerHTML = `
            <div class="alert alert-warning rounded-4 border-2">
              <strong>🌱 ${gmMsg}</strong>
              <p class="mb-1 mt-1 small"><strong>${t('answerKeyLabel')}</strong> ${String.fromCharCode(65 + q.answerIndex)}. ${q.options[q.answerIndex]}</p>
              <p class="mb-0 small"><strong>${t('explanationLabel')}</strong> ${q.explanation}</p>
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
    const predikat = getPredikatLocalized(score);
    playVictory();
    fireConfettiIfHigh(score);

    let recommendedIsland = 1;
    let maxWrong = -1;
    Object.entries(topicStats).forEach(([islandKey, st]) => {
      if (st.wrong > maxWrong) {
        maxWrong = st.wrong;
        recommendedIsland = Number(islandKey);
      }
    });
    if (maxWrong <= 0) recommendedIsland = 1;

    const islandMeta = getIslandMeta(recommendedIsland);

    let extraHtml = '';
    if (mode === 'pretest') {
      extraHtml = `
        <div class="sq-info-box my-3 text-start">
          <div class="sq-info-title">${t('recBoxTitle')}</div>
          <p class="mb-1">
            ${t('recBoxDesc', { id: recommendedIsland, name: islandMeta.name, sub: islandMeta.subtitle })}
          </p>
          <p class="mb-0 small">
            ${t('recBoxNote')}
          </p>
        </div>
      `;
    } else if (mode === 'posttest') {
      extraHtml = `
        <div class="my-3">
          <span class="badge bg-${predikat.color} fs-5 px-4 py-2 rounded-pill">
            ${t('predicateLabel', { label: predikat.label })}
          </span>
        </div>
      `;
    } else if (mode === 'boss') {
      const passed = score >= CONFIG.PASSING_SCORE;
      extraHtml = `
        <div class="alert ${passed ? 'alert-success' : 'alert-info'} rounded-4 my-3">
          ${passed ? t('bossPassedMsg') : t('bossFailedMsg', { pass: CONFIG.PASSING_SCORE })}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="sq-card text-center">
        <div class="display-4 mb-2">${score >= 90 ? '🏆' : score >= 70 ? '🎉' : '🌱'}</div>
        <h2 class="h3 fw-bold mb-1">${t('resultHeading', { title })}</h2>
        <p class="text-secondary mb-3">${t('resultCountSub', { correct: correctCount, total: totalQuestions })}</p>
        <div class="display-3 fw-bold text-primary mb-2">${score}</div>
        ${extraHtml}
        <div class="d-flex flex-wrap justify-content-center gap-2 mt-4">
          <button type="button" id="btn-quiz-retry" class="btn sq-btn-outline sq-touch">${t('retryQuizBtn')}</button>
          <button type="button" id="btn-quiz-finish" class="btn sq-btn-primary sq-touch">${t('continueAdvBtn')}</button>
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
      onComplete(resultPayload);
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
