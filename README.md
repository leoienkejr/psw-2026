# CineTrack

Catálogo pessoal de filmes ("o que já vi, estou vendo e quero ver").

- `cinetrack/parte1/` — versão em HTML, CSS e JavaScript puro (Parte 1 do trabalho, Marco 1).
- `backend/` — API REST com Express que salva os filmes em `data/filmes.json`.
- `frontend/` — app React (Vite) que consome a API do backend.
- `docs/api.md` — referência completa das rotas da API.
- `docs/testes-parte1.md` e `docs/testes-parte2.md` — testes registrados de cada parte.

## Do zero (resumo rápido)

```bash
git clone https://github.com/leoienkejr/psw-2026.git
cd psw-2026

# backend (API em http://localhost:3000)
cd backend
npm install
npm run seed     # cria data/filmes.json com os 6 filmes iniciais
npm start

# frontend (app em http://localhost:5173) — em outro terminal
cd ../frontend
npm install
npm run dev
```

Detalhes de cada parte abaixo.

## Como rodar a parte 1

Não há build nem dependências: é um site estático.

```bash
# opção 1: abrir direto
xdg-open cinetrack/parte1/index.html

# opção 2 (recomendada): servir por HTTP a partir da raiz do repositório
npx serve .        # ou qualquer servidor estático apontando para a raiz
# abrir http://localhost:3000/cinetrack/parte1/index.html
```

Os dados ficam no `localStorage` do navegador (chave `cinetrack:filmes`);
na primeira visita a lista é semeada com os 6 filmes canônicos.

### O que funciona na parte 1

- Listagem em cards (pôster, título, ano, gênero, nota em estrelas e status).
- Adicionar e editar filmes por um modal com validação (título, gênero,
  ano entre 1888 e 2030, status válido, nota de 1 a 5).
- Remover filme com confirmação (`confirm`).
- Busca por título (com debounce) e filtro por status — os dois combinam.
- **Ordenação** da lista por título (`localeCompare`, trata acentos), ano
  (mais recentes primeiro) ou nota (melhores primeiro), combinando com
  busca e filtro.
- Persistência automática no `localStorage` entre recarregas.
- Estado vazio com mensagem acessível (`aria-live`), tema escuro
  automático e folha de estilo de impressão.

> `cinetrack/parte1/adicionar.html` é a página estática de formulário
> construída na Aula 1 como exercício de layout; o fluxo real de adicionar
> filme é o modal da `index.html`.

## Como rodar o backend

Pré-requisitos: Node.js 20+ (usa `--env-file` e o `fetch` global).

```bash
cd backend
npm install
npm run seed     # (opcional) repõe os 6 filmes iniciais em data/filmes.json
npm run dev      # inicia em http://localhost:3000 com recarga automática
# ou
npm start        # inicia sem watch
```

A porta e as chaves ficam em `backend/.env` (copie `backend/.env.example`
se o arquivo não existir). O servidor responde em:

| Método | Rota            | Descrição                                   |
|--------|-----------------|---------------------------------------------|
| GET    | `/filmes`       | Lista todos os filmes (filtros opcionais `?q=` e `?status=`) |
| GET    | `/filmes/:id`   | Detalhe de um filme                          |
| POST   | `/filmes`       | Cria um filme (corpo JSON)                   |
| PUT    | `/filmes/:id`   | Atualiza um filme                            |
| DELETE | `/filmes/:id`   | Remove um filme (resposta 204)               |
| GET    | `/stats`        | Resumo da coleção (total, por status, média de notas) |
| GET    | `/tmdb/search`  | **Opcional:** busca no TMDB (`?q=`), exige `TMDB_API_KEY` no `.env` |

O POST e o PUT validam o corpo no servidor (título, ano entre 1888 e 2030,
gênero, nota inteira de 1 a 5 e status entre `assistido`, `assistindo` e
`quero`) e devolvem **400 com todos os erros de uma vez**:
`{ "erros": ["A nota deve ser um número inteiro entre 1 e 5.", ...] }`.
Códigos de resposta e corpos esperados de cada rota estão em
[`docs/api.md`](docs/api.md).

## Como rodar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev      # inicia em http://localhost:5173
```

O frontend fala com o backend em `http://localhost:3000`. Se o backend
rodar em outra porta, crie `frontend/.env` com:

```
VITE_API_URL=http://localhost:3000
```

## Build de produção

```bash
cd frontend
npm run build    # gera os arquivos em frontend/dist/
npm run preview  # (opcional) serve o build em http://localhost:4173
```
