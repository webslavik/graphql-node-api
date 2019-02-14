import React from 'react';


const eventItem = props => {
    return(
        <li className='list-group-item'>
            {props.event.title}
        </li>
    )
}

export default eventItem;
