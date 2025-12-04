import { useQuestionStore } from "../store/questions"
import { useState, useEffect } from "react"

export const Partials = ({setCurrentView}: any) => {    

    const {degree, topic, user, availablePartials, fetchAvailablePartials } = useQuestionStore()

    const {selectPartial } = useQuestionStore()
    const [selectedPartial, setSelectedPartial] = useState<string | null>(null);

    useEffect(() => {
        fetchAvailablePartials(degree, topic, user)      
    }, [degree, topic, user])

    const handlePartialSelected = (partial: string) => {
        setCurrentView("viewPartials")
        selectPartial(partial)
        setSelectedPartial(partial); // Guardar el parcial seleccionado en el estado
    }

    // console.log(`partial.value: ${partial}, selectedPartial: ${selectedPartial}`)

    return (
        <div className="content-stacks partials">
            <h2 className="title-topics">Selecciona un parcial 'Opcional'</h2>
            <div className="topics-container">
                {/* validar si availablePartial tiene informacion, si no tiene mostrar Cargando..., si tiene mostrar resultado */}
                {availablePartials.length > 0 ? availablePartials.map((partial: any, index: number) => (
                    <div className={`topic ${selectedPartial === partial.partial ? 'selected' : ''}`}
                        key={partial.partial || index}
                        onClick={() => handlePartialSelected(partial.partial)}>
                        <h3>{partial.partial}</h3>
                    </div>
                )) : <div className="loader"></div>}
            </div>
            <button className="btn" onClick={() => setCurrentView("viewUsers")}>Volver</button>
        </div>
    )
}
