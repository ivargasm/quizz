import {create} from 'zustand'
import {type Question} from "./type"
import confetti from 'canvas-confetti'
import { persist } from 'zustand/middleware'

interface State {
    questions: Question[]
    currentQuestion: number
    fetchQuestions: (limit: number) => Promise<void>
    selectAnswer: (questionId: number, answerIndex: number) => void
    goNextQuestion: () => void
    goPrevQuestion: () => void
    reset: () => void
}

// crear el estado global
export const useQuestionStore = create<State>()(persist((set, get) => {
    return{
        questions: [],
        currentQuestion: 0, //posicion del array de questions
        fetchQuestions: async (limit: number) => {
            const response = await fetch('http://localhost:5173/data.json')
            const json = await response.json()

            //revolver las preguntas
            const questions = json.sort(() => Math.random() - 0.5).slice(0, limit)

            //enviar las preguntas al estado global
            set({questions})
        },

        selectAnswer: (questionId: number, answerIndex: number) => {
            const {questions} = get()

            // usar el structureclone para clonar el objeto completo
            const newQuestions = structuredClone(questions)
            // buscar el indice de la pregrunta
            const questionIndex = newQuestions.findIndex(q => q.id === questionId)
            // recuperar la informacion
            const questionInfo = newQuestions[questionIndex]
            // verificar pregunta correcta
            const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex
            if(isCorrectUserAnswer){
                // lanzar confetti
                confetti()
            }
            // cambiar la informacion en la copia de las preguntas
            newQuestions[questionIndex] = {
                ...questionInfo,
                isCorrectUserAnswer,
                userSelectedAnswer: answerIndex,
            }
            // enviar la informacion al estado global
            set({questions: newQuestions})
        },

        goNextQuestion: () => {
            const {currentQuestion, questions} = get()
            const nextQuestion = currentQuestion + 1

            if(nextQuestion <= questions.length - 1){
                set({currentQuestion: nextQuestion})
            }
        },

        goPrevQuestion: () => {
            const {currentQuestion} = get()
            const prevQuestion = currentQuestion - 1

            if(prevQuestion >= 0){
                set({currentQuestion: prevQuestion})
            }
        },

        reset: () => {
            set({questions: [], currentQuestion: 0})
        }
    }
},{
    name: 'questions' //se puede agegar el lugar donde guardar, por default es localStorage
}))