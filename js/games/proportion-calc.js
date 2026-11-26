/**
 * Pulau 3 Mini-Game: Kalkulator Proporsi Interaktif + Grafik Batang/Donat Chart.js
 */
import { playClick, playWrong, playVictory } from '../sound.js';
import { t } from '../i18n.js';

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function renderProportionCalcGame(container, textsData, onComplete) {
  let activeTextId = textsData.texts[0].id;
  let chartType = 'doughnut';
  let chartInstance = null;

  function render() {
    const story = textsData.texts.find((item) => item.id === activeTextId) || textsData.texts[0];
    const actualStats = story.stages.map((st) => ({
      stage: st.stage,
      sentences: st.sentences.length,
      words: st.sentences.reduce((acc, s) => acc + countWords(s), 0)
    }));
    const totalSentences = actualStats.reduce((sum, s) => sum + s.sentences, 0);
    const totalWords = actualStats.reduce((sum, s) => sum + s.words, 0);

    const maxStage = actualStats.reduce((a, b) => (b.sentences > a.sentences ? b : a), actualStats[0]);
    const minStage = actualStats.reduce((a, b) => (b.sentences < a.sentences ? b : a), actualStats[0]);

    container.innerHTML = `
      <div class="sq-card">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h3 class="h4 fw-bold mb-1">${t('mg3Title')}</h3>
            <p class="small text-secondary mb-0">${t('mg3Sub')}</p>
          </div>
          <div class="d-flex gap-2">
            <select id="prop-story-select" class="form-select sq-touch-sm" aria-label="Select story text">
              ${textsData.texts.map((item) => `<option value="${item.id}" ${item.id === activeTextId ? 'selected' : ''}>${item.title}</option>`).join('')}
            </select>
            <button type="button" id="btn-toggle-chart" class="btn sq-btn-outline sq-touch-sm">
              ${chartType === 'doughnut' ? t('mg3ToBar') : t('mg3ToDoughnut')}
            </button>
          </div>
        </div>

        <div class="sq-reading-box mb-4">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <strong>📖 ${story.title} (${story.type.toUpperCase()})</strong>
            <span class="badge bg-secondary">${t('mg3TotalWords', { words: totalWords })}</span>
          </div>
          ${story.stages
            .map(
              (st) => `
              <div class="mb-2">
                <span class="sq-stage-tag tag-${st.stage.toLowerCase().replace('-', '')}">${st.stage}</span>
                <p class="mb-1 small">${st.sentences.join(' ')}</p>
              </div>`
            )
            .join('')}
        </div>

        <div class="row g-4 align-items-center">
          <div class="col-lg-6">
            <h4 class="h6 fw-bold text-primary mb-2">${t('mg3Step1')}</h4>
            <div class="table-responsive">
              <table class="table table-bordered align-middle small">
                <thead class="table-light">
                  <tr>
                    <th>${t('mg3ColStage')}</th>
                    <th>${t('mg3ColInput')}</th>
                    <th>${t('mg3ColWords')}</th>
                    <th>${t('mg3ColPct')}</th>
                  </tr>
                </thead>
                <tbody>
                  ${actualStats
                    .map(
                      (st, idx) => `
                      <tr>
                        <td class="fw-bold">${st.stage}</td>
                        <td>
                          <input type="number" min="0" max="20" value="1"
                            class="form-control form-control-sm prop-input" data-idx="${idx}"
                            aria-label="Sentence count ${st.stage}">
                        </td>
                        <td>${st.words}</td>
                        <td class="fw-bold text-primary" id="prop-pct-${idx}">-</td>
                      </tr>`
                    )
                    .join('')}
                </tbody>
              </table>
            </div>

            <div class="row g-2 mb-3">
              <div class="col-sm-6">
                <label class="form-label small fw-bold" for="sel-longest">${t('mg3Longest')}</label>
                <select id="sel-longest" class="form-select sq-touch-sm">
                  ${actualStats.map((s) => `<option value="${s.stage}">${s.stage}</option>`).join('')}
                </select>
              </div>
              <div class="col-sm-6">
                <label class="form-label small fw-bold" for="sel-shortest">${t('mg3Shortest')}</label>
                <select id="sel-shortest" class="form-select sq-touch-sm">
                  ${actualStats.map((s) => `<option value="${s.stage}">${s.stage}</option>`).join('')}
                </select>
              </div>
            </div>

            <button type="button" id="btn-check-prop" class="btn sq-btn-primary sq-touch w-100">
              ${t('mg3CheckBtn')}
            </button>
            <div id="prop-feedback" class="mt-3"></div>
          </div>

          <div class="col-lg-6">
            <div class="p-3 border rounded-4 bg-white">
              <canvas id="prop-chart-canvas" height="250" aria-label="Stage proportion chart"></canvas>
            </div>
            <div class="sq-info-box mt-3 small" id="prop-summary-box">
              <div class="sq-info-title">${t('mg3FormulaTitle')}</div>
              ${t('mg3FormulaBody')}
            </div>
          </div>
        </div>
      </div>
    `;

    const inputs = [...container.querySelectorAll('.prop-input')];

    function updateLiveChartAndPct() {
      const vals = inputs.map((inp) => Math.max(0, Number(inp.value) || 0));
      const sum = vals.reduce((a, b) => a + b, 0) || 1;
      vals.forEach((v, idx) => {
        const pctEl = container.querySelector(`#prop-pct-${idx}`);
        if (pctEl) pctEl.textContent = `${((v / sum) * 100).toFixed(1)}%`;
      });

      const canvas = container.querySelector('#prop-chart-canvas');
      if (window.Chart && canvas) {
        if (chartInstance) chartInstance.destroy();
        chartInstance = new window.Chart(canvas, {
          type: chartType,
          data: {
            labels: actualStats.map((s) => s.stage),
            datasets: [
              {
                label: t('mg3ColInput'),
                data: vals,
                backgroundColor: ['#1d4ed8', '#dc2626', '#f59e0b', '#0d9488', '#7c3aed'],
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
          }
        });
      }
    }

    inputs.forEach((inp) => inp.addEventListener('input', updateLiveChartAndPct));
    updateLiveChartAndPct();

    container.querySelector('#prop-story-select').addEventListener('change', (e) => {
      playClick();
      activeTextId = e.target.value;
      render();
    });

    container.querySelector('#btn-toggle-chart').addEventListener('click', () => {
      playClick();
      chartType = chartType === 'doughnut' ? 'bar' : 'doughnut';
      render();
    });

    container.querySelector('#btn-check-prop').addEventListener('click', () => {
      const vals = inputs.map((inp) => Number(inp.value) || 0);
      const countMatches = vals.filter((v, idx) => v === actualStats[idx].sentences).length;
      const longestChoice = container.querySelector('#sel-longest').value;
      const shortestChoice = container.querySelector('#sel-shortest').value;

      const longestValid = actualStats.some((s) => s.stage === longestChoice && s.sentences === maxStage.sentences);
      const shortestValid = actualStats.some((s) => s.stage === shortestChoice && s.sentences === minStage.sentences);
      const diffSentences = maxStage.sentences - minStage.sentences;

      const fb = container.querySelector('#prop-feedback');
      if (countMatches === actualStats.length && longestValid && shortestValid) {
        playVictory();
        fb.innerHTML = `<div class="alert alert-success rounded-4">${t('mg3Right', { total: totalSentences, max: maxStage.sentences, min: minStage.sentences, diff: diffSentences })}</div>`;
        onComplete(100, `Calculated proportions & analyzed chart for ${story.title}.`);
      } else {
        playWrong();
        fb.innerHTML = `<div class="alert alert-warning rounded-4">${t('mg3Wrong', { ok: countMatches, total: actualStats.length })} (${actualStats.map((s) => `${s.stage}: ${s.sentences}`).join(', ')})</div>`;
      }
    });
  }

  render();
}
