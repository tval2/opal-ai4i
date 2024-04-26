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
    async for message in websocket:
        print(f"Received message type: {type(message)}")  # Should confirm 'bytes'
        if isinstance(message, str):
            print("Expected binary data, received text.")
            continue  # Skip processing if message is text

        try:
            audio_buffer = BytesIO(message)
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

            # Send the transcription back to the client
            await websocket.send(transcription.text)

        except Exception as e:
            print(f"Error: {e}")

start_server = websockets.serve(transcribe, "localhost", 5003)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()