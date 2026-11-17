# 🦸 PROMPT — OMEGA RUSH: Esquadrão de Heróis
### Um Crowd Runner de super-heróis — Akko's Corporation

> **Instrução para o Claude:** este documento é a especificação completa do jogo. Todas as decisões de design já foram tomadas — **não me pergunte nada sobre design, siga este documento**. Se algo estiver ambíguo, escolha a opção mais divertida e mais leve para celular e registre a decisão em `DECISOES.md`. Responda e comente o código em **português do Brasil**.
>
> Repositório: **`akkotfpn/OMEGA-RUSH-Esquadr-o-de-Her-is`** (já criado por mim). Construa o jogo em **fases** (seção 14), fazendo commit ao fim de cada fase, e não pare até entregar a fase pedida funcionando.

---

## 1. Visão geral

**Omega Rush** é um *crowd runner* 3D para celular (modo retrato). O jogador controla um **Herói Líder** que corre por uma pista à frente de um **esquadrão de Cadetes** (a multidão). Arrastando o dedo para os lados, ele escolhe por quais **portões** passar (que somam, multiplicam, dividem ou transformam o esquadrão), desvia de armadilhas, coleta **armas** e enfrenta exércitos de vilões. No fim de cada fase há um **confronto final** contra uma tropa inimiga ou um **Supervilão** (chefe).

- **Gênero:** Crowd Runner / Army Runner, hybrid-casual com progressão de RPG leve
- **Plataforma:** Android (APK via Capacitor) + versão web (GitHub Pages)
- **Orientação:** retrato, 9:16, funcionando de 9:16 a 9:21
- **Duração de uma fase:** 35 a 75 segundos
- **Conteúdo inicial:** **10 mundos × 20 fases = 200 fases** + Modo Infinito + Desafio Diário
- **Idiomas:** PT-BR (padrão) e EN (seletor nas configurações)
- **100% offline**, sem anúncios, sem compras reais, sem login
- **Assinatura:** "Akko's Corporation" na splash screen, nos créditos e no rodapé do menu
- **Todo conteúdo é original.** Nenhum herói, nome, uniforme ou símbolo pode lembrar personagens da Marvel, DC, Image ou qualquer outra marca. Os nomes abaixo são todos inventados.

---

## 2. Loop principal

1. **Menu do Mapa** → o jogador escolhe a fase (mapa de mundos com caminho, estilo Candy Crush).
2. **Pré-fase** → escolhe o **Herói Líder** e a **Arma equipada**, e vê a recompensa prevista.
3. **Corrida** → arrasta para escolher portões, desvia de armadilhas e coleta itens. O esquadrão atira sozinho para a frente.
4. **Confronto final** → a pista termina numa arena; o esquadrão entra em combate automático contra o exército e o chefe. O jogador pode tocar no botão de **Ultimate** do herói quando a barra encher.
5. **Resultado** → 1 a 3 estrelas, moedas, fragmentos de herói e baú (se houver).
6. **Melhorias** → gasta moedas e fragmentos em heróis, armas e no Quartel-General.

### Estrelas
- ⭐ terminou a fase
- ⭐⭐ terminou com ≥ 50% do esquadrão máximo que alcançou
- ⭐⭐⭐ terminou com ≥ 50% **e** sem perder o herói líder (sem tomar dano letal)

---

## 3. Controles e sensação de jogo

- **Arrastar horizontalmente** em qualquer lugar da tela move o líder (com suavização; resposta < 50 ms).
- A multidão segue o líder em formação circular compacta (empacotamento em espiral de Fermat), com leve atraso e "efeito mola".
- **Botão Ultimate** (canto inferior direito) acende quando a barra enche.
- Vibração curta (Capacitor Haptics) ao passar em portões bons, ao perder cadetes e ao derrotar um chefe.
- **Juice obrigatório:** números flutuantes (+25, ×3), *screen shake* leve, *hit-stop* de 60 ms no golpe final do chefe, partículas nos portões, câmera que se afasta conforme o esquadrão cresce.

---

## 4. Os Heróis (13)

Cada herói tem: **raridade**, **passiva** (o tempo todo), **projétil da multidão** (o que os cadetes atiram quando ele lidera), **Ultimate** e **cor do uniforme** (os cadetes usam a cor do líder). Heróis sobem do nível 1 ao 30 com moedas + fragmentos.

| # | Herói | Elemento | Raridade | Como desbloquear |
|---|-------|----------|----------|------------------|
| 1 | **Faísca** | Eletricidade | Comum | Inicial |
| 2 | **Muralha** | Pedra | Comum | Fase 8 |
| 3 | **Vendaval** | Vento | Comum | Fase 18 |
| 4 | **Brasa** | Fogo | Raro | Chefe do Mundo 2 (fase 40) |
| 5 | **Geada** | Gelo | Raro | Fase 55 |
| 6 | **Maré** | Água | Raro | Chefe do Mundo 3 (fase 60) |
| 7 | **Engrenagem** | Tecnologia | Raro | Fase 75 |
| 8 | **Raiz** | Natureza | Épico | Chefe do Mundo 5 (fase 100) |
| 9 | **Pulso** | Som | Épico | Fase 115 |
| 10 | **Prisma** | Luz | Épico | Chefe do Mundo 7 (fase 140) |
| 11 | **Eclipse** | Sombra | Lendário | Chefe do Mundo 8 (fase 160) |
| 12 | **Quasar** | Cósmico | Lendário | Chefe do Mundo 9 (fase 180) |
| 13 | **AKKO** | Ômega (secreto) | Mítico | Fase 200 com 3 estrelas em todos os chefes |

Todos os heróis também podem ser desbloqueados antes com **fragmentos** (50 / 80 / 120 / 200 / 300 por raridade), que caem em baús.

### Fichas detalhadas

**1. Faísca** — jovem mensageira que foi atingida por um raio enquanto entregava encomendas de skate.
- Visual: uniforme amarelo e azul-marinho, óculos de proteção, cabelo espetado com eletricidade.
- Passiva: +10% de velocidade de ataque do esquadrão.
- Projétil: pequenos raios amarelos.
- Ultimate **Tempestade em Cadeia**: um raio salta entre até 25 inimigos (dano = 40 × nível).

**2. Muralha** — ex-operário de demolição com pele que vira granito.
- Visual: corpulento, cinza e laranja, ombreiras de rocha.
- Passiva: o esquadrão começa com **+5 cadetes** e as armadilhas matam 20% menos.
- Projétil: pedrinhas em arco.
- Ultimate **Fortaleza**: domo de pedra que deixa o esquadrão invulnerável por 4 s.

**3. Vendaval** — piloto de asa-delta que domina correntes de ar.
- Visual: verde-água e branco, capa curta que tremula, máscara de piloto.
- Passiva: imã de coleta (moedas e itens até 2 faixas de distância).
- Projétil: lâminas de ar que atravessam 1 inimigo.
- Ultimate **Furacão**: empurra todos os inimigos à frente para trás e derruba 30% deles da pista.

**4. Brasa** — cozinheira de rua cujas mãos esquentam a 3.000 °C.
- Visual: vermelho e preto, avental de couro reforçado, chamas nos punhos.
- Passiva: inimigos atingidos queimam (dano ao longo do tempo).
- Projétil: bolas de fogo com pequena explosão em área.
- Ultimate **Erupção**: tapete de lava à frente por 5 s.

**5. Geada** — cientista polar que sobreviveu a um experimento criogênico.
- Visual: azul-gelo e prata, armadura translúcida de cristal.
- Passiva: inimigos atingidos ficam 25% mais lentos.
- Projétil: estilhaços de gelo.
- Ultimate **Era do Gelo**: congela todos os inimigos na tela por 3 s.

**6. Maré** — salva-vidas que controla a água ao redor.
- Visual: azul-turquesa e areia, tridente curto nas costas.
- Passiva: quando um cadete morreria por armadilha, há 15% de chance de ele ser "salvo".
- Projétil: jatos de água que empurram.
- Ultimate **Tsunami**: onda que atravessa a pista e causa dano massivo.

**7. Engrenagem** — inventora de 16 anos que constrói gadgets com sucata.
- Visual: macacão roxo com bolsos, mochila mecânica com braços robóticos.
- Passiva: 2 drones de combate acompanham o esquadrão.
- Projétil: rebites metálicos rápidos.
- Ultimate **Enxame de Drones**: 12 drones kamikaze buscam alvos.

**8. Raiz** — guardiã de uma floresta urbana esquecida.
- Visual: verde-musgo e marrom, cabelo de folhas, braceletes de cipó.
- Passiva: a cada 10 s, gera 1 cadete novo.
- Projétil: sementes que viram espinhos no chão.
- Ultimate **Floresta Viva**: cura/reconstrói 30% dos cadetes perdidos na fase.

**9. Pulso** — DJ que transforma batidas em ondas de choque.
- Visual: preto e magenta, fones enormes, jaqueta com equalizador em LED.
- Passiva: a cada 4 s, o esquadrão emite uma onda sonora em área.
- Projétil: anéis sônicos que atravessam.
- Ultimate **Drop**: atordoa todos os inimigos e dobra o dano por 5 s.

**10. Prisma** — astrônoma que absorve luz e a dispara em feixes.
- Visual: branco perolado com detalhes em arco-íris, visor de cristal.
- Passiva: projéteis se dividem em 2 ao acertar.
- Projétil: feixes de luz coloridos.
- Ultimate **Refração Total**: 7 lasers varrem a tela.

**11. Eclipse** — ex-vilão arrependido que anda entre sombras.
- Visual: roxo-escuro e preto, capuz, olhos brilhantes.
- Passiva: 20% de chance de esquiva de qualquer dano.
- Projétil: adagas de sombra.
- Ultimate **Passo Sombrio**: o esquadrão fica intangível e atravessa armadilhas por 5 s.

**12. Quasar** — astronauta fundido com uma estrela de nêutrons.
- Visual: azul-cósmico com constelações animadas na roupa, aura dourada.
- Passiva: todos os portões de multiplicação ganham +1 (×2 vira ×3).
- Projétil: mini-estrelas teleguiadas.
- Ultimate **Supernova**: explosão que limpa a tela (chefes tomam 25% da vida máxima).

**13. AKKO (secreto)** — o herói mascote da Akko's Corporation. Ninguém sabe de onde veio.
- Visual: armadura preta fosca com linhas douradas, capa longa, emblema "A" estilizado no peito.
- Passiva: combina as passivas de Faísca, Muralha e Quasar.
- Projétil: lâminas douradas teleguiadas.
- Ultimate **Protocolo Ômega**: converte 50% dos inimigos da tela em cadetes do esquadrão.

---

## 5. As Armas (20)

A arma equipada muda **o padrão de tiro de todo o esquadrão**. Também é possível pegar armas temporárias na pista (portão **Arsenal** ou caixote). Cada arma vai do nível 1 ao 20.

| # | Arma | Raridade | Padrão | Destaque |
|---|------|----------|--------|----------|
| 1 | **Blaster de Plasma** | Comum | Tiro reto | Inicial, equilibrado |
| 2 | **Estilingue de Fótons** | Comum | Tiro reto rápido | Cadência alta, dano baixo |
| 3 | **Disco Bumerangue** | Comum | Vai e volta | Acerta 2× |
| 4 | **Martelo Sísmico** | Comum | Onda no chão | Dano em linha, curto alcance |
| 5 | **Canhão Sônico** | Raro | Cone | Empurra inimigos |
| 6 | **Chicote Voltaico** | Raro | Arco lateral | Acerta quem chega pelos lados |
| 7 | **Lâminas Gêmeas** | Raro | Dois tiros diagonais | Bom contra multidões espalhadas |
| 8 | **Granada de Gosma** | Raro | Arco + poça | Deixa inimigos lentos |
| 9 | **Luvas Gravitacionais** | Raro | Puxa e esmaga | Agrupa inimigos |
| 10 | **Torreta de Ombro** | Raro | Automática | Mira o inimigo mais próximo |
| 11 | **Rifle Rail** | Épico | Perfurante | Atravessa tudo em linha |
| 12 | **Lançador de Enxame** | Épico | Mísseis teleguiados | 6 micro-mísseis por rajada |
| 13 | **Orbe Prismático** | Épico | Orbita o esquadrão | Dano de contato contínuo |
| 14 | **Tridente das Marés** | Épico | 3 jatos | Combina com Maré (+30%) |
| 15 | **Escudo Reflexivo** | Épico | Defensivo | Devolve projéteis inimigos |
| 16 | **Lança-Chamas Criogênico** | Épico | Cone duplo | Queima e congela alternadamente |
| 17 | **Foice do Eclipse** | Lendário | Giro 360° | Ataca em volta de todo o esquadrão |
| 18 | **Corrente Estelar** | Lendário | Ricochete | Salta entre 6 alvos |
| 19 | **Martelo do Trovão Ômega** | Lendário | Raio do céu | Atinge áreas aleatórias à frente |
| 20 | **Núcleo Singularidade** | Mítico | Buraco negro | Suga e destrói pequenos inimigos (só pelo Desafio Diário 30/30) |

**Sinergias herói + arma** (bônus de +25% de dano, mostrado com um selo dourado na pré-fase):
Faísca + Chicote Voltaico · Muralha + Martelo Sísmico · Vendaval + Disco Bumerangue · Brasa + Lança-Chamas Criogênico · Geada + Lança-Chamas Criogênico · Maré + Tridente das Marés · Engrenagem + Torreta de Ombro · Raiz + Granada de Gosma · Pulso + Canhão Sônico · Prisma + Orbe Prismático · Eclipse + Foice do Eclipse · Quasar + Corrente Estelar · AKKO + Martelo do Trovão Ômega.

---

## 6. Os Vilões

### Tropas inimigas (aparecem na pista e nas arenas)
| Tropa | Comportamento | Primeiro mundo |
|-------|---------------|----------------|
| **Capangas** | Multidão básica, corre em direção ao esquadrão | 1 |
| **Brutamontes** | Grandes e lentos; cada um vale por 5 capangas | 2 |
| **Atiradores** | Ficam parados e atiram | 2 |
| **Escudeiros** | Bloqueiam projéteis frontais | 3 |
| **Kamikazes** | Correm rápido e explodem (matam 3 cadetes) | 4 |
| **Drones Vigia** | Voam e mergulham | 5 |
| **Clonadores** | Ao morrer, viram 2 capangas | 6 |
| **Torres de Laser** | Fixas na pista, giram um feixe | 7 |
| **Sombras** | Ficam invisíveis por 2 s | 9 |

Os inimigos usam uniforme da **Legião do Caos**: vermelho e preto, com o símbolo de um olho quebrado.

### Supervilões (chefes)
Cada mundo tem um **mini-chefe na fase 10** e um **chefe na fase 20**. Os chefes têm barra de vida, 2 ou 3 fases de ataque e falas curtas em balões.

| Mundo | Mini-chefe (fase X10) | Chefe (fase X20) |
|-------|------------------------|------------------|
| 1 | **Sargento Fuzil** | **Doutor Estática** — cientista que rouba energia da cidade |
| 2 | **Ferro-Velho** | **Ferrugem** — gigante feito de sucata e guindastes |
| 3 | **Louva-a-Deus** | **Rainha Espinho** — planta mutante colossal |
| 4 | **Escorpião de Vidro** | **Faraó de Vidro** — múmia de cristal que reflete tiros |
| 5 | **Capitão Lodo** | **Leviatã** — serpente marinha mecânica |
| 6 | **Iéti de Aço** | **Barão Zero** — nobre que congela o tempo |
| 7 | **Forjador** | **Magmor** — titã de lava |
| 8 | **Unidade X-9** | **Comandante Nulo** — IA que comanda a estação orbital |
| 9 | **Reflexo** — cópia maligna do herói que o jogador estiver usando | **Espelho Quebrado** — vilão que copia a arma do jogador |
| 10 | **Os Quatro Arautos** (luta com 4 mini-chefes de uma vez) | **Imperador Caos** — líder da Legião, 3 fases, chefe final |

---

## 7. Os 10 mundos e as 200 fases

Cada mundo tem **visual próprio** (cor do céu, cor da pista, cenário lateral, música) e **apresenta uma mecânica nova** nas primeiras fases, com dica na tela na primeira vez.

| Mundo | Fases | Nome | Cenário | Mecânica nova |
|-------|-------|------|---------|---------------|
| 1 | 1–20 | **Metrópole Neon** | Arranha-céus, letreiros, viadutos | Portões +, ×, − e capangas (tutorial nas fases 1–3) |
| 2 | 21–40 | **Porto Industrial** | Contêineres, guindastes, esteiras | Serras giratórias e esteiras que empurram |
| 3 | 41–60 | **Selva Mutante** | Ruínas cobertas de cipó, flores gigantes | Pontes estreitas (perde quem cai) e portões ÷ |
| 4 | 61–80 | **Deserto de Cristal** | Dunas e obeliscos de cristal | Portões que se movem de um lado ao outro |
| 5 | 81–100 | **Cidade Submersa** | Cúpulas de vidro, cardumes | Correntes laterais que puxam o esquadrão |
| 6 | 101–120 | **Tundra Glacial** | Gelo, auroras, fortalezas | Chão escorregadio (controle com inércia) |
| 7 | 121–140 | **Vulcão Forja** | Lava, fábricas de armas | Chão que desaba e chuva de meteoros |
| 8 | 141–160 | **Estação Orbital** | Espaço, anéis, painéis solares | Gravidade baixa (pulos sobre buracos) e lasers |
| 9 | 161–180 | **Dimensão Espelho** | Tudo invertido, cores negativas | Portões com valor escondido (?) e pista que se inverte |
| 10 | 181–200 | **Cidadela do Caos** | Castelo flutuante sombrio | Todas as mecânicas misturadas |

### Ritmo dentro de cada mundo (20 fases)
- **Fases 1–3:** apresentam a mecânica nova com folga.
- **Fases 4–9:** variações, dificuldade subindo.
- **Fase 10:** mini-chefe.
- **Fases 11–14:** combinam a nova mecânica com as antigas.
- **Fase 15:** **Fase Bônus** (chuva de moedas, sem inimigos, 25 s).
- **Fases 16–19:** as mais difíceis do mundo.
- **Fase 20:** chefe do mundo + baú garantido + desbloqueio.

### Como gerar as 200 fases
As fases são **geradas a partir de dados**, não à mão uma a uma, mas o resultado precisa ser **sempre igual** para a mesma fase:

- `src/data/worlds.js` — os 10 mundos (tema, paleta, mecânicas, chefes, música).
- `src/data/levels.js` — gerador determinístico: `gerarFase(numero)` usa uma semente fixa (`seed = numero * 7919`) com um PRNG (mulberry32) e devolve a lista de **segmentos**.
- Fases especiais (1, 2, 3, todos os X10, X15 e X20) têm **overrides escritos à mão** em `src/data/levelOverrides.js`.

**Segmentos** (blocos de pista de 20 a 40 m que o gerador encadeia):
`portao_duplo`, `portao_triplo`, `corredor_armadilhas`, `tropa_inimiga`, `ponte_estreita`, `arsenal`, `moedas`, `corredor_movel`, `chefe_arena`, `bonus`.

**Curva de dificuldade** (L = número da fase, 1 a 200):
- Tamanho da pista: `comprimento = 180 + L * 1.6` metros (máx. 520)
- Força do exército final: `forcaFinal = round(15 + L * 4 + 1.022^L * 6)`
- Valor dos portões bons: soma `+[5..15] * (1 + L/40)`, multiplicação `×2` (×3 a partir da fase 30, ×4 a partir da 120, raros)
- Valor dos portões ruins: `−[5..20] * (1 + L/50)`, `÷2` a partir da fase 41
- Inimigos na pista: `tropas = 1 + floor(L / 25)` por fase
- **Regra de equilíbrio obrigatória:** escrever um *script de validação* (`npm run validar`) que simula, para cada uma das 200 fases, o melhor caminho possível e o caminho "médio" (escolha aleatória entre os portões), e garante que:
  1. o melhor caminho vence com **pelo menos 30% de folga**;
  2. o caminho médio vence nas fases 1–20 e perde em pelo menos 40% das fases 150–200;
  3. nenhuma fase tem dois segmentos impossíveis seguidos.
  O script gera `relatorio-equilibrio.md` com uma tabela das 200 fases.

---

## 8. Portões e itens da pista

| Portão | Cor | Efeito |
|--------|-----|--------|
| **+N** | Azul | Soma cadetes |
| **×N** | Dourado | Multiplica cadetes |
| **−N** | Vermelho | Remove cadetes |
| **÷N** | Vermelho-escuro | Divide cadetes |
| **Recruta Herói** | Roxo | Adiciona um **mini-herói** aliado aleatório (dano ×5 de um cadete) até o fim da fase |
| **Arsenal** | Laranja | Troca a arma por uma aleatória por 15 s |
| **Turbo** | Verde | +50% de velocidade de ataque por 10 s |
| **Mistério (?)** | Arco-íris | Valor escondido, pode ser ótimo ou ruim (60/40) |
| **Risco** | Preto e amarelo | ×3 ou ÷3, com 50% de chance cada |

Alguns portões **têm vida**: precisam ser "destravados" atirando neles, e o número sobe enquanto o esquadrão atira (como no anúncio do Top Lords). Usar isso a partir do Mundo 2.

**Armadilhas:** serra giratória, martelo pendular, barreira de laser, buraco, rolo compressor, espinhos que sobem, barril explosivo, pilar que cai.

**Coletáveis:** moedas, gemas (raras), cristais de Ultimate (enchem a barra), caixote de arma.

---

## 9. Progressão e economia (sem dinheiro real)

- **Moedas:** ganhas nas fases (20 + 2×L por vitória, ×1.5 com 3 estrelas). Usadas para subir de nível heróis e armas e melhorar o Quartel-General.
- **Gemas:** raras (chefes, conquistas, desafio diário). Usadas para abrir baús e reviver 1 vez por fase.
- **Fragmentos de herói:** caem em baús, desbloqueiam e evoluem heróis.
- **Baús:** Bronze (a cada 5 fases), Prata (mini-chefes), Ouro (chefes), Lendário (a cada 50 fases).
- **Quartel-General** (5 melhorias, nível 1–25 cada):
  1. **Academia de Cadetes** — cadetes iniciais (+1 por nível)
  2. **Arsenal** — dano base (+4% por nível)
  3. **Laboratório** — velocidade de ataque (+2% por nível)
  4. **Cofre** — moedas ganhas (+5% por nível)
  5. **Centro de Treino** — carga do Ultimate (+3% por nível)
- **Custo de melhoria:** `custo = round(50 * 1.18^(nivel-1))`.
- **Missões diárias** (3 por dia, renovam à meia-noite local): ex.: "Chegue a 300 cadetes", "Derrote 2 chefes", "Use 5 Ultimates".
- **Conquistas** (30): ex.: "Primeiro Esquadrão" (complete a fase 1), "Exército de Mil" (1.000 cadetes de uma vez), "Intocável" (10 fases seguidas com 3 estrelas), "Colecionador" (todos os heróis).

---

## 10. Modos extras
- **Modo Infinito** (libera na fase 30): pista sem fim que fica mais difícil; recorde salvo.
- **Desafio Diário** (libera na fase 20): uma fase gerada pela data do dia (`seed = AAAAMMDD`), com herói e arma sorteados. 30 desafios completados liberam o **Núcleo Singularidade**.
- **Galeria de Heróis:** modelo 3D girando, história, atributos, sinergias.

---

## 11. Telas (UI)

1. **Splash** — logo "OMEGA RUSH" + "Akko's Corporation" (2 s).
2. **Mapa de Mundos** — caminho vertical com as fases em nós, estrelas em cada nó, ícone do chefe nos X10/X20, rolagem suave, botão "Jogar" grande fixo embaixo.
3. **Pré-fase** — cartão do herói, arma, sinergia, recompensas previstas.
4. **HUD** — número de cadetes acima do esquadrão (como no anúncio), barra de progresso da fase no topo, moedas, botão de pausa, botão de Ultimate.
5. **Pausa** — continuar, reiniciar, configurações, sair.
6. **Vitória / Derrota** — estrelas animadas, recompensas, "Próxima fase" / "Tentar de novo" / "Reviver (10 gemas)".
7. **Heróis**, **Armas**, **Quartel-General**, **Missões**, **Conquistas**, **Configurações** (som, música, vibração, qualidade gráfica Baixa/Média/Alta, idioma, apagar progresso, créditos).

Estilo da UI: botões grandes arredondados com borda grossa e sombra (estilo "cartoon mobile"), fonte **Lilita One** (embutida no projeto, sem CDN), cores fortes, ícones desenhados em SVG.

---

## 12. Arte, som e desempenho

### Arte
- **Low-poly estilo cartoon**, sombreamento *toon* (MeshToonMaterial) com contorno simples.
- **Sem arquivos 3D externos:** heróis, cadetes, inimigos e cenários são **montados em código** a partir de formas básicas (cápsulas, caixas, cilindros, cones), cada herói com silhueta própria (capa, ombreiras, capuz, mochila etc.).
- Cadetes e inimigos usam **InstancedMesh** (um draw call por tipo), com animação de corrida feita no shader ou por deslocamento simples.
- Céu com degradê por mundo, neblina, cenário lateral reaproveitado (pool de objetos).

### Som
- Efeitos e músicas **gerados por código com Web Audio API** (sem arquivos de áudio): disparo, portão bom, portão ruim, explosão, vitória, derrota, chefe.
- Uma trilha curta em loop por mundo, feita com sequenciador simples (baixo + bateria + melodia), variando escala e BPM por mundo.

### Desempenho (obrigatório)
- **60 FPS** em celular intermediário (referência: Galaxy A54) com **até 600 cadetes + 300 inimigos** na tela.
- Acima de 600 cadetes, o número continua subindo, mas o visual mostra no máximo 600 (os extras viram "força" invisível).
- Projéteis em **pool**, colisões em grade espacial (sem física pesada, sem engine de física).
- Qualidade gráfica automática: se o FPS ficar abaixo de 45 por 3 s, baixa a qualidade sozinho.
- Tamanho final do APK abaixo de 30 MB.

---

## 13. Tecnologia e estrutura

- **Three.js** + **JavaScript (ES Modules)** + **Vite**
- **Capacitor** para gerar o APK Android (com o plugin Haptics)
- **Salvamento:** `localStorage` com versão de save e migração (`saveVersion`), salvando a cada fim de fase
- **Sem nenhuma dependência de rede** em tempo de execução

```
omega-rush/
├─ index.html
├─ package.json
├─ vite.config.js
├─ capacitor.config.json
├─ src/
│  ├─ main.js
│  ├─ core/        (loop, input, câmera, save, i18n, áudio, pools)
│  ├─ game/        (corrida, multidão, portões, armadilhas, combate, chefes)
│  ├─ entities/    (construtores 3D de heróis, cadetes, inimigos, cenários)
│  ├─ data/        (heroes.js, weapons.js, enemies.js, bosses.js, worlds.js, levels.js, levelOverrides.js, missions.js, achievements.js)
│  ├─ ui/          (telas em HTML/CSS por cima do canvas)
│  └─ i18n/        (pt-BR.json, en.json)
├─ scripts/
│  └─ validar-fases.js
├─ .github/workflows/
│  ├─ apk.yml      (gera APK debug a cada push e anexa como artifact; em tag v*, cria Release com o APK)
│  └─ pages.yml    (publica a versão web no GitHub Pages)
├─ README.md       (em português, com GIF/prints, como jogar, como compilar)
├─ DECISOES.md
└─ LICENSE         (MIT)
```

Todos os números de balanceamento ficam nos arquivos de `src/data/` — **nada de número mágico espalhado pelo código**.

---

## 14. Fases de entrega

Entregue **uma fase por vez**. Ao fim de cada uma: faça commit, rode o jogo, confira que funciona e me diga o que testar.

1. **Fundação:** estrutura do projeto, Vite, Three.js, pista infinita simples, líder controlável, multidão com InstancedMesh, portões + e ×, número acima do esquadrão. Workflow de APK funcionando.
2. **Combate:** tiro automático, capangas na pista, arena final, vitória/derrota, estrelas.
3. **Conteúdo de dados:** todos os heróis, armas, inimigos e chefes em `src/data/`; gerador das 200 fases; script de validação passando.
4. **Heróis e armas jogáveis:** modelos 3D dos 13 heróis, padrões de tiro das 20 armas, Ultimates, sinergias.
5. **Mundos:** os 10 cenários, mecânicas novas de cada mundo, 20 chefes com padrões de ataque.
6. **Meta-jogo:** mapa de mundos, economia, Quartel-General, baús, missões, conquistas, save.
7. **Polimento:** áudio procedural, partículas, juice, tutorial, i18n EN, configurações, qualidade automática.
8. **Extras e lançamento:** Modo Infinito, Desafio Diário, Galeria, README com prints, GitHub Pages, Release v1.0.0 com APK.

---

## 15. Critérios de pronto (v1.0.0)

- [ ] As 200 fases jogáveis do começo ao fim, com `npm run validar` passando
- [ ] 13 heróis, 20 armas, 9 tipos de tropa e 20 chefes funcionando
- [ ] 60 FPS com 600 cadetes no celular de referência
- [ ] APK gerado automaticamente pelo GitHub Actions e versão web no GitHub Pages
- [ ] Progresso salvo e restaurado corretamente após fechar o app
- [ ] Nenhum conteúdo parecido com personagens de outras empresas
- [ ] "Akko's Corporation" na splash, no menu e nos créditos
- [ ] Jogo inteiro em PT-BR, com opção EN
