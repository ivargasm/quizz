import {Button, TextField , Stack} from "@mui/material"
import { useQuestionStore } from "./store/questions"
import { useState } from 'react';


export const Start = () => {
    // limite de preguntas
    const LIMIT_QUESTIONS = 10
    const [totalPreguntas, setTotalPreguntas] = useState(LIMIT_QUESTIONS);

    const handleInputChange = (event) => {
    setTotalPreguntas(event.target.value);
}
    // obtener las preguntas
    const fetchQuestions = useQuestionStore(state => state.fetchQuestions)

    const handleClick = () => {
        fetchQuestions(totalPreguntas)
    }
    return (
        <>
            <Stack direction='row' gap={2} alignItems='center' justifyContent='center'>
                <Button onClick={handleClick} variant="contained">
                    ¡Empezar!
                </Button>

                <TextField label="# preguntas" variant="standard" type="number" onChange={handleInputChange} sx={{ m: 1, width: '15ch' }}/>

            </Stack>
        </>
    )
}