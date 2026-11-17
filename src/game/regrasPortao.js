// Regras puras dos portões (sem Three.js), para poderem ser testadas no Node.
import { PORTOES } from '../data/balance.js';

/** Tipos de portão disponíveis nesta etapa. */
export const TIPO = {
  SOMA: 'soma',
  MULT: 'mult',
  SUB: 'sub',
  DIV: 'div',
};

/** Aplica um portão ao número de cadetes e devolve o novo total (nunca negativo). */
export function aplicarPortao(total, portao) {
  switch (portao.tipo) {
    case TIPO.SOMA: return total + portao.valor;
    case TIPO.MULT: return total * portao.valor;
    case TIPO.SUB: return Math.max(0, total - portao.valor);
    case TIPO.DIV: return Math.max(0, Math.floor(total / portao.valor));
    default: return total;
  }
}

/** Texto mostrado no painel do portão. */
export function rotuloPortao(portao) {
  switch (portao.tipo) {
    case TIPO.SOMA: return `+${portao.valor}`;
    case TIPO.MULT: return `×${portao.valor}`;
    case TIPO.SUB: return `−${portao.valor}`;
    case TIPO.DIV: return `÷${portao.valor}`;
    default: return '?';
  }
}

export function portaoEhBom(portao) {
  return portao.tipo === TIPO.SOMA || portao.tipo === TIPO.MULT;
}

/**
 * Gera um par de portões (esquerda/direita) para a distância d.
 * `rng` é um gerador de criarRng().
 */
export function gerarParPortoes(d, rng) {
  const bom = () =>
    rng.chance(PORTOES.chanceMultiplicacao)
      ? { tipo: TIPO.MULT, valor: rng.escolher(PORTOES.multiplicacoes) }
      : { tipo: TIPO.SOMA, valor: PORTOES.soma(d, rng()) };
  const ruim = () => ({ tipo: TIPO.SUB, valor: PORTOES.subtracao(d, rng()) });

  let a;
  let b;
  if (rng.chance(PORTOES.chanceParBom)) {
    a = bom();
    b = bom();
    // evita dois portões idênticos lado a lado
    if (a.tipo === b.tipo && a.valor === b.valor) b = { tipo: TIPO.SOMA, valor: a.valor + 5 };
  } else {
    a = bom();
    b = ruim();
  }
  return rng.chance(0.5) ? [a, b] : [b, a];
}
