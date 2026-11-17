import * as THREE from 'three';
import { juntarPecas } from './geometria.js';

// Geometria de um Cadete (o soldado da multidão), montada com formas básicas.
// As cores vêm do herói líder: os cadetes usam o uniforme dele.
export function criarGeometriaCadete(cores) {
  const { uniforme, detalhe, pele = '#f1c27d', visor = '#1a1f3a' } = cores;
  const corpo = new THREE.CapsuleGeometry(0.2, 0.3, 3, 8);
  const cabeca = new THREE.SphereGeometry(0.19, 10, 8);
  const capacete = new THREE.SphereGeometry(0.215, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const viseira = new THREE.BoxGeometry(0.3, 0.08, 0.1);
  const perna = new THREE.CylinderGeometry(0.075, 0.07, 0.3, 6);
  const cinto = new THREE.CylinderGeometry(0.21, 0.21, 0.07, 10);
  const ombro = new THREE.SphereGeometry(0.09, 6, 5);

  return juntarPecas([
    { geo: perna, cor: detalhe, pos: [-0.09, 0.15, 0] },
    { geo: perna, cor: detalhe, pos: [0.09, 0.15, 0] },
    { geo: corpo, cor: uniforme, pos: [0, 0.5, 0] },
    { geo: cinto, cor: detalhe, pos: [0, 0.38, 0] },
    { geo: ombro, cor: detalhe, pos: [-0.21, 0.65, 0] },
    { geo: ombro, cor: detalhe, pos: [0.21, 0.65, 0] },
    { geo: cabeca, cor: pele, pos: [0, 0.92, 0] },
    { geo: capacete, cor: uniforme, pos: [0, 0.95, 0] },
    { geo: viseira, cor: visor, pos: [0, 0.94, -0.17] },
  ]);
}
