import * as THREE from 'three';
import { toon, brilho } from '../core/toon.js';

// Modelos 3D dos heróis, montados em código. Nesta etapa só a Faísca existe;
// os outros 12 entram na etapa 4 seguindo o mesmo formato.

function membro(raio, comprimento, material) {
  // Pivô no topo, para o membro balançar a partir do ombro/quadril
  const pivo = new THREE.Group();
  const malha = new THREE.Mesh(new THREE.CapsuleGeometry(raio, comprimento, 3, 8), material);
  malha.position.y = -(comprimento / 2 + raio * 0.6);
  pivo.add(malha);
  return pivo;
}

/** Faísca — mensageira elétrica: amarelo e azul-marinho, óculos e cabelo espetado. */
export function criarFaisca() {
  const amarelo = toon('#ffd23f');
  const marinho = toon('#1b2a6b');
  const pele = toon('#e8b48a');
  const raio = brilho('#fff27a');
  const lente = brilho('#4de1ff');

  const heroi = new THREE.Group();
  const corpo = new THREE.Group();
  heroi.add(corpo);

  // Pernas
  const pernaE = membro(0.12, 0.38, marinho);
  const pernaD = membro(0.12, 0.38, marinho);
  pernaE.position.set(-0.14, 0.62, 0);
  pernaD.position.set(0.14, 0.62, 0);
  corpo.add(pernaE, pernaD);

  // Tênis
  for (const perna of [pernaE, pernaD]) {
    const tenis = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.32), amarelo);
    tenis.position.set(0, -0.62, -0.05);
    perna.add(tenis);
  }

  // Tronco
  const tronco = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.42, 4, 10), amarelo);
  tronco.position.y = 0.95;
  corpo.add(tronco);

  // Raio no peito (losango em zigue-zague simplificado)
  const simbolo = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.32, 3), marinho);
  simbolo.position.set(0, 1.0, -0.26);
  simbolo.rotation.set(-Math.PI / 2, 0, 0.5);
  corpo.add(simbolo);

  // Cinto
  const cinto = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.285, 0.1, 12), marinho);
  cinto.position.y = 0.7;
  corpo.add(cinto);

  // Braços
  const bracoE = membro(0.09, 0.34, amarelo);
  const bracoD = membro(0.09, 0.34, amarelo);
  bracoE.position.set(-0.36, 1.2, 0);
  bracoD.position.set(0.36, 1.2, 0);
  corpo.add(bracoE, bracoD);
  for (const braco of [bracoE, bracoD]) {
    const luva = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), marinho);
    luva.position.y = -0.55;
    braco.add(luva);
  }

  // Cabeça
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.25, 14, 12), pele);
  cabeca.position.y = 1.55;
  corpo.add(cabeca);

  // Óculos de proteção
  const faixa = new THREE.Mesh(new THREE.TorusGeometry(0.255, 0.035, 6, 20), marinho);
  faixa.position.y = 1.6;
  faixa.rotation.x = Math.PI / 2;
  corpo.add(faixa);
  for (const lado of [-1, 1]) {
    const oculos = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.06, 12), lente);
    oculos.rotation.x = Math.PI / 2;
    oculos.position.set(lado * 0.1, 1.6, -0.23);
    corpo.add(oculos);
  }

  // Cabelo espetado e elétrico
  const cabelo = new THREE.Group();
  const pontas = [
    [0, 0.26, 0, 0, 0], [-0.13, 0.2, 0.05, 0, 0.6], [0.13, 0.2, 0.05, 0, -0.6],
    [0, 0.18, 0.15, -0.7, 0], [-0.1, 0.12, 0.18, -0.8, 0.5], [0.1, 0.12, 0.18, -0.8, -0.5],
  ];
  for (const [x, y, z, rx, rz] of pontas) {
    const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.26, 5), raio);
    ponta.position.set(x, y, z);
    ponta.rotation.set(rx, 0, rz);
    cabelo.add(ponta);
  }
  cabelo.position.y = 1.55;
  corpo.add(cabelo);

  heroi.userData = { corpo, pernaE, pernaD, bracoE, bracoD, cabelo, tempo: 0 };
  return heroi;
}

/** Animação de corrida (pernas e braços balançando, corpo quicando). */
export function animarHeroi(heroi, dt, velocidade) {
  const u = heroi.userData;
  u.tempo += dt * (velocidade / 10) * 11;
  const s = Math.sin(u.tempo);
  u.pernaE.rotation.x = s * 0.9;
  u.pernaD.rotation.x = -s * 0.9;
  u.bracoE.rotation.x = -s * 0.8;
  u.bracoD.rotation.x = s * 0.8;
  u.corpo.position.y = Math.abs(Math.cos(u.tempo)) * 0.08;
  u.corpo.rotation.x = -0.12;
  u.cabelo.rotation.y = Math.sin(u.tempo * 3) * 0.08;
}
