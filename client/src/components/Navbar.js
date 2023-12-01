import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import icon_light from '../assits/icon_light.png';

function Navbar({ setUsername, setUserType, setIsLoggedIn }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUsername("");
        setUserType("");
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <div className="transparent-navbar">
            <Link to="/home" className="navbar-logo">
                <img src={icon_light} alt="Audio Scribe Icon" />
                <h1>AudioScribe</h1>
            </Link>
        
            <div className="links-container">
                <ul className="nav-links">
                    <li><NavLink to="/home" activeclass="active-link">Home</NavLink></li>
                    <li><NavLink to="/upload" activeclass="active-link">Upload</NavLink></li>
                    <li><NavLink to="/fixscribe" activeclass="active-link">FixScribe</NavLink></li>
                    <li><NavLink to="/statistics" activeclass="active-link">Statistics</NavLink></li>
                    <li><NavLink to="/create-user" activeclass="active-link">Create User</NavLink></li>
                </ul>
                
                <div className="hamburger-menu" onClick={() => setShowDropdown(!showDropdown)}>
                    ☰
                </div>
                <div className="hamburger-container">
                    {showDropdown && (
                        <div className={`nav-dropdown ${showDropdown ? 'open' : 'close'}`}>
                            <div className="close-menu" onClick={() => setShowDropdown(false)}>×</div>
                            <NavLink to="/home" activeclass="active-link" onClick={() => setShowDropdown(false)}>Home</NavLink>
                            <NavLink to="/fixscribe" activeclass="active-link" onClick={() => setShowDropdown(false)}>FixScribe</NavLink>
                            <NavLink to="/upload" activeclass="active-link" onClick={() => setShowDropdown(false)}>Upload</NavLink>
                            <NavLink to="/statistics" activeclass="active-link" onClick={() => setShowDropdown(false)}>Statistics</NavLink>
                            <NavLink to="/create-user" activeclass="active-link" onClick={() => setShowDropdown(false)}>Create User</NavLink>
                            <br></br><br></br><br></br><br></br>
                            <button className="logout-btn-dropdown" onClick={() => handleLogout()}>Logout</button>
                        </div>
                    )}
                </div>
                
                <button className="logout-btn" onClick={() => handleLogout()}>Logout</button>

            </div>
      </div>
    );
}


  

export default Navbar;
