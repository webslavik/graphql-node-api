import React, { Component } from 'react';


class AuthPage extends Component {
    state = {
        isLogin: true,
    }

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
        .then(response => {
            console.log(response);
        })
        .catch(error => console.log(error));
            
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
                                <input type="text" className="form-control" id="email" ref={this.emailEl} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pwd">Password:</label>
                                <input type="password" className="form-control" id="pwd" ref={this.passwordEl} />
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
