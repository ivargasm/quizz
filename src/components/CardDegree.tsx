import React from 'react';

interface SelectableCardProps {
    imageSrc: string;
    title: string;
    onClick?: () => void; // Esta función se invocará cuando se haga clic en la tarjeta.
}

export const SelectableCard: React.FC<SelectableCardProps> = ({ imageSrc, title, onClick }) => {
    return (
        <div onClick={onClick}>
            <div className="card-degree">
                <img src={imageSrc} alt={title} />
                <div className="intro">
                    <div>{title}</div>
                </div>
            </div>
        </div>
    )
}