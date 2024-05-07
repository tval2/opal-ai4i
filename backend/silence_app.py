# This kind of works, has some errors, doesn't get all user audio properly.

import asyncio
import websockets
import os
from openai import OpenAI
from pydub import AudioSegment, silence
from io import BytesIO
from dotenv import load_dotenv
import logging
import tempfile
import subprocess

# Initialize logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables
load_dotenv()
LEMONFOX_API_KEY = os.getenv('LEMONFOX_API_KEY')

# Initialize the OpenAI client
client = OpenAI(
    api_key=LEMONFOX_API_KEY,
    base_url="https://api.lemonfox.ai/v1",
)

# Configuration for audio processing
CHUNK_SIZE = 5120  # Adjust this size based on your expected data rates and frame sizes
MIN_SILENCE_LENGTH = 500  # in ms, adjust based on your audio characteristics
SILENCE_THRESHOLD = -30  # in dBFS, adjust based on your audio characteristics
OVERLAP_RATIO = 0.5  # Ratio of overlap between consecutive segments, adjust as needed
BUFFER_SIZE = 50000  # Buffer size before processing, adjust based on trial and error

async def transcribe(websocket, path):
    binary_total = b""

    try:
        async for message in websocket:
            binary_total += message

            # Check if accumulated data is sufficient for processing
            if len(binary_total) < BUFFER_SIZE:
                continue  # Wait for more data to accumulate

            # Processing audio with ffmpeg via a temporary file
            with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as temp_file:
                temp_file.write(binary_total)
                temp_file_path = temp_file.name

            # Re-encode the received chunk to ensure it's a valid WebM file
            output_path = f"{temp_file_path}_processed.webm"
            cmd = [
                'ffmpeg', '-y', '-i', temp_file_path,
                '-c', 'copy',  # Copy streams to avoid re-encoding
                '-f', 'webm', output_path
            ]

            # Execute the ffmpeg command
            process = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            if process.returncode != 0:
                logging.error("ffmpeg error: %s", process.stderr.decode())
                await websocket.send("Error processing audio")
                continue  # Skip further processing if ffmpeg fails

            try:
                # Process the newly created WebM file
                audio_segment = AudioSegment.from_file(output_path, format="webm")
                audio_segment = audio_segment.set_frame_rate(16000).set_channels(1)
                non_silent_audio = silence.split_on_silence(
                    audio_segment,
                    min_silence_len=MIN_SILENCE_LENGTH,
                    silence_thresh=SILENCE_THRESHOLD,
                    keep_silence=200,
                    seek_step=int(MIN_SILENCE_LENGTH * OVERLAP_RATIO)
                )

                combined_audio = AudioSegment.empty()
                for chunk in non_silent_audio:
                    combined_audio += chunk

                if len(combined_audio) > 0:
                    audio_buffer = BytesIO()
                    combined_audio.export(audio_buffer, format="wav")
                    audio_buffer.seek(0)

                    transcription = client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_buffer,
                        language="en"
                    )
                    await websocket.send(transcription.text)
                else:
                    await websocket.send("Silence detected, no transcription sent.")
            except Exception as e:
                logging.error("Error processing audio file: %s", str(e))
                await websocket.send("Error processing audio: " + str(e))
            finally:
                # Cleanup the processed file
                os.remove(output_path)

            # Cleanup original temporary file
            os.remove(temp_file_path)

            # Clear the buffer after processing
            binary_total = b""
    except Exception as e:
        logging.error("WebSocket error: ", exc_info=True)
        await websocket.send("WebSocket error: " + str(e))

# Setup and run the WebSocket server
async def main():
    async with websockets.serve(transcribe, "localhost", 5003):
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
