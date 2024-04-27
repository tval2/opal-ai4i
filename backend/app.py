import asyncio
import websockets
import os
from openai import OpenAI
from pydub import AudioSegment
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()
LEMONFOX_API_KEY = os.getenv('LEMONFOX_API_KEY')

client = OpenAI(
  api_key=LEMONFOX_API_KEY,
  base_url="https://api.lemonfox.ai/v1",
)

async def transcribe(websocket, path):
    binary_total = b""
    async for message in websocket:
        binary_total += message
        audio_buffer = BytesIO(binary_total)
        print(f"Buffer size: {audio_buffer.getbuffer().nbytes} bytes")
        audio_segment = AudioSegment.from_file(audio_buffer, format="webm")
        audio_segment = audio_segment.set_frame_rate(16000).set_channels(1)
        audio_format = audio_segment.export(format="wav")
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_format,
            language="en"
        )
        print("output:::",transcription.text,":::output")
        await websocket.send(transcription.text)

start_server = websockets.serve(transcribe, "localhost", 5003)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()