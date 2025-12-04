import { create } from 'zustand'
import { type Question } from "./type"
import confetti from 'canvas-confetti'
import { persist } from 'zustand/middleware'

interface Degree {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}


interface State {
    questions: Question[]
    currentQuestion: number
    fetchQuestions: (limit: number, url: string) => Promise<void>
    selectAnswer: (questionId: string, answerIndex: string) => void
    goNextQuestion: () => void
    goPrevQuestion: () => void
    reset: () => void
    toggleTheme: () => void
    theme: string
    degree: string // ID del degree como string
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
    fetchAvailablePartials: (degree: string, topic: string, user: string) => Promise<void>
    api_url: string
}

// crear el estado global
export const useQuestionStore = create<State>()(persist((set, get) => {
    return {
        questions: [],
        currentQuestion: 0, //posicion del array de questions
        fetchQuestions: async (limit: number, url: string) => {
            const response = await fetch(url)
            const json = await response.json()

            //revolver las preguntas
            const questions = json.sort(() => Math.random() - 0.5).slice(0, limit)

            //enviar las preguntas al estado global
            set({ questions })
        },

        selectAnswer: async (questionId: string, answerIndex: string) => {
            const { questions } = get()

            // usar el structureclone para clonar el objeto completo
            const newQuestions = structuredClone(questions)
            // buscar el indice de la pregrunta
            const questionIndex = newQuestions.findIndex(q => q.id === questionId)
            // recuperar la informacion
            const questionInfo = newQuestions[questionIndex]
            // verificar si la pregunta es abierta
            if (questionInfo.is_open) {

                // enviar peticion post al server con los datos de answerIndex y questionInfo.answers[0]
                const response = await fetch(`${get().api_url}validate_question`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "question":questionInfo.question, "userAnswer":answerIndex })
                })

                // parsear respuesta
                const data = await response.json()
                // extraer el valor de correct del JSON dentro de validation
                const validationMatch = data.validation.match(/"correct":\s*(true|false)/)
                const isCorrectUserAnswer = validationMatch ? validationMatch[1] === 'true' : false
                // verificar pregunta correcta
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

                set({questions: newQuestions})
            } else {
                // verificar pregunta correcta
                const isCorrectUserAnswer = questionInfo.correctAnswer == answerIndex
                if (isCorrectUserAnswer) {
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
                set({ questions: newQuestions })

            }
        },

        goNextQuestion: () => {
            const { currentQuestion, questions } = get()
            const nextQuestion = currentQuestion + 1

            if (nextQuestion <= questions.length - 1) {
                set({ currentQuestion: nextQuestion })
            }
        },

        goPrevQuestion: () => {
            const { currentQuestion } = get()
            const prevQuestion = currentQuestion - 1

            if (prevQuestion >= 0) {
                set({ currentQuestion: prevQuestion })
            }
        },

        reset: () => {
            set({
                questions: [],
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

        theme: localStorage.getItem("theme") || "light",

        selectDegree: (degree: string) => {
            set({ degree })
            // Después de establecer un grado, puedes querer restablecer las otras selecciones:
            set({ topic: '', user: '', partial: '', availableTopics: [] })
        },

        selectTopic: (topic: string) => {
            set({ topic })
            // Después de establecer un tema, puedes querer restablecer las otras selecciones
            set({ user: '', partial: '', availableUsers: [] })
        },

        selectPartial: (partial: string) => {
            set({ partial })
        },

        selectUser: (user: string) => {
            set({ user })
            // Después de establecer un tema, puedes querer restablecer las otras selecciones
            set({ partial: '', availablePartials: [] })
        },

        fetchAvailableDegrees: async () => {
            try {
                const response = await fetch(`${get().api_url}degrees/`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const degrees = await response.json()
                // Asegurar que degrees sea un array
                const degreesArray = Array.isArray(degrees) ? degrees : []
                set({ availableDegrees: degreesArray })
            } catch (error) {
                console.error('Error fetching degrees:', error)
                set({ availableDegrees: [] })
            }
        },

        fetchAvailableTopics: async (degree: string) => {
            const response = await fetch(`${get().api_url}topics/${degree}`)
            const topics = await response.json()
            set({ availableTopics: topics })
        },

        fetchAvailableUsers: async (degree: string, topic: string) => {
            const response = await fetch(`${get().api_url}users/${degree}/${topic}`)
            const users = await response.json()
            set({ availableUsers: users })
        },
        fetchAvailablePartials: async (degree: string, topic: string, user: string) => {
            const response = await fetch(`${get().api_url}partial/${degree}/${topic}/${user}`)
            const partials = await response.json()
            set({ availablePartials: partials })
        },
        degree: '',
        topic: '',
        partial: '',
        user: '',
        availableDegrees: [],
        availableTopics: [],
        availablePartials: [],
        availableUsers: [],
        // api_url: 'https://juristechspace.com/api-quizz/'
        api_url: 'http://localhost:8000/api-quizz'
    }
}, {
    name: 'questions' //se puede agegar el lugar donde guardar, por default es localStorage
}))