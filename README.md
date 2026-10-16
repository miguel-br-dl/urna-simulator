# Simulador de urna eletrônica

Simulador interativo de uma urna eletrônica, feito somente com HTML, CSS e JavaScript puro. O projeto pode ser publicado diretamente no GitHub Pages, sem build, servidor ou dependências externas.

## Como usar

1. Abra `index.html` em um navegador ou publique o repositório no GitHub Pages.
2. Clique nos números da urna para formar um voto de até dois algarismos.
3. Use `CORRIGE` para limpar os algarismos digitados.
4. Use `CONFIRMA` depois de digitar dois números.

Também há suporte opcional ao teclado: números digitam, `Esc` corrige e `Enter` confirma.

## Regras da simulação

- Sem algarismos: exibe `base0`.
- Com um algarismo: exibe `base1`.
- `13`: exibe `base13` e toca `confirma-urna.mp3` ao confirmar.
- `22`: exibe `base22` e toca `gemidao.mp3` ao confirmar.
- Qualquer outro par: exibe `baseE` e toca `gemidao.mp3` ao confirmar.
- Depois de dois algarismos, novas teclas numéricas não têm efeito e não tocam áudio.
- `CORRIGE` limpa o voto e toca o som de clique.
- `BRANCO` não tem ação nesta simulação.
- `CONFIRMA` não tem ação antes de dois algarismos.

## Otimização dos assets

Os PNG originais continuam em `assets/` como fallback. Para o carregamento principal, as imagens foram convertidas para WebP e reduzidas para `1280 × 853` em `assets/otimizados/`.

O JavaScript faz um pre-flight no carregamento da página: mantém a primeira imagem prioritária, pré-carrega os estados seguintes quando o navegador está livre e prepara os três áudios. Isso evita que a troca de estado fique esperando o download depois do clique.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie estes arquivos.
2. Abra `Settings` → `Pages`.
3. Em `Build and deployment`, escolha `Deploy from a branch`.
4. Selecione a branch principal e a pasta `/ (root)`.
5. Salve e aguarde a URL do GitHub Pages.

Como o site é estático, não é necessário instalar Node.js, executar `npm install` ou gerar uma pasta `dist`.
