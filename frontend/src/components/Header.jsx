import Titulo from './Titulo.jsx'

// Cabeçalho com busca controlada e botão de adicionar.
// O valor do campo vem de App (estado busca) e cada tecla sobe
// pelo handler aoDigitar via onChange.
function Header({ busca, aoDigitar }) {
  return (
    <header>
      <Titulo
        nome="CineTrack"
        subtitulo="Catálogo pessoal de filmes — o que você já viu, está vendo e quer ver."
      />

      <input
        type="search"
        id="busca"
        aria-label="Buscar filme por título"
        placeholder="Buscar filme..."
        value={busca}
        onChange={(evento) => aoDigitar(evento.target.value)}
      />

      {/* O "+" curto aparece em telas menores; o longo a partir de 1024px. */}
      <button type="button" className="btn-adicionar">
        <span className="btn-adicionar-curto" aria-label="Adicionar filme">+</span>
        <span className="btn-adicionar-longo">+ Adicionar</span>
      </button>
    </header>
  )
}

export default Header