type ModalProps = {
    isOpen: boolean
    onClose: (state: boolean) => void
    children: React.ReactNode
};


export const Modal = ({isOpen, onClose, children}:ModalProps) => {

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
                <div>
                    {children}                    
                </div>
                <button className="close-modal" id="close-modal" onClick={() => closeView()}>❌</button>
            </div>
        </div>
    )
}
