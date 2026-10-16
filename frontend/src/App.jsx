import { useState } from 'react'
import Header from './components/Header.jsx'
import Filtros from './components/Filtros.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'
import ModalFilme from './components/ModalFilme.jsx'
import { filmesIniciais, gerarId } from './data/filmes.js'

function App() {
  // Estado inicial: os seis filmes da Parte 1.
  const [filmes, setFilmes] = useState(filmesIniciais)

  // Estado elevado do filtro: qual status está ativo ("todos" por padrão).
  const [status, setStatus] = useState('todos')

  // Termo da busca em minúsculas; "" = sem filtro de busca (como na Parte 1).
  const [busca, setBusca] = useState('')

  // Controle do modal: aberto/fechado e qual filme está em edição
  // (null = modo inclusão).
  const [modalAberto, setModalAberto] = useState(false)
  const [filmeEditando, setFilmeEditando] = useState(null)

  // Visíveis = filmes que combinam o status ativo E o termo da busca.
  const visiveis = filmes.filter((filme) => {
    const casaStatus = status === 'todos' || filme.status === status
    const casaBusca = filme.titulo.toLowerCase().includes(busca.toLowerCase())
    return casaStatus && casaBusca
  })

  // Inclusão: novo objeto com id gerado no fim da lista (imutabilidade).
  function adicionar(dados) {
    setFilmes([...filmes, { id: gerarId(filmes), ...dados }])
  }

  // Remoção: mantém apenas os filmes de id diferente.
  function remover(id) {
    setFilmes(filmes.filter((filme) => filme.id !== id))
  }

  // Edição: troca só o filme de mesmo id por uma cópia com as alterações.
  function editar(id, alteracoes) {
    setFilmes(
      filmes.map((filme) =>
        filme.id === id ? { ...filme, ...alteracoes } : filme
      )
    )
  }

  // Abre o modal em modo inclusão (sem filme para editar).
  function abrirModalNovo() {
    setFilmeEditando(null)
    setModalAberto(true)
  }

  // Abre o modal em modo edição, com os dados do filme escolhido.
  function abrirModalEdicao(filme) {
    setFilmeEditando(filme)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setFilmeEditando(null)
  }

  // Envio do modal: decide entre incluir e editar e fecha em seguida.
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
        <section id="lista" aria-live="polite">
          <ListaFilmes
            filmes={visiveis}
            aoEditar={abrirModalEdicao}
            aoRemover={remover}
          />
        </section>
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