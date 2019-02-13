import React, { Component } from 'react';

import AuthContext from './../context/auth-context';


class AuthPage extends Component {
    state = {
        isLogin: true,
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return {
                isLogin: !prevState.isLogin,
            }
        });
    }

    submitHandler = event => {
        event.preventDefault();

        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 ||
            password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query {
                    login(email: "${email}", password: "${password}") {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        };

        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {email: "${email}", password: "${password}"}) {
                            _id
                            email
                            password
                        }
                    }
                `
            };
        }

        fetch('http://localhost:3001/api', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.status !== 200 &&
                response.status !== 201) {
                throw new Error('Failed!');
            }

            return response.json();
        })
        .then(respData => {
            if (respData.data.login) {
                console.log('Sign in:', respData);
                
                this.context.login(
                    respData.data.login.token,
                    respData.data.login.userId,
                    respData.data.login.tokenExpiration
                  );

                return;
            }

            console.log('Sign up:', respData);
        })
        .catch(error => {
            console.log(`[ERROR] Auth failed!`);
        });
            
    }

    render() {
        return (
            <div className='container mb-5'>
                <div className='row justify-content-center pt-5'>
                    <div className='col-sm-4'>
                        <h1 className='mb-4'>
                            {this.state.isLogin ? 'Sign in' : 'Sign up'}
                        </h1>
                        <form onSubmit={this.submitHandler}>
                            <div className="form-group">
                                <label htmlFor="email">Email address:</label>
                                <input type="text" className="form-control" id="email" ref={this.emailEl} defaultValue='slavik.sukhanov@gmail.com' />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pwd">Password:</label>
                                <input type="password" className="form-control" id="pwd" ref={this.passwordEl} defaultValue='123456' />
                            </div>
                            <button type="submit" className="btn btn-primary mr-3">Submit</button>
                            <button type="button" className="btn" onClick={this.switchModeHandler}>
                                Switch to {this.state.isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default AuthPage;
