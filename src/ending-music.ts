/** Reuse one local media element across endings; no network or runtime synthesis dependency. */
export class EndingMusic {
 private readonly audio = new Audio(new URL('./audio/after_last_rollcall.wav', import.meta.url).href);
 private generation = 0;
 private active = false;
 private focusPaused = false;
 private failed = false;

 constructor() {
  this.audio.preload = 'auto';
  this.audio.volume = 0;
  this.audio.addEventListener('ended', () => { this.active = false; });
  this.audio.addEventListener('error', () => { this.failed = true; this.active = false; });
 }

 begin() {
  this.stop();
  this.failed = false;
  this.active = true;
  this.play();
 }

 private play() {
  const generation = this.generation;
  void this.audio.play().catch(() => {
   // pause()/stop() can reject a pending play request after a new ending has begun.
   if (generation === this.generation) { this.failed = true; this.active = false; }
  });
 }

 stop() {
  this.generation++;
  this.active = false;
  this.focusPaused = false;
  this.audio.pause();
  this.audio.currentTime = 0;
  this.audio.volume = 0;
 }

 update(dt: number, volume: number, focused: boolean, dialogue: boolean) {
  if (!this.active) return;
  const target = volume * .24 * (dialogue ? .24 : 1);
  this.audio.volume = volume === 0 ? 0 : this.audio.volume +
   (target - this.audio.volume) * (1 - Math.exp(-dt / (dialogue ? .1 : .75)));
  if (!focused && !this.focusPaused) {
   this.generation++;
   this.audio.pause();
   this.focusPaused = true;
  } else if (focused && this.focusPaused) {
   this.focusPaused = false;
   this.play();
  }
 }

 measure() {
  return {
   active: this.active, paused: this.audio.paused, position: this.audio.currentTime,
   duration: Number.isFinite(this.audio.duration) ? this.audio.duration : 0,
   volume: this.audio.volume, ready: this.audio.readyState, error: this.failed,
  };
 }
}
