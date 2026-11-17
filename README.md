# Ω OMEGA RUSH: Esquadrão de Heróis

**Crowd runner 3D de super-heróis para Android e navegador — Akko's Corporation**

Lidere um esquadrão de Cadetes por pistas cheias de portões. Some, multiplique e fuja dos portões vermelhos, monte um exército gigante e enfrente a Legião do Caos. 13 heróis originais, 20 armas, 10 mundos e 200 fases.

> 🚧 Em desenvolvimento — **Etapa 1 de 8 (Fundação)** concluída.

## Como jogar
- **Arraste para os lados** em qualquer lugar da tela.
- Passe pelos portões **azuis (+)** e **dourados (×)**; evite os **vermelhos (−)**.
- Se o esquadrão chegar a zero, a corrida acaba.

## Baixar
- **APK:** aba [Actions](../../actions/workflows/apk.yml) → última execução → artefato `omega-rush-apk`. Versões estáveis ficam em [Releases](../../releases).
- **Web:** GitHub Pages do repositório (depois de ativar em *Settings → Pages → Source: GitHub Actions*).

## Desenvolvimento
```bash
npm install
npm run dev      # servidor local (abra no celular pela rede)
npm run testar   # testes das regras do jogo
npm run build    # gera a pasta dist/
```

### APK local (opcional)
```bash
npm run build
npx cap add android   # só na primeira vez
npx cap sync android
cd android && ./gradlew assembleDebug
```

## Tecnologia
Three.js · Vite · Capacitor 7 · JavaScript (ES Modules). Tudo é desenhado em código (sem modelos 3D nem áudios externos) e funciona 100% offline.

## Roteiro
| Etapa | Conteúdo | Status |
|---|---|---|
| 1 | Fundação: pista, líder, esquadrão, portões + e ×, APK | ✅ |
| 2 | Combate: tiro automático, capangas, arena final, estrelas | ⏳ |
| 3 | Dados: heróis, armas, inimigos, chefes, 200 fases + validação | ⏳ |
| 4 | Heróis e armas jogáveis, Ultimates, sinergias | ⏳ |
| 5 | Os 10 mundos e os 20 chefes | ⏳ |
| 6 | Meta-jogo: mapa, economia, Quartel-General, baús, missões | ⏳ |
| 7 | Polimento: áudio, partículas, tutorial, inglês | ⏳ |
| 8 | Modo Infinito, Desafio Diário, Galeria, v1.0.0 | ⏳ |

A especificação completa está em [`docs/PROMPT.md`](docs/PROMPT.md) e as decisões tomadas durante o desenvolvimento em [`DECISOES.md`](DECISOES.md).

## Créditos
Criado por **Davi Souza — Akko's Corporation**.
Fonte [Lilita One](https://fonts.google.com/specimen/Lilita+One) (SIL Open Font License, ver `src/ui/fonts/OFL-LilitaOne.txt`).
Todos os personagens são originais.
