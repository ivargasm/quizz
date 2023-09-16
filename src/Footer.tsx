import { useQuestionData } from "./hooks/useQuestionsData"
import { useQuestionStore } from "./store/questions"



export const Footer = () => {
    const { correct, incorrect, unanswered } = useQuestionData()
    const reset = useQuestionStore(state => state.reset) // obtener la funcion para reiniciar el juego

    return(
        <footer className="footer">
            <strong>{`✅ ${correct} correctas - ❌ ${incorrect} incorrectas - ❓ ${unanswered} sin responder`}</strong>
            <div style={{marginTop:'16px'}}>
                <button className="btn" onClick={()=>reset()}>
                    Reiniciar Juego
                </button>
            </div>
        </footer>
    )
}