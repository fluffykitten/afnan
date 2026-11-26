/**
 * Modul Gamifikasi: 6 Avatar SVG kartun, XP, Level, Streak, Badge (14 badge),
 * Konfeti nilai >= 90, dan Papan Peringkat Lokal.
 */
import { CONFIG } from './config.js';
import { getAllStudents, updateActiveStudent } from './storage.js';
import { playVictory } from './sound.js';
import { t, getBadgeText, getLang } from './i18n.js';

export const AVATARS = [
  {
    id: 'explorer',
    label: 'Raka Penjelajah',
    svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="30" fill="#dbeafe"/><circle cx="32" cy="36" r="16" fill="#fed7aa"/><path d="M14 28 Q32 10 50 28 Z" fill="#1d4ed8"/><rect x="12" y="25" width="40" height="5" rx="2" fill="#1e3a8a"/><circle cx="26" cy="35" r="2.5" fill="#111827"/><circle cx="38" cy="35" r="2.5" fill="#111827"/><path d="M27 42 Q32 46 37 42" stroke="#111827" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'scholar',
    label: 'Sinta Pustaka',
    svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="30" fill="#ccfbf1"/><circle cx="32" cy="35" r="16" fill="#fde68a"/><path d="M16 32 Q16 14 32 14 Q48 14 48 32" fill="#0f766e"/><circle cx="26" cy="35" r="4.5" fill="none" stroke="#111827" stroke-width="2"/><circle cx="38" cy="35" r="4.5" fill="none" stroke="#111827" stroke-width="2"/><line x1="30.5" y1="35" x2="33.5" y2="35" stroke="#111827" stroke-width="2"/><path d="M27 43 Q32 46 37 43" stroke="#111827" stroke-width="2.3" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'captain',
    label: 'Bima Nakhoda',
    svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="30" fill="#e0e7ff"/><circle cx="32" cy="36" r="16" fill="#fdba74"/><path d="M16 24 H48 L44 15 H20 Z" fill="#ffffff" stroke="#1e3a8a" stroke-width="2"/><rect x="18" y="23" width="28" height="4" fill="#f59e0b"/><circle cx="26" cy="35" r="2.5" fill="#111827"/><circle cx="38" cy="35" r="2.5" fill="#111827"/><path d="M26 42 Q32 47 38 42" stroke="#111827" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'owl',
    label: 'Burung Hantu Bijak',
    svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="30" fill="#ede9fe"/><ellipse cx="32" cy="35" rx="18" ry="19" fill="#7c3aed"/><circle cx="25" cy="31" r="6" fill="#ffffff"/><circle cx="39" cy="31" r="6" fill="#ffffff"/><circle cx="25" cy="31" r="2.5" fill="#111827"/><circle cx="39" cy="31" r="2.5" fill="#111827"/><polygon points="32,35 28,41 36,41" fill="#f59e0b"/></svg>`
  },
  {
    id: 'kancil',
    label: 'Kancil Cerdik',
    svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="30" fill="#fef3c7"/><ellipse cx="22" cy="18" rx="4" ry="10" fill="#d97706"/><ellipse cx="42" cy="18" rx="4" ry="10" fill="#d97706"/><circle cx="32" cy="36" r="15" fill="#f59e0b"/><circle cx="26" cy="34" r="2.5" fill="#111827"/><circle cx="38" cy="34" r="2.5" fill="#111827"/><circle cx="32" cy="40" r="3" fill="#111827"/></svg>`
  },
  {
    id: 'creator',
    label: 'Nadia Kreator',
    svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="30" fill="#fce7f3"/><circle cx="32" cy="36" r="16" fill="#fed7aa"/><path d="M16 32 Q20 14 32 14 Q44 14 48 32" fill="#be185d"/><circle cx="26" cy="35" r="2.5" fill="#111827"/><circle cx="38" cy="35" r="2.5" fill="#111827"/><path d="M27 42 Q32 46 37 42" stroke="#111827" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="46" cy="18" r="5" fill="#0d9488"/></svg>`
  }
];

export function getAvatarSvg(avatarId) {
  return (AVATARS.find((a) => a.id === avatarId) || AVATARS[0]).svg;
}

export function getLevelInfo(xp) {
  const level = Math.floor((xp || 0) / CONFIG.XP_PER_LEVEL) + 1;
  const currentInLevel = (xp || 0) % CONFIG.XP_PER_LEVEL;
  const pct = Math.round((currentInLevel / CONFIG.XP_PER_LEVEL) * 100);
  return { level, currentInLevel, pct };
}

export function fireConfettiIfHigh(score) {
  if (Number(score) >= CONFIG.MIN_CONFETTI_SCORE && typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 95,
      spread: 75,
      origin: { y: 0.6 }
    });
  }
}

export function showToast(title, body) {
  const container = document.getElementById('sq-toast-container');
  if (!container) return;
  const toastEl = document.createElement('div');
  toastEl.className = 'toast show align-items-center text-bg-primary border-0 rounded-4 mb-2 shadow';
  toastEl.setAttribute('role', 'alert');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <strong>${title}</strong><br><span class="small">${body}</span>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
    </div>
  `;
  toastEl.querySelector('.btn-close').addEventListener('click', () => toastEl.remove());
  container.appendChild(toastEl);
  setTimeout(() => toastEl.remove(), 4500);
}

export function awardXpAndEvaluateBadges(xpAmount, reason, badgesList = []) {
  const newlyUnlocked = [];
  const updated = updateActiveStudent((stu) => {
    stu.xp = (stu.xp || 0) + xpAmount;
    if (reason) {
      stu.activityLog = stu.activityLog || [];
      stu.activityLog.unshift({ time: new Date().toISOString(), text: `${reason} (+${xpAmount} XP)` });
      stu.activityLog = stu.activityLog.slice(0, 20);
    }

    const owned = new Set(stu.badges || []);
    const gamesDoneCount = Object.keys(stu.islandGamesDone || {}).length;
    const completedCount = (stu.completedIslands || []).length;
    const bossScores = Object.values(stu.bossScores || {});
    const hasHigh =
      bossScores.some((s) => s >= 90) || (stu.posttest && stu.posttest.score >= 90);

    const conditions = {
      first_step: Boolean(stu.pretest),
      island_1: (stu.completedIslands || []).includes(1),
      island_2: (stu.completedIslands || []).includes(2),
      island_3: (stu.completedIslands || []).includes(3),
      island_4: (stu.completedIslands || []).includes(4),
      island_5: (stu.completedIslands || []).includes(5),
      island_6: (stu.completedIslands || []).includes(6),
      master_explorer: completedCount >= 6,
      perfect_boss: hasHigh,
      game_lover: gamesDoneCount >= 3,
      all_games: gamesDoneCount >= 6,
      deep_reflector: Boolean(stu.reflection && stu.reflection.savedAt),
      graduate: Boolean(stu.posttest && stu.posttest.score >= CONFIG.PASSING_SCORE),
      streak_3: stu.xp >= 300 || (stu.streak || 0) >= 3
    };

    badgesList.forEach((b) => {
      if (conditions[b.id] && !owned.has(b.id)) {
        owned.add(b.id);
        stu.xp += b.xpBonus || 0;
        newlyUnlocked.push(getBadgeText(b));
      }
    });
    stu.badges = [...owned];
  });

  newlyUnlocked.forEach((b) => {
    playVictory();
    const prefix = getLang() === 'en' ? '🎖️ New Badge:' : '🎖️ Badge Baru:';
    showToast(`${prefix} ${b.icon} ${b.name}!`, `${b.description} (+${b.xpBonus} XP)`);
  });

  return updated;
}

export function renderLeaderboardModalHtml(badgesList) {
  const students = [...getAllStudents()].sort((a, b) => (b.xp || 0) - (a.xp || 0));
  if (students.length === 0) {
    return `<p class="text-secondary mb-0">${t('lbEmpty')}</p>`;
  }

  return `
    <p class="small text-secondary mb-3">${t('lbSub')}</p>
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>${t('lbColStudent')}</th>
            <th>${t('lbColClass')}</th>
            <th>${t('lbColXp')}</th>
            <th>${t('lbColIslands')}</th>
            <th>${t('lbColFinal')}</th>
            <th>${t('lbColBadges')}</th>
          </tr>
        </thead>
        <tbody>
          ${students
            .map((s, idx) => {
              const lv = getLevelInfo(s.xp);
              return `
                <tr>
                  <td class="fw-bold">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <span class="sq-mini-avatar">${getAvatarSvg(s.avatarId)}</span>
                      <strong>${s.name}</strong>
                    </div>
                  </td>
                  <td>${s.className}</td>
                  <td>Lv.${lv.level} (${s.xp} XP)</td>
                  <td>${(s.completedIslands || []).length} / 6</td>
                  <td>${s.posttest ? `${s.posttest.score} (${s.posttest.predikat})` : '-'}</td>
                  <td>${(s.badges || []).length} / ${badgesList.length}</td>
                </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}
