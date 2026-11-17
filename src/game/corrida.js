import * as THREE from 'three';
import { CAMERA, CORRIDA, ESQUADRAO, PISTA, EFEITOS } from '../data/balance.js';
import { criarRng } from '../core/rng.js';
import { ControleArraste } from '../core/input.js';
import { vibrar } from '../core/vibracao.js';
import { carregar, salvar } from '../core/save.js';
import { Cenario } from '../entities/cenario.js';
import { criarFaisca, animarHeroi } from '../entities/heroi.js';
import { Esquadrao } from './esquadrao.js';
import { Portoes } from './portoes.js';
import { Particulas } from './particulas.js';
import { aplicarPortao, rotuloPortao, portaoEhBom, TIPO } from './regrasPortao.js';
import { Hud } from '../ui/hud.js';

const ESTADO = { MENU: 'menu', CORRENDO: 'correndo', FIM: 'fim' };

// Cores da Faísca (herói inicial) — os cadetes vestem o uniforme do líder.
const CORES_FAISCA = { uniforme: '#ffd23f', detalhe: '#1b2a6b' };

/**
 * A corrida da Etapa 1: pista infinita com pares de portões.
 * Na Etapa 2 ganha combate e arena final; na Etapa 3 passa a usar as 200 fases.
 */
export class Corrida {
  constructor(container, callbacks = {}) {
    this.callbacks = callbacks;
    this.save = carregar();

    // ---------- Renderizador ----------
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    this.cena = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(CAMERA.fov, window.innerWidth / window.innerHeight, 0.1, 260);

    // ---------- Luzes ----------
    this.cena.add(new THREE.HemisphereLight('#c9d6ff', '#3a2a55', 1.6));
    const sol = new THREE.DirectionalLight('#ffffff', 1.8);
    sol.position.set(-6, 14, 8);
    this.cena.add(sol);

    // ---------- Mundo ----------
    this.cenario = new Cenario(this.cena);
    this.esquadrao = new Esquadrao(this.cena, CORES_FAISCA);
    this.heroi = criarFaisca();
    this.heroi.scale.setScalar(ESQUADRAO.escalaHeroi);
    this.cena.add(this.heroi);
    this.portoes = new Portoes(this.cena, criarRng(1));
    this.particulas = new Particulas(this.cena);
    this.hud = new Hud(this.camera);
    this.controle = new ControleArraste(this.renderer.domElement);

    this.estado = ESTADO.MENU;
    this.relogio = new THREE.Clock();
    this.tremor = 0;
    this.zoom = 0;
    this._ancora = new THREE.Vector3();

    window.addEventListener('resize', () => this.redimensionar());
    this.reiniciar();
    this.renderer.setAnimationLoop(() => this.quadro());
  }

  redimensionar() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  reiniciar() {
    this.distancia = 0;
    this.velocidade = CORRIDA.velocidade;
    this.alvoX = 0;
    this.maiorEsquadrao = ESQUADRAO.inicial;
    this.esquadrao.centroX = 0;
    this.esquadrao.definirTotal(0);
    this.esquadrao.definirTotal(ESQUADRAO.inicial);
    this.portoes.reiniciar(criarRng(Date.now() & 0xffffffff));
    this.cenario.reiniciar();
    this.controle.consumirDelta();
    this.posicionar(0);
  }

  comecar() {
    this.reiniciar();
    this.estado = ESTADO.CORRENDO;
    this.hud.mostrar(true);
  }

  terminar() {
    this.estado = ESTADO.FIM;
    this.hud.mostrar(false);
    const d = Math.floor(this.distancia);
    this.save.recordeInfinito = Math.max(this.save.recordeInfinito, d);
    this.save.maiorEsquadrao = Math.max(this.save.maiorEsquadrao, this.maiorEsquadrao);
    salvar(this.save);
    vibrar('forte');
    this.callbacks.aoTerminar?.({ distancia: d, maiorEsquadrao: this.maiorEsquadrao });
  }

  /** Posiciona esquadrão, herói e câmera para a distância atual. */
  posicionar(dt) {
    const z = -this.distancia;
    const e = this.esquadrao;
    e.centroZ = z + e.raio + ESQUADRAO.distanciaLider;

    this.heroi.position.set(e.centroX, 0, z);

    // Câmera se afasta conforme o esquadrão cresce
    const alvoZoom = Math.min(CAMERA.zoomMax, Math.max(0, e.raio - 1) * CAMERA.zoomPorRaio);
    this.zoom += (alvoZoom - this.zoom) * Math.min(1, dt * 2);
    const camX = e.centroX * CAMERA.seguirX;
    let tx = 0;
    let ty = 0;
    if (this.tremor > 0) {
      const f = EFEITOS.tremorPortaoRuim * (this.tremor / EFEITOS.tremorDuracao);
      tx = (Math.random() - 0.5) * f;
      ty = (Math.random() - 0.5) * f;
      this.tremor = Math.max(0, this.tremor - dt);
    }
    this.camera.position.set(
      camX + tx,
      CAMERA.altura + this.zoom * 0.8 + ty,
      e.centroZ + CAMERA.distancia + this.zoom,
    );
    this.camera.lookAt(camX, 0, z - CAMERA.olharAFrente);
  }

  passarPortao(portao) {
    const e = this.esquadrao;
    const antes = e.total;
    const depois = aplicarPortao(antes, portao);
    const removidos = e.definirTotal(depois);
    this.maiorEsquadrao = Math.max(this.maiorEsquadrao, depois);

    const bom = portaoEhBom(portao);
    const tipo = !bom ? 'ruim' : portao.tipo === TIPO.MULT ? 'mult' : 'bom';
    this.hud.flutuar(rotuloPortao(portao), e.centroX, 3, e.centroZ - 2, tipo);
    this.particulas.explodir(e.centroX, 1.5, e.centroZ - 1, bom ? '#ffd23f' : '#ff3b4e', 18, 6);

    // Os que morreram viram fumacinha vermelha (limitado para não pesar)
    for (let i = 0; i < removidos.length && i < 40; i++) {
      const [x, z] = removidos[i];
      this.particulas.explodir(x, 0.5, z, '#ff3b4e', 3, 3);
    }

    if (bom) {
      vibrar('leve');
    } else {
      vibrar('media');
      this.tremor = EFEITOS.tremorDuracao;
    }
    if (depois <= 0) this.terminar();
  }

  quadro() {
    const dt = Math.min(0.05, this.relogio.getDelta());
    const e = this.esquadrao;

    if (this.estado === ESTADO.CORRENDO) {
      this.velocidade = Math.min(CORRIDA.velocidadeMax, CORRIDA.velocidade + this.distancia * CORRIDA.aceleracaoPorMetro);
      this.distancia += this.velocidade * dt;

      // Arraste → alvo lateral (fração da tela × largura da pista)
      this.alvoX += this.controle.consumirDelta() * PISTA.largura * CORRIDA.sensibilidadeArraste;
      const lim = e.limiteX();
      this.alvoX = Math.max(-lim, Math.min(lim, this.alvoX));
      e.centroX += (this.alvoX - e.centroX) * Math.min(1, dt * CORRIDA.suavizacaoX);

      // A distância "de verdade" para os portões é a do centro do esquadrão
      const distanciaCentro = -e.centroZ;
      this.portoes.atualizar(dt, distanciaCentro, e.centroX, (p) => this.passarPortao(p));
    } else {
      this.controle.consumirDelta();
    }

    const velocidadeVisual = this.estado === ESTADO.CORRENDO ? this.velocidade : 4;
    if (this.estado === ESTADO.MENU) this.distancia += 4 * dt; // a pista anda devagar no menu

    e.atualizar(dt, velocidadeVisual);
    animarHeroi(this.heroi, dt, velocidadeVisual);
    this.particulas.atualizar(dt);
    this.posicionar(dt);
    this.cenario.atualizar(this.camera.position.z);

    if (this.estado === ESTADO.CORRENDO) {
      // O contador fica acima do herói líder
      this._ancora.set(this.heroi.position.x, 3.7, this.heroi.position.z);
      this.hud.atualizar(e.total, this.distancia, this.save.recordeInfinito, this._ancora);
    }

    this.renderer.render(this.cena, this.camera);
  }
}
