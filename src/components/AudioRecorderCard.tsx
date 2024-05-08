import { useState, useEffect, useCallback } from "react";
import CardForm from "./CardForm";
import { promptLLM } from "../agent/llm";
import { AllowedModelTypes } from "../types/llm";
import { FormValues } from "../types/form";
import { createPromptForField } from "../prompts/prompts";
import { Box, Flex, Button, Textarea } from "@chakra-ui/react";

const starterForm: FormValues = {
  patient_name: "",
  patient_age: "",
  patient_weight: "",
  patient_chief_complaint: "",
  patient_signs_symptoms: "",
  patient_medications: "",
  patient_dob: "",
  patient_date: "",
  evacuation_location: "",
  time_onset: "",
  time_dispatched: "",
  time_en_route: "",
  time_on_scene: "",
  time_depart_ref: "",
  time_arrive_rec: "",
  time_available: "",
  eye_opening: "",
  verbal:"",
  motor: "",
  type: "",
  sex: ""

};

const AudioRecorderCard = () => {
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(starterForm);

  const CHUNK_SIZE = 5120;

  const handleNewMessage = useCallback(
    async (newMessage: string) => {
      // Generate the prompt using existing messages and the new message
      const timestamp = new Date().toLocaleTimeString(); // Current timestamp
      const prompt = createPromptForField(
        messages.join(" "),
        newMessage,
        formValues
      );
      console.log("Generated Prompt:", prompt);
      // Call the LLM with the generated prompt
      const response = await promptLLM(prompt, AllowedModelTypes.TEXT);
      console.log("LLM Response:", response);

      // Expecting response in the format {key1: 'value1', key2: 'value2'}
      const jsonMatch = response.match(/\{[^{}]*\}/);
      if (jsonMatch) {
        const jsonText = jsonMatch[0];
        const correctedJson = jsonText.replace(
          /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
          '"$2":'
        );

        try {
          const updates = JSON.parse(correctedJson); // Assuming the LLM returns a JSON string
          if (updates && typeof updates === "object") {
            setFormValues((prevValues) => ({
              ...prevValues,
              ...updates,
            }));
          }
        } catch (error) {}
      } else {
        console.log("No JSON-like data found in response.");
      }
    },
    [formValues]
  );

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
        const timestamp = new Date().toLocaleTimeString();
        const messageWithTimestamp = `${timestamp}: ${message}`;
        handleNewMessage(messageWithTimestamp);
        setMessages((prevMessages) => [...prevMessages, messageWithTimestamp]);
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
  }, [recording, handleNewMessage]);

  const updateFormValue = (fieldName: string, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  return (
    <Flex direction="row" height="100vh">
      <Box flex="1">
        <CardForm formValues={formValues} onChange={updateFormValue} />
      </Box>
      <Box flex="1" bg="gray.100" p={4}>
        <Button onClick={() => setRecording(!recording)} mb={2}>
          {recording ? "Stop Recording" : "Start Recording"}
        </Button>
        <Textarea readOnly value={messages.join('\n')} placeholder="Transcription will appear here..." />
      </Box>
    </Flex>
  );
};

export default AudioRecorderCard;
