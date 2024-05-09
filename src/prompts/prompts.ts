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
      return `   - ${key}: ${value || ""}`;
    })
    .join("\n");

  return (
    "You're an expert paramedic and emergency responder. " +
    "Your role is to read a transcription of live audio that" +
    " is being read in during a live emergency and fill out an ePCR form. " +
    "I will give you the list of all the fields that need to be filled out " +
    "in the ePCR form. Next to each field there will either be a blank if that field" +
    " hasn't been filled out yet OR there will be a value of what the form currently" +
    " says (either given earlier by you or done manually my the paramedic)." +
    " I will also give you the transcription which will be incomplete " +
    "as it comes in audio chunks live. Since diarization is not implemented yet you will " +
    "have to infer who is saying what between responders, the patient, and third parties. " +
    "So far, this is the data for you to use: \n\n" +
    `1. transcription you've previously seen:\n "${past_transcription}" \n` +
    `2. transcription of the latest audio chunk:\n "${latest_message}" \n` +
    `3. The fields in the ePCR form are: \n ${fieldsString}\n\n` +
    `For type we have options {["medical", "trauma", "cardiac", "first aid"]}` +
    "You must decide which fields to either fill out, edit, or erase. It's perfectly okay if " +
    "given the transcription so far you don't fill any of them out on a given prompt, or if you end" +
    " up leaving some of them blank. We must be careful not to make up answers" +
    " since in healthcare it's better to have no data than to have incorrect data." +
    " Your output is used in a code base so we need all of your answers to come back in the json format " +
    "{key_1: 'new_value_1', key_2: 'new_value_2', ...}. If you return an empty string '' for a given key then I will assume you want" +
    " to erase whatever is currently in that field as given above. If you return a key that already has a value, I'll assume you want to edit it." +
    " And if you return a key that is blank i'll assume you want to add the new value into the field. I've provided" +
    " the keys we use in our code for you in the prompt above (the left of the colon in something like patient_age:). " +
    "Finally, you can reason all you want and think in steps if needed but at the end of your response give the final answer " +
    "between json brackets { } which I will parse in my code to process and update the form. "
  );
}
