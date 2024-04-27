import { useState, useEffect } from "react";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const CHUNK_SIZE = 5120;

  useEffect(() => {
    let mediaRecorder: MediaRecorder | null = null;

    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });

      const newSocket = new WebSocket("ws://localhost:5003");
      setSocket(newSocket);

      newSocket.onopen = () => {
        console.log("WebSocket Connected");
      };

      newSocket.onclose = () => {
        console.log("WebSocket Closed");
      };

      newSocket.onmessage = (event) => {
        const message = event.data;
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      newSocket.onerror = (error) => {
        console.log("WebSocket Error: ", error);
      };

      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (newSocket.readyState === WebSocket.OPEN) {
          newSocket.send(event.data); // Send the Blob data directly
        }
      });

      mediaRecorder.start(CHUNK_SIZE);
      setRecording(true);
    };

    const stopRecording = () => {
      mediaRecorder?.stop();
      socket?.close();
      setRecording(false);
    };

    if (recording) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      mediaRecorder?.stop();
      socket?.close();
    };
  }, [recording]);

  return (
    <div>
      <button onClick={() => setRecording(!recording)}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default AudioRecorder;
