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
    fetchAvailablePartials: (degree: string, topic: string, user: string) => Promise<void>
    api_url: string
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
            // verificar si la pregunta es abierta
            if(questionInfo.is_open){
                const calculateSimilarity = (str1:string, str2:string) => {
                    const len1 = str1.length;
                    const len2 = str2.length;
                    const matrix = [];

                    // Inicializar la matriz
                    for (let i = 0; i <= len1; i++) {
                        matrix[i] = [i];
                    }
                    for (let j = 0; j <= len2; j++) {
                        matrix[0][j] = j;
                    }

                    // Calcular la distancia de edición
                    for (let i = 1; i <= len1; i++) {
                        for (let j = 1; j <= len2; j++) {
                            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                            matrix[i][j] = Math.min(
                                matrix[i - 1][j] + 1, // Eliminación
                                matrix[i][j - 1] + 1, // Inserción
                                matrix[i - 1][j - 1] + cost // Sustitución
                            );
                        }
                    }

                    // Calcular la similitud
                    const maxLen = Math.max(len1, len2);
                    const similarity = 1 - matrix[len1][len2] / maxLen;
                    
                    return similarity;
                }

                const similarity = calculateSimilarity(answerIndex.trim().toLowerCase(), questionInfo.answers[0].trim().toLowerCase());
                console.log(similarity)
                const isCorrectUserAnswer = (similarity > 0.5) ? true : false;
                console.log(isCorrectUserAnswer)
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

            }
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
            // Suponiendo que tienes una API para esto:
            const response = await fetch(`${get().api_url}degrees/`)
            // const response = await fetch('http://localhost/api-quizz/degrees/')
            const degrees = await response.json()
            set({ availableDegrees: degrees })
        },
        
        fetchAvailableTopics: async (degree: string) => {
            const response = await fetch(`${get().api_url}topics/${degree}`)
            // const response = await fetch(`http://localhost/api-quizz/topics/${degree}`)
            const topics = await response.json()
            set({ availableTopics: topics })
        },

        fetchAvailableUsers: async (degree: string, topic: string) => {
            const response = await fetch(`${get().api_url}users/${degree}/${topic}`)
            // const response = await fetch(`http://localhost/api-quizz/users/${degree}/${topic}`)
            const users = await response.json()
            set({ availableUsers: users })
        },
        fetchAvailablePartials: async(degree: string, topic: string, user: string) => {
            const response  = await fetch(`${get().api_url}partial/${degree}/${topic}/${user}`)
            // const response  = await fetch(`http://localhost/api-quizz/partial/${degree}/${topic}/${user}`)
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
        api_url: 'https://studyquizarena.netlify.app/'
    }
},{
    name: 'questions' //se puede agegar el lugar donde guardar, por default es localStorage
}))