# Testes da ANP 09 — rotas de busca e stats no backend

Testes executados com o servidor rodando (`npm start`, porta 3000) e o banco
regenerado pelo seed (`npm run seed`). Cada requisição abaixo foi feita via
curl (equivalente a abrir a URL no navegador) contra `backend/server.js`.

## Rotas novas

| # | Requisição | Resultado esperado | Resultado |
|---|------------|--------------------|-----------|
| 1 | `GET /filmes?q=du` | Só o filme cujo título contém "du" | **Passou** — só `Duna: Parte Dois` (id 4, status assistindo) |
| 2 | `GET /filmes?q=DUNA` | Mesmo resultado de `?q=du` (busca ignora maiúsculas) | **Passou** — mesma resposta do caso 1 |
| 3 | `GET /filmes?q=a&status=quero` | Só filmes "quero" cujo título contém "a" (os dois critérios combinam) | **Passou** — `Interestelar` (id 5) e `Cidade de Deus` (id 6) |
| 4 | `GET /filmes?q=zzz` | Lista vazia | **Passou** — `[]` |
| 5 | `GET /stats` | `total 6`, `porStatus { assistido: 3, assistindo: 1, quero: 2 }`, `mediaNotas 4.5` | **Passou** — `{"total":6,"porStatus":{"assistido":3,"assistindo":1,"quero":2},"mediaNotas":4.5}` |

A média vem de `reduce` somando as notas (5+5+4+4+5+4 = 27) dividido por 6
e arredondado com `Math.round(x * 10) / 10` — mesma técnica da ANP 05.

## Rotas antigas (regressão)

| # | Requisição | Resultado esperado | Resultado |
|---|------------|--------------------|-----------|
| 6 | `GET /filmes` | Os 6 filmes do seed | **Passou** — ids 1 a 6, intactos |
| 7 | `GET /filmes/1` | O objeto completo de "A Origem" | **Passou** |
| 8 | `GET /filmes/99` | 404 com mensagem de erro | **Passou** — HTTP 404, `{"erro":"Filme com id 99 não encontrado"}` |
| 9 | `GET /filmes?status=quero` (sem `q`) | Só os filmes "quero" | **Passou** — filtro antigo segue funcionando sem o parâmetro novo |

## Ajuste no seed

O critério de aceitação da ANP (porStatus `3/1/2` e mediaNotas `4.5`)
pressupunha "Cidade de Deus" como filme **quero** com nota **4**, mas o seed
da Aula 2 o gravava como **assistido** com nota **5** (o que daria
`{assistido: 4, assistindo: 1, quero: 1}` e média `4.7`). O seed foi ajustado
para o estado canônico da ANP antes dos testes acima.
