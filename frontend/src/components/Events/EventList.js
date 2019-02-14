import React from 'react';
import EventItem from './EventItem';


const eventList = props => {
    const events = props.events.map(event => {
        return (
            <EventItem 
                key={event._id} 
                id={event._id} 
                title={event.title}
                price={event.price}
                userId={event.userId}
                creator={props.userId === event.creator._id} />
        );
    });

    return (
        <ul className="list-group">
            {events}
        </ul>
    )
}

export default eventList;
