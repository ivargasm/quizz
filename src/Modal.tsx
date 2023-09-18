type ModalProps = {
    isOpen: boolean;
    onClose: (state: boolean) => void;
};


export const Modal = ({isOpen, onClose}:ModalProps) => {

    const closeView = () => {

        const modal = document.getElementById('modal')
        const modalContent = document.getElementById('modal-content')

        if(onClose && modal && modalContent){
            modalContent.classList.add('close')

            setTimeout(() => {
                modalContent.classList.remove('close')
                modal.style.display='none'
                onClose(false)
            }, 1000)
        }


    
    }

    return (
        <div className="modal" id="modal" style={{display: isOpen ? 'flex' : 'none'}}>
            <div className="modal-content" id="modal-content">
                <p className="modal-title">Hola <span className="wave">👋</span></p>
                <p>
                    ¡Hola comunidad de StudyQuizArena! Estamos buscando colaboradores apasionados que quieran contribuir y enriquecer nuestra base de cuestionarios. Si tienes conocimientos en alguna carrera o materia y te gustaría ayudar a otros a prepararse y evaluar sus conocimientos, ¡nos encantaría escuchar de ti! Tu colaboración puede marcar la diferencia en la preparación académica de muchos. Ponte en contacto con nosotros y sé parte de esta emocionante aventura educativa. ¡Gracias por ser parte de StudyQuizArena!
                    <br /><a href="mailto:contacto@ismaelvm.xyz">contacto@ismaelvm.xyz</a>
                </p>
                <button className="close-modal" id="close-modal" onClick={() => closeView()}>❌</button>
            </div>
        </div>
    )
}
