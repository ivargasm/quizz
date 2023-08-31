import { Button, TextField, Stack, MenuItem, Box } from "@mui/material"
import { useQuestionStore } from "./store/questions"
import { useState, useEffect } from 'react';


export const Start = () => {
    // limite de preguntas
    const LIMIT_QUESTIONS = 10
    const [totalPreguntas, setTotalPreguntas] = useState(LIMIT_QUESTIONS);
    const [degree, setDegree] = useState('derecho');
    const [topic, setTopic] = useState('derecho administrativo');
    const [partial, setPartial] = useState('');
    const [url, setUrl] = useState('');

    // obtener las carreras
    const degrees = [
        {
            value: 'derecho',
            label: 'Derecho',
        },
        {
            value: 'sistemas computacionales',
            label: 'SIstemas Computacionales',
        },
        {
            value: 'administracion',
            label: 'Administracion',
        },
    ];

    // obtener las Materias
    const topics = [
        {
            value: 'derecho administrativo',
            label: 'Derecho Administrativo',
        },
    ];

    // obtener las parciales
    const partials = [
        {
            value: '1',
            label: '1',
        },
        {
            value: '2',
            label: '2',
        },
        {
            value: '3',
            label: '3',
        },
    ];

    // obtener el numero de preguntas
    const handleInputChange = (event) => {
        console.log(event.target.value);
        setTotalPreguntas(event.target.value);
    }

    // obtener la carrera
    const handleDegreeChange = (event) => {
        setDegree(event.target.value);
    }

    // obtener la materia
    const handleTopicChange = (event) => {
        setTopic(event.target.value);
    }

    // obtener el parcial
    const handlePartialChange = (event) => {
        setPartial(event.target.value);
    }

    useEffect(() => {
        // configurar la url
        if(partial != ''){
            setUrl(`http://localhost/api-quizz/questions/${degree}/${topic}/${partial}`);
        }else{
            setUrl(`http://localhost/api-quizz/questions/${degree}/${topic}`);
        }
        console.log(url);

    }, [url, degree, topic, partial]);




    // obtener las preguntas
    const fetchQuestions = useQuestionStore(state => state.fetchQuestions)

    const handleClick = () => {
        fetchQuestions(totalPreguntas, url)
    }
    return (
        <>
            <Stack direction='row' gap={4} alignItems='center' justifyContent='center' marginBottom={4}>
                <Button onClick={handleClick} variant="contained">
                    ¡Empezar!
                </Button>

                <TextField label="# preguntas" variant="standard" type="number" onChange={handleInputChange} sx={{ m: 1, width: '15ch' }} />

            </Stack>
            <Stack direction='row' gap={3} alignItems='center' justifyContent='center'>
                <TextField id="outlined-select-currency" select label="Opcion" defaultValue="" helperText="Selecciona tu carrera" onChange={handleDegreeChange}>
                    {degrees.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField id="outlined-select-currency" select label="Opcion" defaultValue="" helperText="Selecciona la materia" onChange={handleTopicChange}>
                    {topics.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField id="outlined-select-currency" select label="Opcion" defaultValue="" helperText="Selecciona el parcial" onChange={handlePartialChange}>
                    {partials.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>
        </>
    )
}