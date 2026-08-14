import { GameSettings } from '../types';

class AudioService {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private musicInterval: number | null = null;
  private currentSettings: GameSettings = {
    sfxVolume: 0.8,
    musicVolume: 0.5,
    sfxMuted: false,
    musicMuted: false,
    screenShake: true,
    highGlow: true,
  };

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.sfxGainNode = this.ctx.createGain();
        this.sfxGainNode.connect(this.ctx.destination);

        this.musicGainNode = this.ctx.createGain();
        this.musicGainNode.connect(this.ctx.destination);

        this.updateVolumes(this.currentSettings);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public updateSettings(settings: GameSettings) {
    this.currentSettings = { ...settings };
    this.updateVolumes(settings);
    if (settings.musicMuted || settings.musicVolume === 0) {
      this.stopMusic();
    } else if (!this.isMusicPlaying && this.ctx) {
      this.startSynthwaveMusic();
    }
  }

  private updateVolumes(settings: GameSettings) {
    if (this.sfxGainNode && this.ctx) {
      const vol = settings.sfxMuted ? 0 : settings.sfxVolume;
      this.sfxGainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
    if (this.musicGainNode && this.ctx) {
      const vol = settings.musicMuted ? 0 : settings.musicVolume * 0.3; // keep ambient music background
      this.musicGainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  // SFX: Play Jump
  public playJump() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.currentSettings.sfxMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // SFX: Double Jump / Moonwalk Glide
  public playDoubleJump() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.currentSettings.sfxMuted) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(2500, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  // SFX: Cyber Slide
  public playSlide() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.currentSettings.sfxMuted) return;

    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.12);
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);

    noise.start();
  }

  // SFX: Orb Collect Chime
  public playOrbCollect(comboCount: number = 1) {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.currentSettings.sfxMuted) return;

    // Pitch rises with combo
    const baseFreq = 440 * Math.pow(1.05, Math.min(comboCount, 12));
    const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5]; // Major chord synth chime

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.03);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.03 + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(this.ctx.currentTime + idx * 0.03);
      osc.stop(this.ctx.currentTime + idx * 0.03 + 0.25);
    });
  }

  // SFX: Powerup Blast / Surge
  public playPowerUp() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.currentSettings.sfxMuted) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(4000, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  // SFX: Obstacle Dodge / Close Call
  public playDodge() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.currentSettings.sfxMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // SFX: Hit / Impact
  public playHit() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.currentSettings.sfxMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // SFX: Game Over
  public playGameOver() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.currentSettings.sfxMuted) return;

    const notes = [220, 207.65, 196, 174.61, 146.83]; // Descending cyber collapse scale
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.35, this.ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.12 + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(this.ctx.currentTime + idx * 0.12);
      osc.stop(this.ctx.currentTime + idx * 0.12 + 0.2);
    });
  }

  // SFX: UI Click
  public playClick() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.currentSettings.sfxMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // PROCEDURAL SYNTHWAVE MUSIC ENGINE
  public startSynthwaveMusic() {
    this.initContext();
    if (this.isMusicPlaying || !this.ctx || !this.musicGainNode || this.currentSettings.musicMuted) return;

    this.isMusicPlaying = true;
    let step = 0;

    // Synthwave Bassline frequencies (A minor / Cyber Funk vibe)
    // A1, A1, C2, D2, A1, F1, G1, E1
    const bassline = [110, 110, 130.81, 146.83, 110, 87.31, 98.0, 82.41];
    const arpeggio = [220, 261.63, 329.63, 392.0, 440, 523.25, 392.0, 329.63];

    const tempoMs = 120; // 125 BPM 16th notes approx

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGainNode || this.currentSettings.musicMuted || !this.isMusicPlaying) return;

      const now = this.ctx.currentTime;

      // 1. Bass synth note on eighths
      if (step % 2 === 0) {
        const freq = bassline[Math.floor(step / 2) % bassline.length];
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq / 2, now); // Deep sub-bass

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.15);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGainNode);

        osc.start(now);
        osc.stop(now + 0.18);
      }

      // 2. Arpeggiator lead note on every 16th note
      const arpFreq = arpeggio[step % arpeggio.length];
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();

      arpOsc.type = 'triangle';
      arpOsc.frequency.setValueAtTime(arpFreq, now);

      arpGain.gain.setValueAtTime(0.08, now);
      arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      arpOsc.connect(arpGain);
      arpGain.connect(this.musicGainNode);

      arpOsc.start(now);
      arpOsc.stop(now + 0.09);

      // 3. Cyber Hi-hat pulse on off-beats
      if (step % 2 === 1) {
        const hatBufferSize = this.ctx.sampleRate * 0.03;
        const hatBuffer = this.ctx.createBuffer(1, hatBufferSize, this.ctx.sampleRate);
        const data = hatBuffer.getChannelData(0);
        for (let i = 0; i < hatBufferSize; i++) data[i] = Math.random() * 2 - 1;

        const hat = this.ctx.createBufferSource();
        hat.buffer = hatBuffer;

        const hatFilter = this.ctx.createBiquadFilter();
        hatFilter.type = 'highpass';
        hatFilter.frequency.setValueAtTime(7000, now);

        const hatGain = this.ctx.createGain();
        hatGain.gain.setValueAtTime(0.06, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        hat.connect(hatFilter);
        hatFilter.connect(hatGain);
        hatGain.connect(this.musicGainNode);

        hat.start(now);
      }

      step = (step + 1) % 32;
    }, tempoMs);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const audioService = new AudioService();
