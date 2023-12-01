import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SimpleBar from 'simplebar-react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import 'simplebar-react/dist/simplebar.min.css';
import axios from 'axios';
import './DataCard.css';


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function DataCard({ SERVER_IP, username, audioName, audioSrc, audioNumber, transcription, startT, endT, done, del }) {
    const [expanded, setExpanded] = useState(false);
    const [initTranscription, setInitTranscription] = useState(transcription)
    const [inputValue, setInputValue] = useState(transcription);
    const [doneAudio, setDoneAudio] = useState(done);
    const [deleteAudio, setDeleteAudio] = useState(del);
    const [initDeleteAudio, setInitDeleteAudio] = useState(del);
    const [startTimeInit, setStartTimeInit] = useState(startT.toFixed(2));
    const [endTimeInit, setEndTimeInit] = useState(endT.toFixed(2));
    const [startTime, setStartTime] = useState(startT.toFixed(2));
    const [endTime, setEndTime] = useState(endT.toFixed(2));
    const [tempStartTime, setTempStartTime] = useState(startT.toFixed(2));
    const [tempEndTime, setTempEndTime] = useState(endT.toFixed(2));
    const [isStartTimeChanged, setIsStartTimeChanged] = useState(false);
    const [isEndTimeChanged, setIsEndTimeChanged] = useState(false);
    const [isTranscriptionEdited, setIsTranscriptionEdited] = useState(false);
    const [metadataLoaded, setMetadataLoaded] = useState(false);
    const audioRef = useRef(null);   

    const handleMetadataLoaded = () => {
        setMetadataLoaded(true);
        const audioEl = audioRef.current;
        audioEl.currentTime = parseFloat(startTime);
    };

    const attachAudioRef = (element) => {
        if (element) {
            audioRef.current = element;
            audioRef.current.addEventListener("loadedmetadata", handleMetadataLoaded);
        }
    };

    useEffect(() => {
        const audioEl = audioRef.current;

        const handleTimeUpdate = () => {
            if (metadataLoaded) {
                if (audioEl.currentTime < startTime || audioEl.currentTime >= endTime) {
                    audioEl.pause();
                    audioEl.currentTime = parseFloat(startTime);
                }
            }
        };
        
        if (audioEl) {
            audioEl.addEventListener("timeupdate", handleTimeUpdate);
        }

        return () => {
            if (audioEl) {
                audioEl.removeEventListener("timeupdate", handleTimeUpdate);
            }
        };
    }, [startTime, endTime, metadataLoaded]);

    const updateAudioTimeButton = (time) => {
        const audioEl = audioRef.current;
        if (!audioEl) return;
        audioEl.pause();
        audioEl.currentTime = parseFloat(time);
    };

    const updateAudioTimeText = () => {
        const audioEl = audioRef.current;
        if (!audioEl) return;
        audioEl.pause();
        audioEl.currentTime = parseFloat(startTime);
    };


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setIsTranscriptionEdited(event.target.value !== initTranscription);
    };

    const adjustTime = (time, increment) => {
        return parseFloat(parseFloat(time) + increment).toFixed(2);
    };

    const handleStartTimeIncrease = () => {
        const newStartTime = adjustTime(tempStartTime, 0.01);
        setTempStartTime(newStartTime);
        setStartTime(newStartTime);
        
        if (newStartTime !== startTimeInit) {
            setIsStartTimeChanged(true);
        } else {
            setIsStartTimeChanged(false);
        }
        updateAudioTimeButton(newStartTime);
    };
    
    const handleStartTimeDecrease = () => {
        const newStartTime = adjustTime(tempStartTime, -0.01);
        setTempStartTime(newStartTime);
        setStartTime(newStartTime)
    
        if (newStartTime !== startTimeInit) {
            setIsStartTimeChanged(true);
        } else {
            setIsStartTimeChanged(false);
        }
        updateAudioTimeButton(newStartTime);
    };
    

    const handleEndTimeIncrease = () => {
        const newEndTime = adjustTime(tempEndTime, 0.01);
        setTempEndTime(newEndTime);
        setEndTime(newEndTime)
    
        if (newEndTime !== endTimeInit) {
            setIsEndTimeChanged(true);
        } else {
            setIsEndTimeChanged(false);
        }
        updateAudioTimeButton(startTime);
    };
    
    const handleEndTimeDecrease = () => {
        const newEndTime = adjustTime(tempEndTime, -0.01);
        setTempEndTime(newEndTime);
        setEndTime(newEndTime)
    
        if (newEndTime !== endTimeInit) {
            setIsEndTimeChanged(true);
        } else {
            setIsEndTimeChanged(false);
        }
        updateAudioTimeButton(startTime);
    };
    
    const handleStartTimeBlur = (e) => {
        const newValue = parseFloat(e.target.value).toFixed(2);
        if (newValue !== startTime && newValue <= endTime && newValue >= 0) {
            setTempStartTime(newValue);
            setStartTime(newValue);
            setIsStartTimeChanged(true);
        } else {
            setTempStartTime(startTime);
            setIsStartTimeChanged(false);
        }
        updateAudioTimeText()
    };
    
    const handleEndTimeBlur = (e) => {
        const newValue = parseFloat(e.target.value).toFixed(2);
        if (newValue !== endTime && newValue >= startTime) {
            setTempEndTime(newValue);
            setEndTime(newValue);
            setIsEndTimeChanged(true);
        } else {
            setTempEndTime(endTime);
            setIsEndTimeChanged(false);
        }
        updateAudioTimeText()
    };

    const handleCheckboxChange = (event) => {
        setDeleteAudio(event.target.checked);
    };

    const handleSaveClick = async () => {
        if (!(isStartTimeChanged || isEndTimeChanged || isTranscriptionEdited || (initDeleteAudio !== deleteAudio)) && doneAudio) {
            return;
        }
        const dataToSend = {
                            "audioName": audioName, 
                            "audioNumber": audioNumber, 
                            "username": username, 
                            "transcription": inputValue, 
                            "startTime": startTime, 
                            "endTime": endTime, 
                            "doneAudio": true, 
                            "deleteAudio": deleteAudio
                            };
        try {
            const response = await axios.put(`${SERVER_IP}/update-data`, dataToSend);
            if (response.data) {
                setDoneAudio(true);
                setInitDeleteAudio(deleteAudio);
                setInitTranscription(inputValue);
                setStartTimeInit(startTime);
                setEndTimeInit(endTime);
                setIsTranscriptionEdited(false);
                setIsStartTimeChanged(false);
                setIsEndTimeChanged(false);
            } else {
                console.error('Unexpected response format from server.');
            }
        } catch (error) {
            console.error('Error sending data to the server:', error.message);
        }
    };

  return (
    <div className="card-container">
        <Card className="card">
            <CardHeader
                title={`Audio ${audioNumber}`}
                onClick={handleExpandClick}
                style={{ color: doneAudio ? '#00FF00' : 'inherit' }}
                action={
                    <CardActions disableSpacing>
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon className="card-button" />
                        </ExpandMore>
                    </CardActions>
                }
            />

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <audio className="audio-control" id="audio" controls ref={attachAudioRef}>
                        <source src={audioSrc} type="audio/wav" />
                    </audio>
                    <TableContainer className="table-container">
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Transcription</TableCell>
                                    <TableCell>Start Time</TableCell>
                                    <TableCell>End Time</TableCell>
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="transcription-cell">
                                    <div className='transcription'>
                                        <TextField
                                            className="textfield"
                                            variant="outlined"
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            multiline
                                            rows={5}
                                        >
                                            <SimpleBar style={{ maxHeight: '150px'}}>
                                                {inputValue}
                                            </SimpleBar>
                                        </TextField>
                                    </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="time-controls">
                                            <Button className="adjust-time-button" onClick={handleStartTimeDecrease} disabled={Boolean(tempStartTime <= 0)}>-</Button>
                                            <TextField 
                                                value={tempStartTime}
                                                onChange={e => setTempStartTime(e.target.value)}
                                                onBlur={handleStartTimeBlur}
                                            />
                                            <Button className="adjust-time-button" onClick={handleStartTimeIncrease} disabled={tempStartTime === tempEndTime}>+</Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="time-controls">
                                            <Button className="adjust-time-button" onClick={handleEndTimeDecrease} disabled={Boolean(tempEndTime <= 0 | tempEndTime === tempStartTime)}>-</Button>
                                            <TextField 
                                                value={tempEndTime}
                                                onChange={e => setTempEndTime(e.target.value)}
                                                onBlur={handleEndTimeBlur}
                                            />
                                            <Button className="adjust-time-button" onClick={handleEndTimeIncrease}>+</Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            style={{"color":"white"}}
                                            checked={Boolean(deleteAudio)}
                                            onChange={handleCheckboxChange}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <button className="save-data" type="submit" onClick={handleSaveClick} >Save</button>
                </CardContent>
            </Collapse>
        </Card>
    </div>
);

}

export default DataCard;
