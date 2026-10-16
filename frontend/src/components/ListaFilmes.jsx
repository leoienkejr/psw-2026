import CardFilme from './CardFilme.jsx'

function ListaFilmes({ filmes, aoEditar, aoRemover }) {
  if (filmes.length === 0) {
    return <p className="vazio">Nenhum filme neste filtro.</p>
  }

  return (
    <>
      {filmes.map((filme) => (
        <CardFilme
          key={filme.id}
          filme={filme}
          aoEditar={aoEditar}
          aoRemover={aoRemover}
        />
      ))}
    </>
  )
}

export default ListaFilmes