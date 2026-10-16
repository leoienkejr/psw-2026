const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

function lerFilmes() {
  const caminhoArquivo = path.join(__dirname, 'data', 'filmes.json')
  const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8')
  return JSON.parse(conteudo)
}

function salvarFilmes(lista) {
  const caminhoArquivo = path.join(__dirname, 'data', 'filmes.json')
  fs.writeFileSync(caminhoArquivo, JSON.stringify(lista, null, 2), 'utf-8')
}

app.get('/filmes', (req, res) => {
  const { status, q } = req.query

  let filmes = lerFilmes()

  // Busca por substring no título, ignorando maiúsculas e minúsculas
  // (o mesmo que o filtro de texto do frontend, agora do lado do servidor).
  if (q) {
    const textoBusca = String(q).toLowerCase()
    filmes = filmes.filter((filme) => filme.titulo.toLowerCase().includes(textoBusca))
  }

  if (status) {
    filmes = filmes.filter(
      (filme) => filme.status.toLowerCase() === String(status).toLowerCase()
    )
  }

  res.json(filmes)
})

app.get('/filmes/:id', (req, res) => {
  const id = Number(req.params.id)
  const filme = lerFilmes().find((filme) => filme.id === id)

  if (!filme) {
    return res.status(404).json({ erro: `Filme com id ${req.params.id} não encontrado` })
  }

  res.json(filme)
})

// ---------------------------------------------------------------------------
// GET /stats — resumo da coleção (portado das funções puras da ANP 05).
// Contagens e média calculadas com reduce, sem contadores escritos à mão.
// ---------------------------------------------------------------------------
app.get('/stats', (req, res) => {
  const filmes = lerFilmes()

  // Quantidade de filmes em cada status: o acumulador começa como objeto
  // vazio e cada filme soma 1 na posição do seu status.
  const porStatus = filmes.reduce((contagem, filme) => {
    contagem[filme.status] = (contagem[filme.status] || 0) + 1
    return contagem
  }, {})

  // Soma das notas com reduce; o * 10 / 10 com Math.round arredonda
  // a média para 1 casa decimal (mesma técnica da ANP 05).
  const somaNotas = filmes.reduce((soma, filme) => soma + filme.nota, 0)
  const mediaNotas =
    filmes.length === 0 ? 0 : Math.round((somaNotas / filmes.length) * 10) / 10

  res.json({
    total: filmes.length,
    porStatus,
    mediaNotas
  })
})

// ---------------------------------------------------------------------------
// validarFilme — porte da função da Parte 1 (cinetrack/parte1/app.js).
// Devolve a lista de problemas encontrados; lista vazia = dados válidos.
// O servidor é a última linha de defesa: valida tudo de novo mesmo que o
// frontend já tenha validado, e devolve TODOS os erros de uma vez na
// resposta 400 ({ "erros": [...] }).
// ---------------------------------------------------------------------------
function validarFilme(corpo) {
  const erros = []

  if (!corpo.titulo || String(corpo.titulo).trim() === '') {
    erros.push('Informe o título.')
  }

  const ano = Number(corpo.ano)
  if (!Number.isInteger(ano) || ano < 1888 || ano > 2030) {
    erros.push('O ano deve ser um número inteiro entre 1888 e 2030.')
  }

  if (!corpo.genero || String(corpo.genero).trim() === '') {
    erros.push('Informe o gênero.')
  }

  if (!['quero', 'assistindo', 'assistido'].includes(corpo.status)) {
    erros.push('Escolha um status válido (assistido, assistindo ou quero).')
  }

  const nota = Number(corpo.nota)
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    erros.push('A nota deve ser um número inteiro entre 1 e 5.')
  }

  return erros
}

app.post('/filmes', (req, res) => {
  const erros = validarFilme(req.body)

  if (erros.length > 0) {
    return res.status(400).json({ erros })
  }

  const filmes = lerFilmes()
  const novoId = filmes.reduce((max, filme) => Math.max(max, filme.id), 0) + 1

  const novoFilme = {
    id: novoId,
    titulo: req.body.titulo,
    ano: Number(req.body.ano),
    genero: req.body.genero,
    poster: req.body.poster || '',
    nota: Number(req.body.nota),
    status: req.body.status,
    comentario: req.body.comentario || ''
  }

  filmes.push(novoFilme)
  salvarFilmes(filmes)

  res.status(201).json(novoFilme)
})

app.put('/filmes/:id', (req, res) => {
  const id = Number(req.params.id)

  // Mesma validação do POST: o corpo do PUT vem completo do formulário
  // de edição, então os mesmos campos são obrigatórios.
  const erros = validarFilme(req.body)

  if (erros.length > 0) {
    return res.status(400).json({ erros })
  }

  const filmes = lerFilmes()
  const indice = filmes.findIndex((filme) => filme.id === id)

  if (indice === -1) {
    return res.status(404).json({ erro: `Filme com id ${req.params.id} não encontrado` })
  }

  // O id da URL prevalece sobre qualquer id vindo do corpo.
  const filmeAtualizado = { ...filmes[indice], ...req.body, id }

  filmes[indice] = filmeAtualizado
  salvarFilmes(filmes)

  res.json(filmeAtualizado)
})

app.delete('/filmes/:id', (req, res) => {
  const id = Number(req.params.id)

  const filmes = lerFilmes()
  const indice = filmes.findIndex((filme) => filme.id === id)

  if (indice === -1) {
    return res.status(404).json({ erro: `Filme com id ${req.params.id} não encontrado` })
  }

  filmes.splice(indice, 1)
  salvarFilmes(filmes)

  res.status(204).end()
})

// ---------------------------------------------------------------------------
// GET /tmdb/search?q=texto — busca filmes na API pública do TMDB (opcional).
// Requer TMDB_API_KEY no .env (https://www.themoviedb.org/settings/api).
// ---------------------------------------------------------------------------
const CHAVE_TMDB = process.env.TMDB_API_KEY

app.get('/tmdb/search', async (req, res) => {
  if (!CHAVE_TMDB) {
    return res.status(503).json({
      erro: 'TMDB_API_KEY não configurada no .env do backend.'
    })
  }

  const { q } = req.query

  if (!q || !String(q).trim()) {
    return res.status(400).json({ erro: 'Informe o parâmetro de busca ?q=' })
  }

  const url =
    `https://api.themoviedb.org/3/search/movie` +
    `?api_key=${CHAVE_TMDB}&language=pt-BR&query=${encodeURIComponent(q)}`

  try {
    const resposta = await fetch(url)

    if (!resposta.ok) {
      return res.status(502).json({
        erro: `TMDB respondeu com status ${resposta.status}`
      })
    }

    const dados = await resposta.json()

    // Mapeia para o formato enxuto usado pelo CineTrack.
    const resultados = (dados.results || []).map((filme) => ({
      id_tmdb: filme.id,
      titulo: filme.title,
      ano: filme.release_date ? Number(filme.release_date.slice(0, 4)) : null,
      sinopse: filme.overview || '',
      poster: filme.poster_path
        ? `https://image.tmdb.org/t/p/w300${filme.poster_path}`
        : ''
    }))

    res.json(resultados)
  } catch (erroRede) {
    res.status(502).json({
      erro: `Falha ao contatar o TMDB: ${erroRede.message}`
    })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor do CineTrack rodando em http://localhost:${PORT}`)
})
