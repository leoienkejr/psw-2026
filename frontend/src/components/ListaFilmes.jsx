import CardFilme from './CardFilme.jsx'

// Recebe a lista de filmes e renderiza um card para cada um.
// Lista vazia (sem cadastros, filtro ou busca sem resultados):
// mostra mensagem em vez de área em branco.
function ListaFilmes({ filmes }) {
  if (filmes.length === 0) {
    return <p className="vazio">Nenhum filme neste filtro.</p>
  }

  return (
    <>
      {filmes.map((filme) => (
        <CardFilme key={filme.id} filme={filme} />
      ))}
    </>
  )
}

export default ListaFilmes