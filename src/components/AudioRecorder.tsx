import { useState, useEffect } from "react";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let mediaRecorder: MediaRecorder | null = null;

    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      const newSocket = new WebSocket("ws://localhost:5003");
      setSocket(newSocket);

      newSocket.onopen = () => {
        console.log("WebSocket Connected");
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
          event.data.arrayBuffer().then((buffer) => {
            const base64String = btoa(
              String.fromCharCode(...new Uint8Array(buffer))
            );
            newSocket.send(base64String);
          });
        }
      });

      mediaRecorder.start(1000);
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
