import * as THREE from 'three';
import { ESQUADRAO, PISTA } from '../data/balance.js';
import { criarGeometriaCadete } from '../entities/cadete.js';

const ANGULO_DOURADO = Math.PI * (3 - Math.sqrt(5)); // ≈137,5°

/** Posição do cadete i na espiral de Fermat (formação circular compacta). */
export function posicaoEspiral(i, espacamento = ESQUADRAO.espacamento) {
  const r = espacamento * Math.sqrt(i + 0.5);
  const a = i * ANGULO_DOURADO;
  return [Math.cos(a) * r, Math.sin(a) * r];
}

/** Raio ocupado por n cadetes na formação. */
export function raioFormacao(n, espacamento = ESQUADRAO.espacamento) {
  return espacamento * Math.sqrt(Math.max(1, n) + 0.5);
}

/**
 * O esquadrão: guarda o total "lógico" de cadetes (pode passar de 600)
 * e desenha até ESQUADRAO.maxVisiveis com um único InstancedMesh.
 */
export class Esquadrao {
  constructor(cena, cores) {
    this.max = ESQUADRAO.maxVisiveis;
    this.malha = new THREE.InstancedMesh(
      criarGeometriaCadete(cores),
      new THREE.MeshToonMaterial({ vertexColors: true }),
      this.max,
    );
    this.malha.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.malha.frustumCulled = false;
    this.malha.count = 0;
    cena.add(this.malha);

    // Estado por cadete visível (arrays planos: rápido e sem lixo para o GC)
    this.px = new Float32Array(this.max); // posição atual relativa ao centro
    this.pz = new Float32Array(this.max);
    this.vx = new Float32Array(this.max);
    this.vz = new Float32Array(this.max);
    this.escala = new Float32Array(this.max); // anima o "nascer" (0 → 1)
    this.fase = new Float32Array(this.max);
    // Posições-alvo da espiral calculadas uma vez só
    this.alvoX = new Float32Array(this.max);
    this.alvoZ = new Float32Array(this.max);
    for (let i = 0; i < this.max; i++) {
      this.fase[i] = Math.random() * Math.PI * 2;
      const [ax, az] = posicaoEspiral(i);
      this.alvoX[i] = ax;
      this.alvoZ[i] = az;
    }

    this.total = 0;
    this.centroX = 0;
    this.centroZ = 0;
    this.tempo = 0;
    this._m = new THREE.Matrix4();
    this._q = new THREE.Quaternion();
    this._e = new THREE.Euler();
    this._p = new THREE.Vector3();
    this._s = new THREE.Vector3();

    // Sombra simples debaixo do esquadrão (mais barata que sombra real)
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(0,0,0,0.55)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    this.sombra = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }),
    );
    this.sombra.position.y = 0.02;
    cena.add(this.sombra);
  }

  get visiveis() {
    return Math.min(this.total, this.max);
  }

  /**
   * Formato da formação. Enquanto cabe na pista é um círculo; quando passa da
   * largura vira uma elipse alongada para trás (mesma densidade), e os cadetes
   * ficam um pouco mais juntos em esquadrões enormes.
   */
  formato() {
    const n = this.visiveis;
    const t = Math.min(1, Math.max(0, (n - ESQUADRAO.compactarDe) / (ESQUADRAO.compactarAte - ESQUADRAO.compactarDe)));
    const k = 1 - t * (1 - ESQUADRAO.compactacaoMax); // 1 → compactacaoMax
    const r = raioFormacao(n) * k;
    const a = PISTA.largura / 2 - 0.5;
    if (r <= a) return { k, sx: k, sz: k, rx: r, rz: r };
    return { k, sx: k * (a / r), sz: k * (r / a), rx: a, rz: (r * r) / a };
  }

  get raio() {
    return this.formato().rz;
  }

  /** Muda o total. Novos cadetes "nascem" no centro; os que saem são devolvidos para gerar partículas. */
  definirTotal(novo) {
    const antes = this.visiveis;
    this.total = Math.max(0, Math.floor(novo));
    const depois = this.visiveis;
    const removidos = [];
    if (depois > antes) {
      for (let i = antes; i < depois; i++) {
        this.px[i] = (Math.random() - 0.5) * 0.4;
        this.pz[i] = (Math.random() - 0.5) * 0.4;
        this.vx[i] = 0;
        this.vz[i] = 0;
        this.escala[i] = 0;
      }
    } else if (depois < antes) {
      for (let i = depois; i < antes; i++) {
        removidos.push([this.centroX + this.px[i], this.centroZ + this.pz[i]]);
      }
    }
    this.malha.count = depois;
    return removidos;
  }

  /** Limita o centro para a formação caber na pista. */
  limiteX() {
    // Mesmo um esquadrão gigante consegue ir para um dos lados e escolher o portão
    return Math.max(ESQUADRAO.desvioMinimo, PISTA.largura / 2 - this.formato().rx - 0.3);
  }

  atualizar(dt, velocidade) {
    this.tempo += dt;
    const n = this.visiveis;
    const k = ESQUADRAO.mola;
    const amortecimento = 2 * Math.sqrt(k) * 0.9;
    const meia = PISTA.largura / 2 - 0.25;
    const ritmo = (velocidade / 10) * 11;
    const { sx, sz, rx, rz } = this.formato();

    for (let i = 0; i < n; i++) {
      const ax = this.alvoX[i] * sx;
      const az = this.alvoZ[i] * sz;
      // Mola até a posição alvo na espiral
      this.vx[i] += ((ax - this.px[i]) * k - this.vx[i] * amortecimento) * dt;
      this.vz[i] += ((az - this.pz[i]) * k - this.vz[i] * amortecimento) * dt;
      this.px[i] += this.vx[i] * dt;
      this.pz[i] += this.vz[i] * dt;
      if (this.escala[i] < 1) this.escala[i] = Math.min(1, this.escala[i] + dt * 5);

      let x = this.centroX + this.px[i];
      if (x > meia) x = meia;
      if (x < -meia) x = -meia;

      const t = this.tempo * ritmo + this.fase[i];
      const pulo = Math.abs(Math.sin(t)) * 0.12;
      this._e.set(-0.15, 0, Math.sin(t) * 0.12);
      this._q.setFromEuler(this._e);
      const e = this.escala[i] * ESQUADRAO.escalaCadete;
      this._s.set(e, e, e);
      this._p.set(x, pulo, this.centroZ + this.pz[i]);
      this._m.compose(this._p, this._q, this._s);
      this.malha.setMatrixAt(i, this._m);
    }
    this.malha.instanceMatrix.needsUpdate = true;

    this.sombra.scale.set(rx * 2.4 + 1, 1, rz * 2.4 + 1);
    this.sombra.position.x = this.centroX;
    this.sombra.position.z = this.centroZ;
  }
}
