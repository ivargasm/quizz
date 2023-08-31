import { Container, Stack, Typography } from '@mui/material'
import './App.css'
// import { JavaScriptLogo } from './assets/JavaScriptLogo'
import { useQuestionStore } from './store/questions'
import { Start } from './Start'
import { Game } from './Game'
// import { CesbaLogo } from './assets/CesbaLogo'

function App() {
  const questions = useQuestionStore(state => state.questions)
  return (
    <main>
      <Container maxWidth="sm">
        <Stack direction='row' gap={2} alignItems='center' justifyContent='center'>
          {/* <JavaScriptLogo /> */}
          {/* <CesbaLogo /> */}
          <Typography variant='h2' component='h1'>CESBA Quizz</Typography>
        </Stack>

        {questions.length === 0 && <Start />} {/* renderizar el componente Start si no hay preguntas */}
        {questions.length > 0 && <Game />} {/* rederizar el componente Game si hay preguntas */}
      </Container>
    </main>
  )
}

export default App
