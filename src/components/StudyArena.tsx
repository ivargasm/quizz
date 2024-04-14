// import { Modal } from "./Modal"
import { useQuestionStore } from "../store/questions"
import { SelectableCard } from "./CardDegree"
// import derechoImage from '../assets/derecho.jpeg'
// import sistemasImage from '../assets/sistemas.jpeg'
import { useEffect, useState } from "react"
import { Topics } from "../components/Topics"
import { Teachers } from "../components/Teachers"
import { Partials } from "./Partials"
import { Modal } from "./Modal"

interface DegreeImageMap {
    [degreeName: string]: string // Esto indica que cada clave es una cadena que mapea a una cadena que representa una ruta de imagen.
}

export const StudyArena = ({mostrar, setMostrar}:any) => {

    const LIMIT_QUESTIONS = 100
    const [totalPreguntas, setTotalPreguntas] = useState(LIMIT_QUESTIONS)
    const { selectDegree, availableDegrees, fetchAvailableDegrees, degree, topic, user, partial, api_url } = useQuestionStore()
    const [currentView, setCurrentView] = useState('viewDegrees')
    const [url, setUrl] = useState('')


    const degreeImages: DegreeImageMap  = {
        "Derecho": 'https://res.cloudinary.com/ivargasm/image/upload/v1713122104/study-quizz/derecho.jpg',
        "Sistemas": 'https://res.cloudinary.com/ivargasm/image/upload/v1713122104/study-quizz/sistemas.jpg',
        //... Agrega otras carreras e imágenes si las tienes
    }
    

    useEffect(() => {
        fetchAvailableDegrees()
        if(partial != ''){
            setUrl(`${api_url}questions/${degree}/${topic}/${user}/${partial}`)
            // setUrl(`http://localhost/api-quizz/questions/${degree}/${topic}/${user}/${partial}`);
        }else{
            setUrl(`${api_url}questions/${degree}/${topic}/${user}`)
            // setUrl(`http://localhost/api-quizz/questions/${degree}/${topic}/${user}`)
        } 
    }, [currentView, url, degree, topic, user, partial])

    const handleDegreeSelected = (degree_value: string) => {
        selectDegree(degree_value)
        setCurrentView('viewTopics')
    }

    // obtener el numero de preguntas
    const handleInputChange = (event:any) => {
        setTotalPreguntas(event.target.value)
    }

    // obtener las preguntas
    const fetchQuestions = useQuestionStore(state => state.fetchQuestions)
    const handleClick = () => {
        fetchQuestions(totalPreguntas, url)
    }

    return (
        <>
            <div className="content-stacks">
                <div className="stack">
                    <button className="btn"  onClick={handleClick}>¡Empezar!</button>
                    <input type="number" className="generic_input" placeholder="# preguntas" onChange={handleInputChange}/>
                </div>
                <Modal isOpen={mostrar} onClose={() => setMostrar(false)}>
                    ¡Hola comunidad de StudyQuizArena! Estamos buscando colaboradores apasionados que quieran contribuir y enriquecer nuestra base de cuestionarios. Si tienes conocimientos en alguna carrera o materia y te gustaría ayudar a otros a prepararse y evaluar sus conocimientos, ¡nos encantaría escuchar de ti! Tu colaboración puede marcar la diferencia en la preparación académica de muchos. Ponte en contacto con nosotros y sé parte de esta emocionante aventura educativa. ¡Gracias por ser parte de StudyQuizArena!
                    <br /><a href="mailto:contacto@juristechspace.com">contacto@juristechspace.com</a>
                </Modal>
                
            </div>
            <div className="card-category">
                {currentView === 'viewDegrees' && availableDegrees.map((degree) => (
                    <SelectableCard
                        key={degree['value']}
                        title={degree['label']}
                        imageSrc={degreeImages[degree['label']]}
                        onClick={() => handleDegreeSelected(degree['value'])}
                    />
                ))}
            </div>
            {currentView === 'viewTopics' && <Topics setCurrentView={setCurrentView}/>} 
            {currentView === 'viewUsers' && <Teachers setCurrentView={setCurrentView}/>}
            {currentView === 'viewPartials' && <Partials setCurrentView={setCurrentView}/>}
        </>
    )
}
