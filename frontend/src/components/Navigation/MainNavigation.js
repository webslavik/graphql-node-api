import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from './../../context/auth-context';


const mainNavigation = props => (
    <AuthContext.Consumer>
        {context => {
            return (
                <nav className="navbar navbar-expand-sm bg-light fixed-top">
                    <NavLink to='/' className="navbar-brand">Logo</NavLink>
                    <ul className='navbar-nav'>
                        {!context.token && (
                            <li className="nav-item">
                                <NavLink to='auth' className="nav-link">Authenticate</NavLink>
                            </li>
                        )}
                        {context.token && (
                            <li>
                                <NavLink to='bookings' className="nav-link">Bookings</NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink to='events' className="nav-link">Events</NavLink>
                        </li>
                    </ul>
                </nav>

            )
        }}
    </AuthContext.Consumer>
)

export default mainNavigation;
