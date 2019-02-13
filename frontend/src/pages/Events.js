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

    componentDidMount() {
        // this.fetchEvets();
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
                            creator {
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
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(`[ERROR] Create event failed!`);
        });
    }

    modalCancelHandler = () => {
        this.setState({ creating: false });
    }

    fetchEvets = () => {
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                    }
                }
            `
        };

        fetch('http://localhost:3001/api', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            mode:'no-cors',
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
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error(error));
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
                                    <input type="text" className="form-control" id="title" ref={this.titleElRef} defaultValue='For test' />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="usr">Price:</label>
                                    <input type="number" className="form-control" id="price" ref={this.priceElRef} defaultValue='9.99' />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="usr">Date:</label>
                                    <input type="datetime-local" className="form-control" id="date" ref={this.dateElRef} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="usr">Description:</label>
                                    <textarea className="form-control" rows="5" id="description" ref={this.descriptionElRef} defaultValue='Cool story'></textarea>
                                </div>
                            </form>
                        </Modal>
                    )}

                    {this.context.token && <div className='mb-4'>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.startCreatingEventHandler}>Add event</button>
                    </div>}

                    <h2>Events list</h2>
                    <ul className="list-group">
                        <li className='list-group-item'>test</li>
                    </ul>
                </div>
            </React.Fragment>
        )
    }
}

export default EventsPage;
