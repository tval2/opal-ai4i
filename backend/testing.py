import subprocess

ffmpeg_path = r"C:\Users\User\Documents\Utils\ffmpeg-2024-05-02-git-71669f2ad5-full_build\ffmpeg-2024-05-02-git-71669f2ad5-full_build\bin\ffmpeg.exe"
ffprobe_path = r"C:\Users\User\Documents\Utils\ffmpeg-2024-05-02-git-71669f2ad5-full_build\ffmpeg-2024-05-02-git-71669f2ad5-full_build\bin\ffprobe.exe"

try:
    # Test ffmpeg
    print("Testing ffmpeg...")
    result = subprocess.run([ffmpeg_path, '-version'], capture_output=True, text=True)
    print(result.stdout)

    # Test ffprobe
    print("Testing ffprobe...")
    result = subprocess.run([ffprobe_path, '-version'], capture_output=True, text=True)
    print(result.stdout)
except Exception as e:
    print(f"Error: {e}")
