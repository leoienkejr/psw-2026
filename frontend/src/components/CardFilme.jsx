import Estrelas from './Estrelas.jsx'
import Badge from './Badge.jsx'

function CardFilme({ filme, aoEditar, aoRemover }) {
  return (
    <article className="card" data-id={filme.id}>
      <img src={filme.poster} alt={`Pôster do filme ${filme.titulo}`} />
      <h2>{filme.titulo}</h2>
      <p>
        {filme.ano} · {filme.genero}
      </p>
      <Estrelas nota={filme.nota} />
      <Badge status={filme.status} />
      <button type="button" className="btn-editar" onClick={() => aoEditar(filme)}>
        Editar
      </button>
      <button type="button" className="btn-remover" onClick={() => aoRemover(filme.id)}>
        Remover
      </button>
    </article>
  )
}

export default CardFilme