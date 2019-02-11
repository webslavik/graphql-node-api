import React, { Component } from 'react';

import Modal from './../components/Modal/Modal';
import AuthContext from './../context/auth-context';


class EventsPage extends Component {
    state = {
        creating: false,
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    startCreatingEventHandler = () => {
        this.setState({ creating: true });
    }

    modalConfirmHandler = () => {
        this.setState({ creating: false });

        const event = {
            title: this.titleElRef.current.value,
            price: +this.priceElRef.current.value,
            date: this.dateElRef.current.value,
            description: this.dateElRef.current.value,
        }

        // TODO: simple validation
        if (event.title.trim().length === 0 ||
            event.price <= 0 ||
            event.date.trim().length === 0 ||
            event.description.trim().length === 0) {
            console.log('validation failed')
            return;
        }

        const token = this.context.token;

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {title: "${event.title}", price: "${event.price}", date: ${event.date}", description: ${event.description}) {
                        _id
                        title
                        description
                        price
                        date
                        creator
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
            return response.json();
        })
        .then(data => {
            console.log(data);
        });
    }

    modalCancelHandler = () => {
        this.setState({ creating: false });
    }

    render() {
        return (
            <React.Fragment>
                <div className='event-page pt-5'>
                    {this.state.creating && (
                        <Modal
                            title='Create event'
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
                                    <textarea className="form-control" rows="5" id="description" ref={this.descriptionElRef}></textarea>
                                </div>
                            </form>
                        </Modal>
                    )}

                    <div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.startCreatingEventHandler}>Add event</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default EventsPage;
