import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import icon_light from '../assits/icon_light.png';

function NavbarLogin() {
    return (
        <div className="transparent-navbar">
            <Link to="/" className="navbar-logo">
                <img src={icon_light} alt="Audio Scribe Icon" />
                <h1>AudioScribe</h1>
            </Link>
        
      </div>
    );
}

export default NavbarLogin;
