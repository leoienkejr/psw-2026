// server.js (Aula 2): primeiro servidor HTTP do backend do CineTrack.
// Serve os dados de data/filmes.json criados pelo seed.js.

// Importa o Express instalado na Aula 1 (npm install express).
const express = require('express')

// morgan é o middleware de logger: imprime no terminal cada requisição recebida.
// O formato "dev" mostra método, rota, status e tempo de resposta coloridos.
const morgan = require('morgan')

// fs lê arquivos do disco; path monta caminhos de forma segura entre SOs.
const fs = require('fs')
const path = require('path')

// Cria a aplicação Express.
const app = express()

// 1) Logger: registra toda requisição no terminal (equivalente ao express.logger()).
app.use(morgan('dev'))

// 2) Parser de JSON: permite que o app entenda corpos de requisição em JSON
// (necessário nas próximas aulas para POST/PUT/PATCH).
app.use(express.json())

// Helper lerFilmes(): lê data/filmes.json e devolve o array de filmes.
// path.join(__dirname, 'data', 'filmes.json') aponta para a pasta do server.js,
// então o servidor funciona a partir de qualquer diretório onde seja executado.
// JSON.parse converte o texto do arquivo em array de objetos JavaScript.
function lerFilmes() {
  const caminhoArquivo = path.join(__dirname, 'data', 'filmes.json')
  const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8')
  return JSON.parse(conteudo)
}

// GET /filmes: devolve a lista completa em JSON.
// Se vier ?status=assistido (ou assistindo/quero), filtra antes de responder.
// Ex.: GET /filmes?status=assistido
app.get('/filmes', (req, res) => {
  // req.query guarda os parâmetros depois do "?" da URL.
  const { status } = req.query

  let filmes = lerFilmes()

  if (status) {
    // case insensitive: ignora maiúsculas/minúsculas do filtro.
    filmes = filmes.filter(
      (filme) => filme.status.toLowerCase() === String(status).toLowerCase()
    )
  }

  // res.json serializa o array como JSON e já envia status 200.
  res.json(filmes)
})

// GET /filmes/:id: devolve um filme específico ou 404 se não existir.
// :id é um parâmetro de rota; o Express o entrega em req.params.id (como string).
app.get('/filmes/:id', (req, res) => {
  const id = Number(req.params.id)

  // Busca o filme pelo id no array lido do arquivo.
  const filme = lerFilmes().find((filme) => filme.id === id)

  // Se não achou, responde 404 (Not Found) com uma mensagem JSON.
  if (!filme) {
    return res.status(404).json({ erro: `Filme com id ${req.params.id} não encontrado` })
  }

  // Se achou, responde 200 com o objeto do filme.
  res.json(filme)
})

// Porta do servidor: usa a variável de ambiente PORT se existir, senão 3000.
const PORT = process.env.PORT || 3000

// Sobe o servidor e avisa no terminal.
app.listen(PORT, () => {
  console.log(`Servidor do CineTrack rodando em http://localhost:${PORT}`)
})
