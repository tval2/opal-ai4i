import { FormValues } from "../types/form";

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
    `"${"We have an injured male with groin pains. He's 69 years young. This is apparently a recurring injury and with a possible hernia. Did you get any food? I went in just long enough to get this. I don't know if you went in long enough to grab one roll of the sushi roll. That would have been ideal. I would have probably come out here with a small roll. Was there sushi juice all over you? Yes. I think I was just parking in front of the truck. Yeah, just parking in front of the truck. Hi. Hi. How are you? I'm sorry, I didn't get your name, sir. He says the pain has somewhat subsided right now, but it brought him to cheers just a second ago. So he's definitely in some pain. I would like to go to Mercy and be seen there. OK. We're going to sit right here, buddy. Don't worry about that. We'll pick it up. We'll get it. All right. So Gary, point to me exactly where the pain's at. It's on the right side there. You just point. Yeah, it's just wrong. Just point. I can't breathe. OK. Just point. You can leave it up. It's right here. Do you have a history of any UTI or bladder infections? Nope. OK. Any blood in your urine or anything? No. Is it dark in color or smell real bad? Yeah, sometimes. What about right now? So you said sometimes it is. Is it like that right now? I just took a piss. I mean, I had to. I've been waiting all day. I just pissed like 15 minutes ago while I was waiting for you guys. OK. What kind of medical problems do you have other than the pain? I don't know. I just took a piss. I mean, I had to. I've been waiting all day. I just took a piss for 15 minutes and went away from you guys. OK. What kind of medical problems do you have other than the pain? I don't know. I've been waiting for 15 minutes and went away from you guys. OK. What kind of medical problems do you have other than this chronic issue in your groin? I don't know. I don't know. I don't know. Put this on your finger. See what the oxygen is in your blood. For your pulse oximetry. When was the last time you were seen at the hospital for this? It's been a few months ago. They were never able to diagnose you with anything? No. No history of cancers or anything like that? No. Does it run in your family? It feels like I'm being pinched in half. OK. Does it hurt more when you move? Oh, god, yes. Those bounces. Any time you go to the hospital, you think, okay, I'm going to get it. I'm being pinched in half. OK. Does it hurt more when you move? Oh, god, yes. Those bounces. All right. Any time you go to the hospital, what do they do for you? They give you pain meds? No. Or a shot or anything? Maybe a shot or maybe something in the IV. Does it seem to work every time that they give you that medicine when you go there? Yeah. OK. Yeah, it works. OK. All right. But you guys ready for this? What's that? This probably started from a penis ring. Oh, really? OK. Did you get it stuck? OK. I mean, all night long. I mean, man, I was blue and huge. Yeah. And it hurt. How did you get it off? We cut it off. OK. Did you have to, like, call the hospital or call the fire department or call the hospital? No. I did it again, not thinking, you know, not being very smart, but did it again, and then it hurt. So I quit doing that. OK. And I think I damaged myself. OK. The original time. But the second time, did you have to have it cut off, though? Yeah, I cut it off. You did it yourself? Yeah. Yeah, but I think I did some damage. Let's make sure that we talk to them about it today, OK? Yeah, OK. Yeah. Because if they don't know the whole story, then they, it's hard to find that answer, right? Right. So you got to give them the whole thing. Can you slide up on the pad a little bit? Here you go. Oh, yeah. All right. "}"\n\n` +
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
