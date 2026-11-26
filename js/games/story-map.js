/**
 * Pulau 2 Mini-Game: Drag & Drop Story Map Digital
 * Mendukung drag-and-drop mouse serta klik-pilih aksesibel untuk HP & layar sentuh/keyboard.
 */
import { playClick, playCorrect, playWrong, playVictory } from '../sound.js';

export function renderStoryMapGame(container, textsData, onComplete) {
  const story = textsData.texts.find((t) => t.id === 'toba') || textsData.texts[0];
  const stageBuckets = ['Orientation', 'Complication', 'Evaluation', 'Resolution', 'Re-orientation'];

  // Ambil 1 kalimat representatif per tahap untuk disusun ke Story Map
  const cards = story.stages.map((st, idx) => ({
    id: `card_${idx}`,
    expectedStage: st.stage,
    text: st.sentences[0]
  }));

  const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
  const placements = {}; // cardId -> stageName
  let selectedCardId = null;
  let checked = false;

  function render() {
    const placedCount = Object.keys(placements).length;
    const unplaced = shuffledCards.filter((c) => !placements[c.id]);

    container.innerHTML = `
      <div class="sq-card">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h3 class="h4 fw-bold mb-1">🗺️ Story Map Digital: ${story.title}</h3>
            <p class="small text-secondary mb-0">Seret (Drag &amp; Drop) atau klik kartu kalimat lalu klik kotak tahap struktur yang tepat.</p>
          </div>
          <span class="badge sq-badge-tosca fs-6">${placedCount} / ${cards.length} Terpasang</span>
        </div>

        <!-- Bank Kartu Kalimat -->
        <div class="mb-4 p-3 rounded-4 bg-light border">
          <div class="fw-bold small text-primary mb-2">Kartu Kalimat Cerita (Belum Dipasang):</div>
          <div class="d-flex flex-column gap-2" id="story-card-pool">
            ${
              unplaced.length === 0
                ? '<div class="text-success fw-bold small">✅ Semua kartu sudah dimasukkan ke Story Map! Tekan "Periksa Story Map".</div>'
                : unplaced
                    .map(
                      (c) => `
                      <div class="sq-drag-chip ${selectedCardId === c.id ? 'selected-chip' : ''}"
                           draggable="true" tabindex="0" role="button" data-card-id="${c.id}">
                        📄 ${c.text}
                      </div>`
                    )
                    .join('')
            }
          </div>
        </div>

        <!-- Zona Story Map -->
        <div class="row g-3">
          ${stageBuckets
            .map((stageName) => {
              const assigned = cards.filter((c) => placements[c.id] === stageName);
              return `
                <div class="col-md-6">
                  <div class="sq-dropzone" data-stage="${stageName}" tabindex="0" role="region" aria-label="Zona ${stageName}">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="fw-bold text-primary">${stageName}</span>
                      <button type="button" class="btn btn-sm btn-outline-primary sq-touch-sm" data-place-here="${stageName}">
                        Tempel di sini
                      </button>
                    </div>
                    <div class="d-flex flex-column gap-2">
                      ${
                        assigned.length === 0
                          ? '<div class="small text-secondary fst-italic">Kosong — seret atau klik "Tempel di sini"</div>'
                          : assigned
                              .map((c) => {
                                const statusClass = checked
                                  ? c.expectedStage === stageName
                                    ? 'border-success bg-success-subtle'
                                    : 'border-danger bg-danger-subtle'
                                  : '';
                                return `
                                  <div class="sq-drag-chip ${statusClass}" data-assigned-id="${c.id}">
                                    <div class="small">${c.text}</div>
                                    <button type="button" class="btn btn-link btn-sm p-0 mt-1 text-danger" data-remove-card="${c.id}">
                                      Lepas kartu
                                    </button>
                                  </div>`;
                              })
                              .join('')
                      }
                    </div>
                  </div>
                </div>`;
            })
            .join('')}
        </div>

        <div id="storymap-feedback" class="mt-3"></div>

        <div class="d-flex flex-wrap justify-content-between gap-2 mt-4">
          <button type="button" id="btn-reset-map" class="btn sq-btn-outline sq-touch">🔄 Reset Papan</button>
          <button type="button" id="btn-check-map" class="btn sq-btn-primary sq-touch" ${placedCount < cards.length ? 'disabled' : ''}>
            ✅ Periksa Story Map
          </button>
        </div>
      </div>
    `;

    // Drag & Click handlers pada kartu
    container.querySelectorAll('[data-card-id]').forEach((chip) => {
      chip.addEventListener('dragstart', (e) => {
        selectedCardId = chip.dataset.cardId;
        e.dataTransfer.setData('text/plain', chip.dataset.cardId);
      });
      chip.addEventListener('click', () => {
        playClick();
        selectedCardId = selectedCardId === chip.dataset.cardId ? null : chip.dataset.cardId;
        render();
      });
      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          chip.click();
        }
      });
    });

    // Dropzone & click-to-place handlers
    container.querySelectorAll('.sq-dropzone').forEach((zone) => {
      const stage = zone.dataset.stage;
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain') || selectedCardId;
        if (id) {
          playClick();
          placements[id] = stage;
          selectedCardId = null;
          checked = false;
          render();
        }
      });
    });

    container.querySelectorAll('[data-place-here]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!selectedCardId) return;
        playClick();
        placements[selectedCardId] = btn.dataset.placeHere;
        selectedCardId = null;
        checked = false;
        render();
      });
    });

    container.querySelectorAll('[data-remove-card]').forEach((btn) => {
      btn.addEventListener('click', () => {
        playClick();
        delete placements[btn.dataset.removeCard];
        checked = false;
        render();
      });
    });

    container.querySelector('#btn-reset-map').addEventListener('click', () => {
      playClick();
      Object.keys(placements).forEach((k) => delete placements[k]);
      selectedCardId = null;
      checked = false;
      render();
    });

    container.querySelector('#btn-check-map').addEventListener('click', () => {
      checked = true;
      let correct = 0;
      cards.forEach((c) => {
        if (placements[c.id] === c.expectedStage) correct += 1;
      });
      const score = Math.round((correct / cards.length) * 100);
      render();

      const fb = container.querySelector('#storymap-feedback');
      if (correct === cards.length) {
        playVictory();
        fb.innerHTML = `<div class="alert alert-success rounded-4">🎉 <strong>Sempurna!</strong> Semua ${cards.length} tahap Story Map tersusun tepat (Skor 100).</div>`;
        onComplete(100, 'Berhasil menyusun Story Map lengkap dengan benar.');
      } else {
        playWrong();
        fb.innerHTML = `<div class="alert alert-warning rounded-4">🌱 ${correct} dari ${cards.length} kartu sudah tepat (Skor ${score}). Cek kartu merah dan perbaiki agar makin mantap!</div>`;
        if (score >= 60) {
          onComplete(score, `Menyusun Story Map (${correct}/${cards.length} tepat).`);
        }
      }
    });
  }

  render();
}
