// Vibração curta. No APK usa o plugin Haptics do Capacitor (exposto pela ponte nativa);
// no navegador cai para navigator.vibrate quando existir.
let ligada = true;

export function definirVibracao(valor) {
  ligada = valor;
}

function haptics() {
  return window.Capacitor?.Plugins?.Haptics;
}

/** forca: 'leve' | 'media' | 'forte' */
export function vibrar(forca = 'leve') {
  if (!ligada) return;
  const h = haptics();
  const estilo = { leve: 'LIGHT', media: 'MEDIUM', forte: 'HEAVY' }[forca] ?? 'LIGHT';
  if (h?.impact) {
    h.impact({ style: estilo }).catch(() => {});
    return;
  }
  if (navigator.vibrate) {
    navigator.vibrate({ leve: 12, media: 25, forte: 50 }[forca] ?? 12);
  }
}
