const FILTROS = [
  { status: 'todos', rotulo: 'Todos' },
  { status: 'assistido', rotulo: 'Assistido' },
  { status: 'assistindo', rotulo: 'Assistindo' },
  { status: 'quero', rotulo: 'Quero assistir' },
]

function Filtros({ ativo, aoMudar }) {
  return (
    <nav aria-label="Filtros de status">
      {FILTROS.map(({ status, rotulo }) => (
        <button
          key={status}
          type="button"
          data-status={status}
          className={status === ativo ? 'ativo' : ''}
          aria-pressed={status === ativo}
          onClick={() => aoMudar(status)}
        >
          {rotulo}
        </button>
      ))}
    </nav>
  )
}

export default Filtros