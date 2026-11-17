// Testes das regras puras (rode com: npm run testar)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarRng } from '../../src/core/rng.js';
import { aplicarPortao, gerarParPortoes, portaoEhBom, rotuloPortao, TIPO } from '../../src/game/regrasPortao.js';

test('aplicarPortao faz as contas certas e nunca fica negativo', () => {
  assert.equal(aplicarPortao(10, { tipo: TIPO.SOMA, valor: 5 }), 15);
  assert.equal(aplicarPortao(10, { tipo: TIPO.MULT, valor: 3 }), 30);
  assert.equal(aplicarPortao(10, { tipo: TIPO.SUB, valor: 25 }), 0);
  assert.equal(aplicarPortao(11, { tipo: TIPO.DIV, valor: 2 }), 5);
});

test('rótulos dos portões', () => {
  assert.equal(rotuloPortao({ tipo: TIPO.SOMA, valor: 7 }), '+7');
  assert.equal(rotuloPortao({ tipo: TIPO.MULT, valor: 2 }), '×2');
  assert.equal(rotuloPortao({ tipo: TIPO.SUB, valor: 9 }), '−9');
});

test('mesma semente gera os mesmos portões (determinístico)', () => {
  const a = criarRng(123);
  const b = criarRng(123);
  for (let d = 30; d < 2000; d += 34) {
    assert.deepEqual(gerarParPortoes(d, a), gerarParPortoes(d, b));
  }
});

test('todo par tem pelo menos um portão bom', () => {
  const rng = criarRng(99);
  for (let d = 30; d < 5000; d += 34) {
    const [x, y] = gerarParPortoes(d, rng);
    assert.ok(portaoEhBom(x) || portaoEhBom(y), `par sem saída em ${d} m`);
  }
});
