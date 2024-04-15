import { useQuestionStore } from '../store/questions'

export const useQuestionData = () => {
    const questions = useQuestionStore(state => state.questions)

    let correct = 0
    let incorrect = 0
    let unanswered = 0

    questions.forEach(question => {
        const { userSelectedAnswer, correctAnswer, isCorrectUserAnswer } = question
        if(userSelectedAnswer == null) unanswered++
        else if((userSelectedAnswer == correctAnswer) || isCorrectUserAnswer) correct++
        else incorrect++
    })

    return { correct, incorrect, unanswered }
}