/**
 * Pulau 6 Mini-Game: Story Builder (Template + Kartu Acak + Presentasi Mode Papan Interaktif)
 */
import { playClick, playVictory } from '../sound.js';
import { getActiveStudent, updateActiveStudent } from '../storage.js';

export function renderStoryBuilderGame(container, textsData, onComplete, onOpenPresentation) {
  const cards = textsData.storyBuilderCards || {
    characters: ['A brave mouse deer and a proud eagle'],
    settings: ['In a misty bamboo forest'],
    problems: ['A sudden flood trapped the forest animals'],
    morals: ['Teamwork saves everyone']
  };

  const student = getActiveStudent();
  const saved = student?.createdStory || {
    title: '',
    genre: 'Fable',
    character: cards.characters[0],
    setting: cards.settings[0],
    problem: cards.problems[0],
    moral: cards.morals[0],
    orientation: '',
    complication: '',
    resolution: '',
    reorientation: ''
  };

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function render() {
    container.innerHTML = `
      <div class="sq-card">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h3 class="h4 fw-bold mb-1">✍️ Story Builder: Rancang Cerita Orisinal</h3>
            <p class="small text-secondary mb-0">Acak kartu inspirasi, susun kerangka 4 tahap dalam bahasa Inggris, lalu presentasikan di Mode PID!</p>
          </div>
          <button type="button" id="btn-draw-cards" class="btn sq-btn-tosca sq-touch">🎲 Acak Kartu Ide</button>
        </div>

        <div class="sq-info-box mb-3 small">
          <div class="sq-info-title">🃏 Kartu Ide Kelompokmu Saat Ini</div>
          <div><strong>Tokoh:</strong> <span id="card-char">${saved.character}</span></div>
          <div><strong>Latar:</strong> <span id="card-set">${saved.setting}</span></div>
          <div><strong>Masalah:</strong> <span id="card-prob">${saved.problem}</span></div>
          <div><strong>Nilai Moral:</strong> <span id="card-mor">${saved.moral}</span></div>
        </div>

        <form id="story-builder-form" class="row g-3">
          <div class="col-md-8">
            <label class="form-label fw-bold" for="sb-title">Judul Cerita (English)</label>
            <input type="text" id="sb-title" class="form-control sq-touch" placeholder="Contoh: The Honest Heron of Merapi" value="${saved.title}" required />
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold" for="sb-genre">Jenis Cerita</label>
            <select id="sb-genre" class="form-select sq-touch">
              <option value="Fable" ${saved.genre === 'Fable' ? 'selected' : ''}>Fable</option>
              <option value="Legend" ${saved.genre === 'Legend' ? 'selected' : ''}>Legend</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold" for="sb-ori">1. Orientation (Who, When, Where)</label>
            <textarea id="sb-ori" rows="3" class="form-control" placeholder="Once upon a time, in..." required>${saved.orientation}</textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold" for="sb-comp">2. Complication (Conflict / Crisis)</label>
            <textarea id="sb-comp" rows="3" class="form-control" placeholder="One day, a big problem happened when..." required>${saved.complication}</textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold" for="sb-res">3. Resolution (How it was solved)</label>
            <textarea id="sb-res" rows="3" class="form-control" placeholder="Finally, they worked together to..." required>${saved.resolution}</textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold" for="sb-reori">4. Re-orientation (Moral Reflection)</label>
            <textarea id="sb-reori" rows="3" class="form-control" placeholder="From that day on, they learned that..." required>${saved.reorientation}</textarea>
          </div>

          <div class="col-12 d-flex flex-wrap gap-2 justify-content-between">
            <button type="button" id="btn-fill-template" class="btn sq-btn-outline sq-touch">✨ Bantu Isi Contoh Draf</button>
            <div class="d-flex flex-wrap gap-2">
              <button type="submit" class="btn sq-btn-primary sq-touch">💾 Simpan Kerangka Cerita</button>
              <button type="button" id="btn-present-pid" class="btn sq-btn-dark sq-touch">🖥️ Presentasi di Papan Interaktif</button>
            </div>
          </div>
        </form>
        <div id="sb-feedback" class="mt-3"></div>
      </div>
    `;

    container.querySelector('#btn-draw-cards').addEventListener('click', () => {
      playClick();
      saved.character = pickRandom(cards.characters);
      saved.setting = pickRandom(cards.settings);
      saved.problem = pickRandom(cards.problems);
      saved.moral = pickRandom(cards.morals);
      container.querySelector('#card-char').textContent = saved.character;
      container.querySelector('#card-set').textContent = saved.setting;
      container.querySelector('#card-prob').textContent = saved.problem;
      container.querySelector('#card-mor').textContent = saved.moral;
    });

    container.querySelector('#btn-fill-template').addEventListener('click', () => {
      playClick();
      container.querySelector('#sb-title').value = `The Tale of ${saved.character.split(' ').slice(0, 4).join(' ')}`;
      container.querySelector('#sb-ori').value = `Once upon a time, ${saved.setting.toLowerCase()}, lived ${saved.character.toLowerCase()}.`;
      container.querySelector('#sb-comp').value = `Suddenly, ${saved.problem.toLowerCase()}, and they struggled to find a way out.`;
      container.querySelector('#sb-res').value = 'Finally, they listened to each other and solved the crisis through courage and cooperation.';
      container.querySelector('#sb-reori').value = `From that day on, everyone remembered that ${saved.moral.toLowerCase()}`;
    });

    function collectStory() {
      saved.title = container.querySelector('#sb-title').value.trim();
      saved.genre = container.querySelector('#sb-genre').value;
      saved.orientation = container.querySelector('#sb-ori').value.trim();
      saved.complication = container.querySelector('#sb-comp').value.trim();
      saved.resolution = container.querySelector('#sb-res').value.trim();
      saved.reorientation = container.querySelector('#sb-reori').value.trim();
      saved.savedAt = new Date().toISOString();
      return { ...saved };
    }

    container.querySelector('#story-builder-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const storyObj = collectStory();
      updateActiveStudent((stu) => {
        stu.createdStory = storyObj;
      });
      playVictory();
      container.querySelector('#sb-feedback').innerHTML =
        '<div class="alert alert-success rounded-4">🎉 Kerangka cerita berhasil disimpan! Kamu siap mempresentasikannya di Papan Interaktif (PID).</div>';
      onComplete(100, `Merancang cerita orisinal "${storyObj.title}".`);
    });

    container.querySelector('#btn-present-pid').addEventListener('click', () => {
      playClick();
      const storyObj = collectStory();
      if (!storyObj.title || !storyObj.orientation) {
        container.querySelector('#sb-feedback').innerHTML =
          '<div class="alert alert-warning rounded-4">Isi judul dan kerangka cerita dulu (atau tekan "Bantu Isi Contoh Draf") sebelum presentasi.</div>';
        return;
      }
      updateActiveStudent((stu) => {
        stu.createdStory = storyObj;
      });
      onComplete(100, `Merancang & mempresentasikan "${storyObj.title}".`);
      if (typeof onOpenPresentation === 'function') {
        onOpenPresentation(storyObj);
      }
    });
  }

  render();
}
