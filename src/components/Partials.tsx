import { useQuestionStore } from "../store/questions"
import { useState, useEffect } from "react"

export const Partials = ({setCurrentView}: any) => {    

    const {degree, topic, user, availablePartials, fetchAvailablePartials } = useQuestionStore()

    // obtener las parciales
    // const partials = [
    //     {
    //         value: '1',
    //         label: '1',
    //     },
    //     {
    //         value: '2',
    //         label: '2',
    //     },
    //     {
    //         value: '3',
    //         label: '3',
    //     },
    // ]

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
                {availablePartials.map((partial: any) => (
                    <div className={`topic ${selectedPartial === partial.value ? 'selected' : ''}`}
                        key={partial.value}
                        onClick={() => handlePartialSelected(partial.value)}>
                        <h3>{partial.label}</h3>
                    </div>
                ))}
            </div>
            <button className="btn" onClick={() => setCurrentView("viewUsers")}>Volver</button>
        </div>
    )
}
