# Decisões de desenvolvimento

Registro das escolhas feitas onde a especificação (`docs/PROMPT.md`) deixava espaço.

## Etapa 1 — Fundação
- **Pasta `android/` não vai para o repositório.** O GitHub Actions cria o projeto com `npx cap add android` a cada build e aplica os ajustes (modo retrato) por script. Assim o repositório fica leve. Se um dia for preciso mexer em código nativo (ícone, splash nativa), a pasta passa a ser versionada.
- **Sem `package-lock.json` por enquanto**: o primeiro build no Actions resolve as versões dentro das faixas do `package.json`. O lock será adicionado assim que for gerado.
- **Vibração** é acessada pela ponte nativa (`window.Capacitor.Plugins.Haptics`), sem import do plugin no código web. O plugin continua nas dependências para o Capacitor instalar a parte nativa. No navegador cai para `navigator.vibrate`.
- **Formação do esquadrão:** espiral de Fermat. Quando o círculo fica mais largo que a pista, ele vira uma **elipse alongada para trás** com a mesma densidade, e os cadetes ficam até 28% mais juntos a partir de 80 cadetes. Isso mantém a multidão dentro da pista sem achatar contra as muretas.
- **Esquadrão gigante ainda escolhe portão:** o centro sempre pode ir pelo menos 1,6 m para cada lado, mesmo quando a formação ocupa a pista toda.
- **O portão escolhido é o do lado do centro do esquadrão** (x < 0 = esquerda). Mais previsível para o jogador do que contar quantos cadetes passaram em cada lado.
- **Contador** fica acima do herói líder, como no anúncio de referência.
- **Fonte Lilita One** embutida em `src/ui/fonts/` (licença OFL incluída).
- **Etapa 1 é um modo infinito simples** com velocidade crescente e recorde salvo; as fases numeradas chegam na Etapa 3.
