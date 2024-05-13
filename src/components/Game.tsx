import { useQuestionStore } from "../store/questions"
import { type Question as QuestionType } from "../store/type"
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark, stackoverflowLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Footer } from "../Footer"
import React, { useState } from 'react'

const getBackgroundColor = (info: QuestionType, index: number) => { // obtener el color de fondo de una respuesta
    const { userSelectedAnswer, correctAnswer, isCorrectUserAnswer } = info
    // usuario aun no selcciona una respuesta
    if(userSelectedAnswer == null) return 'transparent'
    // validar si la pregunta es abierta
    if(info.is_open === 1){
        // ya selecciono una respuesta y es la incorrecta
        if(!isCorrectUserAnswer) return '#94241c'
        // ya selecciono una respuesta y es la correcta
        if(isCorrectUserAnswer) return '#377339'
        // caso por defecto
        return 'transparent'
    }
    // ya selecciono una respuesta y es la incorrecta
    if(index.toString() != correctAnswer && index.toString() !== userSelectedAnswer) return '#transparent'
    // ya selecciono una respuesta y es la correcta
    if(index.toString() == correctAnswer) return '#4caf50'
    // ya selecciono una respuesta y es la incorrecta
    if(index.toString() == userSelectedAnswer) return '#f44336'
    // caso por defecto
    return 'transparent'
}

const Question = ({ info }: { info: QuestionType }) => { // componente para mostrar una pregunta

    const [userAnswer, setUserAnswer] = useState('')
    const [loader, setLoader] = useState(false)
    const selectAnswer = useQuestionStore(state => state.selectAnswer) // obtener la funcion para seleccionar una respuesta
    const createHandleClick = (answerIndex: string) => () =>{ // crear una funcion que selecciona una respuesta
        // validar is info.is_open === 1 poner loader en true
        if(info.is_open === 1) {
            setLoader(true)
            setTimeout(() => {
                setLoader(false)
            }, 2000)
        }
        selectAnswer(info.id, answerIndex)
    }    
    let theme = useQuestionStore(state => state.theme) // obtener el tema

    const handleAnswerChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setUserAnswer(event.target.value);
    };
    
    return(
        <>
            <div className="card">
                <h2 className="card-title">{info.question}</h2>
                {info.code != null && 
                    <SyntaxHighlighter language='javascript' style={theme === 'light' ? stackoverflowLight : atomOneDark} className='code-block'>
                        {info.code}
                    </SyntaxHighlighter>
                }
                {info.is_open === 0 
                    ?  (
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
                                            <span className="custom-list-text" style={{ whiteSpace: 'pre-line' }}>
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

                    )
                    : (
                        <div className="text_area">
                            <textarea placeholder="Ingresa tu respuesta" 
                                onChange={handleAnswerChange}
                                style={{backgroundColor: getBackgroundColor(info, 0)}}
                                disabled={info.userSelectedAnswer != null}
                                value={info.userSelectedAnswer}
                            >
                            </textarea>
                            <div>
                                <button className="btn" onClick={createHandleClick(userAnswer)} disabled={info.userSelectedAnswer != null}>Enviar</button>
                                {loader && info.userSelectedAnswer == null &&
                                    <div className="loader"></div>
                                }
                            </div>
                            {info.userSelectedAnswer != null &&
                                <div className="correct_answer">{info.answers[0]}</div>

                            }
                        </div>
                    )
                }
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