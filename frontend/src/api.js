// Cliente da API real (backend Express). O mock foi removido.
//
// A URL base pode ser ajustada criando frontend/.env com:
//   VITE_API_URL=http://localhost:3000
// Sem essa variável, usa-se o endereço padrão do backend da disciplina.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Função central: faz a requisição, converte o corpo e transforma
// respostas de erro (4xx/5xx) em exceções com a mensagem do backend.
async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  })

  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null)

    // Erro de validação do servidor (400) devolve { erros: [...] } com
    // todos os problemas de uma vez; junta as mensagens para exibí-las.
    const mensagem = Array.isArray(corpo?.erros)
      ? corpo.erros.join(' ')
      : (corpo?.erro || `Erro ${resposta.status}: ${resposta.statusText}`)

    throw new Error(mensagem)
  }

  // DELETE devolve 204 sem corpo.
  if (resposta.status === 204) return null

  return resposta.json()
}

export async function listar() {
  return requisicao('/filmes')
}

export async function criar(filme) {
  return requisicao('/filmes', {
    method: 'POST',
    body: JSON.stringify(filme),
  })
}

export async function atualizar(id, alteracoes) {
  return requisicao(`/filmes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(alteracoes),
  })
}

export async function removerFilme(id) {
  return requisicao(`/filmes/${id}`, {
    method: 'DELETE',
  })
}
