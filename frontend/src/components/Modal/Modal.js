import React from 'react';

import AuthContext from './../../context/auth-context';

import './Modal.css'

const modal = props => (
    <AuthContext.Consumer>
        {context => {
            return (
                <div className='custom-modal justify-content-center align-items-center position-fixed'>
                    {/* Backdrop */}
                    <div
                        className='custom-modal-backdrop position-fixed'
                        onClick={props.onCancel}>
                    </div>

                    {/* Content */}
                    <div className='custom-modal-content card'>
                        <div className="card-header bg-primary text-light">{props.title}</div>
                        <div className='card-body'>
                            {props.children}

                            <div className='modal-actions'>
                                {props.canCancel && (
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={props.onCancel}>
                                        Cancel
                                    </button>
                                )}
                                {props.canConfirm && context.token && (
                                    <button
                                        type="button"
                                        className="btn btn-primary mr-3"
                                        onClick={props.onConfirm}>
                                        {props.confirmName}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }}
    </AuthContext.Consumer>
);

export default modal;
