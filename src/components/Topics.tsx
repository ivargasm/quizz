import { useQuestionStore } from "../store/questions"
import { useEffect } from "react"

export const Topics = ({setCurrentView}: any) => {

    const {degree, topic, selectTopic, availableTopics, fetchAvailableTopics } = useQuestionStore()

    const back = () => setCurrentView('viewDegrees')

    useEffect(() => {
        fetchAvailableTopics(degree)      
    }, [topic])

    const handleTopicSelected = (topic: string) => {
        selectTopic(topic)
        setCurrentView('viewUsers')
    }

    return (
        <div className="content-stacks topics">
            <h2 className="title-topics">Selecciona un tema</h2>
            <div className="topics-container">
                {/* validar si availableTopics tiene informacion, si no tiene mostrar Cargando..., si tiene mostrar resultado */}
                {availableTopics.length > 0 ? availableTopics.map((topic: any, index: number) => (
                    <div className="topic" key={topic.id || index} onClick={() => handleTopicSelected(topic.id)}>
                        <h3>{topic.description}</h3>
                    </div>
                )) : <div className="loader"></div>}
            </div>
            <button className="btn" onClick={back}>Regresar</button>
        </div>
    )
}
