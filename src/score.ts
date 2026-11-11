// Original procedural score. Three layers: ventilation drone, sparse piano-like
// pentatonic motif and pulse. No samples or externally licensed recordings.
export class Score {
    private ctx: AudioContext | null = null;
    private bus: GainNode | null = null;
    private drones: OscillatorNode[] = [];
    private beat = 0;
    private clock = 0;
    start() { if (this.ctx) {
        void this.ctx.resume();
        return;
    } this.ctx = new AudioContext(); this.bus = this.ctx.createGain(); this.bus.gain.value = .08; const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 900; this.bus.connect(filter).connect(this.ctx.destination); for (const f of [55, 82.41, 110.3]) {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.value = .08;
        o.connect(g).connect(this.bus);
        o.start();
        this.drones.push(o);
    } }
    pause() { if (this.ctx)
        void this.ctx.suspend(); }
    update(dt: number, chase: boolean, volume: number) { if (!this.ctx || !this.bus)
        return; this.bus.gain.setTargetAtTime(volume * .35, this.ctx.currentTime, .3); this.clock -= dt; if (this.clock > 0)
        return; this.clock = chase ? .32 : 2.8; const notes = chase ? [146.83, 155.56, 220, 155.56] : [220, 0, 293.66, 329.63, 0, 196, 0, 146.83]; const f = notes[this.beat++ % notes.length]; if (!f)
        return; const o = this.ctx.createOscillator(), g = this.ctx.createGain(), p = this.ctx.createStereoPanner(); o.type = chase ? 'triangle' : 'sine'; o.frequency.value = f; g.gain.setValueAtTime(.001, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(chase ? .12 : .2, this.ctx.currentTime + .025); g.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + (chase ? .25 : 2.5)); p.pan.value = Math.sin(this.beat * 1.7) * .6; o.connect(g).connect(p).connect(this.bus); o.start(); o.stop(this.ctx.currentTime + 3); }
}
