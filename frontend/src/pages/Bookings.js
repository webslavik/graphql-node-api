import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import BookingsList from './../components/Bookings/BookingList';
import BookingsChart from './../components/Bookings/BookingChart';
import BookingsControls from './../components/Bookings/BookingControls';

import AuthContext from './../context/auth-context';


class BookingsPage extends Component {
    state = {
        bookings: [],
        isLoading: false,
        selectedTab: 'list',
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookingList();
    }

    deleteBookingHandler = bookingId => {
        this.setState({ isLoading: true });

        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!) {
                    cancelBooking(bookingId: $id) {
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId,
            },
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
                this.setState(prevState => {
                    const updatedBookings = prevState.bookings.filter(booking => {
                        return booking._id !== bookingId;
                    })

                    return { bookings: updatedBookings };
                });

                this.setState({ isLoading: false });
            })
            .catch(error => {
                console.log(`[ERROR] Fetch events failed!`);
                this.setState({ isLoading: false });
            });

    }

    fetchBookingList() {
        this.setState({ isLoading: true });

        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        updatedAt,
                        event {
                            title
                            price
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

    changeSelectedTabHandler = tabType => {
        if (tabType === 'list') {
            this.setState({ selectedTab: 'list' });
        } else {
            this.setState({ selectedTab: 'chart' });
        }
    }

    render() {
        let content = <Spinner />;

        if (!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <BookingsControls 
                        selectedTab={this.state.selectedTab}
                        onChangeTab={this.changeSelectedTabHandler} />

                    {this.state.selectedTab === 'list' ?
                        <BookingsList
                            bookings={this.state.bookings} 
                            onDelete={this.deleteBookingHandler} /> :
                        <BookingsChart bookings={this.state.bookings} />
                    }
                </React.Fragment>
            );
        }

        return (
            <div className='booking-page pt-5 pb-5'>
                {content}
            </div>
        );
    }
}

export default BookingsPage;
