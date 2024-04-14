export interface Question{
    id: string
    question: string
    code: string
    answers: string[]
    correctAnswer: string
    is_open?: int
    userSelectedAnswer?: string
    isCorrectUserAnswer?: boolean
}