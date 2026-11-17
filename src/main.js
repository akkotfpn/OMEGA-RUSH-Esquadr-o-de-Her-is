// Omega Rush: Esquadrão de Heróis — Akko's Corporation
import { Corrida } from './game/corrida.js';

const $ = (id) => document.getElementById(id);

const corrida = new Corrida($('jogo'), {
  aoTerminar({ distancia, maiorEsquadrao }) {
    $('fim-distancia').textContent = `${distancia} m`;
    $('fim-maximo').textContent = `Maior esquadrão: ${maiorEsquadrao.toLocaleString('pt-BR')}`;
    setTimeout(() => $('tela-fim').classList.remove('oculto'), 600);
  },
});

$('btn-jogar').addEventListener('click', () => {
  $('tela-inicio').classList.add('oculto');
  corrida.comecar();
});

$('btn-denovo').addEventListener('click', () => {
  $('tela-fim').classList.add('oculto');
  corrida.comecar();
});

// Splash da Akko's Corporation (2 s)
setTimeout(() => {
  const splash = $('splash');
  splash.classList.add('sumir');
  setTimeout(() => splash.remove(), 600);
}, 2000);

// Para testes automáticos e depuração no navegador
window.__omega = corrida;
