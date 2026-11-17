// Controle por arraste: em qualquer lugar da tela, arrastar para os lados
// move o alvo lateral do esquadrão. Funciona com dedo e mouse.
export class ControleArraste {
  constructor(elemento) {
    this.elemento = elemento;
    this.ativo = false;
    this.ultimoX = 0;
    this.deltaAcumulado = 0; // em pixels, consumido a cada quadro
    this.ponteiroId = null;

    this._baixo = (e) => {
      if (this.ponteiroId !== null) return;
      this.ponteiroId = e.pointerId;
      this.ativo = true;
      this.ultimoX = e.clientX;
    };
    this._mover = (e) => {
      if (!this.ativo || e.pointerId !== this.ponteiroId) return;
      this.deltaAcumulado += e.clientX - this.ultimoX;
      this.ultimoX = e.clientX;
    };
    this._cima = (e) => {
      if (e.pointerId !== this.ponteiroId) return;
      this.ativo = false;
      this.ponteiroId = null;
    };

    elemento.addEventListener('pointerdown', this._baixo);
    window.addEventListener('pointermove', this._mover, { passive: true });
    window.addEventListener('pointerup', this._cima);
    window.addEventListener('pointercancel', this._cima);
  }

  /** Devolve o deslocamento horizontal desde a última chamada, em fração da largura da tela. */
  consumirDelta() {
    const fracao = this.deltaAcumulado / Math.max(1, window.innerWidth);
    this.deltaAcumulado = 0;
    return fracao;
  }
}
