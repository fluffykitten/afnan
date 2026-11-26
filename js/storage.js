/**
 * Manajemen penyimpanan lokal (localStorage) untuk multi-profil siswa dan pengaturan guru.
 */
import { CONFIG } from './config.js';

const STORAGE_KEY = 'story_quest_smp9_v1';

function createEmptyStudent(name, className, avatarId) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: `stu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim(),
    className: className.trim(),
    avatarId: avatarId || 'explorer',
    createdAt: new Date().toISOString(),
    xp: 0,
    streak: 1,
    lastActiveDate: today,
    muted: false,
    unlockedIsland: 1,
    completedIslands: [],
    islandGamesDone: {},
    bossScores: {},
    pretest: null,
    posttest: null,
    reflection: {
      blank1: '',
      blank2: '',
      blank3: '',
      blank4: '',
      savedAt: null
    },
    createdStory: null,
    badges: [],
    activityLog: []
  };
}

function getDefaultState() {
  return {
    activeStudentId: null,
    students: [],
    settings: {
      quizRaceSeconds: CONFIG.DEFAULT_QUIZ_RACE_SECONDS,
      youtubeUrl: CONFIG.APERSEPSI_YOUTUBE_URL
    }
  };
}

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultState(),
      ...parsed,
      settings: { ...getDefaultState().settings, ...(parsed.settings || {}) },
      students: Array.isArray(parsed.students) ? parsed.students : []
    };
  } catch {
    return getDefaultState();
  }
}

export function saveStore(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getActiveStudent() {
  const store = loadStore();
  if (!store.activeStudentId) return null;
  return store.students.find((s) => s.id === store.activeStudentId) || null;
}

export function createOrSelectStudent(name, className, avatarId) {
  const store = loadStore();
  const cleanName = name.trim();
  const cleanClass = className.trim();
  let student = store.students.find(
    (s) => s.name.toLowerCase() === cleanName.toLowerCase() && s.className.toLowerCase() === cleanClass.toLowerCase()
  );

  if (student) {
    student.avatarId = avatarId || student.avatarId;
    updateStreakInternal(student);
  } else {
    student = createEmptyStudent(cleanName, cleanClass, avatarId);
    store.students.push(student);
  }

  store.activeStudentId = student.id;
  saveStore(store);
  return student;
}

export function switchActiveStudent(studentId) {
  const store = loadStore();
  const found = store.students.find((s) => s.id === studentId);
  if (!found) return null;
  updateStreakInternal(found);
  store.activeStudentId = found.id;
  saveStore(store);
  return found;
}

function updateStreakInternal(student) {
  const today = new Date().toISOString().slice(0, 10);
  if (!student.lastActiveDate) {
    student.lastActiveDate = today;
    student.streak = 1;
    return;
  }
  if (student.lastActiveDate === today) return;

  const prev = new Date(student.lastActiveDate);
  const curr = new Date(today);
  const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
  student.streak = diffDays === 1 ? (student.streak || 0) + 1 : 1;
  student.lastActiveDate = today;
}

export function updateActiveStudent(updaterFn) {
  const store = loadStore();
  const idx = store.students.findIndex((s) => s.id === store.activeStudentId);
  if (idx === -1) return null;
  const student = store.students[idx];
  updateStreakInternal(student);
  updaterFn(student, store);
  saveStore(store);
  return student;
}

export function getSettings() {
  return loadStore().settings;
}

export function updateSettings(partial) {
  const store = loadStore();
  store.settings = { ...store.settings, ...partial };
  saveStore(store);
  return store.settings;
}

export function getAllStudents() {
  return loadStore().students;
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
}
