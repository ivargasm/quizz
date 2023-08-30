import { Card, Typography, List, ListItem, ListItemButton, ListItemText, Stack, IconButton } from "@mui/material"
import { useQuestionStore } from "./store/questions"
import { type Question as QuestionType } from "./store/type"
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ArrowForwardIos, ArrowBackIosNew } from "@mui/icons-material"
import { Footer } from "./Footer"

const getBackgroundColor = (info: QuestionType, index: number) => { // obtener el color de fondo de una respuesta
    const { userSelectedAnswer, correctAnswer } = info

    // usuario aun no selcciona una respuesta
    if(userSelectedAnswer == null) return 'transparent'
    // ya selecciono una respuesta y es la incorrecta
    if(index !== correctAnswer && index !== userSelectedAnswer) return '#transparent'
    // ya selecciono una respuesta y es la correcta
    if(index === correctAnswer) return '#4caf50'
    // ya selecciono una respuesta y es la incorrecta
    if(index === userSelectedAnswer) return '#f44336'
    // caso por defecto
    return 'transparent'
}


const Question = ({ info }: { info: QuestionType }) => { // componente para mostrar una pregunta

    const selectAnswer = useQuestionStore(state => state.selectAnswer) // obtener la funcion para seleccionar una respuesta
    const createHandleClick = (answerIndex: number) => () =>{ // crear una funcion que selecciona una respuesta
        selectAnswer(info.id, answerIndex)
    }
    
    
    return(
        <Card variant='outlined' sx={{textAlign:'left', bgcolor:'#222', p:2, marginTop: 4}}>
            <Typography variant='h5'>
                {info.question}
            </Typography>

            <SyntaxHighlighter language='javascript' style={atomOneDark}>
                {info.code}
            </SyntaxHighlighter>

            <List sx={{bgcolor: '#333'}} disablePadding>
                {info.answers.map((answer, index) => (
                    <ListItem key={index} disablePadding divider>
                        <ListItemButton onClick={createHandleClick(index)} sx={{backgroundColor: getBackgroundColor(info, index)}} disabled={info.userSelectedAnswer != null}>
                            <ListItemText primary={answer} sx={{textAlign:'center'}}/>
                        </ListItemButton>
                    </ListItem>
                ))}

            </List>

        </Card>
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
            <Stack direction='row' gap={2} alignItems='center' justifyContent='center'>
                <IconButton onClick={goPrevQuestion} disabled={currentQuestion === 0}>
                    <ArrowBackIosNew />
                </IconButton>
                {currentQuestion+1}/{Questions.length}
                <IconButton onClick={goNextQuestion} disabled={currentQuestion >= Questions.length-1}>
                    <ArrowForwardIos />
                </IconButton>
            </Stack>
            <Question info={questionInfo} /> {/* mostrar la pregunta actual */}
            <Footer /> {/* mostrar el footer */}
        </>
    )

}