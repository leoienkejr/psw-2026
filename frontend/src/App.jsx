import { useState } from 'react'
import Header from './components/Header.jsx'
import Filtros from './components/Filtros.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'
import { filmesIniciais } from './data/filmes.js'

function App() {
  // Estado inicial: os seis filmes da Parte 1.
  // Sem eventos ainda — o setFilmes será usado nas etapas seguintes.
  const [filmes, setFilmes] = useState(filmesIniciais)

  // Estado elevado do filtro: qual status está ativo ("todos" por padrão).
  const [status, setStatus] = useState('todos')

  // Termo da busca em minúsculas; "" = sem filtro de busca (como na Parte 1).
  const [busca, setBusca] = useState('')

  // Visíveis = filmes que combinam o status ativo E o termo da busca.
  // (mesma lógica de aplicarFiltros() da Parte 1, agora derivada do estado)
  const visiveis = filmes.filter((filme) => {
    const casaStatus = status === 'todos' || filme.status === status
    const casaBusca = filme.titulo.toLowerCase().includes(busca.toLowerCase())
    return casaStatus && casaBusca
  })

  return (
    <>
      <Header
        busca={busca}
        aoDigitar={setBusca}
      />

      <Filtros
        ativo={status}
        aoMudar={setStatus}
      />

      <main>
        <section id="lista" aria-live="polite">
          <ListaFilmes filmes={visiveis} />
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