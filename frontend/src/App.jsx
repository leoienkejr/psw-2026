import Titulo from './components/Titulo.jsx'

function App() {
  return (
    <>
      <header>
        <Titulo
          nome="CineTrack"
          subtitulo="Catálogo pessoal de filmes — o que você já viu, está vendo e quer ver."
        />
      </header>

      <main>
        <p>Em breve: lista de filmes, filtros e cadastro.</p>
      </main>

      <footer>
        <small>
          © {new Date().getFullYear()} CineTrack — projeto integrador.
        </small>
      </footer>
    </>
  )
}

export default App