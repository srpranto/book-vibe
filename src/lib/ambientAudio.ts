export type AmbientSoundType = "rain" | "fireplace" | "cafe" | "silent";

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private currentSound: AmbientSoundType = "silent";
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private isMuted: boolean = false;
  private currentVolume: number = 0.5;

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number): void {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(
        this.isMuted ? 0 : this.currentVolume,
        this.ctx.currentTime,
      );
    }
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolume(this.currentVolume);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public stop(): void {
    if (this.noiseNode) {
      try {
        if ("stop" in this.noiseNode && typeof (this.noiseNode as AudioBufferSourceNode).stop === "function") {
          (this.noiseNode as AudioBufferSourceNode).stop();
        }
        this.noiseNode.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      this.noiseNode = null;
    }
    this.currentSound = "silent";
  }

  public play(type: AmbientSoundType): void {
    if (type === "silent") {
      this.stop();
      return;
    }

    const ctx = this.initContext();
    if (!ctx) return;

    this.stop();

    if (!this.gainNode) {
      this.gainNode = ctx.createGain();
      this.gainNode.connect(ctx.destination);
    }
    this.gainNode.gain.setValueAtTime(
      this.isMuted ? 0 : this.currentVolume,
      ctx.currentTime,
    );

    if (type === "rain") {
      this.playRain(ctx, this.gainNode);
    } else if (type === "fireplace") {
      this.playFireplace(ctx, this.gainNode);
    } else if (type === "cafe") {
      this.playCafe(ctx, this.gainNode);
    }

    this.currentSound = type;
  }

  public getCurrentSound(): AmbientSoundType {
    return this.currentSound;
  }

  private playRain(ctx: AudioContext, destination: AudioNode): void {
    // Rain: Brown/Pink noise through a low-pass filter with gentle modulation
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(destination);

    noiseSource.start();
    this.noiseNode = noiseSource;
  }

  private playFireplace(ctx: AudioContext, destination: AudioNode): void {
    // Fireplace: Low rumble + subtle crackling impulses
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.03;
      b2 = 0.85 * b2 + white * 0.01;
      // Random subtle crackle pops
      const crackle = Math.random() > 0.997 ? (Math.random() * 2 - 1) * 0.8 : 0;
      data[i] = (b0 + b1 + b2) * 0.8 + crackle;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(destination);

    noiseSource.start();
    this.noiseNode = noiseSource;
  }

  private playCafe(ctx: AudioContext, destination: AudioNode): void {
    // Cafe: Soft ambient hum and warmth
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      data[i] = (b0 + b1 + b2 + b3) * 0.15;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.Q.setValueAtTime(0.7, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(destination);

    noiseSource.start();
    this.noiseNode = noiseSource;
  }
}

export const ambientAudio = new AmbientAudioEngine();
