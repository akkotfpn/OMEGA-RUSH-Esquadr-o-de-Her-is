import * as THREE from 'three';
import { PISTA, PORTOES } from '../data/balance.js';
import { toon } from '../core/toon.js';
import { TIPO, rotuloPortao, gerarParPortoes } from './regrasPortao.js';

const CORES = {
  [TIPO.SOMA]: { fundo: 'rgba(47,140,255,0.78)', borda: '#9fd0ff', moldura: '#2f8cff' },
  [TIPO.MULT]: { fundo: 'rgba(255,190,30,0.82)', borda: '#fff2a8', moldura: '#ffb81e' },
  [TIPO.SUB]: { fundo: 'rgba(255,59,78,0.78)', borda: '#ffb3bb', moldura: '#ff3b4e' },
  [TIPO.DIV]: { fundo: 'rgba(160,20,40,0.82)', borda: '#ff8a9a', moldura: '#a01428' },
};

/** Um portão: moldura + painel com o número desenhado em canvas. */
class Portao {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 256;
    this.canvas.height = 192;
    this.textura = new THREE.CanvasTexture(this.canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;

    const largura = PISTA.largura / 2 - 0.25;
    const altura = PORTOES.altura;
    this.grupo = new THREE.Group();

    this.painel = new THREE.Mesh(
      new THREE.PlaneGeometry(largura, altura),
      new THREE.MeshBasicMaterial({ map: this.textura, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
    );
    this.painel.position.y = altura / 2 + 0.1;
    this.grupo.add(this.painel);

    this.matMoldura = toon('#2f8cff').clone();
    const poste = new THREE.BoxGeometry(0.22, altura + 0.3, 0.22);
    for (const lado of [-1, 1]) {
      const p = new THREE.Mesh(poste, this.matMoldura);
      p.position.set(lado * largura / 2, (altura + 0.3) / 2, 0);
      this.grupo.add(p);
    }
    const topo = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.22, 0.25, 0.3), this.matMoldura);
    topo.position.y = altura + 0.3;
    this.grupo.add(topo);

    this.dados = null;
    this.usado = false;
    this.brilho = 0;
  }

  definir(dados) {
    this.dados = dados;
    this.usado = false;
    this.brilho = 0;
    this.grupo.visible = true;
    this.grupo.scale.set(1, 1, 1);
    this.painel.material.opacity = 1;
    const cor = CORES[dados.tipo];
    this.matMoldura.color.set(cor.moldura);

    const g = this.canvas.getContext('2d');
    const W = this.canvas.width;
    const H = this.canvas.height;
    g.clearRect(0, 0, W, H);
    g.fillStyle = cor.fundo;
    g.fillRect(0, 0, W, H);
    g.strokeStyle = cor.borda;
    g.lineWidth = 10;
    g.strokeRect(5, 5, W - 10, H - 10);
    const texto = rotuloPortao(dados);
    g.font = `${texto.length > 4 ? 72 : 96}px 'Lilita One', 'Arial Black', sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.lineJoin = 'round';
    g.lineWidth = 14;
    g.strokeStyle = '#0b0f2a';
    g.strokeText(texto, W / 2, H / 2 + 6);
    g.fillStyle = '#ffffff';
    g.fillText(texto, W / 2, H / 2 + 6);
    this.textura.needsUpdate = true;
  }
}

/**
 * Gerencia os pares de portões à frente do esquadrão (pool reaproveitado).
 * Chama onPassar(portao, lado) quando o esquadrão cruza um par.
 */
export class Portoes {
  constructor(cena, rng) {
    this.rng = rng;
    this.pares = [];
    const quantidade = 6;
    for (let i = 0; i < quantidade; i++) {
      const esq = new Portao();
      const dir = new Portao();
      const grupo = new THREE.Group();
      esq.grupo.position.x = -PISTA.largura / 4;
      dir.grupo.position.x = PISTA.largura / 4;
      grupo.add(esq.grupo, dir.grupo);
      cena.add(grupo);
      this.pares.push({ grupo, esq, dir, distancia: 0, ativo: false, escolhido: null });
    }
    this.proximaDistancia = PORTOES.primeiroEm;
  }

  reiniciar(rng) {
    this.rng = rng;
    this.proximaDistancia = PORTOES.primeiroEm;
    for (const par of this.pares) {
      par.ativo = false;
      par.grupo.visible = false;
    }
  }

  _colocar(par) {
    const d = this.proximaDistancia;
    const [a, b] = gerarParPortoes(d, this.rng);
    par.esq.definir(a);
    par.dir.definir(b);
    par.distancia = d;
    par.ativo = true;
    par.escolhido = null;
    par.grupo.visible = true;
    par.grupo.position.z = -d;
    this.proximaDistancia += PORTOES.intervalo;
  }

  /** distancia = quanto o centro do esquadrão já andou; x = posição lateral do centro. */
  atualizar(dt, distancia, x, onPassar) {
    // Garante portões até 5 intervalos à frente
    for (const par of this.pares) {
      if (!par.ativo && this.proximaDistancia < distancia + PORTOES.intervalo * 5) this._colocar(par);
    }

    for (const par of this.pares) {
      if (!par.ativo) continue;
      if (!par.escolhido && distancia >= par.distancia) {
        const lado = x < 0 ? par.esq : par.dir;
        const outro = x < 0 ? par.dir : par.esq;
        lado.usado = true;
        outro.usado = true;
        outro.grupo.visible = false;
        par.escolhido = lado;
        onPassar(lado.dados, lado);
      }
      // Animação do portão escolhido: incha e some
      const escolhido = par.escolhido;
      if (escolhido && escolhido.grupo.visible) {
        escolhido.brilho += dt;
        const s = 1 + escolhido.brilho * 1.2;
        escolhido.grupo.scale.set(s, s, s);
        escolhido.painel.material.opacity = Math.max(0, 1 - escolhido.brilho * 3);
        if (escolhido.brilho > 0.35) escolhido.grupo.visible = false;
      }
      // Libera o par quando ficou bem para trás
      if (distancia - par.distancia > 25) {
        par.ativo = false;
        par.grupo.visible = false;
      }
    }
  }
}
