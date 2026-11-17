import * as THREE from 'three';

// Interface por cima do canvas: contador do esquadrão, distância e números flutuantes.
const $ = (id) => document.getElementById(id);

export class Hud {
  constructor(camera) {
    this.camera = camera;
    this.hud = $('hud');
    this.distancia = $('hud-distancia');
    this.recorde = $('hud-recorde');
    this.contador = $('contador-esquadrao');
    this.flutuantes = $('flutuantes');
    this._v = new THREE.Vector3();
    this._ultimoTotal = -1;
    this._ultimaDist = -1;
  }

  mostrar(visivel) {
    this.hud.classList.toggle('oculto', !visivel);
    this.contador.classList.toggle('oculto', !visivel);
  }

  /** Converte um ponto 3D em pixels na tela. */
  paraTela(x, y, z) {
    this._v.set(x, y, z).project(this.camera);
    return [(this._v.x * 0.5 + 0.5) * window.innerWidth, (-this._v.y * 0.5 + 0.5) * window.innerHeight];
  }

  atualizar(total, distancia, recorde, ancora) {
    if (total !== this._ultimoTotal) {
      this.contador.textContent = total.toLocaleString('pt-BR');
      this.contador.classList.remove('pulsar');
      void this.contador.offsetWidth; // reinicia a animação
      this.contador.classList.add('pulsar');
      this._ultimoTotal = total;
    }
    const d = Math.floor(distancia);
    if (d !== this._ultimaDist) {
      this.distancia.textContent = `${d} m`;
      this.recorde.textContent = `Recorde ${Math.max(recorde, d)} m`;
      this._ultimaDist = d;
    }
    const [sx, sy] = this.paraTela(ancora.x, ancora.y, ancora.z);
    this.contador.style.translate = `${sx}px ${sy}px`;
  }

  /** Número que sobe e some (ex.: "+25", "×3", "−10"). tipo: 'bom' | 'mult' | 'ruim' */
  flutuar(texto, x, y, z, tipo) {
    const [sx, sy] = this.paraTela(x, y, z);
    const el = document.createElement('div');
    el.className = `flutuante ${tipo}`;
    el.textContent = texto;
    el.style.left = `${sx}px`;
    el.style.top = `${sy}px`;
    this.flutuantes.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}
