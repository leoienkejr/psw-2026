import { filmesIniciais } from './data/filmes.js'

// Chave de teste: quando true, listar() falha para exercitar o tratamento de erro.
const SIMULAR_FALHA = false

const ATRASO_MS = 800

export function listar() {
  return new Promise((resolver, rejeitar) => {
    setTimeout(() => {
      if (SIMULAR_FALHA) {
        rejeitar(new Error('Não foi possível carregar os filmes.'))
        return
      }
      resolver([...filmesIniciais])
    }, ATRASO_MS)
  })
}
