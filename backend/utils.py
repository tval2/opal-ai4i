import torchaudio
print(torchaudio.list_audio_backends())
def read_audio_from_stream(audio_stream, sampling_rate: int = 16000):
    sox_backends = set(['sox', 'sox_io'])
    audio_backends = torchaudio.list_audio_backends()

    if len(sox_backends.intersection(audio_backends)) > 0:
        effects = [
            ['channels', '1'],  # Force mono
            ['rate', str(sampling_rate)]  # Resample to the target sampling rate
        ]

        wav, sr = torchaudio.sox_effects.apply_effects_file(audio_stream, effects=effects)
    else:
        # Load the audio file from the stream
        wav, sr = torchaudio.load(audio_stream)

        # If more than one channel, take the mean to make it mono
        if wav.size(0) > 1:
            wav = wav.mean(dim=0, keepdim=True)

        # Resample if necessary
        if sr != sampling_rate:
            transform = torchaudio.transforms.Resample(orig_freq=sr, new_freq=sampling_rate)
            wav = transform(wav)
            sr = sampling_rate

    assert sr == sampling_rate, "Sampling rate does not match the target sampling rate"
    return wav.squeeze(0)  