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
// Os botões disparam os callbacks recebidos do App:
// Editar abre o modal com os dados preenchidos; Remover exclui na hora.
function CardFilme({ filme, aoEditar, aoRemover }) {
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