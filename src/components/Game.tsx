import { useQuestionStore } from "../store/questions"
import { type Question as QuestionType } from "../store/type"
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark, stackoverflowLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Footer } from "../Footer"
import React from 'react'

const getBackgroundColor = (info: QuestionType, index: number) => { // obtener el color de fondo de una respuesta
    const { userSelectedAnswer, correctAnswer } = info
    // usuario aun no selcciona una respuesta
    if(userSelectedAnswer == null) return 'transparent'
    // ya selecciono una respuesta y es la incorrecta
    if(index.toString() !== correctAnswer && index.toString() !== userSelectedAnswer) return '#transparent'
    // ya selecciono una respuesta y es la correcta
    if(index.toString() === correctAnswer) return '#4caf50'
    // ya selecciono una respuesta y es la incorrecta
    if(index.toString() === userSelectedAnswer) return '#f44336'
    // caso por defecto
    return 'transparent'
}

const Question = ({ info }: { info: QuestionType }) => { // componente para mostrar una pregunta
    const selectAnswer = useQuestionStore(state => state.selectAnswer) // obtener la funcion para seleccionar una respuesta
    const createHandleClick = (answerIndex: string) => () =>{ // crear una funcion que selecciona una respuesta
        selectAnswer(info.id, answerIndex)
    }    
    let theme = useQuestionStore(state => state.theme) // obtener el tema
    
    return(
        <>
            <div className="card">
                <h2 className="card-title">{info.question}</h2>
                {info.code != null && 
                    <SyntaxHighlighter language='javascript' style={theme === 'light' ? stackoverflowLight : atomOneDark} className='code-block'>
                        {info.code}
                    </SyntaxHighlighter>
                }
                <ul className="custom-list">
                    {info.answers.map((answer, index) => (
                        <li key={`${info.id}-${index}`} className="custom-list-item">
                            <button 
                                className={`custom-list-button ${info.userSelectedAnswer != null ? 'disabled' : ''}`} 
                                onClick={createHandleClick(index.toString())} 
                                style={{backgroundColor: getBackgroundColor(info, index)}}
                                disabled={info.userSelectedAnswer != null}
                            >
                            {/* <span className="custom-list-text">{answer}</span> */}
                                <span className="custom-list-text">
                                    {answer.split('\n').map((line, lineIndex) => (
                                        <React.Fragment key={lineIndex}>
                                            {line}
                                            {lineIndex !== answer.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export const Game = () => {

    const Questions = useQuestionStore(state => state.questions) // obtener las preguntas
    const currentQuestion = useQuestionStore(state => state.currentQuestion) // obtener la pregunta actual
    const questionInfo = Questions[currentQuestion] // obtener la info de la pregunta actual
    const goNextQuestion = useQuestionStore(state => state.goNextQuestion) // obtener la funcion para ir a la siguiente pregunta
    const goPrevQuestion = useQuestionStore(state => state.goPrevQuestion) // obtener la funcion para ir a la pregunta anterior

    return(
        <>
            <div className="nav-stack">
                <button className="nav-button" onClick={goPrevQuestion} disabled={currentQuestion === 0}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <span className="question-count">{currentQuestion+1}/{Questions.length}</span>
                <button className="nav-button" onClick={goNextQuestion} disabled={currentQuestion >= Questions.length-1}>
                    <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
            <Question info={questionInfo} /> {/* mostrar la pregunta actual */}
            <Footer /> {/* mostrar el footer */}
        </>
    )

}