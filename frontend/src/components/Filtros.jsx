// Filtros de status. Ainda sem eventos: a troca do botão ativo
// e a filtragem da lista serão ligadas nas etapas seguintes.
const FILTROS = [
  { status: 'todos', rotulo: 'Todos' },
  { status: 'assistido', rotulo: 'Assistido' },
  { status: 'assistindo', rotulo: 'Assistindo' },
  { status: 'quero', rotulo: 'Quero assistir' },
]

function Filtros() {
  return (
    <nav aria-label="Filtros de status">
      {FILTROS.map(({ status, rotulo }) => (
        <button key={status} type="button" data-status={status} className={status === 'todos' ? 'ativo' : ''}>
          {rotulo}
        </button>
      ))}
    </nav>
  )
}

export default Filtros