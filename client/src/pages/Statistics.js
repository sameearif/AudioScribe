import React, { useEffect } from 'react';
import { useState } from 'react';
import Select from 'react-select';
import { ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import './Statistics.css'

const Statistics = ( {userType, SERVER_IP} ) => {
    const [user, setUser] = useState("");
    const [userError, setuserError] = useState("");
    const [processing, setProcessing] = useState(false);
    const [userOptions, setUserOptions] = useState([]);
    const [total, setTotal] = useState(0)
    const [dones, setDones] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await axios.get(`${SERVER_IP}/get-users`);
            const users = response.data;
            
            const options = users.map(userTuple => ({
              value: userTuple[0],
              label: userTuple[1]
            }));
            
            setUserOptions(options);
          } catch (error) {
            console.error("Error fetching users", error);
          }
        };
        
        if (userType === "admin") {
            fetchUsers();
        }
    }, [SERVER_IP, userType]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setuserError("Please select a user");
            return;
        }
        setProcessing(true);
        try {
            const response = await axios.post(`${SERVER_IP}/get-done`, {
                "user": user["value"],
            });
            if (response.data) {
                setDones(response.data);
                setTotal(response.data[0] + response.data[1])
            } else {
                console.error('Unexpected response format from server.');
            }
        } catch (error) {
            console.error('Error authenticating:', error.message);
        } finally {
            setProcessing(false);
        }
    };
    
    const donePercentage = (dones[1] / total) * 100;
    const leftPercentage = (dones[0] / total) * 100;

    if (userType === "user") {
        return (
            <div className='container'>
                <br></br><br></br>
                <div className="error-box">Only admins can access this page</div>
            </div>
        )
    }

    return (
        <div className="container">
            <form className="stats-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label className="form-label">
                        User:
                        <Select options={userOptions} onChange={(selected) => setUser(selected)} classNamePrefix="react-select" />
                        {userError && !user && <div className="error-message">Please select a user</div>}
                    </label>
                </div>
                <br></br>
                <button className={`submit-form ${processing ? 'processing' : ''}`} type="submit" disabled={processing}>Process</button>
                {processing && <div className="loader"></div>}
                <br></br><br></br>
                {total > 0 && (
                    <div className="progressBarContainer">
                        <ProgressBar className="myProgressBar">
                            <ProgressBar
                                striped
                                variant="success"
                                now={donePercentage}
                                key={1}
                                label={`${dones[1] || 0} done`}
                            />
                            <ProgressBar
                                striped
                                variant="danger"
                                now={leftPercentage}
                                key={2}
                                label={`${dones[0] || 0} left`}
                            />
                        </ProgressBar>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Statistics;
