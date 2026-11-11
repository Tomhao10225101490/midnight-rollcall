export const options = { volume: .3, sensitivity: 2, quality: 1 };
try {
    const v = JSON.parse(localStorage.getItem('rollcall-settings') || 'null');
    for (const k of ['volume', 'sensitivity', 'quality'] as const) {
        if (v && typeof v[k] === 'number' && Number.isFinite(v[k]))
            options[k] = v[k];
    }
    options.volume = Math.max(0, Math.min(1, options.volume));
    options.sensitivity = Math.max(1, Math.min(5, options.sensitivity));
    options.quality = options.quality === .75 ? .75 : 1;
}
catch { }
export function persist() { try {
    localStorage.setItem('rollcall-settings', JSON.stringify(options));
}
catch { } }
