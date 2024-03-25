import { Modal } from "./Modal";
import { useQuestionStore } from "../store/questions"
import { useState, useEffect, useRef } from 'react';
import { SelectableCard } from "./CardDegree";
import derechoImage from '../assets/derecho.jpeg';


export const Start = () => {
    // limite de preguntas
    const LIMIT_QUESTIONS = 100
    const [totalPreguntas, setTotalPreguntas] = useState(LIMIT_QUESTIONS);
    const [degree, setDegree] = useState('');
    const [topic, setTopic] = useState('');
    const [partials, setPartials] = useState([]);
    const [partialSelected, setPartialSelected] = useState('');
    const [user, setUser] = useState('');
    const [url, setUrl] = useState('');
    const [degrees, setDegrees] = useState([]);
    const [topics, setTopics] = useState([]);
    const [users, setUsers] = useState([]);
    const [isOpenDegree, setIsOpenDegree] = useState(false)
    const [isOpenTopic, setIsOpenTopic] = useState(false)
    const [isOpenPartial, setIsOpenPartial] = useState(false)
    const [isOpenUser, setIsOpenUser] = useState(false)
    const [selectedOptionDegree, setSelectedOptionDegree] = useState('Opción')
    const [selectedOptionTopic, setSelectedOptionTopic] = useState('Opción')
    const [selectedOptionPartial, setSelectedOptionPartial] = useState('Opción')
    const [selectedOptionUser, setSelectedOptionUser] = useState('Opción')
    const [mostrar, setMostrar] = useState(false)
    
    const dropdowndegree = useRef<any>(null)
    const dropdowntopic = useRef<any>(null)
    const dropdownpartial = useRef<any>(null)
    const dropdownuser = useRef<any>(null)

    // funcion para obtener valores desde la api
    const fetchFromApi = async (route:string, degree:string, topic:string, user:string) => {
        // const response = await fetch(`https://juristechspace.com/api-quizz/${route}/${degree}/${topic}/${user}`);
        const response = await fetch(`http://localhost/api-quizz/${route}/${degree}/${topic}/${user}`);
        const data = await response.json();
        return data;
    }

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
    // ];

    // obtener el numero de preguntas
    const handleInputChange = (event:any) => {
        setTotalPreguntas(event.target.value);
    }

    // obtener la carrera
    const handleDegreeChange = (value_degree: string, value_id: string) => {
        setDegree(value_id);
        setSelectedOptionDegree(value_degree)
        setIsOpenDegree(false);
    }

    // obtener la materia
    const handleTopicChange = (value_topic: string, value_id: string) => {
        setTopic(value_id);
        setSelectedOptionTopic(value_topic)
        setIsOpenTopic(false);
    }

    // obtener el parcial
    const handlePartialChange = (value_partial: string, value_id: string) => {
        setPartialSelected(value_id)
        setSelectedOptionPartial(value_partial)
        setIsOpenPartial(false);
    }

    // obtener el usuario
    const handleUserChange = (value_User: string, value_id: string) => {
        setUser(value_id)
        setSelectedOptionUser(value_User)
        setIsOpenUser(false);
    }

    useEffect(() => {
        // configurar la url
        if(partialSelected != ''){
            // setUrl(`https://juristechspace.com/api-quizz/questions/${degree}/${topic}/${user}/${partialSelected}`);
            setUrl(`http://localhost/api-quizz/questions/${degree}/${topic}/${user}/${partialSelected}`);
        }else{
            // setUrl(`https://juristechspace.com/api-quizz/questions/${degree}/${topic}/${user}`);
            setUrl(`http://localhost/api-quizz/questions/${degree}/${topic}/${user}`);
        }

        // obtener las carreras
        fetchFromApi('degrees', degree, topic, user).then((data) => {
            setDegrees(data);
        })

        // obtener las materias
        fetchFromApi('topics', degree, topic, user).then((data) => {
            setTopics(data);
        })

        // obtener los usuarios
        fetchFromApi('users', degree, topic, user).then((data) => {
            setUsers(data);
        })

        // obtener parciales
        fetchFromApi('partial', degree, topic, user).then((data) => {
            setPartials(data);
        })

        document.addEventListener("click", closeDropdown);
        return () => {
            document.removeEventListener("click", closeDropdown);
        }
    }, [url, degree, topic, partialSelected, user]);

    const closeDropdown = (event:any) => {
        if (dropdowndegree.current && !dropdowndegree.current.contains(event.target)) {
            setIsOpenDegree(false);
        }

        if (dropdowntopic.current && !dropdowntopic.current.contains(event.target)) {
            setIsOpenTopic(false);
        }

        if (dropdownpartial.current && !dropdownpartial.current.contains(event.target)) {
            setIsOpenPartial(false);
        }

        if (dropdownuser.current && !dropdownuser.current.contains(event.target)) {
            setIsOpenUser(false);
        }
    };

    console.log(partials)


    // obtener las preguntas
    const fetchQuestions = useQuestionStore(state => state.fetchQuestions)

    const handleClick = () => {
        fetchQuestions(totalPreguntas, url)
    }
    return (
        <>
            <div className="content-stacks">
                <div className="stack">
                    <button className="btn" onClick={handleClick}>¡Empezar!</button>
                    <input type="number" className="generic_input" placeholder="# preguntas" onChange={handleInputChange}/>
                </div>
                
                <div className="stack sm">
                    <div className="content-select">
                        <div className="custom-dropdown" ref={dropdowndegree}>
                            <div className="selected-option" onClick={() => setIsOpenDegree(!isOpenDegree)}>
                                {selectedOptionDegree}
                            </div>
                            {isOpenDegree && (
                                <ul className="options-list">
                                    {degrees.map((item) => (
                                        <li data-value={item['value']} key={item['value']} onClick={() => handleDegreeChange(item['label'], item['value'])}>{item['label']}</li>
                                    ))}                        
                                </ul>
                            )}
                        </div>
                        <label className="label-msg">Carrera</label>
                    </div>

                    <div className="content-select">
                        <div className="custom-dropdown" ref={dropdowntopic}>
                            <div className="selected-option" onClick={() => setIsOpenTopic(!isOpenTopic)}>
                                {selectedOptionTopic}
                            </div>
                            {isOpenTopic && (
                                <ul className="options-list">
                                    {topics.map((item) => (
                                        <li data-value={item['value']} key={item['value']} onClick={() => handleTopicChange(item['label'], item['value'])}>{item['label']}</li>
                                    ))}                        
                                </ul>
                            )}
                        </div>
                        <label className="label-msg">Materia</label>
                    </div>

                    <div className="content-select">
                        <div className="custom-dropdown" ref={dropdownpartial}>
                            <div className="selected-option" onClick={() => setIsOpenPartial(!isOpenPartial)}>
                                {selectedOptionPartial}
                            </div>
                            {isOpenPartial && (
                                <ul className="options-list">
                                    {partials.map((item) => (
                                        <li data-value={item['value']} key={item['value']} onClick={() => handlePartialChange(item['label'], item['value'])}>{item['label']}</li>
                                    ))}                        
                                </ul>
                            )}
                        </div>
                        <label className="label-msg">Parcial</label>
                    </div>

                    <div className="content-select">
                        <div className="custom-dropdown" ref={dropdownuser}>
                            <div className="selected-option" onClick={() => setIsOpenUser(!isOpenUser)}>
                                {selectedOptionUser}
                            </div>
                            {isOpenUser && (
                                <ul className="options-list">
                                    {users.map((item) => (
                                        <li data-value={item['value']} key={item['value']} onClick={() => handleUserChange(item['label'], item['value'])}>{item['label']}</li>
                                    ))}                        
                                </ul>
                            )}
                        </div>
                        <label className="label-msg">Creador</label>
                    </div>
                </div>
                <Modal isOpen={mostrar} onClose={() => setMostrar(false)}>
                    ¡Hola comunidad de StudyQuizArena! Estamos buscando colaboradores apasionados que quieran contribuir y enriquecer nuestra base de cuestionarios. Si tienes conocimientos en alguna carrera o materia y te gustaría ayudar a otros a prepararse y evaluar sus conocimientos, ¡nos encantaría escuchar de ti! Tu colaboración puede marcar la diferencia en la preparación académica de muchos. Ponte en contacto con nosotros y sé parte de esta emocionante aventura educativa. ¡Gracias por ser parte de StudyQuizArena!
                    <br /><a href="mailto:contacto@ismaelvm.xyz">contacto@ismaelvm.xyz</a>
                </Modal>
                <button className="btn open-modal" onClick={() => setMostrar(true)}>Hola 👋</button>
            </div>
            {/* <SelectableCard/> */}
            <SelectableCard imageSrc={derechoImage} title="Derecho" onClick={() => console.log("Derecho seleccionado")} />
        </>
    )
}