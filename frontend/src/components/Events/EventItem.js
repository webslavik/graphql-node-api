import React from 'react';


const eventItem = props => {
    return (
        <li className='list-group-item d-flex justify-content-between align-items-center'>
            <div className='d-flex'>
                <div className='font-weight-bold mr-3'>{props.title}</div>
                <div>${props.price.toFixed(2)}</div>
            </div>
            <div>
               {props.creator ? 
                    <span className="badge badge-primary">Your event</span> :
                    <button 
                        type="button" 
                        className="btn btn-primary btn-sm"
                        onClick={props.onDetails.bind(this, props.id)}>
                        View Details
                    </button>
                }
            </div>
        </li>
    )
}

export default eventItem;
