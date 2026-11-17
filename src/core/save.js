// Salvamento local com versão. Na etapa 6 ganha moedas, heróis, fases etc.
const CHAVE = 'omega-rush-save';
export const VERSAO_SAVE = 1;

function padrao() {
  return { saveVersion: VERSAO_SAVE, recordeInfinito: 0, maiorEsquadrao: 0 };
}

function migrar(dados) {
  // Ponto único para converter saves antigos quando o formato mudar
  if (!dados || typeof dados !== 'object') return padrao();
  return { ...padrao(), ...dados, saveVersion: VERSAO_SAVE };
}

export function carregar() {
  try {
    return migrar(JSON.parse(localStorage.getItem(CHAVE)));
  } catch {
    return padrao();
  }
}

export function salvar(dados) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    // armazenamento cheio ou bloqueado: o jogo continua sem salvar
  }
}
