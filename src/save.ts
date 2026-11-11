export const key = 'rollcall-v1';
export function read() { try {
    const s = JSON.parse(localStorage.getItem(key) || 'null');
    return s?.v === 1 && Number.isInteger(s.stage) && s.stage >= 0 && s.stage <= 4 ? s : null;
}
catch {
    return null;
} }
export function save(stage: number) { try {
    localStorage.setItem(key, JSON.stringify({ v: 1, stage }));
}
catch {
    console.warn('存档不可用，将继续本局游戏');
} }
