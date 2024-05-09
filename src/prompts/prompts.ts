import { FormValues } from "../types/form";
//import msg from "./example_transcript";

export function createPromptForField(
  past_transcription: string,
  latest_message: string,
  formValues: FormValues
) {
  const fieldsString = Object.entries(formValues)
    .map(([key, value]) => {
      return `  - ${key}: "${value || ""}"`;
    })
    .join("\n");

  return (
    "You're an expert paramedic and emergency responder. We need your help to fill out this ePCR form for an ongoing emergency." +
    " I will give you the transcription of the conversation with the patient so far (it'll be incomplete as it comes in audio chunks live)." +
    " Since diarization isn't implemented yet you'll have to infer who is saying what between paramedics and the patient. " +
    "Since the Whisper speech-to-text model isn't perfect some of the words will likely have been " +
    "transcribed incorrectly and you'll have to figure out the answers even with the errors present.\n" +
    "You must decide which fields to fill out (or edit if there's already a value and you think it's wrong)." +
    " It's perfectly okay if given the transcription so far you don't fill any of them or if you end up leaving some of them blank. " +
    "We must be careful not to make up answers since in healthcare it's better to have no data than to have incorrect data.\n" +
    "Here's the transcription so far:\n" +
    `"${past_transcription}"\n\n` +
    "The fields in the ePCR form are below." +
    " Some of them may already be filled out (so only include those in your response if you want to change the existing answer):" +
    `\n${fieldsString}\n\n` +
    "Since we are using your output in our code base we need your answer to include a json format" +
    " {key_1: 'new_value_1', key_2: 'new_value_2', ...} of just the keys to update the values of.  " +
    "If you return a key-value pair for a key that already has a value, I'll assume you want to edit " +
    "the existing value above (only do this if you truly want to change the answer rather than keep what it has). " +
    "And if you return a value for a key that is currently blank i'll assume you want to add the new value in the field. " +
    "I've provided the keys we use in our code for you in the prompt above (e.g. to the left of the colon like 'patient_name').\n\n" +
    "Think in steps by first considering which useful information is in the transcript and what information is already filled out in the form." +
    " Then decide what keys to either add or edit. If a key already has a value and you want to keep then no need to include it in your response. " +
    "The final answer must include a json version at the end of your answer (which I'll parse in my code to process and update the form)."
  );
}
