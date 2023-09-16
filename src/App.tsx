import { Container, Stack, Typography } from '@mui/material'
// import './App.css'
// import { JavaScriptLogo } from './assets/JavaScriptLogo'
import { useQuestionStore } from './store/questions'
import { Start } from './Start'
import { Game } from './Game'
import { Nav } from './Nav'
// import { CesbaLogo } from './assets/CesbaLogo'

function App() {
  const questions = useQuestionStore(state => state.questions)
  return (
    <>
      <Nav />
      <main>
        <section className='container-app'>
          <div className="stack">
            <h1 className="title">StudyQuizArena</h1>
          </div>
          {questions.length === 0 && <Start />} {/* renderizar el componente Start si no hay preguntas */}
          {questions.length > 0 && <Game />} {/* rederizar el componente Game si hay preguntas */}
          </section>
      </main>
    </>
  )
}

export default App
