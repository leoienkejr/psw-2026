import Titulo from './Titulo.jsx'

function Header({ busca, aoDigitar, aoAdicionar }) {
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

      <button
        type="button"
        className="btn-adicionar"
        onClick={aoAdicionar}
      >
        <span className="btn-adicionar-curto" aria-label="Adicionar filme">+</span>
        <span className="btn-adicionar-longo">+ Adicionar</span>
      </button>
    </header>
  )
}

export default Header