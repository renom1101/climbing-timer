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
 * Single strong beep at 1000 Hz. Triangle wave is less harsh than
 * square but still carries harmonics that cut through noise.
 * 250ms duration with decay gives a clear, punchy tick.
 */
export function playDing() {
  const ctx = getContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.value = 1000;
  osc.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.7, now + 0.01);
  gain.gain.setValueAtTime(0.7, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.start(now);
  osc.stop(now + 0.25);
}

/**
 * Low sine tone at 440 Hz with a long decay. Deep and resonant,
 * clearly distinct from the higher-pitched ding.
 */
export function playDong() {
  const ctx = getContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = 440;
  osc.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.7, now + 0.01);
  gain.gain.setValueAtTime(0.7, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc.start(now);
  osc.stop(now + 0.6);
}
