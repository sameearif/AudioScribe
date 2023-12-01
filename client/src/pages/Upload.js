import React from 'react';
import { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './Upload.css'

const Upload = ( { userType, SERVER_IP} ) => {
    const [language, setLanguage] = useState(null);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [languageError, setLanguageError] = useState("");
    const [youtubeLinkError, setYoutubeLinkError] = useState("");
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const languageOptions = [
        { value: 'English', label: 'English' },
        { value: 'Urdu', label: 'Urdu' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLanguageError("");
        setYoutubeLinkError("");
        setError("");
        setSuccess("");

        if (!language) {
            setLanguageError("Language is required!");
        }
        if (!youtubeLink) {
            setYoutubeLinkError("Youtube Link is required!");
        }

        if (!language || !youtubeLink) {
            return;
        }
        setProcessing(true)
        try {
            const response = await axios.post(`${SERVER_IP}/process-video`, {
                "language": language["value"],
                "url": youtubeLink
            });
            if (response.data) {
                if (!response.data[0]) {
                    setError(response.data[1])
                } else {
                    setSuccess(response.data[1])
                }
            } else {
                console.error('Unexpected response format from server.');
            }
        } catch (error) {
            console.error('Error authenticating:', error.message);
        } finally {
            setProcessing(false);
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
        <div className="container">
            <form className="upload-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label className="form-label">
                        Language:
                        <Select options={languageOptions} isDisabled={processing} onChange={(selected) => setLanguage(selected)} classNamePrefix="react-select" />
                        {languageError && !language && <div className="error-message">{languageError}</div>}
                    </label>
                </div>
                <br></br>
                <div className="form-row">
                    <input className="youtube-link" type="text" disabled={processing} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="Enter Youtube Link" />
                    <div>{youtubeLinkError && <div className="error-message">{youtubeLinkError}</div>}</div>
                </div>
                <br></br>
                <button className={`submit-form ${processing ? 'processing' : ''}`} type="submit" disabled={processing}>Process</button>
                {processing && <div className="loader"></div>}
                <div>{error && <div className="process-e-message">{error}</div>}</div>
                <div>{success && <div className="process-s-message">{success}</div>}</div>
            </form>
        </div>
    );
};

export default Upload;
