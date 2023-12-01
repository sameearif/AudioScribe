import React, { useState, useEffect, useRef } from 'react';
import DataCard from '../components/DataCard';
import { ProgressBar } from 'react-bootstrap';
import Select from 'react-select';
import JSZip from 'jszip';
import axios from 'axios';
import './FixScribe.css'

function FixScribe({ username, SERVER_IP }) {
    const itemsPerPage = 10;
    const dropdownRef = useRef(null);
    const [audios, setAudios] = useState([]);
    const [menuPlacement, setMenuPlacement] = useState('auto');
    const [currentPage, setCurrentPage] = useState(1); 
    const [dataLength, setDataLength] = useState(0);
    const [data, setData] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isAudioLoaded, setIsAudioLoaded] = useState(false);
    const [total, setTotal] = useState(0);
    const [dones, setDones] = useState({});
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        const fetchDones = async () => {
            try {
                const response = await axios.post(`${SERVER_IP}/get-done`, {
                    "user": username,
                });
                if (response.data) {
                    setDones(response.data);
                    setTotal(response.data[0] + response.data[1])
                } else {
                    console.error('Unexpected response format from server.');
                }
            } catch (error) {
                console.error('Error authenticating:', error.message);
            }
        }
        fetchDones()
    }, [SERVER_IP, username])

    const donePercentage = (dones[1] / total) * 100;
    const leftPercentage = (dones[0] / total) * 100;

    useEffect(() => {
        const fetchAndUnzipAudio = async () => {
            try {
                const response = await axios.post(`${SERVER_IP}/get-audios`, {"username": username}, { responseType: 'arraybuffer' });
                const zip = await JSZip.loadAsync(response.data);
                const audioPromises = [];
    
                zip.forEach((relativePath, zipEntry) => {
                    const promise = zipEntry.async('blob').then(blob => {
                        const url = URL.createObjectURL(blob);
                        return {name: relativePath, url: url};
                    });
    
                    audioPromises.push(promise);
                });
    
                const audioFiles = await Promise.all(audioPromises);
                const audioMap = audioFiles.reduce((acc, {name, url}) => {
                    acc[name] = url;
                    return acc;
                }, {});
                setAudios(audioMap);
                setIsAudioLoaded(true);
            } catch (error) {
                console.error("Error fetching audio:", error);
            }
        };
    
        fetchAndUnzipAudio();
    }, [SERVER_IP, username]);
    
    useEffect(() => {
        const fetchPageLength = async () => {
            try {
                const response = await axios.post(`${SERVER_IP}/page-count`, {
                    "username": username,
                });
                setDataLength(response.data);
            } catch (error) {
                console.error('There was an error fetching data', error);
            }
        };

        fetchPageLength();
    }, [SERVER_IP, username]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${SERVER_IP}/get-data`, {
                    "username": username,
                    "offset": (currentPage - 1) * 10
                });
                setData(response.data);
                setIsDataLoaded(true);
            } catch (error) {
                console.error('There was an error fetching data', error);
            }
        };

        fetchData();
    }, [SERVER_IP, username, currentPage]);

    const totalPages = Math.ceil(dataLength / itemsPerPage);
    const options = Array.from({ length: totalPages }, (_, i) => ({
        value: i + 1,
        label: `Page ${i + 1}`
    }));

    const determinePlacement = () => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.BoundingClientRect();
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;
    
            if (spaceAbove > spaceBelow) {
                setMenuPlacement('top');
            } else {
                setMenuPlacement('auto');
            }
        }
    };

    const handleDownload = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const response = await axios.post(`${SERVER_IP}/get-json`, {
                "username": username,
            });
            const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${username}.json` 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('There was an error fetching data', error);
        }
        setProcessing(false)
    };

    if (!isAudioLoaded || !isDataLoaded) {
        return (
            <div className="loader-container">
                <div className="loader"></div>;
            </div>
        )
    }

    if ((isAudioLoaded && isDataLoaded) && dataLength - 1 === 0) {
        return (
            <div className='container'>
                <br></br><br></br>
                <div className="error-box">No audios are assigned to you yet.</div>
            </div>
        )
    }

    return (
        <div className="container">
            <br></br><br></br>
            <h4 className='headings'>Progress:</h4>
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
        <br></br><br></br>
        <h4 className='headings'>Audios:</h4>
          <div className="data-cards">
              {data.map((item, index) => (
                  <div key={item[0]}>
                      <DataCard SERVER_IP={SERVER_IP} username={username} audioName={item[0]} audioSrc={audios[`${item[1]}.wav`]} audioNumber={((currentPage - 1) * 10) + index + 1} transcription={item[2]} startT={item[3]} endT={item[4]} done={item[5]} del={item[6]} />
                  </div>
              ))}
          </div>
          <form className="download-form" onSubmit={handleDownload}>
                <button className={`download ${processing ? 'processing' : ''}`} type="submit" disabled={processing}>Export JSON</button>
                {processing && 
                <div className="loader-container">
                    <div className="loader"></div>;
                </div>}
            </form>
            <br></br><br></br>
          <div className="pagination-dropdown">
            <Select
                className="page-dropdown"
                onMenuOpen={determinePlacement}
                options={options} 
                value={{ label: `Page ${currentPage}`, value: currentPage }}
                onChange={option => setCurrentPage(option.value)}
                classNamePrefix="react-select"
                menuPlacement={menuPlacement}
            />
          </div>
      </div>
    );
}


export default FixScribe;
