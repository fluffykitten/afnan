/**
 * Router SPA utama & Controller State Aplikasi Story Quest
 */
import { CONFIG, extractYouTubeId } from './config.js';
import {
  getActiveStudent,
  createOrSelectStudent,
  switchActiveStudent,
  updateActiveStudent,
  getAllStudents,
  getSettings
} from './storage.js';
import { setMuted, getMuted, playClick, playVictory } from './sound.js';
import {
  AVATARS,
  getAvatarSvg,
  getLevelInfo,
  awardXpAndEvaluateBadges,
  renderLeaderboardModalHtml
} from './gamification.js';
import { renderQuizSession, buildBossQuizQuestions, buildPosttestQuestions } from './quiz-engine.js';
import { renderCertificateView, downloadLearningSummary } from './certificate.js';
import { openTeacherModal } from './teacher.js';
import {
  getLang,
  setLang,
  t,
  getPredikatLocalized,
  getIslandMeta,
  getMiniMaterials,
  getAvatarLabel,
  getBadgeText
} from './i18n.js';

import { renderMatchPurposeGame } from './games/match-purpose.js';
import { renderStoryMapGame } from './games/story-map.js';
import { renderProportionCalcGame } from './games/proportion-calc.js';
import { renderQuizRaceGame } from './games/quiz-race.js';
import { renderFactOpinionGame } from './games/fact-opinion.js';
import { renderStoryBuilderGame } from './games/story-builder.js';

const appState = {
  route: 'home',
  islandId: 1,
  islandStep: 'material',
  materialSlide: 0,
  textsData: null,
  questionsData: null,
  badgesData: [],
  modalInstance: null
};

const appRoot = document.getElementById('app-root');
const bottomNavBar = document.getElementById('bottom-nav-bar');

function applyStaticShellTranslations() {
  const lang = getLang();
  document.documentElement.lang = lang;
  const langLabel = document.getElementById('lang-label');
  if (langLabel) langLabel.textContent = lang.toUpperCase();

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    el.innerHTML = t(key);
  });
}

function getModal() {
  if (!appState.modalInstance) {
    appState.modalInstance = new window.bootstrap.Modal(document.getElementById('sqModal'));
  }
  return appState.modalInstance;
}

function showModal(title, renderFn) {
  const modalTitle = document.getElementById('sqModalLabel');
  const modalBody = document.getElementById('sqModalBody');
  const modalFooter = document.getElementById('sqModalFooter');
  modalTitle.textContent = title;
  modalFooter.innerHTML = `<button type="button" class="btn sq-btn-outline sq-touch" data-bs-dismiss="modal">${t('modalClose')}</button>`;
  renderFn(modalBody, modalFooter);
  getModal().show();
}

function calculateOverallProgress(student) {
  if (!student) return 0;
  let points = 0;
  if (student.pretest) points += 1;
  points += (student.completedIslands || []).length;
  if (student.posttest) points += 1;
  if (student.reflection?.savedAt) points += 1;
  return Math.min(100, Math.round((points / 9) * 100));
}

function syncHeader() {
  applyStaticShellTranslations();
  const student = getActiveStudent();
  const strip = document.getElementById('student-status-strip');
  const pct = calculateOverallProgress(student);

  document.getElementById('global-progress-text').textContent = `${pct}%`;
  const bar = document.getElementById('global-progress-bar');
  bar.style.width = `${pct}%`;
  document.getElementById('global-progress-bar-wrap').setAttribute('aria-valuenow', String(pct));

  if (!student) {
    strip.classList.add('d-none');
    return;
  }

  strip.classList.remove('d-none');
  const lv = getLevelInfo(student.xp);
  document.getElementById('header-avatar-slot').innerHTML = getAvatarSvg(student.avatarId);
  document.getElementById('header-student-name').textContent = student.name;
  document.getElementById('header-student-class').textContent = student.className;
  document.getElementById('header-student-level').textContent = `Lv. ${lv.level}`;
  document.getElementById('header-xp').textContent = `⚡ ${student.xp} ${t('xpSuffix')}`;
  document.getElementById('header-streak').textContent = `🔥 ${student.streak || 1} ${t('daysUnit')}`;
  document.getElementById('header-badges').textContent = `🎖️ ${(student.badges || []).length} ${t('badgesUnit')}`;
}

function navigate(route, opts = {}) {
  appState.route = route;
  if (opts.islandId !== undefined) appState.islandId = opts.islandId;
  if (opts.islandStep !== undefined) appState.islandStep = opts.islandStep;
  if (opts.materialSlide !== undefined) appState.materialSlide = opts.materialSlide;
  renderCurrentRoute();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateBottomNav() {
  const student = getActiveStudent();
  if (!student || appState.route === 'home') {
    bottomNavBar.classList.add('d-none');
    return;
  }
  bottomNavBar.classList.remove('d-none');
  const repeatBtn = document.getElementById('btn-repeat-material');
  repeatBtn.classList.toggle('d-none', appState.route !== 'island');
}

function renderCurrentRoute() {
  syncHeader();
  updateBottomNav();
  const student = getActiveStudent();

  if (!student && appState.route !== 'home') {
    appState.route = 'home';
  }

  switch (appState.route) {
    case 'home':
      renderHomeView();
      break;
    case 'apersepsi':
      renderApersepsiView();
      break;
    case 'pretest':
      renderPretestView();
      break;
    case 'map':
      renderMapView();
      break;
    case 'island':
      renderIslandView();
      break;
    case 'posttest':
      renderPosttestView();
      break;
    case 'reflection':
      renderReflectionView();
      break;
    case 'certificate':
      renderCertificateView(appRoot, student, () => navigate('map'));
      break;
    default:
      renderHomeView();
  }
}

/* ============================================================================
   1. BERANDA & PROFIL MULTI-SISWA
   ============================================================================ */
function renderHomeView() {
  const student = getActiveStudent();
  const allStudents = getAllStudents();
  let selectedAvatar = student?.avatarId || AVATARS[0].id;

  appRoot.innerHTML = `
    <div class="row g-4 align-items-stretch">
      <div class="col-lg-6">
        <div class="sq-card-blue h-100 d-flex flex-column justify-content-between">
          <div>
            <span class="badge bg-light text-primary mb-2 px-3 py-2 rounded-pill">${t('heroBadge')}</span>
            <h1 class="display-6 fw-bold mb-3">${t('heroTitle')}</h1>
            <p class="mb-3">${t('heroDesc')}</p>
            <div class="sq-info-box mb-3">
              <div class="sq-info-title">🌟 ${t('flowTitle')}</div>
              <ol class="mb-0 ps-3 small">${t('flowSteps')}</ol>
            </div>
          </div>
          ${
            student
              ? `<div class="d-flex flex-wrap gap-2 mt-2">
                   <button type="button" id="btn-home-continue" class="btn btn-warning fw-bold sq-touch">${t('continueBtn')}</button>
                   <button type="button" id="btn-home-apersepsi" class="btn btn-light fw-bold sq-touch">${t('startApersepsiBtn')}</button>
                 </div>`
              : ''
          }
        </div>
      </div>

      <div class="col-lg-6">
        <div class="sq-card h-100">
          <h2 class="h4 fw-bold text-primary mb-3">${t('profileHeading')}</h2>
          <form id="profile-form">
            <div class="row g-2 mb-3">
              <div class="col-sm-7">
                <label class="form-label fw-bold small" for="inp-name">${t('nameLabel')}</label>
                <input type="text" id="inp-name" class="form-control sq-touch" placeholder="${t('namePlaceholder')}" value="${student?.name || ''}" required />
              </div>
              <div class="col-sm-5">
                <label class="form-label fw-bold small" for="inp-class">${t('classLabel')}</label>
                <input type="text" id="inp-class" class="form-control sq-touch" placeholder="${t('classPlaceholder')}" value="${student?.className || ''}" required />
              </div>
            </div>

            <div class="mb-3">
              <div class="form-label fw-bold small">${t('pickAvatarLabel')}</div>
              <div class="row g-2" id="avatar-grid">
                ${AVATARS.map(
                  (av) => `
                  <div class="col-4">
                    <button type="button" class="sq-avatar-card w-100 ${av.id === selectedAvatar ? 'selected' : ''}" data-avatar="${av.id}">
                      <div>${av.svg}</div>
                      <div class="small fw-bold mt-1">${getAvatarLabel(av)}</div>
                    </button>
                  </div>`
                ).join('')}
              </div>
            </div>

            <button type="submit" class="btn sq-btn-primary sq-touch w-100">
              ${t('saveProfileBtn')}
            </button>
          </form>

          ${
            allStudents.length > 0
              ? `<hr class="my-3"/>
                 <div class="small fw-bold text-secondary mb-2">${t('savedProfilesHint')}</div>
                 <div class="d-flex flex-wrap gap-2">
                   ${allStudents
                     .map(
                       (s) => `
                       <button type="button" class="btn btn-sm sq-btn-outline sq-touch-sm" data-quick-stu="${s.id}">
                         ${s.name} (${s.className}) • ${s.xp} XP
                       </button>`
                     )
                     .join('')}
                 </div>`
              : ''
          }
        </div>
      </div>
    </div>

    ${
      student
        ? `<div class="sq-card mt-4">
             <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
               <h3 class="h5 fw-bold mb-0">${t('badgeCollectionTitle', { owned: (student.badges || []).length, total: appState.badgesData.length })}</h3>
               <span class="small text-secondary">${t('badgeCollectionSub')}</span>
             </div>
             <div class="row g-2">
               ${appState.badgesData
                 .map((rawBadge) => {
                   const b = getBadgeText(rawBadge);
                   const owned = (student.badges || []).includes(b.id);
                   return `
                     <div class="col-6 col-md-4 col-lg-3">
                       <div class="p-2 rounded-4 border h-100 ${owned ? 'bg-primary-subtle border-primary' : 'bg-light opacity-50'}">
                         <div class="fw-bold">${b.icon} ${b.name}</div>
                         <div class="small text-secondary">${b.description}</div>
                       </div>
                     </div>`;
                 })
                 .join('')}
             </div>
           </div>`
        : ''
    }
  `;

  appRoot.querySelectorAll('[data-avatar]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playClick();
      selectedAvatar = btn.dataset.avatar;
      appRoot.querySelectorAll('[data-avatar]').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  appRoot.querySelector('#profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = appRoot.querySelector('#inp-name').value;
    const cls = appRoot.querySelector('#inp-class').value;
    createOrSelectStudent(name, cls, selectedAvatar);
    playVictory();
    navigate('apersepsi');
  });

  appRoot.querySelectorAll('[data-quick-stu]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playClick();
      switchActiveStudent(btn.dataset.quickStu);
      navigate('map');
    });
  });

  const btnCont = appRoot.querySelector('#btn-home-continue');
  if (btnCont) btnCont.addEventListener('click', () => { playClick(); navigate('map'); });
  const btnAper = appRoot.querySelector('#btn-home-apersepsi');
  if (btnAper) btnAper.addEventListener('click', () => { playClick(); navigate('apersepsi'); });
}

/* ============================================================================
   2. APERSEPSI
   ============================================================================ */
function renderApersepsiView() {
  const settings = getSettings();
  const ytId = extractYouTubeId(settings.youtubeUrl);

  appRoot.innerHTML = `
    <div class="sq-card">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <span class="badge sq-badge-tosca mb-1">${t('apersepsiBadge')}</span>
          <h2 class="h3 fw-bold mb-0">${t('apersepsiTitle')}</h2>
        </div>
        <button type="button" id="btn-skip-apersepsi" class="btn sq-btn-primary sq-touch">${t('skipApersepsiBtn')}</button>
      </div>

      <div class="row g-4 align-items-center">
        <div class="col-lg-7">
          ${
            ytId
              ? `<div class="ratio ratio-16x9 rounded-4 overflow-hidden shadow-sm border">
                   <iframe src="https://www.youtube.com/embed/${ytId}" title="Story Quest Starter Video" allowfullscreen></iframe>
                 </div>`
              : `<div class="p-5 text-center bg-light rounded-4 border">${t('apersepsiPlaceholder')}</div>`
          }
          <div class="small text-secondary mt-2">${t('apersepsiOfflineNote')}</div>
        </div>

        <div class="col-lg-5">
          <div class="p-3 rounded-4 bg-primary-subtle border border-primary-subtle text-center mb-3">
            <svg viewBox="0 0 280 140" class="w-100" style="max-height: 150px;" aria-label="Boat and mysterious river illustration">
              <rect width="280" height="140" rx="16" fill="#dbeafe"/>
              <path d="M0 95 Q70 80 140 95 T280 95 L280 140 L0 140 Z" fill="#0d9488"/>
              <path d="M75 95 L105 60 L155 60 L175 95 Z" fill="#f59e0b"/>
              <polygon points="125,20 125,60 160,50" fill="#ffffff"/>
              <circle cx="230" cy="36" r="18" fill="#fde047"/>
            </svg>
          </div>

          <div class="sq-info-box">
            <div class="sq-info-title">${t('apersepsiPromptTitle')}</div>
            <p class="fw-bold mb-2">${t('apersepsiPromptQ')}</p>
            <p class="small mb-0">${t('apersepsiPromptHint')}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  appRoot.querySelector('#btn-skip-apersepsi').addEventListener('click', () => {
    playClick();
    navigate('pretest');
  });
}

/* ============================================================================
   3. ASESMEN AWAL ADAPTIF
   ============================================================================ */
function renderPretestView() {
  const student = getActiveStudent();
  if (student?.pretest) {
    const recId = student.pretest.recommendedIsland || 1;
    const recMeta = getIslandMeta(recId);
    appRoot.innerHTML = `
      <div class="sq-card text-center">
        <div class="display-4 mb-2">🧭</div>
        <h2 class="h3 fw-bold">${t('pretestDoneTitle')}</h2>
        <p class="mb-2">${t('pretestScoreLabel')} <strong class="text-primary fs-4">${student.pretest.score}</strong></p>
        <div class="sq-info-box text-start mx-auto my-3" style="max-width: 640px;">
          <div class="sq-info-title">${t('pretestRecTitle')}</div>
          ${t('pretestRecBody', { id: recId, name: recMeta.name })}
        </div>
        <div class="d-flex justify-content-center gap-2">
          <button type="button" id="btn-pre-retake" class="btn sq-btn-outline sq-touch">${t('retakePretestBtn')}</button>
          <button type="button" id="btn-pre-map" class="btn sq-btn-primary sq-touch">${t('enterMapBtn')}</button>
        </div>
      </div>
    `;
    appRoot.querySelector('#btn-pre-map').addEventListener('click', () => { playClick(); navigate('map'); });
    appRoot.querySelector('#btn-pre-retake').addEventListener('click', () => {
      playClick();
      startAdaptivePretest();
    });
    return;
  }
  startAdaptivePretest();
}

function startAdaptivePretest() {
  renderQuizSession({
    container: appRoot,
    title: t('pretestTitle'),
    subtitle: t('pretestSub'),
    mode: 'pretest',
    questionsPool: appState.questionsData.pretest,
    totalQuestions: 10,
    onComplete: (result) => {
      if (result.userClickedContinue) {
        navigate('map');
        return;
      }
      updateActiveStudent((stu) => {
        stu.pretest = {
          score: result.score,
          recommendedIsland: result.recommendedIsland,
          completedAt: new Date().toISOString()
        };
      });
      awardXpAndEvaluateBadges(50, 'Completed Adaptive Pretest', appState.badgesData);
      syncHeader();
    }
  });
}

/* ============================================================================
   4. PETA 6 PULAU CERITA
   ============================================================================ */
function renderMapView() {
  const student = getActiveStudent();
  const completedSet = new Set(student.completedIslands || []);
  const recIslandId = student.pretest?.recommendedIsland || null;
  const allIslandsDone = completedSet.size >= 6;

  appRoot.innerHTML = `
    <div class="sq-map-wrapper mb-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 class="h3 fw-bold mb-1 text-primary-emphasis">${t('mapTitle')}</h2>
          <p class="small mb-0">${t('mapSub', { pass: CONFIG.PASSING_SCORE })}</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" id="btn-map-apersepsi" class="btn btn-sm sq-btn-outline sq-touch-sm">${t('mapApersepsiBtn')}</button>
          <button type="button" id="btn-map-pretest" class="btn btn-sm sq-btn-outline sq-touch-sm">${t('mapPretestBtn')}</button>
        </div>
      </div>

      <div class="bg-white bg-opacity-75 rounded-4 p-2 mb-3 border">
        <svg viewBox="0 0 900 120" class="w-100" style="max-height: 110px;" aria-label="6 Story Islands sailing route">
          <path d="M75 60 Q215 15 350 60 T625 60 T825 60" fill="none" stroke="#1d4ed8" stroke-width="5" stroke-dasharray="10 8"/>
          ${CONFIG.ISLANDS.map((isl, i) => {
            const meta = getIslandMeta(isl.id);
            const cx = 75 + i * 150;
            const cy = i % 2 === 0 ? 60 : 42;
            const done = completedSet.has(isl.id);
            const unlocked = isl.id <= (student.unlockedIsland || 1);
            const fill = done ? '#0d9488' : unlocked ? '#1d4ed8' : '#94a3b8';
            return `
              <g>
                <circle cx="${cx}" cy="${cy}" r="22" fill="${fill}" stroke="#ffffff" stroke-width="4"/>
                <text x="${cx}" y="${cy + 6}" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold">${done ? '✓' : isl.id}</text>
                <text x="${cx}" y="108" text-anchor="middle" fill="#1e293b" font-size="13" font-weight="bold">${meta.name}</text>
              </g>`;
          }).join('')}
        </svg>
      </div>

      <div class="row g-3">
        ${CONFIG.ISLANDS.map((isl) => {
          const meta = getIslandMeta(isl.id);
          const isUnlocked = isl.id <= (student.unlockedIsland || 1);
          const isCompleted = completedSet.has(isl.id);
          const isRec = recIslandId === isl.id;
          const bossScore = student.bossScores?.[isl.id];

          return `
            <div class="col-md-6 col-lg-4">
              <div class="sq-island-card ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''} ${isRec ? 'recommended' : ''} d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <span class="fs-2">${isl.icon}</span>
                    <div class="text-end">
                      ${isRec ? `<span class="badge sq-badge-tosca mb-1 d-block">${t('recBadge')}</span>` : ''}
                      ${
                        isCompleted
                          ? `<span class="badge bg-success">${t('completedBadge', { score: bossScore })}</span>`
                          : isUnlocked
                            ? `<span class="badge bg-primary">${t('unlockedBadge')}</span>`
                            : `<span class="badge bg-secondary">${t('lockedBadge')}</span>`
                      }
                    </div>
                  </div>
                  <h3 class="h5 fw-bold mb-1">${t('islandLabel', { id: isl.id, name: meta.name })}</h3>
                  <div class="small fw-bold text-primary mb-2">${meta.subtitle}</div>
                  <p class="small text-secondary mb-3">${meta.goal}</p>
                </div>

                <button type="button" class="btn ${isUnlocked ? 'sq-btn-primary' : 'btn-secondary'} sq-touch w-100"
                        data-open-island="${isl.id}" ${isUnlocked ? '' : 'disabled'}>
                  ${
                    isCompleted
                      ? t('revisitIslandBtn')
                      : isUnlocked
                        ? t('exploreIslandBtn')
                        : t('lockedIslandBtn', { prev: isl.id - 1 })
                  }
                </button>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>

    <div class="sq-card">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h3 class="h5 fw-bold mb-1">${t('finalGateTitle')}</h3>
          <p class="small text-secondary mb-0">
            ${allIslandsDone ? t('finalGateDone') : t('finalGateWait', { done: completedSet.size })}
          </p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" id="btn-go-posttest" class="btn sq-btn-primary sq-touch" ${allIslandsDone ? '' : 'disabled'}>
            ${t('posttestBtn')} ${student.posttest ? `(${student.posttest.score})` : ''}
          </button>
          <button type="button" id="btn-go-reflection" class="btn sq-btn-tosca sq-touch" ${student.posttest ? '' : 'disabled'}>
            ${t('reflectionBtn')}
          </button>
          <button type="button" id="btn-go-cert" class="btn sq-btn-dark sq-touch" ${student.posttest ? '' : 'disabled'}>
            ${t('certBtn')}
          </button>
        </div>
      </div>
    </div>
  `;

  appRoot.querySelector('#btn-map-apersepsi').addEventListener('click', () => { playClick(); navigate('apersepsi'); });
  appRoot.querySelector('#btn-map-pretest').addEventListener('click', () => { playClick(); navigate('pretest'); });

  appRoot.querySelectorAll('[data-open-island]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playClick();
      navigate('island', { islandId: Number(btn.dataset.openIsland), islandStep: 'material', materialSlide: 0 });
    });
  });

  appRoot.querySelector('#btn-go-posttest').addEventListener('click', () => { playClick(); navigate('posttest'); });
  appRoot.querySelector('#btn-go-reflection').addEventListener('click', () => { playClick(); navigate('reflection'); });
  appRoot.querySelector('#btn-go-cert').addEventListener('click', () => { playClick(); navigate('certificate'); });
}

/* ============================================================================
   5. TAMPILAN PULAU
   ============================================================================ */
function renderIslandView() {
  const island = CONFIG.ISLANDS.find((i) => i.id === appState.islandId) || CONFIG.ISLANDS[0];
  const meta = getIslandMeta(island.id);
  const student = getActiveStudent();
  const gameDone = Boolean(student.islandGamesDone?.[island.id]);
  const bossDone = (student.completedIslands || []).includes(island.id);

  appRoot.innerHTML = `
    <div class="mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div>
        <span class="badge bg-primary mb-1">${t('islandBadge', { id: island.id })}</span>
        <h2 class="h3 fw-bold mb-0">${island.icon} ${meta.name} — <span class="text-primary">${meta.subtitle}</span></h2>
      </div>
      <div class="btn-group" role="group" aria-label="Island stage tabs">
        <button type="button" class="btn sq-btn-outline sq-touch-sm ${appState.islandStep === 'material' ? 'active' : ''}" data-step-tab="material">${t('tabMaterial')}</button>
        <button type="button" class="btn sq-btn-outline sq-touch-sm ${appState.islandStep === 'game' ? 'active' : ''}" data-step-tab="game">${t('tabGame')} ${gameDone ? '✅' : ''}</button>
        <button type="button" class="btn sq-btn-outline sq-touch-sm ${appState.islandStep === 'boss' ? 'active' : ''}" data-step-tab="boss">${t('tabBoss')} ${bossDone ? '✅' : ''}</button>
      </div>
    </div>

    <div id="island-stage-container"></div>
  `;

  appRoot.querySelectorAll('[data-step-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playClick();
      appState.islandStep = btn.dataset.stepTab;
      renderIslandView();
    });
  });

  const stageContainer = appRoot.querySelector('#island-stage-container');

  if (appState.islandStep === 'material') {
    renderMiniMaterial(stageContainer, island);
  } else if (appState.islandStep === 'game') {
    renderIslandMiniGame(stageContainer, island);
  } else {
    renderIslandBossQuiz(stageContainer, island);
  }
}

function renderMiniMaterial(container, island) {
  const slides = getMiniMaterials(island.id);
  const slideIdx = Math.min(appState.materialSlide, slides.length - 1);
  const slide = slides[slideIdx];
  const sampleText = appState.textsData.texts[island.id - 1];

  container.innerHTML = `
    <div class="sq-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="badge sq-badge-tosca">${t('materialSlideBadge', { curr: slideIdx + 1, total: slides.length })}</span>
        <button type="button" id="btn-read-sample" class="btn btn-sm sq-btn-outline sq-touch-sm">${t('readSampleBtn', { title: sampleText.title })}</button>
      </div>

      <h3 class="h4 fw-bold text-primary mb-3">${slide.title}</h3>
      <p class="fs-5 mb-4">${slide.body}</p>

      <div class="sq-info-box mb-4">
        <div class="sq-info-title">💡 ${slide.boxTitle}</div>
        <div class="mb-0">${slide.boxText}</div>
      </div>

      <div class="d-flex flex-wrap justify-content-between gap-2">
        <button type="button" id="btn-mat-prev" class="btn sq-btn-outline sq-touch" ${slideIdx === 0 ? 'disabled' : ''}>${t('matPrevBtn')}</button>
        ${
          slideIdx + 1 < slides.length
            ? `<button type="button" id="btn-mat-next" class="btn sq-btn-primary sq-touch">${t('matNextBtn')}</button>`
            : `<button type="button" id="btn-mat-togame" class="btn sq-btn-primary sq-touch">${t('matToGameBtn')}</button>`
        }
      </div>
    </div>
  `;

  container.querySelector('#btn-read-sample').addEventListener('click', () => {
    playClick();
    showModal(`📖 ${sampleText.title} (${sampleText.type.toUpperCase()})`, (body) => {
      body.innerHTML = `
        <p class="small text-secondary mb-2"><strong>${t('sampleOrigin')}</strong> ${sampleText.origin} | <strong>${t('samplePurpose')}</strong> ${sampleText.purpose}</p>
        ${sampleText.stages
          .map(
            (st) => `
            <div class="mb-3">
              <span class="sq-stage-tag tag-${st.stage.toLowerCase().replace('-', '')}">${st.stage}</span>
              <p class="mb-0">${st.sentences.join(' ')}</p>
            </div>`
          )
          .join('')}
        <div class="sq-info-box small">
          <div class="sq-info-title">${t('sampleEvidenceTitle')}</div>
          <ul class="mb-0 ps-3">${sampleText.evidences.map((ev) => `<li>${ev}</li>`).join('')}</ul>
        </div>
      `;
    });
  });

  const prevBtn = container.querySelector('#btn-mat-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      playClick();
      appState.materialSlide = Math.max(0, slideIdx - 1);
      renderIslandView();
    });
  }
  const nextBtn = container.querySelector('#btn-mat-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      playClick();
      appState.materialSlide = slideIdx + 1;
      renderIslandView();
    });
  }
  const toGameBtn = container.querySelector('#btn-mat-togame');
  if (toGameBtn) {
    toGameBtn.addEventListener('click', () => {
      playClick();
      appState.islandStep = 'game';
      renderIslandView();
    });
  }
}

function renderIslandMiniGame(container, island) {
  const onGameComplete = (score, summary) => {
    updateActiveStudent((stu) => {
      stu.islandGamesDone = stu.islandGamesDone || {};
      stu.islandGamesDone[island.id] = { score, summary, completedAt: new Date().toISOString() };
    });
    awardXpAndEvaluateBadges(40, `Mini-Game Island ${island.id}`, appState.badgesData);
    syncHeader();

    const nextBar = document.createElement('div');
    nextBar.className = 'mt-3 text-end';
    nextBar.innerHTML = `
      <button type="button" class="btn sq-btn-primary sq-touch" id="btn-after-game-boss">
        ${t('challengeBossBtn', { id: island.id })}
      </button>
    `;
    nextBar.querySelector('#btn-after-game-boss').addEventListener('click', () => {
      playClick();
      appState.islandStep = 'boss';
      renderIslandView();
    });
    container.appendChild(nextBar);
  };

  switch (island.id) {
    case 1:
      renderMatchPurposeGame(container, appState.textsData, onGameComplete);
      break;
    case 2:
      renderStoryMapGame(container, appState.textsData, onGameComplete);
      break;
    case 3:
      renderProportionCalcGame(container, appState.textsData, onGameComplete);
      break;
    case 4:
      renderQuizRaceGame(container, appState.textsData, onGameComplete);
      break;
    case 5:
      renderFactOpinionGame(container, appState.textsData, onGameComplete);
      break;
    case 6:
      renderStoryBuilderGame(container, appState.textsData, onGameComplete, (storyObj) => {
        document.body.classList.add('pid-mode');
        document.getElementById('btn-toggle-pid').setAttribute('aria-pressed', 'true');
        showModal(t('presentationTitle', { title: storyObj.title }), (body) => {
          body.innerHTML = `
            <div class="p-2">
              <div class="badge sq-badge-tosca fs-6 mb-3">${t('presentationTag', { genre: storyObj.genre })}</div>
              <div class="mb-3"><span class="sq-stage-tag tag-orientation">Orientation</span><p class="fs-5">${storyObj.orientation}</p></div>
              <div class="mb-3"><span class="sq-stage-tag tag-complication">Complication</span><p class="fs-5">${storyObj.complication}</p></div>
              <div class="mb-3"><span class="sq-stage-tag tag-resolution">Resolution</span><p class="fs-5">${storyObj.resolution}</p></div>
              <div class="mb-3"><span class="sq-stage-tag tag-reorientation">Re-orientation</span><p class="fs-5">${storyObj.reorientation}</p></div>
              <div class="sq-info-box"><div class="sq-info-title">${t('presentationMoral')}</div>${storyObj.moral}</div>
            </div>
          `;
        });
      });
      break;
    default:
      renderMatchPurposeGame(container, appState.textsData, onGameComplete);
  }
}

function renderIslandBossQuiz(container, island) {
  const meta = getIslandMeta(island.id);
  const pool = buildBossQuizQuestions(appState.questionsData.hots, island.id);
  renderQuizSession({
    container,
    title: t('bossQuizTitle', { id: island.id, name: meta.name }),
    subtitle: t('bossQuizSub'),
    mode: 'boss',
    questionsPool: pool,
    totalQuestions: 10,
    onComplete: (result) => {
      if (result.userClickedContinue) {
        if (result.passed && island.id < 6) {
          navigate('island', { islandId: island.id + 1, islandStep: 'material', materialSlide: 0 });
        } else {
          navigate('map');
        }
        return;
      }

      updateActiveStudent((stu) => {
        stu.bossScores = stu.bossScores || {};
        stu.bossScores[island.id] = Math.max(stu.bossScores[island.id] || 0, result.score);
        if (result.passed) {
          const completed = new Set(stu.completedIslands || []);
          completed.add(island.id);
          stu.completedIslands = [...completed];
          if (island.id >= (stu.unlockedIsland || 1) && island.id < 6) {
            stu.unlockedIsland = island.id + 1;
          }
        }
      });

      const xpGain = result.passed ? 75 : 25;
      awardXpAndEvaluateBadges(xpGain, `Boss Quiz Island ${island.id} (Score ${result.score})`, appState.badgesData);
      syncHeader();
    }
  });
}

/* ============================================================================
   6. ASESMEN AKHIR & REFLEKSI
   ============================================================================ */
function renderPosttestView() {
  const pool = buildPosttestQuestions(appState.questionsData.posttest);
  renderQuizSession({
    container: appRoot,
    title: t('posttestTitle'),
    subtitle: t('posttestSub'),
    mode: 'posttest',
    questionsPool: pool,
    totalQuestions: 10,
    onComplete: (result) => {
      if (result.userClickedContinue) {
        navigate('reflection');
        return;
      }
      const pred = getPredikatLocalized(result.score);
      updateActiveStudent((stu) => {
        stu.posttest = {
          score: result.score,
          predikat: pred.label,
          completedAt: new Date().toISOString()
        };
      });
      awardXpAndEvaluateBadges(100, `Final Assessment (Score ${result.score})`, appState.badgesData);
      syncHeader();
    }
  });
}

function renderReflectionView() {
  const student = getActiveStudent();
  const ref = student.reflection || {};

  appRoot.innerHTML = `
    <div class="sq-card">
      <span class="badge sq-badge-tosca mb-2">${t('reflectionBadge')}</span>
      <h2 class="h3 fw-bold mb-1">${t('reflectionTitle')}</h2>
      <p class="text-secondary small mb-4">${t('reflectionSub')}</p>

      <form id="reflection-form" class="d-grid gap-3">
        <div>
          <label class="form-label fw-bold" for="ref-1">${t('ref1Label')}</label>
          <input type="text" id="ref-1" class="form-control sq-touch" value="${ref.blank1 || ''}" placeholder="${t('ref1Ph')}" required />
        </div>
        <div>
          <label class="form-label fw-bold" for="ref-2">${t('ref2Label')}</label>
          <input type="text" id="ref-2" class="form-control sq-touch" value="${ref.blank2 || ''}" placeholder="${t('ref2Ph')}" required />
        </div>
        <div>
          <label class="form-label fw-bold" for="ref-3">${t('ref3Label')}</label>
          <input type="text" id="ref-3" class="form-control sq-touch" value="${ref.blank3 || ''}" placeholder="${t('ref3Ph')}" required />
        </div>
        <div>
          <label class="form-label fw-bold" for="ref-4">${t('ref4Label')}</label>
          <input type="text" id="ref-4" class="form-control sq-touch" value="${ref.blank4 || ''}" placeholder="${t('ref4Ph')}" required />
        </div>

        <div class="d-flex flex-wrap justify-content-between gap-2 mt-2">
          <button type="submit" class="btn sq-btn-primary sq-touch">${t('saveRefBtn')}</button>
          <button type="button" id="btn-ref-cert" class="btn sq-btn-tosca sq-touch">${t('openCertBtn')}</button>
        </div>
      </form>
      <div id="ref-feedback" class="mt-3"></div>
    </div>
  `;

  appRoot.querySelector('#reflection-form').addEventListener('submit', (e) => {
    e.preventDefault();
    updateActiveStudent((stu) => {
      stu.reflection = {
        blank1: appRoot.querySelector('#ref-1').value.trim(),
        blank2: appRoot.querySelector('#ref-2').value.trim(),
        blank3: appRoot.querySelector('#ref-3').value.trim(),
        blank4: appRoot.querySelector('#ref-4').value.trim(),
        savedAt: new Date().toISOString()
      };
    });
    awardXpAndEvaluateBadges(35, 'Saved Learning Reflection', appState.badgesData);
    syncHeader();
    playVictory();
    appRoot.querySelector('#ref-feedback').innerHTML = `<div class="alert alert-success rounded-4">${t('refSavedAlert')}</div>`;
  });

  appRoot.querySelector('#btn-ref-cert').addEventListener('click', () => {
    playClick();
    navigate('certificate');
  });
}

/* ============================================================================
   7. BGM YOUTUBE PLAYER, ANIMASI KLIK & BINDING GLOBAL HEADER/FOOTER
   ============================================================================ */
let bgmUserPreferredOn = true;
let bgmHasInteracted = false;
let currentBgmVideoId = '';

function syncBgmPlayer(forceFromUser = false) {
  const settings = getSettings();
  const container = document.getElementById('sq-bgm-container');
  const btn = document.getElementById('btn-toggle-bgm');
  const label = document.getElementById('bgm-label');
  if (!container || !btn) return;

  const shouldPlay = bgmUserPreferredOn && !getMuted() && (bgmHasInteracted || forceFromUser);
  const ytId = extractYouTubeId(settings.bgmYoutubeUrl || CONFIG.DEFAULT_BGM_YOUTUBE_URL);

  btn.setAttribute('aria-pressed', String(bgmUserPreferredOn && !getMuted()));
  btn.classList.toggle('active', bgmUserPreferredOn && !getMuted());
  if (label) {
    label.textContent = bgmUserPreferredOn && !getMuted() ? t('bgmOnLabel') : t('bgmOffLabel');
  }

  if (shouldPlay && ytId) {
    if (currentBgmVideoId !== ytId || !container.firstElementChild) {
      currentBgmVideoId = ytId;
      container.innerHTML = `<iframe width="200" height="200" src="https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&controls=0" title="Background Music" allow="autoplay; encrypted-media"></iframe>`;
    }
  } else {
    currentBgmVideoId = '';
    if (container.innerHTML) container.innerHTML = '';
  }
}

function bindButtonAnimations() {
  document.addEventListener('click', (e) => {
    if (!bgmHasInteracted) {
      bgmHasInteracted = true;
      syncBgmPlayer(true);
    }

    const btn = e.target.closest('button, .sq-avatar-card');
    if (!btn || btn.disabled) return;

    let animClass = 'anim-jelly';
    if (['btn-toggle-pid', 'btn-toggle-lang', 'btn-toggle-sound', 'btn-toggle-bgm', 'btn-teacher-mode'].includes(btn.id)) {
      animClass = 'anim-wiggle';
    } else if (btn.classList.contains('sq-btn-primary') || btn.classList.contains('sq-btn-tosca') || btn.classList.contains('btn-warning')) {
      animClass = 'anim-pop';
    }

    btn.classList.remove('anim-wiggle', 'anim-pop', 'anim-jelly');
    void btn.offsetWidth;
    btn.classList.add(animClass);
    setTimeout(() => btn.classList.remove(animClass), 450);
  });
}

function bindGlobalControls() {
  bindButtonAnimations();
  bgmUserPreferredOn = getSettings().bgmEnabled !== false;

  document.getElementById('btn-brand-home').addEventListener('click', () => { playClick(); navigate('home'); });
  document.getElementById('btn-nav-home').addEventListener('click', () => { playClick(); navigate('home'); });
  document.getElementById('btn-nav-map').addEventListener('click', () => { playClick(); navigate('map'); });
  document.getElementById('btn-switch-profile').addEventListener('click', () => { playClick(); navigate('home'); });

  document.getElementById('btn-toggle-lang').addEventListener('click', () => {
    playClick();
    const next = getLang() === 'en' ? 'id' : 'en';
    setLang(next);
    renderCurrentRoute();
    syncBgmPlayer();
  });

  document.getElementById('btn-toggle-bgm').addEventListener('click', () => {
    playClick();
    bgmHasInteracted = true;
    bgmUserPreferredOn = !bgmUserPreferredOn;
    if (bgmUserPreferredOn && getMuted()) {
      setMuted(false);
      document.getElementById('btn-toggle-sound').textContent = '🔊';
      document.getElementById('btn-toggle-sound').setAttribute('aria-pressed', 'false');
    }
    syncBgmPlayer(true);
  });

  document.getElementById('btn-nav-leaderboard').addEventListener('click', () => {
    playClick();
    showModal(t('lbTitle'), (body) => {
      body.innerHTML = renderLeaderboardModalHtml(appState.badgesData);
    });
  });

  document.getElementById('btn-toggle-pid').addEventListener('click', (e) => {
    playClick();
    const isPid = document.body.classList.toggle('pid-mode');
    e.currentTarget.setAttribute('aria-pressed', String(isPid));
    if (isPid && document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (!isPid && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  });

  document.getElementById('btn-toggle-sound').addEventListener('click', (e) => {
    const nextMute = !getMuted();
    setMuted(nextMute);
    e.currentTarget.textContent = nextMute ? '🔇' : '🔊';
    e.currentTarget.setAttribute('aria-pressed', String(nextMute));
    updateActiveStudent((stu) => {
      stu.muted = nextMute;
    });
    syncBgmPlayer();
  });

  document.getElementById('btn-teacher-mode').addEventListener('click', () => {
    playClick();
    showModal(t('teacherModalTitle'), (body, footer) => {
      openTeacherModal(
        body,
        footer,
        () => {
          getModal().hide();
          bgmUserPreferredOn = getSettings().bgmEnabled !== false;
          syncBgmPlayer();
          navigate('home');
        },
        () => {
          bgmUserPreferredOn = getSettings().bgmEnabled !== false;
          syncBgmPlayer(true);
        }
      );
    });
  });

  document.getElementById('btn-prev-step').addEventListener('click', () => {
    playClick();
    const flow = ['home', 'apersepsi', 'pretest', 'map', 'island', 'posttest', 'reflection', 'certificate'];
    if (appState.route === 'island') {
      if (appState.islandStep === 'boss') {
        appState.islandStep = 'game';
        renderIslandView();
      } else if (appState.islandStep === 'game') {
        appState.islandStep = 'material';
        renderIslandView();
      } else {
        navigate('map');
      }
      return;
    }
    const idx = flow.indexOf(appState.route);
    navigate(flow[Math.max(0, idx - 1)]);
  });

  document.getElementById('btn-next-step').addEventListener('click', () => {
    playClick();
    const stu = getActiveStudent();
    if (appState.route === 'apersepsi') navigate('pretest');
    else if (appState.route === 'pretest') navigate('map');
    else if (appState.route === 'map') navigate('island', { islandId: stu?.unlockedIsland || 1, islandStep: 'material', materialSlide: 0 });
    else if (appState.route === 'island') {
      if (appState.islandStep === 'material') {
        appState.islandStep = 'game';
        renderIslandView();
      } else if (appState.islandStep === 'game') {
        appState.islandStep = 'boss';
        renderIslandView();
      } else if ((stu?.completedIslands || []).length >= 6) {
        navigate('posttest');
      } else {
        navigate('map');
      }
    } else if (appState.route === 'posttest') navigate('reflection');
    else if (appState.route === 'reflection') navigate('certificate');
    else navigate('map');
  });

  document.getElementById('btn-repeat-material').addEventListener('click', () => {
    playClick();
    appState.islandStep = 'material';
    appState.materialSlide = 0;
    renderIslandView();
  });

  document.getElementById('btn-download-summary').addEventListener('click', () => {
    playClick();
    downloadLearningSummary(getActiveStudent());
  });
}

async function initApp() {
  setLang(getLang());
  applyStaticShellTranslations();
  bindGlobalControls();
  syncBgmPlayer();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  try {
    const [textsRes, questionsRes, badgesRes] = await Promise.all([
      fetch('./data/texts.json'),
      fetch('./data/questions.json'),
      fetch('./data/badges.json')
    ]);
    appState.textsData = await textsRes.json();
    appState.questionsData = await questionsRes.json();
    appState.badgesData = (await badgesRes.json()).badges || [];

    const activeStu = getActiveStudent();
    if (activeStu) {
      setMuted(Boolean(activeStu.muted));
      document.getElementById('btn-toggle-sound').textContent = activeStu.muted ? '🔇' : '🔊';
      syncBgmPlayer();
      navigate('map');
    } else {
      navigate('home');
    }
  } catch (err) {
    appRoot.innerHTML = `
      <div class="alert alert-danger rounded-4">
        <h4>Failed to load application data</h4>
        <p class="mb-0">Make sure the app is served via a web server (not directly via <code>file://</code>). Detail: ${err.message}</p>
      </div>
    `;
  }
}

initApp();
