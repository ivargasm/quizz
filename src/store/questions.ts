import {create} from 'zustand'
import {type Question} from "./type"
import confetti from 'canvas-confetti'
import { persist } from 'zustand/middleware'

interface Degree {
    value: string;
    label: string;
}


interface State {
    questions: Question[]
    currentQuestion: number
    fetchQuestions: (limit: number, url:string) => Promise<void>
    selectAnswer: (questionId: string, answerIndex: string) => void
    goNextQuestion: () => void
    goPrevQuestion: () => void
    reset: () => void
    toggleTheme: () => void
    theme: string
    degree: string
    topic: string
    partial: string
    user: string
    availableDegrees: Degree[]
    availableTopics: string[]
    availablePartials: string[]
    availableUsers: string[]
    selectDegree: (degree: string) => void
    selectTopic: (topic: string) => void
    selectPartial: (partial: string) => void
    selectUser: (user: string) => void
    fetchAvailableDegrees: () => Promise<void>
    fetchAvailableTopics: (degree: string) => Promise<void>
    fetchAvailableUsers: (degree: string, topic: string) => Promise<void>
}

// crear el estado global
export const useQuestionStore = create<State>()(persist((set, get) => {
    return{
        questions: [],
        currentQuestion: 0, //posicion del array de questions
        fetchQuestions: async (limit: number, url: string) => {
            const response = await fetch(url)
            const json = await response.json()

            //revolver las preguntas
            const questions = json.sort(() => Math.random() - 0.5).slice(0, limit)

            //enviar las preguntas al estado global
            set({questions})
        },

        selectAnswer: (questionId: string, answerIndex: string) => {
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
            set({questions: [],
                currentQuestion: 0,
                degree: '',
                topic: '',
                partial: '',
                user: '',
            })
        },

        toggleTheme: () => {
            const currentTheme = get().theme
            const newTheme = currentTheme === "dark" ? "light" : "dark"
            localStorage.setItem('theme', newTheme)
            document.documentElement.setAttribute('data-theme', newTheme)
            set({ theme: newTheme })
        },

        theme:  localStorage.getItem("theme") || "light",

        selectDegree: (degree: string) => {
            set({ degree })
            // Después de establecer un grado, puedes querer restablecer las otras selecciones:
            set({ topic: '', user: '', partial: '' })
        },

        selectTopic: (topic: string) => {
            set({ topic })
            // Después de establecer un tema, puedes querer restablecer las otras selecciones
            set({ user: '', partial: '' })
        },

        selectPartial: (partial: string) => {
            set({ partial })
        },

        selectUser: (user: string) => {
            set({ user })
            // Después de establecer un tema, puedes querer restablecer las otras selecciones
            set({ partial: '' })
        },

        fetchAvailableDegrees: async () => {
            // Suponiendo que tienes una API para esto:
            // const response = await fetch('https://juristechspace.com/api-quizz/degrees/')
            const response = await fetch('http://localhost/api-quizz/degrees/')
            const degrees = await response.json()
            set({ availableDegrees: degrees })
        },
        
        fetchAvailableTopics: async (degree: string) => {
            // const response = await fetch(`https://juristechspace.com/api-quizz/topics/${degree}`)
            const response = await fetch(`http://localhost/api-quizz/topics/${degree}`)
            const topics = await response.json()
            set({ availableTopics: topics })
        },

        fetchAvailableUsers: async (degree: string, topic: string) => {
            // const response = await fetch(`https://juristechspace.com/api-quizz/users/${degree}/${topic}`)
            const response = await fetch(`http://localhost/api-quizz/users/${degree}/${topic}`)
            const users = await response.json()
            set({ availableUsers: users })
        },
        degree: '',
        topic: '',
        partial: '',
        user: '',
        availableDegrees: [],
        availableTopics: [],
        availablePartials: [],
        availableUsers: []
    }
},{
    name: 'questions' //se puede agegar el lugar donde guardar, por default es localStorage
}))