/**
 * Pulau 1 Mini-Game: Pencocokan Pasangan (Kata Kunci <-> Bukti Tujuan Komunikatif)
 */
import { playClick, playCorrect, playWrong, playVictory } from '../sound.js';

export function renderMatchPurposeGame(container, textsData, onComplete) {
  const pairs = [
    {
      id: 'p1',
      keyword: 'Keep Promises & Control Anger (Lake Toba)',
      evidence: 'Toba broke his sacred promise in anger, and nonstop rain flooded the valley into a lake.'
    },
    {
      id: 'p2',
      keyword: 'Respect & Gratitude to Parents (Malin Kundang)',
      evidence: 'Malin felt ashamed and denied his poor elderly mother, leading to the storm stone curse.'
    },
    {
      id: 'p3',
      keyword: 'Intelligence Beats Brute Force (Kancil)',
      evidence: 'Kancil tricked the crocodiles into forming a river bridge for a feast instead of fighting.'
    },
    {
      id: 'p4',
      keyword: 'Humility & Usefulness Over Beauty (Peacock & Owl)',
      evidence: 'In the dark fog, the plain brown owl saved the lost fawn while colorful feathers failed.'
    },
    {
      id: 'p5',
      keyword: 'Teamwork & Perseverance (Little Ant)',
      evidence: 'Pip called twelve colony friends to lift the heavy golden grain together before the rain.'
    }
  ];

  // Acak urutan bukti di kolom kanan
  const shuffledEvidences = [...pairs].sort(() => Math.random() - 0.5);
  let selectedKeywordId = null;
  const matchedIds = new Set();
  let mistakes = 0;

  function render() {
    const doneAll = matchedIds.size === pairs.length;
    const score = Math.max(60, 100 - mistakes * 10);

    container.innerHTML = `
      <div class="sq-card">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h3 class="h4 fw-bold mb-1">🎯 Pencocokan Pasangan: Kata Kunci ↔ Bukti Tujuan</h3>
            <p class="small text-secondary mb-0">Klik satu <strong>Kata Kunci Tujuan</strong> di kiri, lalu klik <strong>Bukti Teks</strong> yang cocok di kanan.</p>
          </div>
          <span class="badge sq-badge-tosca fs-6">${matchedIds.size} / ${pairs.length} Cocok</span>
        </div>

        <div class="row g-3">
          <div class="col-md-5">
            <div class="fw-bold mb-2 text-primary">Kata Kunci &amp; Nilai Moral</div>
            <div class="d-grid gap-2" id="kw-list">
              ${pairs
                .map((p) => {
                  const isMatched = matchedIds.has(p.id);
                  const isSelected = selectedKeywordId === p.id;
                  return `
                    <button type="button"
                      class="sq-option-btn sq-touch text-start ${isMatched ? 'correct' : ''} ${isSelected ? 'border-primary bg-primary-subtle' : ''}"
                      data-kw="${p.id}" ${isMatched ? 'disabled' : ''}>
                      ${isMatched ? '✅ ' : '🔑 '}${p.keyword}
                    </button>`;
                })
                .join('')}
            </div>
          </div>

          <div class="col-md-7">
            <div class="fw-bold mb-2 text-primary">Bukti Konkret dari Teks (English)</div>
            <div class="d-grid gap-2" id="ev-list">
              ${shuffledEvidences
                .map((p) => {
                  const isMatched = matchedIds.has(p.id);
                  return `
                    <button type="button"
                      class="sq-option-btn sq-touch text-start ${isMatched ? 'correct' : ''}"
                      data-ev="${p.id}" ${isMatched ? 'disabled' : ''}>
                      ${isMatched ? '✅ ' : '📜 '}${p.evidence}
                    </button>`;
                })
                .join('')}
            </div>
          </div>
        </div>

        <div id="match-feedback" class="mt-3">
          ${
            doneAll
              ? `<div class="alert alert-success rounded-4">
                   🎉 <strong>Semua pasangan berhasil dicocokkan!</strong> Skor Mini-Game: <strong>${score}</strong>.
                 </div>`
              : `<div class="sq-info-box small">
                   <div class="sq-info-title">💡 Tips</div>
                   Perhatikan hubungan sebab-akibat antara tindakan tokoh dan pesan moral di setiap bukti teks.
                 </div>`
          }
        </div>
      </div>
    `;

    container.querySelectorAll('[data-kw]').forEach((btn) => {
      btn.addEventListener('click', () => {
        playClick();
        selectedKeywordId = btn.dataset.kw;
        render();
      });
    });

    container.querySelectorAll('[data-ev]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!selectedKeywordId) {
          const fb = container.querySelector('#match-feedback');
          fb.innerHTML = '<div class="alert alert-info rounded-4">Pilih dulu satu <strong>Kata Kunci</strong> di kolom kiri!</div>';
          return;
        }
        const evId = btn.dataset.ev;
        if (evId === selectedKeywordId) {
          playCorrect();
          matchedIds.add(evId);
          selectedKeywordId = null;
          render();
          if (matchedIds.size === pairs.length) {
            playVictory();
            onComplete(Math.max(60, 100 - mistakes * 10), 'Berhasil mencocokkan 5 kata kunci tujuan komunikatif dengan bukti teks.');
          }
        } else {
          mistakes += 1;
          playWrong();
          btn.classList.add('wrong');
          setTimeout(() => btn.classList.remove('wrong'), 500);
          const fb = container.querySelector('#match-feedback');
          fb.innerHTML =
            '<div class="alert alert-warning rounded-4">🌱 Belum tepat, kesalahan membantu kita tumbuh! Cek kesamaan cerita pada kata kunci dan bukti.</div>';
        }
      });
    });
  }

  render();
}
