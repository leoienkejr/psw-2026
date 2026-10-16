function Titulo({ nome = 'CineTrack', subtitulo = 'Catálogo pessoal de filmes.' }) {
  return (
    <div className="titulo">
      <h1>{nome}</h1>
      <p className="titulo-subtitulo">{subtitulo}</p>
    </div>
  )
}

export default Titulo