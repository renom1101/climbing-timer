let audioCtx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Bright, snappy ding that matches the bolder horn palette.
 */
export function playDing() {
  const ctx = getContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = "square";
  osc2.type = "sawtooth";
  osc.frequency.setValueAtTime(900, now);
  osc2.frequency.setValueAtTime(1350, now);
  osc.connect(filter);
  osc2.connect(filter);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1700, now);
  filter.Q.setValueAtTime(0.6, now);
  filter.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.78, now + 0.015);
  gain.gain.setValueAtTime(0.78, now + 0.09);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  osc.start(now);
  osc2.start(now);
  osc.stop(now + 0.22);
  osc2.stop(now + 0.22);
}

/**
 * Ship-horn style dong: deep, steady, and resonant.
 */
export function playDong() {
  const ctx = getContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = "square";
  osc2.type = "sawtooth";
  osc.frequency.setValueAtTime(220, now);
  osc2.frequency.setValueAtTime(440, now);
  osc.connect(filter);
  osc2.connect(filter);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1400, now);
  filter.Q.setValueAtTime(0.9, now);
  filter.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.98, now + 0.02);
  gain.gain.setValueAtTime(0.98, now + 0.25);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

  osc.start(now);
  osc2.start(now);
  osc.stop(now + 0.9);
  osc2.stop(now + 0.9);
}
