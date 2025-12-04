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
            <h2 className="title-topics">Selecciona un colaborador</h2>
            <div className="topics-container">
                {/* validar si availableUsers tiene informacion, si no tiene mostrar Cargando..., si tiene mostrar resultado */}
                {availableUsers.length > 0 ? availableUsers.map((user: any, index: number) => (
                    <div className="topic tooltip" key={user.id || index} onClick={() => handleUserSelected(user.id)}>
                        <h3>{user.name}</h3>
                        <div className="tooltiptext">
                            {user.name} ({user.type}).
                        </div>
                    </div>
                )) : <div className="loader"></div>}
                {/* {availableUsers.map((user: any) => (
                    <div className="topic tooltip" key={user.value} onClick={() => handleUserSelected(user.value)}>
                        <h3>{user.label}</h3>
                        <div className="tooltiptext">
                            {user.name} ({user.type}).
                        </div>
                    </div>
                ))} */}
            </div>
            <button className="btn" onClick={() => setCurrentView("viewTopics")}>Volver</button>
        </div>
    )
}
