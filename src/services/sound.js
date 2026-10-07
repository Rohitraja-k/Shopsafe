/**
 * Web Audio API synthesizer for clean sound feedback.
 * Has sound enable/disable support.
 */

let soundEnabled = true;

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('shopsafe_sound_enabled', JSON.stringify(soundEnabled));
  return soundEnabled;
};

export const isSoundEnabled = () => {
  const stored = localStorage.getItem('shopsafe_sound_enabled');
  if (stored !== null) {
    soundEnabled = JSON.parse(stored);
  }
  return soundEnabled;
};

const getAudioContext = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      return new AudioCtx();
    }
  } catch (e) {
    console.warn('Web Audio API not supported', e);
  }
  return null;
};

export const playSound = (type = 'click') => {
  if (!isSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'scan': // High tech barcode beep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now); // A6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        break;

      case 'success': // Pleasant two-tone chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
        break;

      case 'warning': // Low dual buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

      case 'delete': // Sharp descending tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
        break;

      case 'click':
      default:
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
    }
  } catch (err) {
    // Ignore audio autoplay restrictions
  }
};
