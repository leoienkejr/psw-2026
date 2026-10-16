import { useEffect, useState } from 'react'

// Estado inicial do formulário. Tudo em string (o que o usuário digita);
// ano e nota são convertidos para número apenas no envio.
// Se um filme foi passado, o modal abre em modo edição preenchido;
// se não, abre vazio em modo inclusão.
function formularioInicial(filme) {
  return {
    titulo: filme?.titulo ?? '',
    ano: filme !== null && filme.ano !== undefined ? String(filme.ano) : '',
    genero: filme?.genero ?? '',
    poster: filme?.poster ?? '',
    status: filme?.status ?? 'quero',
    nota: filme?.nota ? String(filme.nota) : '',
    comentario: filme?.comentario ?? '',
  }
}

// Mesmas regras de validarFilme() da Parte 1, agora sobre o objeto já
// convertido (ano e nota numéricos).
function validarFilme(dados) {
  const erros = []

  if (!dados.titulo || dados.titulo.trim() === '') {
    erros.push('Informe o título.')
  }
  if (!Number.isInteger(dados.ano) || dados.ano < 1888 || dados.ano > 2030) {
    erros.push('O ano deve ser um número inteiro entre 1888 e 2030.')
  }
  if (!dados.genero || dados.genero.trim() === '') {
    erros.push('Informe o gênero.')
  }
  if (!['quero', 'assistindo', 'assistido'].includes(dados.status)) {
    erros.push('Escolha um status válido.')
  }
  if (dados.nota !== 0 && (dados.nota < 1 || dados.nota > 5)) {
    erros.push('A nota deve ser de 1 a 5.')
  }

  return erros
}

// Modal controlado: um único objeto de estado guarda todos os campos,
// e cada input escreve nele via onChange com o atributo name.
function ModalFilme({ filme, aoSalvar, aoFechar }) {
  // filme === null → inclusão; filme é objeto → edição
  const editando = filme !== null

  const [form, setForm] = useState(() => formularioInicial(filme))
  const [erros, setErros] = useState([])

  // Handler único: o name do campo vira a chave do objeto de estado.
  function aoMudar(evento) {
    const { name, value } = evento.target
    setForm({ ...form, [name]: value })
  }

  // Escape fecha o modal, como na Parte 1.
  useEffect(() => {
    function aoTeclar(evento) {
      if (evento.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aoFechar])

  function aoEnviar(evento) {
    evento.preventDefault()

    // Conversão dos campos numéricos: ano e nota chegam como string;
    // nota vazia vira 0 (sem nota), como na Parte 1.
    const dados = {
      titulo: form.titulo.trim(),
      ano: Number(form.ano),
      genero: form.genero.trim(),
      poster: form.poster.trim(),
      status: form.status,
      nota: form.nota === '' ? 0 : Number(form.nota),
      comentario: form.comentario,
    }

    const errosDaValidacao = validarFilme(dados)
    if (errosDaValidacao.length > 0) {
      setErros(errosDaValidacao)
      return
    }

    // O App decide se inclui ou edita a partir de filmeEditando.
    aoSalvar(dados)
  }

  return (
    <div className="modal">
      <div className="modal-conteudo" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <h2 id="modal-titulo">{editando ? 'Editar filme' : 'Adicionar filme'}</h2>

        <button type="button" className="modal-fechar" aria-label="Fechar" onClick={aoFechar}>
          ×
        </button>

        {erros.length > 0 && (
          <ul className="erros" role="alert">
            {erros.map((erro) => (
              <li key={erro}>{erro}</li>
            ))}
          </ul>
        )}

        <form id="form-filme" onSubmit={aoEnviar}>
          <label htmlFor="titulo-filme">Título</label>
          <input
            type="text"
            id="titulo-filme"
            name="titulo"
            value={form.titulo}
            onChange={aoMudar}
            autoFocus
          />

          <label htmlFor="ano-filme">Ano</label>
          <input
            type="number"
            id="ano-filme"
            name="ano"
            min="1888"
            max="2030"
            value={form.ano}
            onChange={aoMudar}
          />

          <label htmlFor="genero-filme">Gênero</label>
          <input
            type="text"
            id="genero-filme"
            name="genero"
            value={form.genero}
            onChange={aoMudar}
          />

          <label htmlFor="url-poster-filme">URL do pôster</label>
          <input
            type="text"
            id="url-poster-filme"
            name="poster"
            value={form.poster}
            onChange={aoMudar}
          />

          {/* O select usa os valores internos ("quero", "assistindo", "assistido") */}
          <label htmlFor="status-filme">Status</label>
          <select id="status-filme" name="status" value={form.status} onChange={aoMudar}>
            <option value="quero">Quero assistir</option>
            <option value="assistindo">Assistindo</option>
            <option value="assistido">Assistido</option>
          </select>

          <label htmlFor="nota-filme">Nota</label>
          <input
            type="number"
            id="nota-filme"
            name="nota"
            min="1"
            max="5"
            value={form.nota}
            onChange={aoMudar}
          />

          <label htmlFor="comentario-filme">Comentário</label>
          <textarea
            id="comentario-filme"
            name="comentario"
            value={form.comentario}
            onChange={aoMudar}
          />

          <button type="button" onClick={aoFechar}>
            Cancelar
          </button>
          <button type="submit">{editando ? 'Salvar alterações' : 'Salvar'}</button>
        </form>
      </div>
    </div>
  )
}

export default ModalFilme