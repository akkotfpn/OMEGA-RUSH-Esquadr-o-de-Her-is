// Gerador de números pseudoaleatórios determinístico (mulberry32).
// A mesma semente sempre gera a mesma sequência — essencial para que
// a fase N seja sempre igual para todo mundo.
export function criarRng(semente) {
  let a = semente >>> 0;
  const rng = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  rng.entre = (min, max) => min + rng() * (max - min);
  rng.inteiro = (min, max) => Math.floor(rng.entre(min, max + 1));
  rng.escolher = (lista) => lista[Math.floor(rng() * lista.length)];
  rng.chance = (p) => rng() < p;
  return rng;
}
