// ANP 05 — funções puras de estatística sobre a coleção de filmes.
// Nenhuma delas toca o DOM nem usa console.log: recebem a lista,
// devolvem um valor novo e não mudam o que receberam.

// Média das notas com reduce, arredondada para 1 casa decimal.
// O * 10 / 10 desloca a casa decimal; Math.round arredonda o resto.
export function mediaNotas(lista) {
    if (lista.length === 0) {
        return 0
    }
    const soma = lista.reduce((somaParcial, filme) => somaParcial + filme.nota, 0)
    return Math.round((soma / lista.length) * 10) / 10
}

// Quantidade de filmes em cada status, também com reduce.
// O objeto vazio {} é o acumulador inicial; cada filme soma 1 na
// posição do seu status.
export function contagemPorStatus(lista) {
    return lista.reduce((contagem, filme) => {
        contagem[filme.status] = (contagem[filme.status] || 0) + 1
        return contagem
    }, {})
}

// Nova lista da maior para a menor nota, sem mutar a original.
// Array.prototype.sort muda o array em que é chamado, então antes
// espalhamos a lista ([...lista]) para ordenar uma cópia.
export function ordenarPorNota(lista) {
    return [...lista].sort((a, b) => b.nota - a.nota)
}