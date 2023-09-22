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
                {availableTopics.map((topic: any) => (
                    <div className="topic" key={topic.value} onClick={() => handleTopicSelected(topic.value)}>
                        <h3>{topic.label}</h3>
                    </div>
                ))}
            </div>
            <button className="btn" onClick={back}>Regresar</button>
        </div>
    )
}
