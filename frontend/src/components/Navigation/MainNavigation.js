import React from 'react';
import { NavLink } from 'react-router-dom';


const mainNavigation = props => (
    <nav className="navbar navbar-expand-sm bg-light fixed-top">
        <NavLink to='/' className="navbar-brand">Logo</NavLink>

        <ul className='navbar-nav'>
            <li className="nav-item">
                <NavLink to='auth' className="nav-link">Authenticate</NavLink>
            </li>
            <li>
                <NavLink to='events' className="nav-link">Events</NavLink>
            </li>
            <li>
                <NavLink to='bookings' className="nav-link">Bookings</NavLink>
            </li>
        </ul>
    </nav>
)

export default mainNavigation;
