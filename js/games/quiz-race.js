/**
 * Pulau 4 Mini-Game: Perbandingan Legend vs Fable + Balapan Kuis Timer & Power-up (50:50, +15s)
 */
import { playClick, playCorrect, playWrong, playVictory } from '../sound.js';
import { getSettings } from '../storage.js';
import { t } from '../i18n.js';

export function renderQuizRaceGame(container, textsData, onComplete) {
  const legend = textsData.texts.find((item) => item.id === 'malin') || textsData.texts[1];
  const fable = textsData.texts.find((item) => item.id === 'kancil') || textsData.texts[3];

  const raceQuestions = [
    {
      q: 'Based on the table, which text has a dedicated Evaluation stage?',
      options: ['Malin Kundang (Legend)', 'The Clever Mouse Deer (Fable)', 'Both texts', 'Neither text'],
      ans: 0
    },
    {
      q: 'What is the main difference in characters between Malin Kundang and Kancil?',
      options: [
        'Malin uses human family conflict; Kancil uses talking animals.',
        'Malin uses robots; Kancil uses humans.',
        'Both use crocodiles as heroes.',
        'Neither has a main character.'
      ],
      ans: 0
    },
    {
      q: 'In the proportion chart, which stage is proportionally largest in Kancil (3 of 8 sentences = 37.5%)?',
      options: ['Orientation', 'Complication', 'Resolution', 'Re-orientation'],
      ans: 2
    },
    {
      q: 'Which TWO evidences show why Malin Kundang is a Legend while Kancil is a Fable?',
      options: [
        'Malin explains Air Manis Beach stone & human pride; Kancil features clever talking animals without landmark origin.',
        'Malin is in English; Kancil is in French.',
        'Malin has no conflict; Kancil has no ending.',
        'Both explain mountain eruptions.'
      ],
      ans: 0
    },
    {
      q: 'What similarity do BOTH stories share in their Resolution?',
      options: [
        'Both stories end with a wedding feast.',
        'Actions have clear consequences that reinforce the moral value.',
        'Both protagonists sail on merchant ships.',
        'Both stories forget to resolve the problem.'
      ],
      ans: 1
    }
  ];

  const baseSeconds = getSettings().quizRaceSeconds || 90;
  let timeLeft = baseSeconds;
  let qIndex = 0;
  let correct = 0;
  let usedFifty = false;
  let usedAddTime = false;
  let timerHandle = null;
  let chartInstance = null;
  let finished = false;

  function calcStats(story) {
    const map = { Orientation: 0, Complication: 0, Evaluation: 0, Resolution: 0, 'Re-orientation': 0 };
    let total = 0;
    story.stages.forEach((s) => {
      map[s.stage] = s.sentences.length;
      total += s.sentences.length;
    });
    return { map, total };
  }

  const lStat = calcStats(legend);
  const fStat = calcStats(fable);

  function stopTimer() {
    if (timerHandle) {
      clearInterval(timerHandle);
      timerHandle = null;
    }
  }

  function startTimer() {
    stopTimer();
    timerHandle = setInterval(() => {
      if (finished || !document.body.contains(container)) {
        stopTimer();
        return;
      }
      timeLeft -= 1;
      const timerEl = container.querySelector('#race-timer-val');
      if (timerEl) timerEl.textContent = `${timeLeft}${t('mg4SecUnit')}`;
      if (timeLeft <= 0) {
        stopTimer();
        finishRace();
      }
    }, 1000);
  }

  function renderComparisonPanel() {
    return `
      <div class="row g-3 mb-4">
        <div class="col-lg-6">
          <div class="table-responsive">
            <table class="table table-sm table-bordered small align-middle mb-0">
              <thead class="table-primary">
                <tr>
                  <th>${t('mg4ColAspect')}</th>
                  <th>${legend.title} (Legend)</th>
                  <th>${fable.title} (Fable)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td class="fw-bold">${t('mg4RowChars')}</td><td>${t('mg4RowCharsL')}</td><td>${t('mg4RowCharsF')}</td></tr>
                <tr><td class="fw-bold">${t('mg4RowOrigin')}</td><td>${t('mg4RowOriginL')}</td><td>${t('mg4RowOriginF')}</td></tr>
                <tr><td class="fw-bold">${t('mg4RowTotal')}</td><td>${lStat.total}</td><td>${fStat.total}</td></tr>
                <tr><td class="fw-bold">Complication</td><td>${lStat.map.Complication} (${Math.round((lStat.map.Complication / lStat.total) * 100)}%)</td><td>${fStat.map.Complication} (${Math.round((fStat.map.Complication / fStat.total) * 100)}%)</td></tr>
                <tr><td class="fw-bold">Resolution</td><td>${lStat.map.Resolution} (${Math.round((lStat.map.Resolution / lStat.total) * 100)}%)</td><td>${fStat.map.Resolution} (${Math.round((fStat.map.Resolution / fStat.total) * 100)}%)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="p-2 border rounded-4 bg-white">
            <canvas id="compare-chart" height="160" aria-label="Comparison proportion chart"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  function initChart() {
    const canvas = container.querySelector('#compare-chart');
    if (window.Chart && canvas) {
      if (chartInstance) chartInstance.destroy();
      const labels = ['Orientation', 'Complication', 'Evaluation', 'Resolution', 'Re-orientation'];
      chartInstance = new window.Chart(canvas, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Legend (Malin) %',
              data: labels.map((l) => Math.round((lStat.map[l] / lStat.total) * 100)),
              backgroundColor: '#1d4ed8'
            },
            {
              label: 'Fable (Kancil) %',
              data: labels.map((l) => Math.round((fStat.map[l] / fStat.total) * 100)),
              backgroundColor: '#0d9488'
            }
          ]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, max: 50 } } }
      });
    }
  }

  function renderQuestion() {
    if (qIndex >= raceQuestions.length) {
      finishRace();
      return;
    }
    const item = raceQuestions[qIndex];
    container.innerHTML = `
      <div class="sq-card">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h3 class="h4 fw-bold mb-1">${t('mg4Title')}</h3>
            <p class="small text-secondary mb-0">${t('mg4Sub')}</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-danger fs-6">⏱️ <span id="race-timer-val">${timeLeft}${t('mg4SecUnit')}</span></span>
            <span class="badge sq-badge-tosca fs-6">${t('mg4QCount', { curr: qIndex + 1, total: raceQuestions.length })}</span>
          </div>
        </div>

        ${renderComparisonPanel()}

        <div class="d-flex flex-wrap gap-2 mb-3">
          <button type="button" id="pwr-5050" class="btn btn-sm sq-btn-outline sq-touch-sm" ${usedFifty ? 'disabled' : ''}>
            ✂️ Power-up 50:50 ${usedFifty ? t('mg4Used') : ''}
          </button>
          <button type="button" id="pwr-time" class="btn btn-sm sq-btn-tosca sq-touch-sm" ${usedAddTime ? 'disabled' : ''}>
            ${t('mg4TimePower')} ${usedAddTime ? t('mg4Used') : ''}
          </button>
        </div>

        <h4 class="h5 fw-bold mb-3">${item.q}</h4>
        <div class="d-grid gap-2" id="race-opts">
          ${item.options
            .map(
              (o, i) => `
              <button type="button" class="sq-option-btn sq-touch" data-opt="${i}">
                ${String.fromCharCode(65 + i)}. ${o}
              </button>`
            )
            .join('')}
        </div>
      </div>
    `;

    initChart();

    container.querySelector('#pwr-5050').addEventListener('click', () => {
      if (usedFifty) return;
      usedFifty = true;
      playClick();
      const wrongIndices = [0, 1, 2, 3].filter((i) => i !== item.ans).slice(0, 2);
      container.querySelectorAll('[data-opt]').forEach((b) => {
        if (wrongIndices.includes(Number(b.dataset.opt))) {
          b.disabled = true;
          b.style.opacity = '0.35';
        }
      });
      container.querySelector('#pwr-5050').disabled = true;
    });

    container.querySelector('#pwr-time').addEventListener('click', () => {
      if (usedAddTime) return;
      usedAddTime = true;
      timeLeft += 15;
      playCorrect();
      container.querySelector('#race-timer-val').textContent = `${timeLeft}${t('mg4SecUnit')}`;
      container.querySelector('#pwr-time').disabled = true;
    });

    container.querySelectorAll('[data-opt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = Number(btn.dataset.opt);
        if (chosen === item.ans) {
          correct += 1;
          playCorrect();
          btn.classList.add('correct');
        } else {
          playWrong();
          btn.classList.add('wrong');
        }
        setTimeout(() => {
          qIndex += 1;
          renderQuestion();
        }, 450);
      });
    });
  }

  function finishRace() {
    finished = true;
    stopTimer();
    const score = Math.round((correct / raceQuestions.length) * 100);
    playVictory();
    container.innerHTML = `
      <div class="sq-card text-center">
        <div class="display-4 mb-2">🏁</div>
        <h3 class="h4 fw-bold">${t('mg4DoneTitle')}</h3>
        <p class="mb-2">${t('mg4DoneSub', { correct, total: raceQuestions.length, left: Math.max(0, timeLeft) })}</p>
        <div class="display-4 fw-bold text-primary mb-3">${score}</div>
        <button type="button" id="btn-race-again" class="btn sq-btn-outline sq-touch">${t('mg4Retry')}</button>
      </div>
    `;
    container.querySelector('#btn-race-again').addEventListener('click', () => {
      playClick();
      renderQuizRaceGame(container, textsData, onComplete);
    });
    onComplete(score, `Completed Legend vs Fable Quiz Race (${correct}/${raceQuestions.length}).`);
  }

  renderQuestion();
  startTimer();
}
