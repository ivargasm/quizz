import { useQuestionStore } from "../store/questions"
import { useEffect } from "react"

export const Teachers = ({setCurrentView}: any) => {

    const {user,topic, degree, selectUser, availableUsers, fetchAvailableUsers } = useQuestionStore()

    useEffect(() => {
        fetchAvailableUsers(degree, topic)
    },[user])

    const handleUserSelected = (user: string) => {
        setCurrentView("viewPartials")
        selectUser(user)
    }

    return (
        <div className="content-stacks topics">
            <h2 className="title-topics">Selecciona un profesor</h2>
            <div className="topics-container">
                {availableUsers.map((user: any) => (
                    <div className="topic" key={user.value} onClick={() => handleUserSelected(user.value)}>
                        <h3>{user.label}</h3>
                    </div>
                ))}
            </div>
            <button className="btn" onClick={() => setCurrentView("viewTopics")}>Volver</button>
        </div>
    )
}
