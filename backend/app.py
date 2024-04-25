import asyncio
import websockets
import whisper
import base64
import numpy as np
import torch

# Load the Whisper model
print("why")
model = whisper.load_model("base.en")
print("why2")

async def transcribe(websocket, path):
    async for message in websocket:
        try:
            # Decode the base64-encoded audio data
            audio_bytes = base64.b64decode(message)

            # Ensure the buffer length is a multiple of 2 for np.int16
            if len(audio_bytes) % 2 != 0:
                print("ooookay")
                audio_bytes = audio_bytes[:-1]  # Remove last byte if odd

            # Convert the audio bytes to a numpy array
            audio_np = np.frombuffer(audio_bytes, dtype=np.int16)

            # Convert the audio data to float32
            audio_float = audio_np.astype(np.float32) / np.iinfo(np.int16).max

            # Transcribe the audio using the Whisper model
            audio = whisper.pad_or_trim(audio_float.flatten())
            mel = whisper.log_mel_spectrogram(audio).to(model.device)
            _, transcription, _ = model.transcribe(mel)

            # Send the transcription back to the client
            await websocket.send(transcription.text)

        except Exception as e:
            print(f"Error: {e}")

start_server = websockets.serve(transcribe, "localhost", 5003)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()