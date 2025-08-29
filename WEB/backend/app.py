from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from gtts import gTTS
import tempfile, os
from gtts.lang import tts_langs

SUPPORTED_LANGS = tts_langs()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/text-to-speech")
async def text_to_speech(request: Request):
    data = await request.json()
    text = data.get("text", "")
    lang = data.get("language", "en")

    if lang not in SUPPORTED_LANGS:
        raise HTTPException(status_code=400, detail=f"Unsupported language: {lang}")

    tts = gTTS(text=text, lang=lang)
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tts.save(tmp_file.name)

    return FileResponse(tmp_file.name, media_type="audio/mpeg", filename="tts.mp3")
