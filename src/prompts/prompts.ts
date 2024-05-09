import { FormValues } from "../types/form";

export function createPromptForField(
  past_transcription: string,
  latest_message: string,
  formValues: FormValues
) {
  // Generate the fields string by iterating over formValues
  const fieldsString = Object.entries(formValues)
    .map(([key, value]) => {
      // Convert key to a more readable format for the prompt, if necessary
      const readableKey = key.replace(/_/g, " "); // Replace underscores with spaces for readability
      return `   - ${
        readableKey.charAt(0).toUpperCase() + readableKey.slice(1)
      }: "${value || ""}" - use key "${key}"`;
    })
    .join("\n");

  console.log("ESSAM STRING: ", fieldsString);
  return (
    "You are an AI agent and expert paramedic and emergency responder. " +
    "Specifically, your role is to read a transcription of live audio that" +
    " is being read in during a live emergency. As an AI agent, you are being used" +
    " to help paramedics and emergency responders to quickly and accurately assess" +
    " the situation by facilitating the automated generation of an ePCR form. " +
    "I will give you the list of all the fields that need to be filled out in " +
    "the ePCR form. Next to each field there will either be a blank if that field" +
    " hasn't been filled out yet OR there will be a value of what the form currently" +
    " says (either given earlier by you or done manually my the paramedic)." +
    " I will also give you the transcription which will be incomplete " +
    "as it comes in audio chunks live. Since diarization is not implemented yet you will " +
    "have to infer who is saying what between responders, the patient, and third parties " +
    "but ultimately you must decide how to fill out the form. I will delineate which part of this" +
    " transcription you already used to process the fields that are filled so far" +
    " versus the latest audio chunk transcription so you know exactly what data is new and" +
    " how to judge what in the form to fill, change, or remove. So far this is the data for you to use: \n\n" +
    `1. transcription you've previously seen: "${past_transcription}" \n` +
    `2. transcription of the latest audio chunk: "${latest_message}" \n` +
    `3. The fields that need to be filled out are: \n` +
    `${fieldsString}\n\n For type we have options {["medical", "trauma", "cardiac", "first aid"]}` +
    "You must decide which fields to either fill out, edit, or erase. It's perfectly okay if " +
    "given the transcription so far you don't fill any of them out on a given prompt, or if you end" +
    " up leaving some of them blank even at the very end. We must be careful not to make up answers" +
    " since in healthcare it's better to have no data than to have incorrect data. But ultimately if you" +
    " fill out this form even partially (all of which must be correct) then you will have done your job " +
    "and the paramedic will be able to focus on the patient and spend more time saving lives. Since we are using" +
    " you in a code base we need all of your answers to come back in the json format " +
    "{key_1: 'new_value_1', key_2: 'new_value_2', ...}. If you return an empty string '' then I will assume you want" +
    " to erase an existing field. If you return a key that already has a value, I'll assume you want to edit it." +
    " And if you return a key that is blank i'll assume you want to add the new value into the field. I've provided" +
    " the keys we use in our code for you in the prompt above (where it says '- use key patient_name' for example). " +
    "Finally, you can reason all you want (or none at all and just jump to the json) but the final answer must be " +
    "between json brackets { } which I will parse in my code to process and update the form. "
  );
}
