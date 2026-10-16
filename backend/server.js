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
  const { status } = req.query

  let filmes = lerFilmes()

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

app.post('/filmes', (req, res) => {
  const { titulo, ano } = req.body

  if (!titulo || !ano) {
    return res.status(400).json({ erro: 'Informe título e ano do filme' })
  }

  const filmes = lerFilmes()
  const novoId = filmes.reduce((max, filme) => Math.max(max, filme.id), 0) + 1

  const novoFilme = {
    id: novoId,
    titulo,
    ano,
    genero: req.body.genero || '',
    poster: req.body.poster || '',
    nota: req.body.nota || 0,
    status: req.body.status || 'quero',
    comentario: req.body.comentario || ''
  }

  filmes.push(novoFilme)
  salvarFilmes(filmes)

  res.status(201).json(novoFilme)
})

app.put('/filmes/:id', (req, res) => {
  const id = Number(req.params.id)

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

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor do CineTrack rodando em http://localhost:${PORT}`)
})
