import { filmesIniciais } from "./filmes.js"
import { contagemPorStatus, mediaNotas, ordenarPorNota } from "./estatisticas.js"

const filmes = [...filmesIniciais]

// 1) Média das notas, arredondada para 1 casa decimal.
console.log("Média das notas:", mediaNotas(filmes))

// 2) Quantidade de filmes em cada status.
console.log("Contagem por status:", contagemPorStatus(filmes))

// 3) Nova lista ordenada da maior para a menor nota.
const ordenados = ordenarPorNota(filmes)
console.log(
    "Ordenados por nota (maior → menor):",
    ordenados.map((f) => `${f.nota} ★ — ${f.titulo}`)
)

// Prova de que ordenarPorNota não muta o original: a lista continua
// na ordem antiga (por id) depois da ordenação.
console.log(
    "Original depois de ordenar:",
    filmes.map((f) => `${f.id} — ${f.titulo} (${f.nota} ★, ${f.status})`)
)
