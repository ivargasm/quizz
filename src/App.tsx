// import { JavaScriptLogo } from './assets/JavaScriptLogo'
import { useQuestionStore } from './store/questions'
// import { Start } from './components/Start'
import {StudyArena} from './components/StudyArena'
import { Game } from './components/Game'
import { Nav } from './components/Nav'
import { useEffect, useState } from 'react';
// import { CesbaLogo } from './assets/CesbaLogo'

function App() {
  const questions = useQuestionStore(state => state.questions)
  const { selectDegree, selectTopic, selectPartial, selectUser } = useQuestionStore();
  const [mostrar, setMostrar] = useState(false)

    useEffect(() => {
        selectDegree('')
        selectTopic('')
        selectPartial('')
        selectUser('')
    }, []); // Se ejecuta solo una vez cuando el componente se monta
  return (
    <>
      <Nav setMostrar={setMostrar} />
      <main>
        <section className='container-app'>
          <div className="stack">
            <h1 className="title">StudyQuizArena</h1>
          </div>

          {questions.length === 0 && <StudyArena mostrar={mostrar} setMostrar={setMostrar}/>}
          {/* {questions.length === 0 && <Start />} renderizar el componente Start si no hay preguntas */}
          {questions.length > 0 && <Game />} {/* rederizar el componente Game si hay preguntas */}
        </section>
      </main>
    </>
  )
}

export default App
