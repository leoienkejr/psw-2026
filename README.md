# CineTrack — Parte 1

Catálogo pessoal de filmes ("o que já vi, estou vendo e quero ver")
construído com **HTML + CSS + JavaScript puro**, evoluindo aula a aula
até virar base para a migração do React (Parte 2).

Código em `cinetrack/parte1/`:

| Arquivo          | Papel                                                       |
| ---------------- | ----------------------------------------------------------- |
| `index.html`     | Lista de cards, filtros, busca e modal (sem HTML de card fixo) |
| `adicionar.html` | Página legada das aulas 1–3 (o fluxo real usa o modal)       |
| `style.css`      | Tema com variáveis CSS, modo escuro e layout responsivo      |
| `app.js`         | Estado, funções puras, render e persistência                 |

## Como rodar

Abra `cinetrack/parte1/index.html` direto no navegador, ou sirva a pasta
(persistência e busca funcionam dos dois jeitos):

```bash
cd cinetrack/parte1
python3 -m http.server 8000
# http://localhost:8000
```

## Funcionalidades (marco 1, tag `v1.0`)

- **Cards a partir de um array** (Aula 2): cada card nasce de
  `createElement` + `textContent` — nada de HTML digitado à mão.
- **Filtros por status** (Aula 3/5): nav com `data-status`; o listener
  muda `statusAtual` e chama `atualizar()`.
- **Modal de adicionar/editar** (Aula 4): formulário validado antes de
  tocar no estado; editar reabre o formulário preenchido.
- **Busca por título** (Aula 5): listener de `input` envolto em
  `debounce(..., 300)` — a lista re-renderiza uma vez por pausa de
  digitação, não a cada letra.
- **Persistência** (Aula 5): `salvar()`/`carregar()` no `localStorage`
  com a chave `cinetrack:filmes`. A lista inicial é carregada de lá e
  cada adição, edição ou remoção grava de volta (sobrevive ao F5).
- **Render em um só lugar** (Aula 5): `aplicarFiltros()` combina status
  + busca e `atualizar()` redesenha a lista e o rodapé. Filtro ou busca
  sem resultados mostram a mensagem "Nenhum filme...".

## Acessibilidade

Revisada na Aula 5 (meta Lighthouse ≥ 90):

- `<html lang="pt-BR">`, `meta description` e viewport;
- todo `input`/`select`/`textarea` com `<label for>` associado;
- busca e botões-ícone com `aria-label` descritivos;
- modal com `role="dialog"`, `aria-modal="true"` e `aria-labelledby`
  apontando para o `h2` do título; fecha com Escape, Cancelar e ×;
- foco visível (`:focus-visible`) e contraste via variáveis de tema;
- `#lista` é `aria-live="polite"`: mudanças de filtro/busca/remoção
  são anunciadas pelo leitor de tela.

## Notas

- Os pôsteres usam URLs de imagem reais da TMDB
  (`image.tmdb.org/t/p/w300/...`). O item opcional de buscar os dados
  via API da TMDB (`fetch` + `async/await`) ficou pendente: a API
  exige chave própria — sem ela, mantemos as URLs estáticas.
- `app.js` roda sem build: é um `<script>` comum no fim do `<body>`.

## Histórico

Cada aula virou um commit (`feat: ...`). Este marco fecha em
`feat: busca e persistencia` + tag `v1.0`.
