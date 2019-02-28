import React, { Component } from 'react';

import Modal from './../components/Modal/Modal';
import EventList from '../components/Events/EventList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from './../context/auth-context';


class EventsPage extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null,
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount() {
        this.fetchEvets();
    }

    startCreatingEventHandler = () => {
        this.setState({ creating: true });
    }

    modalConfirmHandler = () => {
        this.setState({ creating: false });

        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        // TODO: simple validation
        if (title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0) {
            console.log('validation failed');
            return;
        }

        const token = this.context.token;

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {
                        title: "${title}", 
                        description: "${description}", 
                        price: ${price}, 
                        date: "${date}"}) {
                            _id
                            title
                            description
                            price
                            date
                    }
                }
             `
        };

        fetch('http://localhost:3001/api', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(response => {
            if (response.status !== 200 &&
                response.status !== 201) {
                throw new Error('Create event failed!');
            }

            return response.json();
        })
        .then(resData => {
            const { data } = resData;

            this.setState(prevState => {
                const updatedEvents = [...prevState.events];

                updatedEvents.push({
                    _id: data.createEvent._id,
                    title: data.createEvent.title,
                    description: data.createEvent.description,
                    price: data.createEvent.price,
                    date: data.createEvent.date,
                    creator: {
                        _id: this.context.userId,
                    },
                });

                return {
                    events: updatedEvents,
                };
            });
        })
        .catch(error => {
            console.log(`[ERROR] Create event failed!`);
        });
    }

    viewDetailsHandler = eventId => {
        const selectedEvent = this.state.events.find(event => event._id === eventId);
        this.setState({ selectedEvent });
    }

    bookEventHandler = () => {
        const requestBody = {
            query: `
                mutation {
                    bookEvent(eventId: "${this.state.selectedEvent._id}") {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `
        }

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
                throw new Error('Create event failed!');
            }

            return response.json();
        })
        .then(resData => {
            const { data } = resData;
            console.log(data)
        })
        .catch(error => {
            console.log(`[ERROR] Create event failed!`);
        });
    }

    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null });
    }

    fetchEvets = () => {
        this.setState({ isLoading: true });

        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            email
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
            const events = resData.data.events;
            this.setState({ events });

            this.setState({ isLoading: false });
        })
        .catch(error => {
            console.log(`[ERROR] Fetch events failed!`);
            this.setState({ isLoading: false });
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className='event-page pt-5 pb-5'>

                    {/* Creating */}
                    {this.state.creating && (
                        <Modal
                            title='Create event'
                            confirmName='Create'
                            canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmHandler}>

                            <form>
                                <div className="form-group">
                                    <label htmlFor="usr">Title:</label>
                                    <input type="text" className="form-control" id="title" ref={this.titleElRef} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="usr">Price:</label>
                                    <input type="number" className="form-control" id="price" ref={this.priceElRef} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="usr">Date:</label>
                                    <input type="datetime-local" className="form-control" id="date" ref={this.dateElRef} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="usr">Description:</label>
                                    <textarea className="form-control" rows="5" id="description" ref={this.descriptionElRef} ></textarea>
                                </div>
                            </form>
                        </Modal>
                    )}

                    {/* Show event details */}
                    {this.state.selectedEvent && (
                        <Modal 
                            title='Event details'
                            confirmName='Book'
                            canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.bookEventHandler}>
                            <h5>
                                {this.state.selectedEvent.title}
                            </h5>
                            <div>
                                <span className='font-weight-bold'>Price: </span> 
                                ${this.state.selectedEvent.price}
                            </div>
                            <div>
                                <span className='font-weight-bold'>Date: </span> 
                                {new Date(this.state.selectedEvent.date).toLocaleDateString()}
                            </div>
                            <div className='mb-4'>
                                <span className='font-weight-bold'>Description: </span>
                                {this.state.selectedEvent.description}
                            </div>
                        </Modal>
                    )}

                    {this.context.token && <div className='mb-4'>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.startCreatingEventHandler}>Add event</button>
                    </div>}

                    {this.state.isLoading ? 
                        <Spinner /> :

                        (<div>
                            <h2>Events</h2>
                            <EventList 
                            events={this.state.events}
                            userId={this.context.userId}
                            onViewDetails={this.viewDetailsHandler} />
                        </div>)
                    }

                </div>
            </React.Fragment>
        )
    }
}

export default EventsPage;
