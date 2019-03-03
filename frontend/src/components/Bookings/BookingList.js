import React from 'react'


const bookingsList = props => (
    <ul className="list-group">
        {props.bookings.map(booking =>
            <li 
                className='list-group-item d-flex justify-content-between align-items-center' 
                key={booking._id}>
                <div>
                    {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()};
                    ${booking.event.price}
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={props.onDelete.bind(this, booking._id)}>
                        Delete
                    </button>
                </div>
            </li>
        )}
    </ul>
)

export default bookingsList;
