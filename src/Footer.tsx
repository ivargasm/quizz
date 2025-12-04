import { useQuestionData } from "./hooks/useQuestionsData"
import { useQuestionStore } from "./store/questions"
import { Modal } from "./components/Modal";
import { useEffect, useState } from "react";



export const Footer = () => {
    const { correct, incorrect, unanswered } = useQuestionData()
    const reset = useQuestionStore(state => state.reset) // obtener la funcion para reiniciar el juego
    const [mostrarModal, setMostrarModal] = useState(false) // estado para mostrar el modal
    const [reiniciar, setReiniciar] = useState(false) // estado para reiniciar el juego
    const [resultado, setResultado] = useState(0)

    // validar si se han respondido todas las preguntas cambiar mostrar a true
    useEffect(() => {
        if(unanswered === 0){
            setMostrarModal(true)
            setResultado((correct*100)/(correct+incorrect))
        }
    }, [unanswered])

    return(
        <footer className="footer">
            <strong>{`✅ ${correct} correctas - ❌ ${incorrect} incorrectas - ❓ ${unanswered} sin responder`}</strong>
            <div style={{marginTop:'16px'}}>
                <button className="btn" onClick={() => setReiniciar(true)}>
                    Reiniciar Juego
                </button>
            </div>
            <Modal isOpen={mostrarModal} onClose={() => setMostrarModal(false)}>
                {resultado > 80 ? 'Bien hecho!' : resultado > 60 ? 'Puesdes mejorar!' : 'Esfuerzate mas!'}
                <br />
                <strong>{`Tu resultado es: ${resultado.toFixed(2)}%`}</strong>
                <br />
                <br />
                <br />
            </Modal>
            {/* Modal para pedir confirmacion de reiniciar juego */}
            <Modal isOpen={reiniciar} onClose={() => setReiniciar(false)}>
                <p>Estas seguro de que quieres reiniciar el juego 🤔</p>
                <br />
                <button className="btn" onClick={()=>reset()}>
                    Reiniciar Juego
                </button>
            </Modal>
        </footer>
    )
}