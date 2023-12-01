import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import Design from './components/Design';
import Navbar from './components/Navbar';
import NavbarLogin from './components/NavbarLogin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Upload from './pages/Upload';
import FixScribe from './pages/FixScribe';
import Statistics from './pages/Statistics'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

const SERVER_IP = "https://540c8f759648.ngrok.app"

function App() {
    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    function ProtectedRoute(props) {
      return props.isLoggedIn ? props.children : <Navigate to="/" replace />;
    }

    return (
        <Router>
            <div className="app-container">
                <div className="design-layer">
                    <Design />
                    </div>
                    <div className="nav-layer">
                      {isLoggedIn ? <Navbar setUsername={setUsername} setUserType={setUserType} setIsLoggedIn={setIsLoggedIn} /> : <NavbarLogin />}
                    </div>
                    <div className="page-layer">
                        <Routes>
                            <Route path="/" element={<SimpleBar style={{ maxHeight: '100%' }}><Login setUsername={setUsername} setUserType={setUserType} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} SERVER_IP={SERVER_IP} /></SimpleBar>} />
                            <Route path="/home" isLoggedIn={isLoggedIn} element={<ProtectedRoute isLoggedIn={isLoggedIn}><SimpleBar style={{ maxHeight: '100%' }}><Home /></SimpleBar></ProtectedRoute>} />
                            <Route path="/upload" isLoggedIn={isLoggedIn} element={<ProtectedRoute isLoggedIn={isLoggedIn}><SimpleBar style={{ maxHeight: '100%' }}><Upload userType={userType} SERVER_IP={SERVER_IP} /></SimpleBar></ProtectedRoute>} />
                            <Route path="/fixscribe" isLoggedIn={isLoggedIn} element={<ProtectedRoute isLoggedIn={isLoggedIn}><SimpleBar style={{ maxHeight: '100%' }}><FixScribe username={username} userType={userType} SERVER_IP={SERVER_IP} /></SimpleBar></ProtectedRoute>} />
                            <Route path="/statistics" isLoggedIn={isLoggedIn} element={<ProtectedRoute isLoggedIn={isLoggedIn}><SimpleBar style={{ maxHeight: '100%' }}><Statistics userType={userType} SERVER_IP={SERVER_IP} /></SimpleBar></ProtectedRoute>} />
                            <Route path="/create-user" isLoggedIn={isLoggedIn} element={<ProtectedRoute isLoggedIn={isLoggedIn}><SimpleBar style={{ maxHeight: '100%' }}><Signup userType={userType} SERVER_IP={SERVER_IP} /></SimpleBar></ProtectedRoute>} />
                        </Routes>
                    </div>
            </div>
        </Router>
    );
}

export default App;
