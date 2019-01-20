import React, { Component } from 'react';

import Modal from './../components/Modal/Modal';


class EventsPage extends Component {
    state = {
        creating: false,
    }

    startCreatingEventHandler = () => {
        this.setState({ creating: true });
    }

    modalConfirmHandler = () => {
        this.setState({ creating: false });
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
                            <div>Modal content</div>
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
