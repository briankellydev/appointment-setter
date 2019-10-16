import './Card.component.scss';
import React from 'react';

interface Props {
    headerText: string;
    bodyHtml: any;
}

const Card: React.FC<Props> = (props) => {
    return (
        <div className="Card">
            {props.headerText ? 
                (<div
                    className="Card-header"
                    style={{'borderBottom': props.bodyHtml ? '1px solid black' : 'none'}}
                    >
                    <h3>{props.headerText}</h3>
                </div>) : 
                (<span></span>)
            }
            {props.bodyHtml ? (<div className="Card-body">
                {props.bodyHtml}
            </div>) : (<span></span>)}
        </div>
    );
}

export default Card;