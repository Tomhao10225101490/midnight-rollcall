import * as T from 'three';
/** Original duty proctor: charcoal Zhongshan-style coat, clipboard, hanging keys. */
export function proctor() {
    const root = new T.Group();
    const cloth = new T.MeshStandardMaterial({ color: '#252e32', roughness: .94 }), skin = new T.MeshStandardMaterial({ color: '#b5a88e', roughness: .8 }), metal = new T.MeshStandardMaterial({ color: '#9c9c86', metalness: .75, roughness: .35 });
    function part(g: T.BufferGeometry, m: T.Material, x: number, y: number, z: number, parent: T.Object3D = root) { const mesh = new T.Mesh(g, m); mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh; }
    part(new T.CylinderGeometry(.27, .38, 1.05, 12), cloth, 0, .28, 0);
    part(new T.SphereGeometry(.23, 20, 16), skin, 0, 1.02, 0);
    part(new T.SphereGeometry(.235, 20, 12, 0, Math.PI * 2, 0, Math.PI * .48), cloth, 0, 1.05, 0);
    part(new T.BoxGeometry(.12, .05, .11), skin, 0, 1.01, .22);
    for (const x of [-.085, .085])
        part(new T.BoxGeometry(.055, .018, .02), cloth, x, 1.07, .218);
    for (const y of [.12, .32, .52, .72])
        part(new T.SphereGeometry(.025, 8, 8), metal, 0, y, .29);
    const legs: T.Group[] = [];
    for (const x of [-.17, .17]) {
        const leg = new T.Group();
        leg.position.set(x, -.2, 0);
        root.add(leg);
        part(new T.CylinderGeometry(.105, .085, .65, 10), cloth, 0, -.33, 0, leg);
        part(new T.BoxGeometry(.19, .15, .32), cloth, 0, -.68, .07, leg);
        legs.push(leg);
        const arm = part(new T.CylinderGeometry(.095, .07, .72, 10), cloth, x * 2, .3, 0);
        arm.rotation.z = x > 0 ? -.12 : .12;
        part(new T.SphereGeometry(.085, 12, 8), skin, x * 2, -.1, .02);
    }
    part(new T.BoxGeometry(.28, .42, .045), new T.MeshStandardMaterial({ color: '#75644b' }), -.39, -.04, .15);
    part(new T.BoxGeometry(.23, .34, .01), new T.MeshStandardMaterial({ color: '#c5bfa2' }), -.39, -.03, .18);
    for (let i = 0; i < 3; i++) {
        part(new T.TorusGeometry(.035, .009, 6, 12), metal, .36 + i * .025, -.15, .1);
        part(new T.BoxGeometry(.012, .1, .012), metal, .36 + i * .025, -.22, .1);
    }
    return { root, animate: (t: number, moving: boolean) => legs.forEach((l, i) => l.rotation.x = moving ? Math.sin(t * 5 + i * Math.PI) * .3 : 0) };
}
