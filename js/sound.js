/**
 * Efek suara ringan berbasis Web Audio API (100% offline tanpa file eksternal).
 */
let audioCtx = null;
let isMuted = false;

function getCtx() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setMuted(muted) {
  isMuted = Boolean(muted);
}

export function getMuted() {
  return isMuted;
}

function playTone(freq, duration = 0.12, type = 'sine', volume = 0.08, delay = 0) {
  if (isMuted) return;
  const ctx = getCtx();
  if (!ctx) return;

  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);

  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

export function playClick() {
  playTone(540, 0.06, 'triangle', 0.05);
}

export function playCorrect() {
  playTone(523.25, 0.12, 'sine', 0.08, 0);
  playTone(659.25, 0.16, 'sine', 0.08, 0.09);
}

export function playWrong() {
  playTone(260, 0.14, 'sawtooth', 0.05, 0);
  playTone(210, 0.18, 'sawtooth', 0.05, 0.11);
}

export function playVictory() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((n, i) => playTone(n, 0.2, 'triangle', 0.08, i * 0.1));
}
