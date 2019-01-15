import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';


class App extends Component {
	state = {
		token: null,
		userId: null,
	}

	login = (token, userId, tokenExpiration) => {
		this.setState({ token, userId });
	}

	logout = () => {
		this.setState({ token: null, userId: null });
	}

	render() {
		return (
		<BrowserRouter>
			<React.Fragment>
			<AuthContext.Provider value={{
				token: null,
				userId: null,
				login: this.login,
				logout: this.logout,
			}}>
				<MainNavigation />
				<main>
				<Switch>
					{/* Redirect */}
					{!this.state.token && <Redirect from='/' to='/auth' exact />}
					{this.state.token && <Redirect from='/' to='/events' exact />}
					{this.state.token && <Redirect from='/auth' to='/events' exact />}					

					{/* Route */}
					{!this.state.token && <Route path='/auth' component={AuthPage} />}
					<Route path='/events' component={EventsPage} />
					{this.state.token && <Route path='/bookings' component={BookingsPage} /> }
				</Switch>
				</main>
			</AuthContext.Provider>
			</React.Fragment>
		</BrowserRouter>
		);
	}
}

export default App;
