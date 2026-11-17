import * as THREE from 'three';

/**
 * Junta várias peças (geometria + cor + transformação) numa única geometria
 * com cores por vértice. Usado nos cadetes e inimigos, que são desenhados com
 * InstancedMesh: uma geometria só = um draw call para centenas de bonecos.
 *
 * pecas: [{ geo, cor, pos:[x,y,z], rot:[x,y,z], esc:[x,y,z] }]
 */
export function juntarPecas(pecas) {
  const posicoes = [];
  const normais = [];
  const cores = [];
  const cor = new THREE.Color();
  const matriz = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const euler = new THREE.Euler();

  for (const p of pecas) {
    const g = (p.geo.index ? p.geo.toNonIndexed() : p.geo.clone());
    euler.set(...(p.rot ?? [0, 0, 0]));
    quat.setFromEuler(euler);
    matriz.compose(
      new THREE.Vector3(...(p.pos ?? [0, 0, 0])),
      quat,
      new THREE.Vector3(...(p.esc ?? [1, 1, 1])),
    );
    g.applyMatrix4(matriz);
    const pos = g.getAttribute('position');
    const nor = g.getAttribute('normal');
    cor.set(p.cor);
    for (let i = 0; i < pos.count; i++) {
      posicoes.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      normais.push(nor.getX(i), nor.getY(i), nor.getZ(i));
      cores.push(cor.r, cor.g, cor.b);
    }
    g.dispose();
  }

  const resultado = new THREE.BufferGeometry();
  resultado.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));
  resultado.setAttribute('normal', new THREE.Float32BufferAttribute(normais, 3));
  resultado.setAttribute('color', new THREE.Float32BufferAttribute(cores, 3));
  resultado.computeBoundingSphere();
  return resultado;
}
