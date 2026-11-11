let ctx: AudioContext;
export let volume = .3;
export function setVolume(v: number) { volume = v; }
export function tone(f = 220, d = .15) { if(volume<=0)return; ctx ??= new AudioContext(); void ctx.resume(); const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(volume * .2, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + d); o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + d); }
export function broadcast(text: string) { tone(520, .25); if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = .82;
    u.pitch = .75;
    u.volume = volume;
    const voice = speechSynthesis.getVoices().find(v => v.lang.startsWith('zh') && v.localService);
    if (voice) {
        u.voice = voice;
        speechSynthesis.speak(u);
    }
} }
export function stopSpeech() { if ('speechSynthesis' in window)
    speechSynthesis.cancel(); }

export function pauseAudio(){if(ctx)void ctx.suspend();stopSpeech()}
export function resumeAudio(){if(ctx)void ctx.resume()}
