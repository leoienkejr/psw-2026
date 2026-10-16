# CineTrack

Catálogo pessoal de filmes ("o que já vi, estou vendo e quero ver").

- `cinetrack/parte1/` — versão inicial em HTML, CSS e JavaScript puro (Aula 1).
- `backend/` — API REST com Express que salva os filmes em `data/filmes.json`.
- `frontend/` — app React (Vite) que consome a API do backend.

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
| GET    | `/filmes`       | Lista todos os filmes (filtro opcional `?status=`) |
| GET    | `/filmes/:id`   | Detalhe de um filme                          |
| POST   | `/filmes`       | Cria um filme (corpo JSON)                   |
| PUT    | `/filmes/:id`   | Atualiza um filme                            |
| DELETE | `/filmes/:id`   | Remove um filme (resposta 204)               |
| GET    | `/tmdb/search`  | **Opcional:** busca no TMDB (`?q=`), exige `TMDB_API_KEY` no `.env` |

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
