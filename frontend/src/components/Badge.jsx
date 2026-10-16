function rotuloStatus(status) {
  if (status === "assistido") return "Assistido"
  if (status === "assistindo") return "Assistindo"
  if (status === "quero") return "Quero assistir"
  return status
}

function Badge({ status }) {
  return <span className={`badge ${status}`}>{rotuloStatus(status)}</span>
}

export default Badge
