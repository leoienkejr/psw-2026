import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Filtros from './components/Filtros.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'
import ModalFilme from './components/ModalFilme.jsx'
import { gerarId } from './data/filmes.js'
import { listar } from './api.js'

function App() {
  const [filmes, setFilmes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [status, setStatus] = useState('todos')
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [filmeEditando, setFilmeEditando] = useState(null)

  useEffect(() => {
    listar()
      .then((dados) => {
        setFilmes(dados)
      })
      .catch((motivo) => {
        setErro(motivo.message)
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [])

  useEffect(() => {
    const sufixo = filmes.length === 1 ? 'filme' : 'filmes'
    document.title = `CineTrack (${filmes.length} ${sufixo})`
  }, [filmes])

  const visiveis = filmes.filter((filme) => {
    const casaStatus = status === 'todos' || filme.status === status
    const casaBusca = filme.titulo.toLowerCase().includes(busca.toLowerCase())
    return casaStatus && casaBusca
  })

  function adicionar(dados) {
    setFilmes([...filmes, { id: gerarId(filmes), ...dados }])
  }

  function remover(id) {
    setFilmes(filmes.filter((filme) => filme.id !== id))
  }

  function editar(id, alteracoes) {
    setFilmes(
      filmes.map((filme) =>
        filme.id === id ? { ...filme, ...alteracoes } : filme
      )
    )
  }

  function abrirModalNovo() {
    setFilmeEditando(null)
    setModalAberto(true)
  }

  function abrirModalEdicao(filme) {
    setFilmeEditando(filme)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setFilmeEditando(null)
  }

  function salvarModal(dados) {
    if (filmeEditando === null) {
      adicionar(dados)
    } else {
      editar(filmeEditando.id, dados)
    }
    fecharModal()
  }

  return (
    <>
      <Header
        busca={busca}
        aoDigitar={setBusca}
        aoAdicionar={abrirModalNovo}
      />

      <Filtros
        ativo={status}
        aoMudar={setStatus}
      />

      <main>
        {carregando ? (
          <section id="lista" aria-live="polite">
            <p className="carregando">Carregando filmes…</p>
          </section>
        ) : erro ? (
          <section id="lista" aria-live="assertive">
            <p className="erro" role="alert">{erro}</p>
          </section>
        ) : (
          <section id="lista" aria-live="polite">
            {filmes.length === 0 ? (
              <p className="vazio">Nenhum filme cadastrado ainda.</p>
            ) : (
              <ListaFilmes
                filmes={visiveis}
                aoEditar={abrirModalEdicao}
                aoRemover={remover}
              />
            )}
          </section>
        )}
      </main>

      {modalAberto && (
        <ModalFilme
          filme={filmeEditando}
          aoSalvar={salvarModal}
          aoFechar={fecharModal}
        />
      )}

      <footer>
        <small>
          © {new Date().getFullYear()} CineTrack — projeto integrador.
        </small>
      </footer>
    </>
  )
}

export default App