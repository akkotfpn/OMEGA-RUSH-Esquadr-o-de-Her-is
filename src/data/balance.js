// Todos os números de balanceamento da corrida ficam aqui.
// Nada de "número mágico" espalhado pelo código do jogo.

export const PISTA = {
  largura: 9,              // largura útil da pista (m)
  comprimentoBloco: 40,    // cada bloco de chão reaproveitado (m)
  blocosVisiveis: 8,       // quantos blocos existem ao mesmo tempo
  alturaMureta: 0.6,
};

export const CORRIDA = {
  velocidade: 10,          // m/s no início
  velocidadeMax: 15,
  aceleracaoPorMetro: 0.004, // quanto a velocidade sobe por metro percorrido
  suavizacaoX: 14,         // quão rápido o esquadrão segue o dedo (maior = mais rápido)
  sensibilidadeArraste: 1.15, // 1 = cruzar a tela inteira move a pista inteira
};

export const ESQUADRAO = {
  inicial: 1,              // cadetes no começo (Fase 1: só o herói + 1 cadete)
  maxVisiveis: 600,        // acima disso o número sobe, mas o visual para aqui
  espacamento: 0.36,       // constante da espiral de Fermat (distância entre cadetes)
  compactarDe: 80,         // a partir daqui os cadetes começam a ficar mais juntos
  compactarAte: 600,
  compactacaoMax: 0.72,    // espaçamento final = 72% do normal
  desvioMinimo: 1.6,       // quanto um esquadrão gigante ainda consegue ir para o lado (m)
  mola: 10,                // rigidez da "mola" que leva cada cadete ao seu lugar
  distanciaLider: 1.4,     // o líder corre esta distância à frente do esquadrão
  escalaCadete: 1,
  escalaHeroi: 1.7,
};

export const CAMERA = {
  fov: 58,
  altura: 10.5,
  distancia: 12,
  olharAFrente: 9,
  zoomPorRaio: 1.7,        // a câmera se afasta conforme o esquadrão cresce
  zoomMax: 18,
  seguirX: 0.35,           // quanto a câmera acompanha o movimento lateral
};

// Geração dos portões no modo infinito da Fase 1 (será trocado pelo gerador das 200 fases na etapa 3)
export const PORTOES = {
  primeiroEm: 30,          // primeiro par de portões (m)
  intervalo: 34,           // distância entre pares (m)
  altura: 3.2,
  // Valores crescem com a distância percorrida (d em metros)
  soma: (d, r) => Math.round((5 + r * 10) * (1 + d / 400)),
  subtracao: (d, r) => Math.round((5 + r * 15) * (1 + d / 300)),
  multiplicacoes: [2, 2, 2, 3],
  chanceParBom: 0.35,      // chance dos dois lados serem bons
  chanceMultiplicacao: 0.3,
};

export const EFEITOS = {
  particulasMax: 400,
  tremorPortaoRuim: 0.25,
  tremorDuracao: 0.25,
};
