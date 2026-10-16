const estrelas = (nota) => {
  let texto = ""
  for (let i = 1; i <= 5; i++) {
    texto += i <= nota ? "★" : "☆"
  }
  return texto
}

function Estrelas({ nota }) {
  return (
    <span className="estrelas" aria-label={`Nota ${nota} de 5`}>
      {estrelas(nota)}
    </span>
  )
}

export default Estrelas
