import * as THREE from 'three';

// Mapa de gradiente com 3 tons: dá o visual "cartoon" do MeshToonMaterial.
let mapaGradiente = null;
function gradiente() {
  if (mapaGradiente) return mapaGradiente;
  const dados = new Uint8Array([90, 170, 255]);
  mapaGradiente = new THREE.DataTexture(dados, dados.length, 1, THREE.RedFormat);
  mapaGradiente.minFilter = THREE.NearestFilter;
  mapaGradiente.magFilter = THREE.NearestFilter;
  mapaGradiente.needsUpdate = true;
  return mapaGradiente;
}

const cache = new Map();

/** Material toon reaproveitado por cor (evita criar centenas de materiais iguais). */
export function toon(cor, extras = {}) {
  const chave = `${cor}|${JSON.stringify(extras)}`;
  if (cache.has(chave)) return cache.get(chave);
  const mat = new THREE.MeshToonMaterial({ color: cor, gradientMap: gradiente(), ...extras });
  cache.set(chave, mat);
  return mat;
}

/** Material que brilha sozinho (neon, letreiros, olhos). */
export function brilho(cor) {
  const chave = `brilho|${cor}`;
  if (cache.has(chave)) return cache.get(chave);
  const mat = new THREE.MeshBasicMaterial({ color: cor });
  cache.set(chave, mat);
  return mat;
}
