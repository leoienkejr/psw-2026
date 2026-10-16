// Funções auxiliares puras herdadas da Parte 1
function rotuloStatus(status) {
  if (status === "assistido") return "Assistido"
  if (status === "assistindo") return "Assistindo"
  if (status === "quero") return "Quero assistir"
  return status
}

const estrelas = (nota) => {
  let texto = ""
  for (let i = 1; i <= 5; i++) {
    texto += i <= nota ? "★" : "☆"
  }
  return texto
}

// Recebe um único objeto filme por props e o desenha como card.
// Os botões Editar/Remover ainda não têm eventos (etapas seguintes).
function CardFilme({ filme }) {
  return (
    <article className="card" data-id={filme.id}>
      <img src={filme.poster} alt={`Pôster do filme ${filme.titulo}`} />
      <h2>{filme.titulo}</h2>
      <p>
        {filme.ano} · {filme.genero}
      </p>
      <span className="estrelas" aria-label={`Nota ${filme.nota} de 5`}>
        {estrelas(filme.nota)}
      </span>
      <span className={`badge ${filme.status}`}>{rotuloStatus(filme.status)}</span>
      <button type="button" className="btn-editar">
        Editar
      </button>
      <button type="button" className="btn-remover">
        Remover
      </button>
    </article>
  )
}

export default CardFilme