export interface Question{
    id: string
    question: string
    code: string
    answers: string[]
    correctAnswer: string
    userSelectedAnswer?: string
    isCorrectUserAnswer?: boolean
}