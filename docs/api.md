# API do CineTrack

API REST do backend Express (`backend/server.js`). Todas as rotas conversam
em JSON e salvam os filmes em `backend/data/filmes.json`. A URL base no
ambiente local é `http://localhost:3000`.

## Formato de um filme

```json
{
  "id": 1,
  "titulo": "A Origem",
  "ano": 2010,
  "genero": "Ficção científica",
  "poster": "https://image.tmdb.org/t/p/w300/....jpg",
  "nota": 5,
  "status": "assistido",
  "comentario": "A camada do sonho dentro do sonho continua impecável."
}
```

Regras de validação (aplicadas no POST e no PUT; o servidor é a última linha
de defesa e devolve **todos** os problemas de uma vez):

| Campo       | Regra                                                    |
|-------------|----------------------------------------------------------|
| `titulo`    | Obrigatório, não pode ficar vazio                         |
| `ano`       | Número inteiro entre 1888 e 2030                          |
| `genero`    | Obrigatório, não pode ficar vazio                         |
| `status`    | Um de: `assistido`, `assistindo`, `quero`                 |
| `nota`      | Número inteiro entre 1 e 5                                |
| `poster`    | Opcional (string, padrão `""`)                            |
| `comentario`| Opcional (string, padrão `""`)                            |

Corpo de erro 400 (lista com todos os erros encontrados):

```json
{ "erros": ["Escolha um status válido (assistido, assistindo ou quero).", "A nota deve ser um número inteiro entre 1 e 5."] }
```

## Rotas

### `GET /filmes`

Lista todos os filmes. Aceita filtros combináveis por query string.

| Item              | Valor                                                              |
|-------------------|--------------------------------------------------------------------|
| Parâmetros        | `?q=texto` (substring do título, ignora maiúsculas) e/ou `?status=` (`assistido`, `assistindo`, `quero`) |
| Corpo             | nenhum                                                             |
| Respostas         | **200** — array de filmes (possivelmente vazio)                    |

### `GET /filmes/:id`

Detalhe de um filme.

| Item       | Valor                                                  |
|------------|--------------------------------------------------------|
| Parâmetros | `:id` numérico na URL                                  |
| Corpo      | nenhum                                                 |
| Respostas  | **200** — objeto do filme; **404** — `{ "erro": "Filme com id X não encontrado" }` |

### `POST /filmes`

Cria um filme. O servidor gera o `id` (maior id existente + 1).

| Item       | Valor                                                                                          |
|------------|------------------------------------------------------------------------------------------------|
| Parâmetros | nenhum (o `id` vem na resposta)                                                                 |
| Corpo      | JSON com `titulo`, `ano`, `genero`, `status`, `nota` (obrigatórios); `poster` e `comentario` opcionais |
| Respostas  | **201** — objeto criado; **400** — `{ "erros": [...] }` com todos os problemas de validação      |

### `PUT /filmes/:id`

Atualiza um filme. O corpo vem completo do formulário de edição e passa pela
**mesma validação do POST** (o `id` da URL prevalece sobre qualquer `id` no
corpo; a validação do corpo roda antes da busca, então corpo inválido em id
inexistente devolve 400).

| Item       | Valor                                                                                          |
|------------|------------------------------------------------------------------------------------------------|
| Parâmetros | `:id` numérico na URL                                                                          |
| Corpo      | JSON completo do filme (mesmos campos obrigatórios do POST)                                     |
| Respostas  | **200** — objeto atualizado; **400** — `{ "erros": [...] }`; **404** — `{ "erro": ... }`        |

### `DELETE /filmes/:id`

Remove um filme.

| Item       | Valor                                                  |
|------------|--------------------------------------------------------|
| Parâmetros | `:id` numérico na URL                                  |
| Corpo      | nenhum                                                 |
| Respostas  | **204** — removido, sem corpo; **404** — `{ "erro": ... }` |

### `GET /stats`

Resumo da coleção (portado das funções puras da ANP 05).

| Item       | Valor                                                                                  |
|------------|----------------------------------------------------------------------------------------|
| Parâmetros | nenhum                                                                                 |
| Corpo      | nenhum                                                                                 |
| Respostas  | **200** — `{ "total": 6, "porStatus": { "assistido": 3, "assistindo": 1, "quero": 2 }, "mediaNotas": 4.5 }` |

### `GET /tmdb/search?q=texto` (opcional)

Busca filmes na API pública do TMDB. Requer `TMDB_API_KEY` no
`backend/.env`; sem a chave a rota responde 503.

| Item       | Valor                                                                                  |
|------------|----------------------------------------------------------------------------------------|
| Parâmetros | `?q=texto` obrigatório                                                                 |
| Corpo      | nenhum                                                                                 |
| Respostas  | **200** — array de resultados (`id_tmdb`, `titulo`, `ano`, `sinopse`, `poster`); **400** — sem `?q=`; **503** — `TMDB_API_KEY` não configurada; **502** — falha ao contatar o TMDB |
