import os
import json

import yt_dlp
import zipfile
from faster_whisper import WhisperModel

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from database import authenticate_login, create_user
from database import get_video_name, insert_audio
from database import segment_per_user, insert_segment
from database import get_json_data, get_user_audios, get_page_count, get_user_data, update_audio
from database import get_all_users, get_done_count

class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    name: str
    username: str
    password: str
    type: str

class AudioRequest(BaseModel):
    language: str
    url: str

class DataRequest(BaseModel):
    username: str
    offset: int

class JSONRequest(BaseModel):
    username: str

class AudioDataRequest(BaseModel):
    username: str

class DataLengthRequest(BaseModel):
    username: str

class DoneRequest(BaseModel):
    user: str

class UpdateRequest(BaseModel):
    audioName: int
    audioNumber: int
    username: str
    transcription: str
    startTime: float
    endTime: float
    doneAudio: bool
    deleteAudio: bool

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://192.168.100.74:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_SIZE = "base"
DEIVCE = "cpu"
COMPUTE_TYPE="int8"

model = WhisperModel(MODEL_SIZE, device=DEIVCE, compute_type=COMPUTE_TYPE)

def download_audio(url):
    path = os.path.join(ROOT_DIR, 'videos')
    audio_name = get_video_name()
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'wav',
            'preferredquality': '192',
        }],
        'postprocessor_args': [
        '-ar', '16000'
        ],
        'prefer_ffmpeg': True,
        'outtmpl': f'audios/{audio_name}'
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        res = insert_audio(path, url)
        if res:
            return (True, audio_name)
        else:
            return (False, "Video already exists in database!")
    except:
        return (False, "URL does not exist!")
    
def generate_chunks(audio_name, language):
    lang = json.loads(open("utils/language_map.json").read())[language]
    segments, _ = model.transcribe(f"audios/{audio_name}.wav", language=lang, beam_size=5)

    audios_per_user = segment_per_user()
    username = ""
    segment_data = []
    for segment in segments:
        username = min(audios_per_user, key=audios_per_user.get)
        segment_data.append((audio_name, username, segment.text.lstrip().rstrip(), segment.start, segment.end))
        audios_per_user[username] += 1

    return insert_segment(segment_data)

@app.post('/authenticate')
def authenticate(data: LoginRequest):
    return authenticate_login(data.username, data.password)

@app.post('/signup')
def signup(data: SignupRequest):
    return create_user(data.name, data.username, data.password, data.type)

@app.post('/process-video')
def process_video(data: AudioRequest):
    res = download_audio(data.url)
    if res[0]:
        return (generate_chunks(res[1], data.language), "Video processed successfully!")
    else:
        return res

@app.post("/page-count")
def page_count(data: DataLengthRequest):
    num_pages = get_page_count(data.username)
    return num_pages[0][0]

@app.post("/get-audios")
def get_audios(data: AudioDataRequest):
    audios = get_user_audios(data.username)
    zip_file = os.path.join(ROOT_DIR, f"zips/{data.username}.zip")
    with zipfile.ZipFile(zip_file, 'w') as zipf:
        for audio in audios:
            zipf.write(f"audios/{audio[0]}.wav", arcname=f"{audio[0]}.wav")
    return FileResponse(zip_file, media_type="application/octet-stream", filename=f"{data.username}.zip")

@app.post("/get-data")
def get_data(data: DataRequest):
    dataset = get_user_data(data.username, data.offset)
    return dataset

@app.put("/update-data")
def update_data(data: UpdateRequest):
    row = (data.audioNumber, data.username, data.transcription, data.startTime, data.endTime, int(data.doneAudio), int(data.deleteAudio), data.audioName)
    update_audio(row)
    return True

@app.get("/get-users")
def get_users():
    return get_all_users()

@app.post("/get-done")
def get_done(data: DoneRequest):
    return get_done_count(data.user)

@app.post("/get-json")
def get_json(data: JSONRequest):
    return get_json_data(data.username)