import Titulo from './Titulo.jsx'

// Cabeçalho com busca e botão de adicionar.
// Ainda sem eventos: os handlers entram nas etapas seguintes.
function Header() {
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