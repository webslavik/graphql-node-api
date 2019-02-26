import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from './../context/auth-context';


class BookingsPage extends Component {
    state = {
        bookings: [],
        isLoading: false,
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookingList();
    }

    fetchBookingList() {
        this.setState({ isLoading: true });

        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        updatedAt
                        event {
                            title
                        }
                    }
                }
            `
        };

        fetch('http://localhost:3001/api', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.context.token}`,
            }
        })
            .then(response => {
                if (response.status !== 200 &&
                    response.status !== 201) {
                    throw new Error('Failed!');
                }

                return response.json();
            })
            .then(resData => {
                const bookings = resData.data.bookings;
                this.setState({ bookings });

                this.setState({ isLoading: false });
            })
            .catch(error => {
                console.log(`[ERROR] Fetch events failed!`);
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <div className='booking-page pt-5 pb-5'>
                <h1 className='mb-3'>Bookings list</h1>

                {this.state.isLoading ?
                    <Spinner /> :

                    (<ul className="list-group">
                        {this.state.bookings.map(booking =>
                            <li className='list-group-item' key={booking._id}>
                                {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}
                            </li>
                        )}
                    </ul>)
                }
            </div>
        );
    }
}

export default BookingsPage;
