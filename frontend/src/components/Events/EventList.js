import React from 'react';
import EventItem from './EventItem';


const eventList = props => {
    const events = props.events.map(event => {
        return (
            <EventItem key={event._id} event={event}  />
        );
    });

    return (
        <ul className="list-group">
            {events}
        </ul>
    )
}

export default eventList;
