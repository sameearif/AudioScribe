import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import Typewriter from '../components/Typewriter';
import SHA256 from 'crypto-js/sha256';
import axios from 'axios';

const Login = ( { SERVER_IP, setUsername, setUserType, isLoggedIn, setIsLoggedIn } ) => {
    const [tempUsername, setTempUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [processing, setIsProcessing] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
          navigate('/home');
        }
    }, [isLoggedIn, navigate]);

    const hashPassword = (password) => {
        return SHA256(password).toString();
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setUsernameError("");
        setPasswordError("");

        if (!tempUsername) {
            setUsernameError("Username is required!");
        }
        if (!password) {
            setPasswordError("Password is required!");
        }

        if (!password || !tempUsername) {
            return
        }

        try {
            const hashedPassword = hashPassword(password);
            const response = await axios.post(`${SERVER_IP}/authenticate`, {
                "username": tempUsername,
                "password": hashedPassword
            });
            if (response.data) {
                if (!response.data[0]) {
                    setUsernameError(response.data[1])
                    setPasswordError(response.data[2])
                } else {
                    setUsername(tempUsername)
                    setUserType(response.data[1]);
                    setIsLoggedIn(true);
                }
            } else {
                console.error('Unexpected response format from server.');
            }
        } catch (error) {
            console.error('Error authenticating:', error.message);
        }
        setIsProcessing(false);
    };

    return (
        <div>
            <div className="typewriter-container">
                <Typewriter />
            </div>
            <div className="container">
            <form className="login-form" onSubmit={handleLogin}>
                <div className="form-row">
                    <label className="form-label">
                        Username:
                        <input className="user-details" type="text" onChange={(e) => setTempUsername(e.target.value)} placeholder="Enter Username" />
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
                <button className={`submit-form ${processing ? 'processing' : ''}`} type="submit" disabled={processing} >Login</button>
            </form>
        </div>
        </div>
    );
};

export default Login;
