// Mock da API (Aula 5): simula o GET /filmes que um backend real atenderia.
// Por enquanto devolve os dados em memória da Atividade 4, mas a assinatura
// já é a de uma chamada assíncrona: listar() devolve uma Promise.

import { filmesIniciais } from './data/filmes.js'

// Chave de teste do item 6: quando true, listar lança um erro
// e o App deve exibir a mensagem de falha em vez da lista.
const SIMULAR_FALHA = false

// Simula a latência da rede: a Promise resolve depois de 800 ms.
const ATRASO_MS = 800

// Lista os filmes. Sucesso: resolve com uma CÓPIA da lista (como viria
// do servidor). Falha: lança um Error, que vira a Promise rejeitada
// capturada pelo .catch do App.
export function listar() {
  return new Promise((resolver, rejeitar) => {
    setTimeout(() => {
      if (SIMULAR_FALHA) {
        rejeitar(new Error('Não foi possível carregar os filmes.'))
        return
      }
      // Cópia rasa para não compartilhar a referência do mock com a UI.
      resolver([...filmesIniciais])
    }, ATRASO_MS)
  })
}
