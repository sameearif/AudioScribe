import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import Select from 'react-select';
import axios from 'axios';
import './Signup.css'

const Signup = ( {userType, SERVER_IP} ) => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [nameError, setNameError] = useState("");
    const [typeError, setTypeError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [signupSuccess, setSignupSuccess] = useState(false);

    const typeOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
    ];

    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setNameError("");
        setUsernameError("");
        setPasswordError("");
        setSignupSuccess(false);

        if (!name) {
            setNameError("Name is required!")
        }

        if (!username) {
            setUsernameError("Username is required!");
        }
        if (!password) {
            setPasswordError("Password is required!");
        }
        if (!type) {
            setTypeError("Account type is required!")
        }

        if (!name || !password || !username) {
            return
        }

        try {
            const hashedPassword = await hashPassword(password);
            const response = await axios.post(`${SERVER_IP}/signup`, {
                "name": name,
                "username": username,
                "password": hashedPassword,
                "type": type["value"]
            });
            if (!response.data) {
                    setUsernameError("Username already exists!")
            } else {
                setSignupSuccess(true)
            }
        } catch (error) {
            console.error('Error authenticating:', error.message);
        }

    };

    if (userType === "user") {
        return (
            <div className='container'>
                <br></br><br></br>
                <div className="error-box">Only admins can access this page</div>
            </div>
        )
    }

    return (
        <div>
            <div className="container">
            <form className="login-form" onSubmit={handleSubmit}>
                 <div className="form-row">
                    <label className="form-label">
                        Account Type:
                        <Select options={typeOptions} onChange={(selected) => setType(selected)} classNamePrefix="react-select" />
                        {typeError && !type && <div className="error-message">{typeError}</div>}
                    </label>
                </div>
                <br></br>
                <div className="form-row">
                        <label className="form-label">
                            Name:
                            <input className="user-details" type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
                            {nameError && <div className="error-message">{nameError}</div>}
                        </label>
                </div>
                <br />
                <div className="form-row">
                    <label className="form-label">
                        Username:
                        <input className="user-details" autoComplete="off" type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" />
                        {usernameError && <div className="error-message">{usernameError}</div>}
                    </label>
                </div>
                <br />
                <div className="form-row">
                    <label className="form-label">
                        Password:
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input className="user-details" type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="view-password-button"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {passwordError && <div className="error-message">{passwordError}</div>}
                    </label>
                </div>
                <br />
                <button className="submit-form" type="submit">Signup</button>
                <br></br>
                {signupSuccess && <div className="signup-message">Signup successful!</div>}
            </form>
        </div>
        </div>
    );
};

export default Signup;
