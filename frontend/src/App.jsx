import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Filtros from './components/Filtros.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'
import ModalFilme from './components/ModalFilme.jsx'
import { gerarId } from './data/filmes.js'
import { listar } from './api.js'

function App() {
  // Estado inicial vazio (Aula 5): os filmes agora chegam da "API"
  // e não do import direto de dados.
  const [filmes, setFilmes] = useState([])

  // Estados do ciclo de carregamento: carregando enquanto a promessa
  // está pendente; erro com a mensagem caso listar() falhe.
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  // Estado elevado do filtro: qual status está ativo ("todos" por padrão).
  const [status, setStatus] = useState('todos')

  // Termo da busca em minúsculas; "" = sem filtro de busca (como na Parte 1).
  const [busca, setBusca] = useState('')

  // Controle do modal: aberto/fechado e qual filme está em edição
  // (null = modo inclusão).
  const [modalAberto, setModalAberto] = useState(false)
  const [filmeEditando, setFilmeEditando] = useState(null)

  // Item 3: carregar os filmes em um efeito com dependências vazias.
  // O efeito roda UMA VEZ, logo após a primeira renderização — é o
  // lugar certo para efeitos colaterais como buscas na "API".
  //
  // Item 7: listar() NUNCA é chamada no corpo do componente. Se fosse
  // (ex.: const filmes = listar()), ela dispararia em TODA renderização
  // (cada tecla da busca, cada clique) e a resposta assíncrona chegaria
  // depois, sem forma de colocar o resultado no estado. No efeito, a
  // chamada acontece uma vez e os .then/.catch atualizam o estado.
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

  // Item 5: sincronizar document.title com o total de filmes.
  // Depende de filmes: roda de novo sempre que a lista mudar
  // (inclusive ao adicionar/remover pelo CRUD da Atividade 4).
  useEffect(() => {
    const sufixo = filmes.length === 1 ? 'filme' : 'filmes'
    document.title = `CineTrack (${filmes.length} ${sufixo})`
  }, [filmes])

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
        {/* Item 4: quatro estados possíveis, na ordem de prioridade:
            carregando → erro → vazio → lista. */
        carregando ? (
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