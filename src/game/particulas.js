import * as THREE from 'three';
import { EFEITOS } from '../data/balance.js';

// Partículas baratas: cubinhos num único InstancedMesh, com pool fixo.
export class Particulas {
  constructor(cena) {
    const max = EFEITOS.particulasMax;
    this.max = max;
    this.malha = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.16, 0.16, 0.16),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
      max,
    );
    this.malha.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.malha.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
    this.malha.frustumCulled = false;
    this.malha.count = max;
    cena.add(this.malha);

    this.vida = new Float32Array(max);
    this.pos = new Float32Array(max * 3);
    this.vel = new Float32Array(max * 3);
    this.prox = 0;
    this._m = new THREE.Matrix4();
    this._zero = new THREE.Matrix4().makeScale(0, 0, 0);
    this._cor = new THREE.Color();
    for (let i = 0; i < max; i++) this.malha.setMatrixAt(i, this._zero);
  }

  /** Solta `quantidade` partículas em (x, y, z) com a cor dada. */
  explodir(x, y, z, cor, quantidade = 8, forca = 4) {
    this._cor.set(cor);
    for (let n = 0; n < quantidade; n++) {
      const i = this.prox;
      this.prox = (this.prox + 1) % this.max;
      this.vida[i] = 0.5 + Math.random() * 0.4;
      this.pos[i * 3] = x;
      this.pos[i * 3 + 1] = y;
      this.pos[i * 3 + 2] = z;
      this.vel[i * 3] = (Math.random() - 0.5) * forca;
      this.vel[i * 3 + 1] = Math.random() * forca + 2;
      this.vel[i * 3 + 2] = (Math.random() - 0.5) * forca;
      this.malha.setColorAt(i, this._cor);
    }
    this.malha.instanceColor.needsUpdate = true;
  }

  atualizar(dt) {
    for (let i = 0; i < this.max; i++) {
      if (this.vida[i] <= 0) continue;
      this.vida[i] -= dt;
      if (this.vida[i] <= 0) {
        this.malha.setMatrixAt(i, this._zero);
        continue;
      }
      this.vel[i * 3 + 1] -= 18 * dt;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] = Math.max(0.05, this.pos[i * 3 + 1] + this.vel[i * 3 + 1] * dt);
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      const s = Math.min(1, this.vida[i] * 2.5);
      this._m.makeScale(s, s, s);
      this._m.setPosition(this.pos[i * 3], this.pos[i * 3 + 1], this.pos[i * 3 + 2]);
      this.malha.setMatrixAt(i, this._m);
    }
    this.malha.instanceMatrix.needsUpdate = true;
  }
}
