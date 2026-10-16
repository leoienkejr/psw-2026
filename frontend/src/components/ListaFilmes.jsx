import CardFilme from './CardFilme.jsx'

// Recebe a lista de filmes e renderiza um card para cada um.
// Repassa os callbacks de editar/remover para cada card.
// Lista vazia (sem cadastros, filtro ou busca sem resultados):
// mostra mensagem em vez de área em branco.
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