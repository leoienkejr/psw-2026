import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Filtros from './components/Filtros.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'
import ModalFilme from './components/ModalFilme.jsx'
import { listar, criar, atualizar, removerFilme as removerFilmeNaApi } from './api.js'

// Status aceitos pelos botões de filtro; usado para sanitizar o valor
// restaurado do localStorage.
const STATUS_VALIDOS = new Set(['todos', 'assistido', 'assistindo', 'quero'])

function App() {
  const [filmes, setFilmes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [erroAcao, setErroAcao] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [filmeEditando, setFilmeEditando] = useState(null)

  // Inicializador preguiçoso: a função roda UMA vez, no primeiro render,
  // e evita ler o localStorage a cada atualização do componente.
  const [status, setStatus] = useState(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem('cinetrack:filtros'))
      return STATUS_VALIDOS.has(salvo?.status) ? salvo.status : 'todos'
    } catch {
      // Chave ausente ou JSON corrompido: cai no padrão.
      return 'todos'
    }
  })

  const [busca, setBusca] = useState(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem('cinetrack:filtros'))
      return typeof salvo?.busca === 'string' ? salvo.busca : ''
    } catch {
      // Chave ausente ou JSON corrompido: cai no padrão.
      return ''
    }
  })

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

  // Persiste as preferências de interface (não os filmes, que vêm da API)
  // sempre que busca ou status mudam. Os filmes continuam vindo de api.js.
  useEffect(() => {
    localStorage.setItem(
      'cinetrack:filtros',
      JSON.stringify({ busca, status })
    )
  }, [busca, status])

  const visiveis = filmes.filter((filme) => {
    const casaStatus = status === 'todos' || filme.status === status
    const casaBusca = filme.titulo.toLowerCase().includes(busca.toLowerCase())
    return casaStatus && casaBusca
  })

  async function adicionar(dados) {
    setErroAcao(null)
    try {
      // Primeiro a API; o estado só é atualizado com o filme já salvo no
      // backend (inclusive o id, que agora é gerado por ele).
      const novoFilme = await criar(dados)
      setFilmes([...filmes, novoFilme])
      return true
    } catch (motivo) {
      setErroAcao(`Não foi possível salvar o filme: ${motivo.message}`)
      return false
    }
  }

  async function removerFilme(id) {
    setErroAcao(null)
    try {
      await removerFilmeNaApi(id)
      setFilmes(filmes.filter((filme) => filme.id !== id))
      return true
    } catch (motivo) {
      setErroAcao(`Não foi possível remover o filme: ${motivo.message}`)
      return false
    }
  }

  async function editar(id, alteracoes) {
    setErroAcao(null)
    try {
      const filmeAtualizado = await atualizar(id, alteracoes)
      setFilmes(
        filmes.map((filme) => (filme.id === id ? filmeAtualizado : filme))
      )
      return true
    } catch (motivo) {
      setErroAcao(`Não foi possível atualizar o filme: ${motivo.message}`)
      return false
    }
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

  async function salvarModal(dados) {
    const sucesso =
      filmeEditando === null
        ? await adicionar(dados)
        : await editar(filmeEditando.id, dados)

    // Só fecha o modal quando a operação deu certo; em caso de erro,
    // a mensagem aparece e o usuário pode corrigir os dados.
    if (sucesso) {
      fecharModal()
    }
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

      {/* Derivado no render: nada de useState novo. */}
      <p className="contador" aria-live="polite">
        Exibindo {visiveis.length} de {filmes.length} filmes
      </p>

      <main>
        {erroAcao && (
          <p className="erro" role="alert">{erroAcao}</p>
        )}

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
                aoRemover={removerFilme}
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
