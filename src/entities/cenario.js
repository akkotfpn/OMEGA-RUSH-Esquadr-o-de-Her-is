import * as THREE from 'three';
import { toon, brilho } from '../core/toon.js';
import { PISTA } from '../data/balance.js';
import { criarRng } from '../core/rng.js';

// Cenário do Mundo 1 — Metrópole Neon.
// A pista é feita de blocos reaproveitados: quando um bloco fica para trás
// da câmera, ele pula para a frente (nada é criado durante a corrida).

const TEMA = {
  ceuTopo: '#0b0f2a',
  ceuBase: '#6b2a8c',
  neblina: '#3a1f5c',
  chao: '#3b3f58',
  chaoLinha: '#565b7a',
  mureta: '#2a2d45',
  neon: ['#21e6ff', '#ff3bd4', '#ffd23f', '#7dff8a'],
  predios: ['#1f2240', '#262a4f', '#2d2050', '#1a2a45'],
};

function texturaCeu() {
  const c = document.createElement('canvas');
  c.width = 2;
  c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, TEMA.ceuTopo);
  grad.addColorStop(0.65, '#2b1a55');
  grad.addColorStop(1, TEMA.ceuBase);
  g.fillStyle = grad;
  g.fillRect(0, 0, 2, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function texturaChao() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = TEMA.chao;
  g.fillRect(0, 0, 256, 256);
  // Placas de piso irregulares (como no anúncio), em tom mais claro
  const rng = criarRng(42);
  g.fillStyle = TEMA.chaoLinha;
  for (let i = 0; i < 9; i++) {
    const x = rng.entre(0, 230);
    const y = rng.entre(0, 230);
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + rng.entre(20, 40), y + rng.entre(-4, 4));
    g.lineTo(x + rng.entre(18, 36), y + rng.entre(14, 24));
    g.lineTo(x + rng.entre(-4, 4), y + rng.entre(12, 22));
    g.closePath();
    g.fill();
  }
  // Faixas laterais de neon
  g.fillStyle = '#21e6ff';
  g.fillRect(0, 0, 6, 256);
  g.fillRect(250, 0, 6, 256);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, PISTA.comprimentoBloco / PISTA.largura);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function texturaJanelas() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, 64, 128);
  const rng = criarRng(7);
  const cores = ['#ffd27a', '#8fe9ff', '#ff9ae8'];
  for (let y = 4; y < 128; y += 10) {
    for (let x = 4; x < 64; x += 10) {
      if (rng.chance(0.45)) {
        g.fillStyle = rng.escolher(cores);
        g.fillRect(x, y, 5, 6);
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Cenario {
  constructor(cena) {
    this.cena = cena;
    cena.background = texturaCeu();
    cena.fog = new THREE.Fog(TEMA.neblina, 60, 190);

    const L = PISTA.largura;
    const C = PISTA.comprimentoBloco;
    this.blocos = [];

    const geoChao = new THREE.PlaneGeometry(L, C);
    geoChao.rotateX(-Math.PI / 2);
    const matChao = toon('#ffffff', { map: texturaChao() });

    const geoMureta = new THREE.BoxGeometry(0.5, PISTA.alturaMureta, C);
    const geoFaixa = new THREE.BoxGeometry(0.52, 0.08, C);
    const geoCalcada = new THREE.PlaneGeometry(26, C);
    geoCalcada.rotateX(-Math.PI / 2);
    const matCalcada = toon('#20223a');
    const janelas = texturaJanelas();
    const rng = criarRng(2024);

    for (let i = 0; i < PISTA.blocosVisiveis; i++) {
      const bloco = new THREE.Group();

      const chao = new THREE.Mesh(geoChao, matChao);
      bloco.add(chao);

      for (const lado of [-1, 1]) {
        const mureta = new THREE.Mesh(geoMureta, toon(TEMA.mureta));
        mureta.position.set(lado * (L / 2 + 0.25), PISTA.alturaMureta / 2, 0);
        bloco.add(mureta);
        const faixa = new THREE.Mesh(geoFaixa, brilho(TEMA.neon[i % 2]));
        faixa.position.set(lado * (L / 2 + 0.25), PISTA.alturaMureta, 0);
        bloco.add(faixa);

        const calcada = new THREE.Mesh(geoCalcada, matCalcada);
        calcada.position.set(lado * (L / 2 + 13.5), -0.3, 0);
        bloco.add(calcada);

        // Prédios
        let z = -C / 2 + 4;
        while (z < C / 2 - 4) {
          const largura = rng.entre(5, 9);
          const altura = rng.entre(10, 34);
          const profundidade = rng.entre(5, 8);
          const mat = toon(rng.escolher(TEMA.predios), {
            emissive: '#ffffff',
            emissiveMap: janelas,
          });
          const predio = new THREE.Mesh(new THREE.BoxGeometry(profundidade, altura, largura), mat);
          predio.position.set(lado * (L / 2 + 5 + profundidade / 2 + rng.entre(0, 4)), altura / 2 - 0.3, z + largura / 2);
          bloco.add(predio);

          // Letreiro de neon em alguns prédios
          if (rng.chance(0.55)) {
            const placa = new THREE.Mesh(
              new THREE.BoxGeometry(0.3, rng.entre(1, 2.2), rng.entre(2.5, 4.5)),
              brilho(rng.escolher(TEMA.neon)),
            );
            placa.position.set(
              predio.position.x - lado * (profundidade / 2 + 0.2),
              rng.entre(4, Math.min(12, altura - 2)),
              predio.position.z,
            );
            bloco.add(placa);
          }
          z += largura + rng.entre(1, 3);
        }

        // Postes com luz
        for (const pz of [-C / 4, C / 4]) {
          const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 5, 6), toon('#3a3d5c'));
          poste.position.set(lado * (L / 2 + 1.2), 2.5, pz);
          const lampada = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), brilho('#fff2b0'));
          lampada.position.set(lado * (L / 2 + 0.8), 5, pz);
          bloco.add(poste, lampada);
        }
      }

      bloco.position.z = -i * C + C / 2;
      cena.add(bloco);
      this.blocos.push(bloco);
    }
  }

  /** Recicla blocos que ficaram para trás da câmera. zCamera é a posição Z da câmera. */
  atualizar(zCamera) {
    const C = PISTA.comprimentoBloco;
    const total = this.blocos.length * C;
    for (const bloco of this.blocos) {
      if (bloco.position.z - C / 2 > zCamera + 5) {
        bloco.position.z -= total;
      }
    }
  }

  reiniciar() {
    const C = PISTA.comprimentoBloco;
    this.blocos.forEach((b, i) => { b.position.z = -i * C + C / 2; });
  }
}
