# Testes da Parte 2 (Marco 2) — validação do servidor e teste ponta a ponta

Testes executados em 16/10/2026, a partir de um clone limpo do repositório:

- Node.js v22.23.3
- Banco regenerado pelo seed: `cd backend && npm run seed`
  → `Seed concluído: 6 filmes gravados em .../backend/data/filmes.json`
- Backend: `cd backend && npm start` → `Servidor do CineTrack rodando em http://localhost:3000`
- Frontend: `cd frontend && npm run dev` → `VITE v7.3.7 ready` em
  `http://localhost:5173` (o index respondeu `HTTP 200`). O build de
  produção (`npm run build`) também foi executado e concluiu sem erros.

Todas as requisições abaixo foram feitas com `curl` contra os mesmos
endpoints que a interface React dispara (`frontend/src/api.js`).

## Parte A — validação endurecida (POST e PUT)

| # | Requisição | Resultado esperado | Resultado |
|---|------------|--------------------|-----------|
| 1 | `POST /filmes` com `{"titulo":"Teste Invalido","ano":2023,"genero":"Acao","nota":7,"status":"inventado"}` | 400 com os dois erros na lista | **Passou** — `HTTP 400` com `{"erros":["Escolha um status válido (assistido, assistindo ou quero).","A nota deve ser um número inteiro entre 1 e 5."]}` |
| 2 | `PUT /filmes/1` com o mesmo tipo de corpo (nota 7, status inventado) | 400 com os dois erros (mesma validação do POST) | **Passou** — `HTTP 400`, mesma lista de erros; o filme 1 ficou intacto |
| 3 | `POST /filmes` com dado válido (`Blade Runner 2049`, 2017, nota 5, assistido) | 201 | **Passou** — `HTTP 201`, objeto criado com `id 7` |
| 4 | `PUT /filmes/7` com dado válido (nota 4, assistindo) | 200 | **Passou** — `HTTP 200`, objeto atualizado |
| 5 | `POST /filmes` com todos os campos inválidos (título vazio, ano 1500, gênero vazio, nota 9, status `x`) | 400 acumulando **todos** os problemas | **Passou** — `HTTP 400` com lista de 5 erros: título, ano, gênero, status e nota |

A lista `erros` acumula os problemas de uma vez (a lógica é o porte da
`validarFilme` da Parte 1, agora rodando no servidor). Exemplo real do
caso 5:

```json
{"erros":["Informe o título.","O ano deve ser um número inteiro entre 1888 e 2030.","Informe o gênero.","Escolha um status válido (assistido, assistindo ou quero).","A nota deve ser um número inteiro entre 1 e 5."]}
```

## Parte B — regressão das rotas antigas

| # | Requisição | Resultado esperado | Resultado |
|---|------------|--------------------|-----------|
| 6 | `GET /filmes` | Os 6 filmes do seed | **Passou** — `total: 6, ids: 1,2,3,4,5,6` |
| 7 | `GET /filmes/99` | 404 | **Passou** — `HTTP 404`, `{"erro":"Filme com id 99 não encontrado"}` |
| 8 | `GET /stats` | Resumo da coleção | **Passou** — `{"total":6,"porStatus":{"assistido":3,"assistindo":1,"quero":2},"mediaNotas":4.5}` |

## Parte C — teste ponta a ponta do zero

Sequência executada de fato nesta sessão (backend na 3000, frontend na 5173):

| # | Passo | Resultado |
|---|-------|-----------|
| 1 | `npm run seed` no backend | **Passou** — 6 filmes gravados; `GET /filmes` devolveu `total: 6, ids: 1..6` |
| 2 | Subir o backend (`npm start`) | **Passou** — servidor em `http://localhost:3000` |
| 3 | Subir o frontend (`npm run dev`) | **Passou** — Vite em `http://localhost:5173`; o index respondeu `HTTP 200` |
| 4 | **Criar** um filme pela interface (equivalente HTTP: `POST /filmes` "A Viagem de Chihiro", 2001, Animação, nota 5, assistido) | **Passou** — `HTTP 201`, `id 7`; a lista passou a exibir 7 filmes |
| 5 | **Ler**: `GET /filmes` e `GET /stats` | **Passou** — `total: 7`; stats `{"total":7,"porStatus":{"assistido":3,"assistindo":2,"quero":2},"mediaNotas":4.4}` |
| 6 | **Editar** o filme 7 pela interface (equivalente HTTP: `PUT /filmes/7`, nota 4, status assistindo) | **Passou** — `HTTP 200` com o objeto atualizado |
| 7 | **Reiniciar o servidor** (matar o processo e subir de novo com `npm start`) | **Passou** — servidor voltou na 3000 |
| 8 | Conferir persistência: `GET /filmes` após a reinicialização | **Passou** — `total: 7` e o filme 7 veio completo do disco: `{"id":7,"titulo":"Persistencia Teste",...,"nota":3,"status":"assistindo"}` (neste trecho final da sessão o filme de persistência foi o "Persistencia Teste", criado com `POST` logo antes da reinicialização) |
| 9 | **Remover**: `DELETE /filmes/7` para limpeza | **Passou** — `HTTP 204`; estado final `total: 6, ids: 1..6` e stats de volta a `{assistido: 3, assistindo: 1, quero: 2}, média 4.5` |

Os dados sobrevivem à reinicialização porque o servidor grava cada mutação
em `backend/data/filmes.json` e relê o arquivo a cada requisição — não há
estado em memória.

## Estado de erro no frontend

Dois níveis de erro, ambos visíveis ao usuário:

1. **Validação local (modal):** `frontend/src/components/ModalFilme.jsx`
   valida antes de gastar a requisição e mostra a lista dentro do modal
   (`<ul class="erros" role="alert">`). Com a nota agora obrigatória no
   servidor, o modal também exige nota de 1 a 5 (nota vazia é rejeitada
   localmente com "A nota deve ser de 1 a 5.").
2. **Erro do servidor:** se mesmo assim o backend devolver 400, o
   `frontend/src/api.js` junta a lista `erros` da resposta em uma única
   mensagem e `App.jsx` a exibe em `<p class="erro" role="alert">` acima da
   lista ("Não foi possível salvar o filme: Escolha um status válido (…)
   A nota deve ser um número inteiro entre 1 e 5."). O modal permanece
   aberto para correção (`salvarModal` só fecha em caso de sucesso).

## Observação de execução

Na primeira tentativa do passo 7–8 havia processos antigos do servidor (de
sessões anteriores) disputando a porta 3000, o que produziu leituras
inconsistentes. Os processos foram encerrados, a porta conferida com
`ss -ltnp` e a sequência inteira foi reexecutada de forma limpa — os
resultados registrados acima são os da execução limpa.

## Documentação da API

O detalhamento de todas as rotas (parâmetros, corpos e códigos de resposta)
está em [`docs/api.md`](api.md).
