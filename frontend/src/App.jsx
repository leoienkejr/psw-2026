import { useState } from 'react'
import Header from './components/Header.jsx'
import Filtros from './components/Filtros.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'
import { filmesIniciais } from './data/filmes.js'

function App() {
  // Estado inicial: os seis filmes da Parte 1.
  // Sem eventos ainda — o setFilmes será usado nas etapas seguintes.
  const [filmes, setFilmes] = useState(filmesIniciais)

  return (
    <>
      <Header />

      <Filtros />

      <main>
        <section id="lista" aria-live="polite">
          <ListaFilmes filmes={filmes} />
        </section>
      </main>

      <footer>
        <small>
          © {new Date().getFullYear()} CineTrack — projeto integrador.
        </small>
      </footer>
    </>
  )
}

export default App