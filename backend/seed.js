// seed.js (Aula 6): grava os 6 filmes iniciais do CineTrack em data/filmes.json.
// Os dados são os mesmos do frontend (frontend/src/data/filmes.js),
// que por sua vez foram copiados de cinetrack/parte1/app.js.
// As chaves são sem acento: id, titulo, ano, genero, nota, status, comentario e poster.

const fs = require('fs')
const path = require('path')

const filmes = [
  {
    id: 1,
    titulo: 'A Origem',
    ano: 2010,
    genero: 'Ficção científica',
    poster: 'https://image.tmdb.org/t/p/w300/9e3Dz7aCANy5aRUQF745IlNloJ1.jpg',
    nota: 5,
    status: 'assistido',
    comentario: 'A camada do sonho dentro do sonho continua impecável.'
  },
  {
    id: 2,
    titulo: 'Parasita',
    ano: 2019,
    genero: 'Drama, Suspense',
    poster: 'https://image.tmdb.org/t/p/w300/bNGW8zYA91VqTZfV3jnKHPEKKvB.jpg',
    nota: 5,
    status: 'assistido',
    comentario: 'Virada de tom brilhante, nada do que eu esperava.'
  },
  {
    id: 3,
    titulo: 'O Auto da Compadecida',
    ano: 2000,
    genero: 'Comédia',
    poster: 'https://image.tmdb.org/t/p/w300/y3IhuITELtprMhUd7bccu629rba.jpg',
    nota: 4,
    status: 'assistido',
    comentario: 'João Grilo e o Major: clássico do cinema nacional.'
  },
  {
    id: 4,
    titulo: 'Duna: Parte Dois',
    ano: 2024,
    genero: 'Ficção científica',
    poster: 'https://image.tmdb.org/t/p/w300/VMy4UGsI2u3f4fALGeCqCdsQBb.jpg',
    nota: 4,
    status: 'assistindo',
    comentario: 'Parei no meio para ver de novo com som melhor.'
  },
  {
    id: 5,
    titulo: 'Interestelar',
    ano: 2014,
    genero: 'Ficção científica',
    poster: 'https://image.tmdb.org/t/p/w300/tR1XVa5bxgdh2bRw2u0DzrgkO2l.jpg',
    nota: 5,
    status: 'quero',
    comentario: 'Todo mundo diz que preciso rever na telona.'
  },
  {
    id: 6,
    titulo: 'Cidade de Deus',
    ano: 2002,
    genero: 'Drama',
    poster: 'https://image.tmdb.org/t/p/w300/gfnXixcGC060QcG6JPxN6AMdVsq.jpg',
    nota: 5,
    status: 'assistido',
    comentario: 'Fotografia e ritmo: um marco brasileiro.'
  }
]

// Caminho do arquivo de dados: backend/data/filmes.json.
// path.join evita juntar strings na mão e funciona em qualquer sistema operacional.
const pastaDados = path.join(__dirname, 'data')
const caminhoArquivo = path.join(pastaDados, 'filmes.json')

// Cria a pasta data/ se ela não existir (recursive evita erro se já existir).
fs.mkdirSync(pastaDados, { recursive: true })

// Grava o JSON formatado com 2 espaços de indentação para ficar legível.
fs.writeFileSync(caminhoArquivo, JSON.stringify(filmes, null, 2), 'utf-8')

// Confirmação no terminal com a quantidade de filmes gravados.
console.log(`Seed concluído: ${filmes.length} filmes gravados em ${caminhoArquivo}`)