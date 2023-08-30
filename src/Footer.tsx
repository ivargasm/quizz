import { useQuestionData } from "./hooks/useQuestionsData"
import { Button } from "@mui/material"
import { useQuestionStore } from "./store/questions"



export const Footer = () => {
    const { correct, incorrect, unanswered } = useQuestionData()
    const reset = useQuestionStore(state => state.reset) // obtener la funcion para reiniciar el juego

    return(
        <footer style={{marginTop: '16px'}}>
            <strong>{`✅ ${correct} correctas - ❌ ${incorrect} incorrectas - ❓ ${unanswered} sin responder`}</strong>
            <div style={{marginTop:'16px'}}>
                <Button onClick={()=>reset()}>
                    Resetear Juego
                </Button>
            </div>
        </footer>
    )
}